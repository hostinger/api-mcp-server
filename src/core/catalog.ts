// Typed mirror of catalog.js. Keep both files, and api-remote-mcp's PHP
// implementation, behaviourally identical.

export const DEFAULT_SEARCH_LIMIT = 5;
export const MAX_SEARCH_LIMIT = 20;
export const MAX_STEPS = 20;

const STEP_REF = /^\$steps\.(\d+)((?:\.[^.]+)*)$/;

export interface CatalogOperation {
  name: string;
  title?: string;
  description?: string;
  group?: string;
  annotations?: { readOnlyHint?: boolean; destructiveHint?: boolean; [key: string]: unknown };
  inputSchema: { type: 'object'; properties?: Record<string, unknown>; required?: string[]; [key: string]: unknown };
}

export interface OperationSummary {
  operation: string;
  title: string;
  description: string;
  group: string | null;
  readOnly: boolean;
  destructive: boolean;
  inputSchema: CatalogOperation['inputSchema'];
}

export interface StepResult { step: number; operation: string; result: unknown }
export interface BatchResult { results: StepResult[]; error?: { step: number; message: string } }

export class ToolInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ToolInputError';
  }
}

const meta = (name: string, title: string, description: string, inputSchema: CatalogOperation['inputSchema'], readOnly: boolean) => ({
  name,
  title,
  description,
  inputSchema,
  annotations: { title, readOnlyHint: readOnly, destructiveHint: !readOnly },
});

export const META_TOOLS = [
  meta('search', 'Search API operations',
    "Find API operations by keyword. Returns the best matches, each with its operation name, hints and inputSchema. Pass a result's operation and params matching its inputSchema to execute or multi-execute.",
    {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keywords, e.g. "list vps" or "dns records".' },
        limit: { type: 'integer', minimum: 1, maximum: MAX_SEARCH_LIMIT, default: DEFAULT_SEARCH_LIMIT, description: 'Maximum number of results.' },
      },
      required: ['query'],
    },
    true),
  meta('execute', 'Execute an API operation',
    "Run one API operation found with search. params is a flat object holding the operation's path, query and body parameters as described by its inputSchema.",
    {
      type: 'object',
      properties: {
        operation: { type: 'string', description: 'Operation name returned by search.' },
        params: { type: 'object', description: 'Parameters matching the operation inputSchema.' },
      },
      required: ['operation'],
    },
    false),
  meta('multi-execute', 'Execute API operations in sequence',
    'Run up to 20 API operations in order, stopping at the first failure. A params value that is exactly "$steps.<i>.<path>" is replaced by that value from the result of earlier step <i> (dot-separated keys; numbers index arrays), e.g. "$steps.0.0.id".',
    {
      type: 'object',
      properties: {
        steps: {
          type: 'array',
          minItems: 1,
          maxItems: MAX_STEPS,
          items: {
            type: 'object',
            properties: {
              operation: { type: 'string', description: 'Operation name returned by search.' },
              params: { type: 'object', description: 'Parameters; may contain "$steps.<i>.<path>" references.' },
            },
            required: ['operation'],
          },
        },
      },
      required: ['steps'],
    },
    false),
];

const byteOrder = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

function toSummary(op: CatalogOperation): OperationSummary {
  return {
    operation: op.name,
    title: op.title ?? op.name,
    description: op.description ?? '',
    group: op.group ?? null,
    readOnly: op.annotations?.readOnlyHint === true,
    destructive: op.annotations?.destructiveHint === true,
    inputSchema: op.inputSchema,
  };
}

export function searchOperations(operations: CatalogOperation[], query: unknown, limit: unknown = DEFAULT_SEARCH_LIMIT): OperationSummary[] {
  if (typeof query !== 'string') throw new ToolInputError('query must be a string');
  const tokens = query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (tokens.length === 0) throw new ToolInputError('query must contain at least one letter or digit');
  if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1 || limit > MAX_SEARCH_LIMIT) {
    throw new ToolInputError(`limit must be an integer from 1 to ${MAX_SEARCH_LIMIT}`);
  }

  return operations
    .map(op => {
      const name = op.name.toLowerCase();
      const group = (op.group ?? '').toLowerCase();
      const title = (op.title ?? '').toLowerCase();
      const description = (op.description ?? '').toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (name.includes(t)) score += 3;
        if (group.includes(t)) score += 2;
        if (title.includes(t)) score += 2;
        if (description.includes(t)) score += 1;
      }
      return { op, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || byteOrder(a.op.name, b.op.name))
    .slice(0, limit)
    .map(s => toSummary(s.op));
}

export function renderSearch(query: string, results: OperationSummary[]): string {
  return results.length > 0
    ? JSON.stringify(results)
    : `No operations matched "${query}". Try broader or different terms.`;
}

export function findOperation<T extends CatalogOperation>(operations: Map<string, T>, name: unknown, params: unknown): T {
  const op = typeof name === 'string' ? operations.get(name) : undefined;
  if (!op) {
    throw new ToolInputError(`Unknown operation "${String(name)}". Use search to find operations.`);
  }
  if (params === null || typeof params !== 'object' || Array.isArray(params)) {
    throw new ToolInputError('params must be an object');
  }
  const given = params as Record<string, unknown>;
  const missing = (op.inputSchema?.required ?? []).filter(k => given[k] === undefined || given[k] === null);
  if (missing.length > 0) {
    throw new ToolInputError(`Missing required parameter(s) for ${op.name}: ${missing.join(', ')}`);
  }
  return op;
}

export function resolveRefs(value: unknown, results: unknown[], stepIndex: number): unknown {
  if (typeof value === 'string') {
    const m = STEP_REF.exec(value);
    if (!m) return value;
    const i = Number(m[1]);
    if (i >= stepIndex) {
      throw new ToolInputError(`${value}: references must point to an earlier step`);
    }
    let current: unknown = results[i];
    for (const segment of m[2].split('.').slice(1)) {
      if (current === null || typeof current !== 'object' || !Object.hasOwn(current, segment)) {
        throw new ToolInputError(`${value}: path not found in the result of step ${i}`);
      }
      current = (current as Record<string, unknown>)[segment];
    }
    return current;
  }
  if (Array.isArray(value)) return value.map(v => resolveRefs(v, results, stepIndex));
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveRefs(v, results, stepIndex)]));
  }
  return value;
}

export async function runSteps(
  steps: unknown,
  runOne: (operation: string, params: Record<string, unknown>) => Promise<unknown>,
  formatError: (error: unknown) => string,
): Promise<BatchResult> {
  if (!Array.isArray(steps) || steps.length === 0 || steps.length > MAX_STEPS) {
    throw new ToolInputError(`steps must be an array of 1 to ${MAX_STEPS} items`);
  }
  const raw: unknown[] = [];
  const results: StepResult[] = [];
  for (const [i, step] of steps.entries()) {
    try {
      if (step === null || typeof step !== 'object' || typeof step.operation !== 'string') {
        throw new ToolInputError(`step ${i}: operation must be a string`);
      }
      const params = resolveRefs(step.params ?? {}, raw, i) as Record<string, unknown>;
      const result = await runOne(step.operation, params);
      raw.push(result);
      results.push({ step: i, operation: step.operation, result });
    } catch (error) {
      return { results, error: { step: i, message: formatError(error) } };
    }
  }
  return { results };
}
