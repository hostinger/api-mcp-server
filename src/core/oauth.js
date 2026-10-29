import { createHash, randomBytes } from "crypto";
import { createServer } from "http";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import { execFile } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUCCESS_HTML = readFileSync(path.join(__dirname, "oauth-success.html"), "utf8");
const ERROR_HTML_TEMPLATE = readFileSync(path.join(__dirname, "oauth-error.html"), "utf8");

const DEFAULT_ISSUER = "https://auth.hostinger.com";
const REGISTER_PATH = "/api/external/v1/oauth-server/register";
const AUTHORIZE_PATH = "/api/external/v1/oauth-server/authorize";
const TOKEN_PATH = "/api/external/v1/oauth-server/token";
const REVOKE_PATH = "/api/external/v1/oauth-server/token/revoke";
const CLIENT_NAME = "hostinger-mcp";
const CALLBACK_PATH = "/oauth/callback";
// RFC 6749 §4.1.2.1 — anything else in ?error= is reported as unknown_error
const OAUTH_ERROR_CODES = new Set([
  "invalid_request",
  "unauthorized_client",
  "access_denied",
  "unsupported_response_type",
  "invalid_scope",
  "server_error",
  "temporarily_unavailable",
]);
const CREDENTIALS_DIR_NAME = "hostinger-mcp";
const CREDENTIALS_FILE_NAME = "credentials.json";
const EXPIRY_BUFFER_SECONDS = 60;

export class OAuthRefreshError extends Error {
  constructor(message) {
    super(message);
    this.name = "OAuthRefreshError";
    this.code = "OAUTH_INVALID_GRANT";
  }
}

/**
 * Resolve the bearer token from the environment. HOSTINGER_API_TOKEN is the
 * preferred name; API_TOKEN and APITOKEN are kept as backwards-compatible
 * aliases (API_TOKEN is deprecated and will be removed in a future version).
 * Empty values fall through, matching the previous `||` behavior.
 */
export function getEnvToken() {
  return (
    process.env["HOSTINGER_API_TOKEN"] ||
    process.env["API_TOKEN"] ||
    process.env["APITOKEN"]
  );
}

/**
 * The issuer must be a bare origin: https, or http only on loopback. It ends up
 * in token requests and in the browser launch, so a path, query or userinfo is
 * refused instead of carried along.
 */
function parseIssuer(raw) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    throw new Error(`Invalid OAUTH_ISSUER: ${raw}`);
  }
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(u.hostname);
  const schemeOk =
    u.protocol === "https:" || (u.protocol === "http:" && loopback);
  if (
    !schemeOk ||
    u.username ||
    u.password ||
    u.pathname !== "/" ||
    u.search ||
    u.hash
  ) {
    throw new Error(
      `Invalid OAUTH_ISSUER: ${raw} (expected an https origin such as ${DEFAULT_ISSUER})`,
    );
  }
  return u.origin;
}

// No shell: the URL is a single argv entry, never parsed by sh or cmd.
// Windows resolves a bare program name from the working directory before PATH,
// so rundll32 is launched by absolute path to never pick up a planted copy.
export function browserCommand(platform, url, systemRoot = process.env.SystemRoot) {
  if (platform === "darwin") return ["open", [url]];
  if (platform === "win32") {
    return [
      path.win32.join(systemRoot || "C:\\Windows", "System32", "rundll32.exe"),
      ["url.dll,FileProtocolHandler", url],
    ];
  }
  return ["xdg-open", [url]];
}

export class OAuthProvider {
  constructor(issuerBaseUrl) {
    this.issuer = parseIssuer(
      issuerBaseUrl || process.env["OAUTH_ISSUER"] || DEFAULT_ISSUER,
    );
    this._loginInProgress = null;
  }

  async getAccessToken() {
    const envToken = getEnvToken();
    if (envToken) {
      return envToken;
    }

    if (!this._loginInProgress) {
      this._loginInProgress = this._resolveToken().finally(() => {
        this._loginInProgress = null;
      });
    }
    return await this._loginInProgress;
  }

