import { createHash, randomBytes } from 'crypto';
import { createServer, Server } from 'http';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import os from 'os';
import axios from 'axios';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUCCESS_HTML: string = readFileSync(path.join(__dirname, 'oauth-success.html'), 'utf8');
const ERROR_HTML_TEMPLATE: string = readFileSync(path.join(__dirname, 'oauth-error.html'), 'utf8');

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[ch] as string);
}

const DEFAULT_ISSUER = 'https://auth.hostinger.com';
const REGISTER_PATH = '/api/external/v1/oauth-server/register';
const AUTHORIZE_PATH = '/api/external/v1/oauth-server/authorize';
const TOKEN_PATH = '/api/external/v1/oauth-server/token';
const REVOKE_PATH = '/api/external/v1/oauth-server/token/revoke';
const CLIENT_NAME = 'hostinger-mcp';
const CALLBACK_PATH = '/oauth/callback';
const CREDENTIALS_DIR_NAME = 'hostinger-mcp';
const CREDENTIALS_FILE_NAME = 'credentials.json';
const EXPIRY_BUFFER_SECONDS = 60;

export interface OAuthCredentials {
  client_id?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

export class OAuthRefreshError extends Error {
  public readonly code = 'OAUTH_INVALID_GRANT';
  constructor(message: string) {
    super(message);
    this.name = 'OAuthRefreshError';
  }
}

/**
 * Resolve the bearer token from the environment. HOSTINGER_API_TOKEN is the
 * preferred name; API_TOKEN and APITOKEN are kept as backwards-compatible
 * aliases (API_TOKEN is deprecated and will be removed in a future version).
 * Empty values fall through, matching the previous `||` behavior.
 */
export function getEnvToken(): string | undefined {
  return process.env['HOSTINGER_API_TOKEN']
    || process.env['API_TOKEN']
    || process.env['APITOKEN'];
}

export class OAuthProvider {
  private readonly issuer: string;
  private _loginInProgress: Promise<string> | null = null;

  constructor(issuerBaseUrl?: string) {
    this.issuer = (issuerBaseUrl || process.env['OAUTH_ISSUER'] || DEFAULT_ISSUER).replace(/\/$/, '');
  }

  async getAccessToken(): Promise<string> {
    const envToken = getEnvToken();
    if (envToken) {
      return envToken;
    }

    if (!this._loginInProgress) {
      this._loginInProgress = this._resolveToken().finally(() => { this._loginInProgress = null; });
    }
    return await this._loginInProgress;
  }

  private async _resolveToken(): Promise<string> {
    const creds = await this._load();

    if (creds && creds.access_token && creds.expires_at && Date.now() < creds.expires_at) {
      return creds.access_token;
    }

    if (creds && creds.refresh_token && creds.client_id) {
      try {
        return await this._refresh(creds);
      } catch (err) {
        if ((err as { code?: string }).code !== 'OAUTH_INVALID_GRANT') {
          throw err;
        }
      }
    }

    return await this._login();
  }

  async login(): Promise<string> {
    if (this._loginInProgress) {
      return await this._loginInProgress;
    }
    this._loginInProgress = this._login().finally(() => { this._loginInProgress = null; });
    return await this._loginInProgress;
  }

  /**
   * Force a fresh token, bypassing the cached-token fast path. Called by the
   * runtime when the API rejects an apparently-valid token with 401. Tries the
   * refresh grant first; if the refresh token is also dead (4xx), falls through
   * to the full browser login flow.
   */
  async reauthenticate(): Promise<string> {
    if (!this._loginInProgress) {
      this._loginInProgress = this._reauthenticate().finally(() => { this._loginInProgress = null; });
    }
    return await this._loginInProgress;
  }

  private async _reauthenticate(): Promise<string> {
    const creds = await this._load();
    if (creds && creds.refresh_token && creds.client_id) {
      try {
        return await this._refresh(creds);
      } catch (err) {
        if ((err as { code?: string }).code !== 'OAUTH_INVALID_GRANT') {
          throw err;
        }
      }
    }
    return await this._login();
  }

  async logout(): Promise<void> {
    const creds = await this._load();
    if (!creds) {
      return;
    }
    if (creds.access_token && creds.client_id) {
      try {
        const params = new URLSearchParams();
        params.set('token', creds.access_token);
        params.set('client_id', creds.client_id);
        await axios.post(`${this.issuer}${REVOKE_PATH}`, params.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          validateStatus: () => true
        });
      } catch (_) {
        // best-effort
      }
    }
    await this._save({ client_id: creds.client_id });
  }

  private async _login(): Promise<string> {
    const creds: OAuthCredentials = (await this._load()) || {};

    const port = await this._getFreePort();
    const redirectUri = `http://127.0.0.1:${port}${CALLBACK_PATH}`;

    if (!creds.client_id) {
      creds.client_id = await this._register(redirectUri);
    }

    const { verifier, challenge } = this._generatePKCE();
    const state = this._generateState();

    const callbackPromise = this._listenForCallback(state, port);

    const authorizeUrl = new URL(`${this.issuer}${AUTHORIZE_PATH}`);
    authorizeUrl.searchParams.set('client_id', creds.client_id);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);
    authorizeUrl.searchParams.set('state', state);
    authorizeUrl.searchParams.set('code_challenge', challenge);
    authorizeUrl.searchParams.set('code_challenge_method', 'S256');
    authorizeUrl.searchParams.set('response_type', 'code');

    this._openBrowser(authorizeUrl.toString());

