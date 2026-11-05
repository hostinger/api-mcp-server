// The site's own WP MCP (the Hostinger AI Assistant plugin): streamable HTTP, session-based, with the
// installation token on every request. Used by push-content.mjs.

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A reply is plain JSON or an event stream whose data lines hold it.
function parseReply(text, id) {
  if (text.trimStart().startsWith('{')) return JSON.parse(text);
  for (const line of text.split('\n')) {
    if (!line.startsWith('data:')) continue;
    try {
      const message = JSON.parse(line.slice(5));
      if (message.id === id) return message;
    } catch {
      /* not a JSON data line */
    }
  }
  throw new Error(`no JSON-RPC reply in: ${text.slice(0, 200)}`);
}

// A tool result holds { ability, result } (structuredContent, or JSON text). A WordPress error comes back
// as a normal result carrying { code, message, data: { status } }; a term_exists error still names the id.
function unwrap(result) {
  let body = result?.structuredContent;
  const text = result?.content?.[0]?.text;
  if (body === undefined) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  const value = body?.result ?? body;
  if (result?.isError || typeof value !== 'object' || value === null) return { error: String(text ?? value).slice(0, 300) };
  if (value.success === false || (value.code && value.data?.status >= 400)) {
    return { error: `${value.code ?? 'error'}: ${value.message ?? ''}`.slice(0, 300), id: value.data?.term_id ?? value.data?.resource_id };
  }
  return { data: value, id: value.id ?? value.data?.id };
}

export const listOf = (data) => (Array.isArray(data) ? data : data?.data ?? []);

// Opens the session and resolves the abilities. `mint` returns { token, url }; it is called again only
// when the token expires. Returns { has(ability), run(ability, params) → { data, id } | { error, id? } }.
export async function openSite(mint) {
  let { token, url } = await mint();
  let session = null;
  let nextId = 0;
  const send = async (method, params, { notify = false } = {}) => {
    const message = notify ? { jsonrpc: '2.0', method, params } : { jsonrpc: '2.0', id: (nextId += 1), method, params };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
        'X-Hostinger-JWT-Token': token,
        ...(session ? { 'Mcp-Session-Id': session } : {}),
      },
      body: JSON.stringify(message),
      signal: AbortSignal.timeout(120_000),
    });
    session = response.headers.get('mcp-session-id') ?? session;
    const text = await response.text();
    // The initialized notification can answer 404 with no body; that's harmless.
    if (notify) return null;
    if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`), { status: response.status });
    const reply = parseReply(text, message.id);
    if (reply.error) throw new Error(`${method}: ${reply.error.message}`);
    return reply.result;
  };
  const open = async () => {
    session = null;
    await send('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'headless-push-content', version: '1' } });
    await send('notifications/initialized', undefined, { notify: true }).catch(() => {});
  };
  // A 429, a 5xx or a dropped connection is retried, but a create only on a 429: it may have gone
  // through, and the next run's lookup finds it. An expired token is re-minted once; a lost session is
  // reopened.
  const call = async (method, params, { retry = true } = {}) => {
    let reminted = false;
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await send(method, params);
      } catch (e) {
        if ((e.status === 401 || e.status === 403) && !reminted) {
          reminted = true;
          ({ token } = await mint());
          await open();
          continue;
        }
        const sessionLost = e.status === 404 || /Mcp-Session-Id/i.test(e.message);
        const transient = e.status === 429 || e.status >= 500 || e.status === undefined;
        if (attempt >= 3 || !(sessionLost || (transient && (retry || e.status === 429)))) throw e;
        if (sessionLost) await open();
        else await sleep(2_000 * 2 ** attempt);
      }
    }
  };
  await open();

  // Every ability as its own tool, or three meta-tools (discover → get-info → execute). Names carry a
  // `hostinger-ai/` prefix (`hostinger-ai-` as a tool name); match on the rest.
  const { tools = [] } = await call('tools/list', {});
  const meta = (suffix) => tools.find((t) => t.name.endsWith(suffix))?.name;
  const execute = meta('execute-ability');
  let names = tools.map((t) => t.name);
  if (execute) {
    const listed = unwrap(await call('tools/call', { name: meta('discover-abilities'), arguments: {} }));
    if (listed.error) throw new Error(`discover-abilities: ${listed.error}`);
    names = (listed.data.abilities ?? []).map((a) => a.name);
  }
  const byShort = new Map(names.map((n) => [n.replace(/^hostinger[-_]ai[/_-]+/, ''), n]));
  const run = async (ability, params) => {
    const name = byShort.get(ability);
    if (!name) return { error: `the site's MCP has no ${ability} ability` };
    const retry = !/-(create|upload-from-url)$/.test(ability);
    try {
      const request = execute ? { name: execute, arguments: { name, parameters: params } } : { name, arguments: params };
      return unwrap(await call('tools/call', request, { retry }));
    } catch (e) {
      return { error: e.message.slice(0, 300) };
    }
  };
  return { has: (ability) => byShort.has(ability), run };
}