  async _resolveToken() {
    const creds = await this._load();

    if (
      creds &&
      creds.access_token &&
      creds.expires_at &&
      Date.now() < creds.expires_at
    ) {
      return creds.access_token;
    }

    if (creds && creds.refresh_token && creds.client_id) {
      try {
        return await this._refresh(creds);
      } catch (err) {
        if (err.code !== "OAUTH_INVALID_GRANT") {
          throw err;
        }
      }
    }

    return await this._login();
  }

  async login() {
    if (this._loginInProgress) {
      return await this._loginInProgress;
    }
    this._loginInProgress = this._login().finally(() => {
      this._loginInProgress = null;
    });
    return await this._loginInProgress;
  }

  /**
   * Force a fresh token, bypassing the cached-token fast path. Called by the
   * runtime when the API rejects an apparently-valid token with 401. Tries the
   * refresh grant first; if the refresh token is also dead (4xx), falls through
   * to the full browser login flow.
   */
  async reauthenticate() {
    if (!this._loginInProgress) {
      this._loginInProgress = this._reauthenticate().finally(() => {
        this._loginInProgress = null;
      });
    }
    return await this._loginInProgress;
  }

  async _reauthenticate() {
    const creds = await this._load();
    if (creds && creds.refresh_token && creds.client_id) {
      try {
        return await this._refresh(creds);
      } catch (err) {
        if (err.code !== "OAUTH_INVALID_GRANT") {
          throw err;
        }
      }
    }
    return await this._login();
  }