    const { code } = await callbackPromise;

    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('code', code);
    params.set('code_verifier', verifier);
    params.set('redirect_uri', redirectUri);
    params.set('client_id', creds.client_id);

    const resp = await axios.post<OAuthTokenResponse>(`${this.issuer}${TOKEN_PATH}`, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      validateStatus: () => true
    });

    if (resp.status >= 400) {
      throw new Error(`Token exchange failed (${resp.status}): ${JSON.stringify(resp.data)}`);
    }

    const tokens = resp.data;
    const newCreds: OAuthCredentials = {
      client_id: creds.client_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in - EXPIRY_BUFFER_SECONDS) * 1000
    };
    await this._save(newCreds);
    return tokens.access_token;
  }

  private async _refresh(creds: OAuthCredentials): Promise<string> {
    const params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', creds.refresh_token as string);
    params.set('client_id', creds.client_id as string);

    const resp = await axios.post<OAuthTokenResponse>(`${this.issuer}${TOKEN_PATH}`, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      validateStatus: () => true
    });

    if (resp.status >= 400 && resp.status < 500) {
      throw new OAuthRefreshError(`Refresh token rejected (${resp.status}): ${JSON.stringify(resp.data)}`);
    }

    if (resp.status >= 500) {
      throw new Error(`Token refresh failed (${resp.status}): ${JSON.stringify(resp.data)}`);
    }

    const tokens = resp.data;
    const newCreds: OAuthCredentials = {
      client_id: creds.client_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || creds.refresh_token,
      expires_at: Date.now() + (tokens.expires_in - EXPIRY_BUFFER_SECONDS) * 1000
    };
    await this._save(newCreds);
    return tokens.access_token;
  }

  private async _register(redirectUri: string): Promise<string> {
    const resp = await axios.post<{ client_id?: string }>(`${this.issuer}${REGISTER_PATH}`, {
      client_name: CLIENT_NAME,
      redirect_uris: [redirectUri]
    }, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    });

    if (resp.status >= 400 || !resp.data || !resp.data.client_id) {
      throw new Error(`Client registration failed (${resp.status}): ${JSON.stringify(resp.data)}`);
    }
    return resp.data.client_id;
  }

  private _generatePKCE(): { verifier: string; challenge: string } {
    const verifier = randomBytes(32).toString('base64url');
    const challenge = createHash('sha256').update(verifier).digest('base64url');
    return { verifier, challenge };
  }

  private _generateState(): string {
    return randomBytes(16).toString('hex');
  }

  private _listenForCallback(expectedState: string, port: number): Promise<{ code: string; port: number }> {
    return new Promise((resolve, reject) => {
      const server: Server = createServer((req, res) => {
        const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
        if (url.pathname !== CALLBACK_PATH) {
          res.writeHead(404);
          res.end();
          return;
        }

        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        const error = url.searchParams.get('error');

        const body = error
          ? ERROR_HTML_TEMPLATE.replace('{{error}}', escapeHtml(error))
          : SUCCESS_HTML;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(body);

        setImmediate(() => server.close());

        if (error) {
          return reject(new Error(`OAuth error from authorization server: ${error}`));
        }
        if (!state || state !== expectedState) {
          return reject(new Error('OAuth state mismatch'));
        }
        if (!code) {
          return reject(new Error('No authorization code received'));
        }
        resolve({ code, port });
      });
      server.on('error', reject);
      server.listen(port, '127.0.0.1');
    });
  }

  private _getFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
      const srv = createServer();
      srv.unref();
      srv.on('error', reject);
      srv.listen(0, '127.0.0.1', () => {
        const addr = srv.address();
        const port = typeof addr === 'object' && addr ? addr.port : 0;
        srv.close(() => resolve(port));
      });
    });
  }

  private _credentialsPath(): string {
    if (process.platform === 'win32') {
      const base = process.env['APPDATA'] || os.homedir();
      return path.join(base, CREDENTIALS_DIR_NAME, CREDENTIALS_FILE_NAME);
    }
    return path.join(os.homedir(), '.config', CREDENTIALS_DIR_NAME, CREDENTIALS_FILE_NAME);
  }

  private async _load(): Promise<OAuthCredentials | null> {
    const p = this._credentialsPath();
    if (!existsSync(p)) {
      return null;
    }
    try {
      const raw = await readFile(p, 'utf8');
      return JSON.parse(raw) as OAuthCredentials;
    } catch (_) {
      return null;
    }
  }

  private async _save(creds: OAuthCredentials): Promise<void> {
    const p = this._credentialsPath();
    await mkdir(path.dirname(p), { recursive: true });
    const writeOpts = process.platform === 'win32'
      ? { encoding: 'utf8' as const }
      : { encoding: 'utf8' as const, mode: 0o600 };
    await writeFile(p, JSON.stringify(creds, null, 2), writeOpts);
  }

  private _openBrowser(url: string): void {
    process.stderr.write(`\n[OAuth] Opening browser for sign-in:\n  ${url}\n`);
    process.stderr.write('[OAuth] If the browser does not open, copy the URL above into one manually.\n\n');
    let cmd: string;
    if (process.platform === 'darwin') {
      cmd = `open "${url}"`;
    } else if (process.platform === 'win32') {
      cmd = `start "" "${url}"`;
    } else {
      cmd = `xdg-open "${url}"`;
    }
    exec(cmd, (err) => {
      if (err) {
        process.stderr.write(`[OAuth] Could not auto-launch browser: ${err.message}\n`);
      }
    });
  }
}
