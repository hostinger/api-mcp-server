import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const SERVER_ENTRY = join(REPO_ROOT, 'src', 'servers', 'all.js');

const TOOL_OK = 'billing_getPaymentMethodListV1';

function startMockApi(status, payload) {
  return new Promise((resolve) => {
    const requested = [];
    const server = http.createServer((req, res) => {
      requested.push({ url: req.url, method: req.method });
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(status);
      const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
      res.end(body);
    });
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({
        url: `http://127.0.0.1:${port}`,
        requested,
        close() {
          return new Promise((r) => server.close(() => r()));
        },
      });
    });
  });
}

async function startMcpClient(apiBaseUrl) {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [SERVER_ENTRY, '--stdio'],
    env: {
      HOSTINGER_API_TOKEN: 'test-token',
      API_BASE_URL: apiBaseUrl,
    },
    stderr: 'pipe',
    cwd: REPO_ROOT,
  });
  const client = new Client({
    name: 'runtime-errors-test',
    version: '0.0.0',
  });
  await client.connect(transport);
  return {
    client,
    async close() {
      await client.close();
    },
  };
}

async function withContext(status, payload, fn) {
  const mock = await startMockApi(status, payload);
  let mcp = null;
  try {
    mcp = await startMcpClient(mock.url);
    await fn(mcp.client);
  } finally {
    if (mcp) {
      await mcp.close();
    }
    await mock.close();
  }
}

describe('CallTool error handling (isError)', () => {
  test('CA1: 2xx response returns success without isError', { timeout: 30000 }, async () => {
    const payload = { data: [{ id: 'pm-1', type: 'credit-card' }] };
    await withContext(200, payload, async (client) => {
      const result = await client.callTool({ name: TOOL_OK, arguments: {} });
      assert.equal(result.isError, undefined);
      assert.ok(Array.isArray(result.content));
      const text = JSON.parse(result.content[0].text);
      assert.deepEqual(text, payload);
    });
  });

  test('CA2: 400 response returns isError with error payload', { timeout: 30000 }, async () => {
    const payload = { message: 'Invalid parameter', code: 'invalid_request' };
    await withContext(400, payload, async (client) => {
      const result = await client.callTool({ name: TOOL_OK, arguments: {} });
      assert.equal(result.isError, true);
      assert.equal(result.content[0].type, 'text');
      const text = JSON.parse(result.content[0].text);
      assert.equal(text.code, 'invalid_request');
    });
  });

  test('CA2: 422 response keeps full validation payload', { timeout: 30000 }, async () => {
    const payload = {
      message: 'Validation failed',
      errors: [{ field: 'domain', message: 'Domain format is invalid' }],
    };
    await withContext(422, payload, async (client) => {
      const result = await client.callTool({ name: TOOL_OK, arguments: {} });
      assert.equal(result.isError, true);
      const text = JSON.parse(result.content[0].text);
      assert.equal(text.message, 'Validation failed');
      assert.equal(text.errors[0].field, 'domain');
    });
  });

  test('CA2: 401 with env token returns isError (no retry)', { timeout: 30000 }, async () => {
    const payload = { message: 'Unauthorized', code: 'unauthorized' };
    await withContext(401, payload, async (client) => {
      const result = await client.callTool({ name: TOOL_OK, arguments: {} });
      assert.equal(result.isError, true);
      const text = JSON.parse(result.content[0].text);
      assert.equal(text.code, 'unauthorized');
    });
  });

  test('CA3: 5xx response returns isError with error payload', { timeout: 30000 }, async () => {
    const payload = { message: 'Internal server error' };
    await withContext(500, payload, async (client) => {
      const result = await client.callTool({ name: TOOL_OK, arguments: {} });
      assert.equal(result.isError, true);
      const text = JSON.parse(result.content[0].text);
      assert.equal(text.message, 'Internal server error');
    });
  });

  test('CA3: ECONNREFUSED returns isError with explanatory text', { timeout: 30000 }, async () => {
    const mock = await startMockApi(200, { ok: true });
    const deadUrl = mock.url;
    await mock.close();

    let mcp = null;
    try {
      mcp = await startMcpClient(deadUrl);
      const result = await mcp.client.callTool({ name: TOOL_OK, arguments: {} });
      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /ECONNREFUSED|connect|request failed/i);
    } finally {
      if (mcp) {
        await mcp.close();
      }
    }
  });

  test('CA4: custom tool validation error returns isError', { timeout: 30000 }, async () => {
    const archivePath = join(REPO_ROOT, 'does-not-exist-archive.zip');
    await withContext(200, { ok: true }, async (client) => {
      const result = await client.callTool({
        name: 'agency-hosting_deployNodeStaticWebsite',
        arguments: { domain: 'example.com', archivePath },
      });
      assert.equal(result.isError, true);
      assert.match(result.content[0].text, /Archive file not found/);
    });
  });

  test('CA5: unknown tool still throws a protocol error', { timeout: 30000 }, async () => {
    await withContext(200, {}, async (client) => {
      await assert.rejects(
        () => client.callTool({ name: 'tool_that_does_not_exist', arguments: {} }),
        /Tool not found/
      );
    });
  });
});