  async logout() {
    const creds = await this._load();
    if (!creds) {
      return;
    }
    if (creds.access_token && creds.client_id) {
      try {
        const params = new URLSearchParams();
        params.set("token", creds.access_token);
        params.set("client_id", creds.client_id);
        await axios.post(`${this.issuer}${REVOKE_PATH}`, params.toString(), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          validateStatus: () => true,
        });
      } catch (_) {}
    }
    await this._save({ client_id: creds.client_id });
  }

  async _login() {
    let creds = (await this._load()) || {};

    const port = await this._getFreePort();
    const redirectUri = `http://127.0.0.1:${port}${CALLBACK_PATH}`;

    if (!creds.client_id) {
      creds.client_id = await this._register(redirectUri);
    }

    const { verifier, challenge } = this._generatePKCE();
    const state = this._generateState();

    const callbackPromise = this._listenForCallback(state, port);

    const authorizeUrl = new URL(`${this.issuer}${AUTHORIZE_PATH}`);
    authorizeUrl.searchParams.set("client_id", creds.client_id);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("state", state);
    authorizeUrl.searchParams.set("code_challenge", challenge);
    authorizeUrl.searchParams.set("code_challenge_method", "S256");
    authorizeUrl.searchParams.set("response_type", "code");

    this._openBrowser(authorizeUrl.toString());

    const { code } = await callbackPromise;

    const params = new URLSearchParams();
    params.set("grant_type", "authorization_code");
    params.set("code", code);
    params.set("code_verifier", verifier);
    params.set("redirect_uri", redirectUri);
    params.set("client_id", creds.client_id);

    const resp = await axios.post(
      `${this.issuer}${TOKEN_PATH}`,
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        validateStatus: () => true,
      },
    );

    if (resp.status >= 400) {
      throw new Error(
        `Token exchange failed (${resp.status}): ${JSON.stringify(resp.data)}`,
      );
    }

    const tokens = resp.data;
    const newCreds = {
      client_id: creds.client_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at:
        Date.now() + (tokens.expires_in - EXPIRY_BUFFER_SECONDS) * 1000,
    };
    await this._save(newCreds);
    return tokens.access_token;
  }

  async _refresh(creds) {
    const params = new URLSearchParams();
    params.set("grant_type", "refresh_token");
    params.set("refresh_token", creds.refresh_token);
    params.set("client_id", creds.client_id);

    const resp = await axios.post(
      `${this.issuer}${TOKEN_PATH}`,
      params.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        validateStatus: () => true,
      },
    );

    if (resp.status >= 400 && resp.status < 500) {
      throw new OAuthRefreshError(
        `Refresh token rejected (${resp.status}): ${JSON.stringify(resp.data)}`,
      );
    }

    if (resp.status >= 500) {
      throw new Error(
        `Token refresh failed (${resp.status}): ${JSON.stringify(resp.data)}`,
      );
    }

    const tokens = resp.data;
    const newCreds = {
      client_id: creds.client_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || creds.refresh_token,
      expires_at:
        Date.now() + (tokens.expires_in - EXPIRY_BUFFER_SECONDS) * 1000,
    };
    await this._save(newCreds);
    return tokens.access_token;
  }

  async _register(redirectUri) {
    const resp = await axios.post(
      `${this.issuer}${REGISTER_PATH}`,
      {
        client_name: CLIENT_NAME,
        redirect_uris: [redirectUri],
      },
      {
        headers: { "Content-Type": "application/json" },
        validateStatus: () => true,
      },
    );

    if (resp.status >= 400 || !resp.data || !resp.data.client_id) {
      throw new Error(
        `Client registration failed (${resp.status}): ${JSON.stringify(resp.data)}`,
      );
    }
    return resp.data.client_id;
  }

  _generatePKCE() {
    const verifier = randomBytes(32).toString("base64url");
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    return { verifier, challenge };
  }

  _generateState() {
    return randomBytes(16).toString("hex");
  }

  _listenForCallback(expectedState, port) {
    return new Promise((resolve, reject) => {
      const server = createServer((req, res) => {
        const url = new URL(req.url, `http://127.0.0.1:${port}`);
        if (url.pathname !== CALLBACK_PATH) {
          res.writeHead(404);
          res.end();
          return;
        }

        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");

        if (state !== expectedState) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end(ERROR_HTML_TEMPLATE.replace("{{error}}", "invalid_state"));
          return;
        }

        const oauthError =
          error && (OAUTH_ERROR_CODES.has(error) ? error : "unknown_error");
        const body = oauthError
          ? ERROR_HTML_TEMPLATE.replace("{{error}}", oauthError)
          : SUCCESS_HTML;
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(body);

        setImmediate(() => server.close());

        if (oauthError) {
          return reject(
            new Error(`OAuth error from authorization server: ${oauthError}`),
          );
        }
        if (!code) {
          return reject(new Error("No authorization code received"));
        }
        resolve({ code, port });
      });
      server.on("error", reject);
      server.listen(port, "127.0.0.1");
    });
  }

  _getFreePort() {
    return new Promise((resolve, reject) => {
      const srv = createServer();
      srv.unref();
      srv.on("error", reject);
      srv.listen(0, "127.0.0.1", () => {
        const addr = srv.address();
        const port = typeof addr === "object" && addr ? addr.port : 0;
        srv.close(() => resolve(port));
      });
    });
  }

  _credentialsPath() {
    if (process.platform === "win32") {
      const base = process.env["APPDATA"] || os.homedir();
      return path.join(base, CREDENTIALS_DIR_NAME, CREDENTIALS_FILE_NAME);
    }
    return path.join(
      os.homedir(),
      ".config",
      CREDENTIALS_DIR_NAME,
      CREDENTIALS_FILE_NAME,
    );
  }

  async _load() {
    const p = this._credentialsPath();
    if (!existsSync(p)) {
      return null;
    }
    try {
      const raw = await readFile(p, "utf8");
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  async _save(creds) {
    const p = this._credentialsPath();
    await mkdir(path.dirname(p), { recursive: true });
    const writeOpts =
      process.platform === "win32"
        ? { encoding: "utf8" }
        : { encoding: "utf8", mode: 0o600 };
    await writeFile(p, JSON.stringify(creds, null, 2), writeOpts);
  }

  _openBrowser(url) {
    process.stderr.write(`\n[OAuth] Opening browser for sign-in:\n  ${url}\n`);
    process.stderr.write(
      "[OAuth] If the browser does not open, copy the URL above into one manually.\n\n",
    );
    const [cmd, args] = browserCommand(process.platform, url);
    execFile(cmd, args, (err) => {
      if (err) {
        process.stderr.write(
          `[OAuth] Could not auto-launch browser: ${err.message}\n`,
        );
      }
    });
  }
}
