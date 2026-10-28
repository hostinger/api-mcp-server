
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import minimist from 'minimist';
import cors from "cors";
import express from "express";
import {Request, Response} from "express";
import { config as dotenvConfig } from "dotenv";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { OAuthProvider, getEnvToken } from "./oauth.js";
import axios,{ AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import * as tus from "tus-js-client";
import fs from "fs";
import path from "path";
import os from "os";
import { Zip, ZipDeflate } from "fflate";
import { META_TOOLS, searchOperations, renderSearch, findOperation, runSteps } from "./catalog.js";
import type { CatalogOperation } from "./catalog.js";

// Load environment variables
dotenvConfig({ quiet: true });

// Define tool and security scheme types
interface OpenApiTool extends Tool {
  method: string;
  path: string;
  security: unknown[];
  custom?: boolean;
  hidden?: boolean;
  group?: string;
  everyServer?: boolean;
  topic?: string;
  handlerMethod?: string;
  templateFile?: string;
  templateFileTS?: string;
}

interface SecurityScheme {
  type: string;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
}

/**
 * An upstream API call that came back as a failure. Carries the status and the
 * API's own response body so the CallTool handler can hand both to the model.
 */
class ApiExecutionError extends Error {
  public readonly status: number;
  public readonly responseData: any;

  constructor(status: number, data: any, message?: string) {
    super(message || `API request failed with status ${status}`);
    this.name = 'ApiExecutionError';
    this.status = status;
    this.responseData = data;
  }
}

const SECURITY_SCHEMES: Record<string, SecurityScheme> = {
  "apiToken": {
    "type": "http",
    "description": "API Token authentication",
    "scheme": "bearer"
  }
};

// MCP Skills extension (io.modelcontextprotocol/skills). The SDK has no built-in
// support yet, so the two methods are registered as custom requests.
const SKILLS_EXTENSION = "io.modelcontextprotocol/skills";
const SKILLS_CACHE = { ttlMs: 300000, cacheScope: "public" };
const ListSkillsRequestSchema = z.object({
  method: z.literal("skills/list"),
  params: z.object({ cursor: z.string().optional() }).passthrough().optional(),
});
const GetSkillRequestSchema = z.object({
  method: z.literal("skills/get"),
  // Lenient on purpose: a missing or non-string uri must surface as InvalidParams
  // from the handler, not as a zod parse failure (InternalError).
  params: z.object({ uri: z.unknown().optional() }).passthrough().optional(),
});

interface SkillFile { uri: string; digest: string; size: number; mimeType: string; text: string }
interface Skill { uri: string; frontmatter: Record<string, unknown>; resources: SkillFile[] }

/**
 * MCP Server for Hostinger API
 * Generated from OpenAPI spec version 2.5.1
 */
class MCPServer {
  private readonly name: string;
  private readonly version: string;
  private readonly toolList: OpenApiTool[];
  private server: Server;
  private operations: Map<string, OpenApiTool> = new Map();
  private instructions?: string;
  private skills: Skill[];
  private debug: boolean;
  private baseUrl: string;
  private headers: Record<string, string>;
  private oauth: OAuthProvider;

  constructor({ name, version, tools, instructions, skills = [] }: { name: string; version: string; tools: OpenApiTool[]; instructions?: string; skills?: Skill[] }) {
    // Initialize class properties
    this.name = name;
    this.version = version;
    this.toolList = tools;
    this.instructions = instructions;
    this.skills = skills;
    this.debug = process.env.DEBUG === "true";
    this.baseUrl = process.env.API_BASE_URL || "https://developers.hostinger.com";
    this.headers = this.parseHeaders(process.env.API_HEADERS || "");
    this.oauth = new OAuthProvider();

    // Initialize tools map - do this before creating server
    this.initializeTools();

    // Create MCP server with correct capabilities
    this.server = new Server(
      {
        name: this.name,
        version: this.version,
      },
      {
        capabilities: {
          tools: {}, // Enable tools capability
          ...(this.skills.length > 0 ? { resources: {}, extensions: { [SKILLS_EXTENSION]: {} } } : {}),
        },
        instructions: this.instructions,
      }
    );

    // Set up request handlers - don't log here
    this.setupHandlers();
  }

  /**
   * Parse headers from string
   */
  private parseHeaders(headerStr: string): Record<string, string> {
    const headers: Record<string, string> = {};
    if (headerStr) {
      headerStr.split(",").forEach((header) => {
        const [key, value] = header.split(":");
        if (key && value) headers[key.trim()] = value.trim();
      });
    }

    const extensionUa = String(process.env.USER_AGENT ?? "")
      .replace(/\r|\n/g, "")
      .trim();
    const base = `hostinger-mcp-server/${this.version}`;
    headers["User-Agent"] = extensionUa ? `${base} (${extensionUa})` : base;

    return headers;
  }

  /**
   * Resolve a bearer token. HOSTINGER_API_TOKEN / API_TOKEN env vars take
   * precedence; otherwise the OAuth provider handles login/refresh transparently.
   */
  private async getAuthToken(): Promise<string> {
    return await this.oauth.getAccessToken();
  }

  /**
   * Initialize tools map from OpenAPI spec
   * This runs before the server is connected, so don't log here
   */
  private initializeTools(): void {
    // The operations are the catalog behind search/execute; they are not listed as tools.
    for (const tool of this.toolList) {
      this.operations.set(tool.name, tool);
    }

    // Don't log here, we're not connected yet
    console.error(`Loaded ${this.operations.size} operations`);
  }

  /**
   * Set up request handlers
   */
  private setupHandlers(): void {
    // Capture the connecting MCP client's identity once the initialize handshake completes.
    // The name is client-controlled input, so strip CR/LF to prevent header injection.
    this.server.oninitialized = () => {
      const clientName = String(this.server.getClientVersion()?.name ?? "")
        .replace(/\r|\n/g, "")
        .trim();
      if (clientName) {
        this.headers["X-MCP-Client"] = clientName;
      }
    };

    // Handle tool listing requests
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      this.log('debug', "Handling ListTools request");
      return { tools: META_TOOLS };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name } = request.params;
      const args = (request.params.arguments ?? {}) as Record<string, any>;
      this.log('debug', "Handling CallTool request", { name, args });

      if (!META_TOOLS.some(t => t.name === name)) {
        throw new McpError(ErrorCode.InvalidParams, `Tool not found: ${name}`);
      }

      try {
        if (name === 'search') {
          const results = searchOperations(this.toolList, args.query, args.limit ?? undefined);
          return { content: [{ type: "text", text: renderSearch(String(args.query), results) }] };
        }

        if (name === 'execute') {
          const result = await this.executeOperation(args.operation, args.params ?? {});
          return { content: [{ type: "text", text: JSON.stringify(result) }] };
        }

        const batch = await runSteps(
          args.steps,
          (operation, params) => this.executeOperation(operation, params),
          (error) => this.formatToolError(error),
        );
        return {
          ...(batch.error ? { isError: true } : {}),
          content: [{ type: "text", text: JSON.stringify(batch) }],
        };
      } catch (error) {
        const errorText = this.formatToolError(error);
        this.log('error', `Error executing ${name}: ${errorText}`);
        return { isError: true, content: [{ type: "text", text: errorText }] };
      }
    });

    if (this.skills.length > 0) {
      this.setupSkillHandlers();
    }
  }

  /**
   * Serve the bundled agent skills over the MCP Skills extension: skills/list and
   * skills/get return the manifest entries, and every listed file is a skill://
   * resource readable with resources/read.
   */
  private setupSkillHandlers(): void {
    const entry = (skill: Skill) => ({
      uri: skill.uri,
      frontmatter: skill.frontmatter,
      resources: skill.resources.map(({ uri, digest, size }) => ({ uri, digest, size })),
    });
    const skillsByUri = new Map<string, Skill>(this.skills.map((skill) => [skill.uri, skill]));
    const files = new Map<string, SkillFile>(this.skills.flatMap((skill) => skill.resources.map((file) => [file.uri, file] as [string, SkillFile])));

    // Widened return types below satisfy setRequestHandler's inferred result type
    // for these two custom (non-SDK) schemas.
    this.server.setRequestHandler(ListSkillsRequestSchema, async (): Promise<Record<string, unknown>> => ({
      resultType: "complete",
      skills: this.skills.map(entry),
      ...SKILLS_CACHE,
    }));

    this.server.setRequestHandler(GetSkillRequestSchema, async (request): Promise<Record<string, unknown>> => {
      const uri = request.params?.uri;
      const skill = typeof uri === "string" ? skillsByUri.get(uri) : undefined;
      if (!skill) {
        throw new McpError(ErrorCode.InvalidParams, typeof uri === "string" ? `Unknown skill: ${uri}` : "Missing or invalid skill uri");
      }
      return { resultType: "complete", skill: entry(skill), ...SKILLS_CACHE };
    });

    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: Array.from(files.values()).map((file) => ({
        uri: file.uri,
        name: file.uri.slice("skill://".length),
        mimeType: file.mimeType,
        size: file.size,
      })),
    }));

    // resources is advertised, so answer templates/list too (skills have none).
    this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({ resourceTemplates: [] }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const file = files.get(request.params.uri);
      if (!file) {
        throw new McpError(ErrorCode.InvalidParams, `Unknown resource: ${request.params.uri}`);
      }
      return { contents: [{ uri: file.uri, mimeType: file.mimeType, text: file.text }] };
    });
  }

  private async executeOperation(operation: unknown, params: unknown): Promise<any> {
    const tool = findOperation(this.operations, operation, params);
    const input = params as Record<string, any>;
    if (tool.hidden) {
      this.log('warning', `Operation ${tool.name} is hidden from search and will be removed in a future release`);
    }
    this.log('info', `Executing operation: ${tool.name}`);
    return tool.custom
      ? this.executeCustomTool(tool, input)
      : this.executeApiCall(tool, input);
  }

  private formatToolError(error: unknown): string {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!(error instanceof ApiExecutionError)) {
      return errorMessage;
    }
    const payload = error.responseData;
    const body = payload === null || payload === undefined || payload === ''
      ? errorMessage
      : typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
    return error.status ? `HTTP ${error.status}: ${body}` : body;
  }

  private async executeCustomTool(tool: OpenApiTool, params: Record<string, any>): Promise<any> {
    switch (tool.name) {
      case 'hosting_deploy':
        return await this.handleHostingDeploy(params);
      case 'hosting_get-deployment':
        return await this.handleHostingGetDeployment(params);
      case 'hosting_websites_get-settings':
        return await this.handleHostingWebsitesGetSettings(params);
      case 'hosting_websites_update-settings':
        return await this.handleHostingWebsitesUpdateSettings(params);
      case 'hosting_cache_clear':
        return await this.handleHostingCacheClear(params);
      case 'hosting_import-wordpress-website':
        return await this.handleWordpressWebsiteImport(params);
      case 'hosting_deploy-wordpress-plugin':
        return await this.handleWordpressPluginDeploy(params);
      case 'hosting_deploy-wordpress-theme':
        return await this.handleWordpressThemeDeploy(params);
      case 'hosting_deploy-js-application':
        return await this.handleJavascriptApplicationDeploy(params);
      case 'hosting_deploy-static-website':
        return await this.handleStaticWebsiteDeploy(params);
      case 'hosting_list-js-deployments':
        return await this.handleListJavascriptDeployments(params);
      case 'hosting_show-js-deployment-logs':
        return await this.handleShowJsDeploymentLogs(params);
      case 'hosting_websites_trigger-event':
        return await this.handleHostingTriggerWebsiteEvent(params);
      case 'agency-hosting_deploy-node-static-website':
        return await this.handleNodeStaticDeploy(params);
      case 'agency-hosting_deploy-php-application':
        return await this.handlePhpAppDeploy(params);
      case 'changelog_list-entries':
        return await this.handleChangelogListEntries(params);
      default:
        throw new Error(`Unknown custom tool: ${tool.name}`);
    }
  }

  private normalizePath(pathString: string): string {
    return pathString.replace(/\\/g, '/');
  }

  // The path becomes part of a URL, where a . or .. segment resolves outside its directory. Separators are
  // normalized first, because a backslash in a file name on Linux or macOS turns into one.
  private assertSafeUploadPath(relativePath: string): void {
    const segments = this.normalizePath(relativePath).split('/');
    if (segments.some((segment: string) => segment === '' || segment === '.' || segment === '..')) {
      throw new Error('Unsafe upload path: ' + relativePath);
    }
  }

  // Directories that hold credentials, the server's own token store (hostinger-mcp) among them.
  private credentialDirectories = ['.ssh', '.aws', '.gnupg', '.config', '.kube', '.docker', '.azure', 'hostinger-mcp'];

  // System directories. /var as a whole stays deployable: sites live in /var/www, and macOS keeps its temp dir there.
  private systemDirectories = ['/etc', '/root', '/usr', '/bin', '/sbin', '/boot', '/proc', '/sys', '/dev', '/var/lib', '/var/log', '/var/db', '/var/root', '/private/etc', '/private/var/lib', '/private/var/log', '/private/var/db', '/private/var/root', '/System', '/Library'];

  // A deploy publishes what it reads, and the path comes from the model, so prompt-injected arguments could
  // publish any readable file. Refused, before anything is read or sent: the home directory and every directory
  // above it (they contain the credentials), other users' home directories, system directories, a path in a
  // credential directory, and a secret file. Symlinks are resolved first.
  // os is imported by deploy.template: the JS generator dedupes import blocks by their whole text, and this block
  // must stay identical to agency-hosting/shared's, or tus and fs are imported twice.
  private assertDeployablePath(localPath: string): void {
    let real: string;
    try {
      real = fs.realpathSync(localPath);
    } catch (error) {
      throw new Error('Path not found: ' + localPath);
    }
    let home = os.homedir();
    try {
      home = fs.realpathSync(home);
    } catch (error) {
      // a missing home directory has nothing in it to protect
    }
    const inside = (dir: string, file: string): boolean => {
      const relative = path.relative(dir, file);
      return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
    };
    // A home in the filesystem root (HOME=/ in a container run as a user without a passwd entry) exempts nothing.
    const inHome = path.dirname(home) !== home && inside(home, real);
    // The directory that holds the home directories (/Users, /home); not when home sits in the root (/root).
    const homes = path.dirname(home);
    const otherHome = !inHome && path.dirname(homes) !== homes && inside(homes, real);
    const inSystem = !inHome && this.systemDirectories.some((dir: string) => inside(dir, real));
    const inCredentials = real.split(path.sep).some((segment: string) => this.credentialDirectories.includes(segment.toLowerCase()));
    if (inside(real, home) || otherHome || inSystem || inCredentials || (fs.statSync(real).isFile() && this.isSecretFile(path.basename(real)))) {
      throw new Error('Refusing to deploy ' + localPath + ': it is, or contains, a home, system or credentials location. Pass the project directory or archive.');
    }
  }

  // Env files (examples such as .env.example are kept), credentials and private keys: a deploy would serve them
  // publicly. Matches the CLI's isSecretFile, plus .npmrc and the Hostinger credential files.
  private isSecretFile(name: string): boolean {
    if (['.env', '.envrc', '.netrc', '.git-credentials', '.pgpass', '.npmrc', '.hostinger.yaml', 'credentials.json'].includes(name)) {
      return true;
    }
    if (['id_rsa', 'id_dsa', 'id_ecdsa', 'id_ed25519'].some((key) => name.startsWith(key))) {
      return true;
    }
    if (name.endsWith('.pem') || name.endsWith('.key')) {
      return true;
    }
    return name.startsWith('.env.') && !['.env.example', '.env.sample', '.env.template', '.env.dist'].includes(name);
  }

  // The files to ship, as sorted forward-slash paths relative to dir, and the secret files left out.
  // node_modules, .git and OS junk are skipped; symlinks are not followed. .gitignore is not read:
  // keep build output out of the directory.
  // exclude is a file that is uploaded on its own (the database dump) and must not also travel inside
  // the archive, where extracting it would leave a second, downloadable copy.
  private listDeployFiles(dir: string, exclude?: string): { files: string[]; skipped: string[] } {
    const files: string[] = [];
    const skipped: string[] = [];
    const walk = (relativeDir: string): void => {
      for (const entry of fs.readdirSync(path.join(dir, relativeDir), { withFileTypes: true })) {
        if (entry.isSymbolicLink()) {
          continue;
        }
        const relativePath = relativeDir ? relativeDir + '/' + entry.name : entry.name;
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.git') {
            walk(relativePath);
          }
        } else if (entry.isFile() && entry.name !== '.DS_Store' && path.resolve(dir, relativePath) !== exclude) {
          if (this.isSecretFile(entry.name)) {
            skipped.push(relativePath);
          } else {
            files.push(relativePath);
          }
        }
      }
    };
    walk('');
    return { files: files.sort(), skipped: skipped.sort() };
  }

  private async resolveUsername(domain: string): Promise<string> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/websites?domain=${encodeURIComponent(domain)}`, baseUrl).toString();
    
    try {
      const bearerToken = await this.getAuthToken();
      
      const config: AxiosRequestConfig = {
        method: 'get',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`
        },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };
      
      const response = await axios(config);
      
      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }
      
      const websites = response.data?.data;
      if (!websites || websites.length === 0) {
        throw new Error(`No website found for domain: ${domain}`);
      }
      
      const username = websites[0].username;
      if (!username) {
        throw new Error(`Username not found in website data for domain: ${domain}`);
      }
      
      this.log('info', `Resolved username: ${username} for domain: ${domain}`);
      return username;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to resolve username for domain ${domain}: ${errorMessage}`);
      
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }
      
      throw error;
    }
  }

  private async fetchUploadCredentials(username: string, domain: string): Promise<{ uploadUrl: string; authRestToken: string; authToken: string }> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL('api/hosting/v1/files/upload-urls', baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          username,
          domain
        },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to fetch upload credentials: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async uploadFile(
    filePath: string, 
    relativePath: string, 
    uploadUrl: string, 
    authRestToken: string, 
    authToken: string
  ): Promise<{ url: string; filename: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const stats = fs.statSync(filePath);
        const fileStream = fs.createReadStream(filePath);
        
        this.assertSafeUploadPath(relativePath);
        const cleanUploadUrl = uploadUrl.replace(new RegExp('/$'), '');
        // The path is part of a URL: encode each segment so a #, ? or % in a file name is not read as
        // a fragment, a query or an escape, and keep the / separators.
        const normalizedPath = this.normalizePath(relativePath).split('/').map((segment: string) => encodeURIComponent(segment)).join('/');
        const uploadUrlWithFile = `${cleanUploadUrl}/${normalizedPath}?override=true`;

        const requestHeaders: Record<string, string> = {
          'X-Auth': authToken,
          'X-Auth-Rest': authRestToken,
          'upload-length': stats.size.toString(),
          'upload-offset': '0'
        };

        try {
          this.log('debug', `Making pre-upload POST request to ${uploadUrlWithFile}`);
          await axios.post(uploadUrlWithFile, '', {
            headers: requestHeaders,
            timeout: 60000, // 60s
            validateStatus: function (status: number): boolean {
              return status == 201;
            }
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          if (axios.isAxiosError(error)) {
            const responseData = error.response?.data;
            const responseStatus = error.response?.status;
            const responseHeaders = error.response?.headers;
            const responseText = typeof responseData === 'object' ? JSON.stringify(responseData) : responseData;
            
            this.log('error', 'Pre-upload POST request failed - Full Response Details:', {
              status: responseStatus,
              headers: responseHeaders,
              data: responseText,
              message: errorMessage
            });
            reject(new Error(`Pre-upload request failed: ${errorMessage}`));
            return;
          } else {
            this.log('error', `Pre-upload POST request failed: ${errorMessage}`);
            reject(new Error(`Pre-upload request failed: ${errorMessage}`));
            return;
          }
        }

        const upload = new tus.Upload(fileStream, {
          uploadUrl: uploadUrlWithFile,
          retryDelays: [1000, 2000, 4000, 8000, 16000, 20000],
          uploadDataDuringCreation: false,
          parallelUploads: 1,
          chunkSize: 10485760,
          headers: requestHeaders,
          removeFingerprintOnSuccess: true,
          uploadSize: stats.size,
          metadata: {
            filename: path.basename(relativePath)
          },
          onError: (error: Error) => {
            this.log('error', `TUS upload error for ${relativePath}`, { error: error.message });
            reject(new Error(`Upload failed: ${error.message}`));
          },
          onSuccess: () => {
            this.log('info', `TUS upload completed for ${relativePath}`, { url: upload.url });
            resolve({
              url: upload.url || uploadUrlWithFile,
              filename: relativePath
            });
          }
        });

        upload.start();

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.log('error', `Error preparing upload for ${filePath}`, { error: errorMessage });
        reject(new Error(`Failed to prepare upload: ${errorMessage}`));
      }
    });
  }

  // Run a catalog operation by name through the runtime's own request code (auth,
  // path parameters, API errors). Hidden operations are still in the catalog, and
  // calling them here does not log the deprecation warning that execute does.
  private async callOperation(name: string, params: Record<string, any>): Promise<any> {
    const tool = this.operations.get(name);
    if (!tool) {
      throw new Error(`Operation ${name} is not available in this server`);
    }
    return this.executeApiCall(tool, params);
  }

  // The website for a domain, matched exactly. The list endpoint filters by substring and pages its
  // results, so a short domain can match many sites: read pages until the exact one turns up or a page
  // comes back short, up to a limit.
  private async findWebsite(domain: string): Promise<any> {
    const perPage = 100;
    const maxPages = 10;
    for (let page = 1; page <= maxPages; page++) {
      const response = await this.callOperation('hosting_websites_list', { domain, page, per_page: perPage });
      const sites = response && Array.isArray(response.data) ? response.data : [];
      const site = sites.find((website: any) => website.domain && website.domain.toLowerCase() === domain.toLowerCase());
      if (site) {
        // Agency Plan (U4S) websites come back without a username, and every later call would fail with
        // an unclear API error.
        if (typeof site.username !== 'string') {
          throw new Error(site.domain + ' is an Agency Plan website: this tool works only for Shared and Cloud hosting websites. Use the agency-hosting operations for it.');
        }
        return site;
      }
      if (sites.length < perPage) {
        break;
      }
    }
    throw new Error('No website found for domain: ' + domain);
  }

  private hosting_deploy_types = ['static', 'nodejs', 'wordpress-site', 'wordpress-plugin', 'wordpress-theme'];

  // A package.json that depends on one of these is an app with a server, not dev tooling.
  private hosting_deploy_serverDependencies = ['express', 'fastify', 'koa', 'hono', 'next', 'nuxt', '@nestjs/core', '@remix-run/node', '@sveltejs/kit', 'astro'];

  // WordPress reads plugin and theme headers from the first 8 KB of a file.
  private hosting_deploy_head(file: string): string {
    const fd = fs.openSync(file, 'r');
    try {
      const buffer = Buffer.alloc(8192);
      const read = fs.readSync(fd, buffer, 0, 8192, 0);
      return buffer.toString('utf8', 0, read).toLowerCase();
    } finally {
      fs.closeSync(fd);
    }
  }

  // What a directory is, from files in its top level. WordPress signals win over package.json,
  // because plugins and themes routinely carry one for their assets. Two WordPress signals at
  // once are ambiguous and need an explicit type.
  private hosting_deploy_detectType(dir: string): string {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
      throw new Error('Directory not found: ' + dir);
    }
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const hasFile = (name: string): boolean => entries.some((entry) => entry.isFile() && entry.name === name);

    const wordpress: string[] = [];
    if (entries.some((entry) => entry.isFile() && entry.name.endsWith('.php') && this.hosting_deploy_head(path.join(dir, entry.name)).includes('plugin name:'))) {
      wordpress.push('wordpress-plugin');
    }
    if (hasFile('style.css') && this.hosting_deploy_head(path.join(dir, 'style.css')).includes('theme name:')) {
      wordpress.push('wordpress-theme');
    }
    if (hasFile('wp-config.php') || entries.some((entry) => entry.isDirectory() && entry.name === 'wp-content')) {
      wordpress.push('wordpress-site');
    }
    if (wordpress.length > 1) {
      throw new Error('Ambiguous directory: it looks like ' + wordpress.join(' and ') + '. Pass type to choose.');
    }
    if (wordpress.length === 1) {
      return wordpress[0];
    }

    let pkg: any = null;
    const manifest = path.join(dir, 'package.json');
    if (fs.existsSync(manifest)) {
      try {
        pkg = JSON.parse(fs.readFileSync(manifest, 'utf8'));
      } catch (error) {
        throw new Error('package.json could not be read (' + (error instanceof Error ? error.message : String(error)) + '): fix it, or pass type to skip detection');
      }
    }
    if (pkg) {
      const dependencies = pkg.dependencies || {};
      const hasServer = this.hosting_deploy_serverDependencies.some((name) => dependencies[name] !== undefined);
      if ((pkg.scripts && (pkg.scripts.build || pkg.scripts.start)) || hasServer) {
        return 'nodejs';
      }
    }
    return 'static';
  }

  // The explicit type if given, else detected from a directory. Archives cannot be inspected.
  private hosting_deploy_resolveType(params: Record<string, any>): string {
    const { path: sourcePath, type, databaseDump } = params;
    let stats: fs.Stats;
    try {
      stats = fs.statSync(sourcePath);
    } catch (error) {
      throw new Error('Path not found: ' + sourcePath);
    }

    if (type !== undefined && !this.hosting_deploy_types.includes(type)) {
      throw new Error('type must be one of: ' + this.hosting_deploy_types.join(', '));
    }
    let resolved = type;
    if (resolved === undefined) {
      if (!stats.isDirectory()) {
        throw new Error('The path is an archive, which cannot be inspected: pass type (static, nodejs or wordpress-site), or pass the directory to detect it');
      }
      resolved = this.hosting_deploy_detectType(sourcePath);
    }
    if ((resolved === 'wordpress-plugin' || resolved === 'wordpress-theme') && !stats.isDirectory()) {
      throw new Error('A ' + (resolved === 'wordpress-plugin' ? 'plugin' : 'theme') + ' deploy needs a directory, not a file');
    }
    if (resolved === 'wordpress-site' && !databaseDump) {
      throw new Error('databaseDump (path to a .sql file) is required to import a WordPress site');
    }
    return resolved;
  }

  // A WordPress slug from a directory name: lower case letters, digits, "-" and "_".
  private hosting_deploy_slug(dir: string): string {
    const base = path.basename(dir);
    const slug = base.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    if (!slug) {
      throw new Error('Cannot derive a slug from "' + base + '"; pass slug');
    }
    return slug;
  }

  // Adds what was left out to a result, so it is never silent.
  private hosting_deploy_withSkipped(result: any, skipped: string[]): any {
    if (skipped.length === 0) {
      return result;
    }
    return {
      ...result,
      skippedFiles: skipped,
      skippedNote: 'These files hold secrets (env files, keys, credentials) and were not uploaded. Set environment values with hosting_nodejs_replace-environment-variables.',
    };
  }

  private async hosting_deploy_createZip(dir: string, files: string[], dest: string): Promise<void> {
    const out = fs.createWriteStream(dest);
    const finished = new Promise<void>((resolve, reject) => {
      out.on('finish', () => resolve());
      out.on('error', reject);
    });
    // The error is reported by the final await; this keeps an early one from being an unhandled rejection.
    finished.catch(() => {});
    const zip = new Zip((error, chunk, final) => {
      if (error) {
        out.destroy(error);
        return;
      }
      out.write(chunk);
      if (final) {
        out.end();
      }
    });
    // When the output stream is full, stop reading and compressing until it drains, so a large site cannot
    // pile up in memory; a write error ends the wait.
    const drained = async (): Promise<void> => {
      if (out.writableNeedDrain) {
        await Promise.race([new Promise<void>((resolve) => out.once('drain', () => resolve())), finished]);
      }
    };
    try {
      for (const relativePath of files) {
        const entry = new ZipDeflate(relativePath, { level: 6 });
        zip.add(entry);
        for await (const chunk of fs.createReadStream(path.join(dir, relativePath))) {
          entry.push(chunk);
          await drained();
          if (out.destroyed) {
            break;
          }
        }
        if (out.destroyed) {
          break;
        }
        entry.push(new Uint8Array(0), true);
        await drained();
      }
      zip.end();
    } catch (error) {
      out.destroy(error as Error);
    }
    await finished;
  }

  // The start-build fields: explicit overrides (the tool's camelCase params) beat base, which is
  // the settings detected from an archive or stored for the site. Only the framework is required.
  // An app that runs straight from source (plain-JavaScript Express) has no build script or output
  // directory, and the API stores them as null, so a missing one is sent as null. Detection supplies
  // the build script but only guesses a root-level entry file, so a compiled app (TypeScript) must
  // pass entryFile.
  // An explicit null for outputDirectory, buildScript or entryFile clears the stored value, so an app
  // can drop a build step it no longer has.
  // storedSettings tells base apart: settings stored for the site or detected from a Git branch (Git
  // deploy) belong to the framework they were stored or detected for, so a different appType starts
  // from a clean build step, while settings detected from the archive being deployed are kept.
  private hosting_deploy_nodeSettings(base: Record<string, any> | null, params: Record<string, any>, storedSettings: boolean): Record<string, any> {
    const given = base || {};
    const appType = params.appType ?? given.app_type;
    const sameFramework = !storedSettings || params.appType === undefined || params.appType === given.app_type;
    const stored = sameFramework ? given : { node_version: given.node_version, root_directory: given.root_directory, package_manager: given.package_manager };
    if (appType === undefined || appType === null) {
      throw new Error("Missing Node.js build setting: appType. Pass it to hosting_deploy, with outputDirectory and buildScript when the app has a build step; read them from the project's package.json.");
    }
    const cleared = (name: string): boolean => name in params && params[name] === null;
    const optional: Record<string, any> = {
      entry_file: params.entryFile ?? stored.entry_file,
      package_manager: params.packageManager ?? stored.package_manager,
    };
    return {
      node_version: params.nodeVersion ?? stored.node_version ?? 22,
      app_type: appType,
      root_directory: params.rootDirectory ?? stored.root_directory ?? '.',
      output_directory: cleared('outputDirectory') ? null : params.outputDirectory ?? stored.output_directory ?? null,
      build_script: cleared('buildScript') ? null : params.buildScript ?? stored.build_script ?? null,
      ...Object.fromEntries(Object.entries(optional).filter(([, value]) => value !== undefined && value !== null)),
      ...(cleared('entryFile') ? { entry_file: null } : {}),
    };
  }

  private hosting_deploy_hasNodeOverrides(params: Record<string, any>): boolean {
    return ['nodeVersion', 'appType', 'rootDirectory', 'outputDirectory', 'buildScript', 'entryFile', 'packageManager'].some((name) => params[name] !== undefined);
  }

  // The folder of the site a static Git deploy goes into, as a clean relative path ('' is the document root).
  // Separators are normalized first, because some servers read a backslash as one: a value made of dots and
  // backslashes, or one that starts with a drive letter, must not get past as a name.
  private hosting_deploy_gitDirectory(git: Record<string, any>): string {
    if (git.directory === undefined || git.directory === '') {
      return '';
    }
    let directory = typeof git.directory === 'string' ? this.normalizePath(git.directory) : '';
    while (directory.length > 1 && directory.endsWith('/')) {
      directory = directory.slice(0, -1);
    }
    const driveRooted = directory.length > 1 && directory[1] === ':' && /[A-Za-z]/.test(directory[0]);
    if (directory === '' || directory.startsWith('/') || driveRooted || directory.split('/').some((segment: string) => segment === '' || segment === '.' || segment === '..')) {
      throw new Error('git.directory must be a relative path inside the website, without ..');
    }
    return directory;
  }

  private hosting_deploy_validate(params: Record<string, any>): void {
    const { domain, path: sourcePath, git } = params;

    if (!domain || typeof domain !== 'string') {
      throw new Error('domain is required and must be a string');
    }
    if ((sourcePath === undefined) === (git === undefined)) {
      throw new Error('Pass exactly one of path (a local directory or archive) or git ({ repository, branch })');
    }
    if (sourcePath !== undefined && (typeof sourcePath !== 'string' || sourcePath === '')) {
      throw new Error('path must be a non-empty string');
    }
    // The slug becomes part of the remote upload path, so it cannot carry path or URL syntax.
    if (params.slug !== undefined && !(typeof params.slug === 'string' && /^[a-z0-9_-]+$/.test(params.slug))) {
      throw new Error('slug must contain only lower-case letters, digits, "-" and "_"');
    }
    if (git !== undefined && (typeof git !== 'object' || git === null || typeof git.repository !== 'string' || typeof git.branch !== 'string' || git.branch === '')) {
      throw new Error('git must be an object with repository (owner/name) and branch');
    }
    // Read only now that git is known to be an object.
    if (git !== undefined) {
      this.hosting_deploy_gitDirectory(git);
      if (git.installationUuid !== undefined && (typeof git.installationUuid !== 'string' || git.installationUuid === '')) {
        throw new Error('git.installationUuid must be a non-empty string when provided');
      }
    }
  }

  private hosting_deploy_timestamp(): string {
    const pad = (value: number): string => String(value).padStart(2, '0');
    const now = new Date();
    return String(now.getFullYear()) + pad(now.getMonth() + 1) + pad(now.getDate()) + '_' + pad(now.getHours()) + pad(now.getMinutes()) + pad(now.getSeconds());
  }

  // The WordPress deploy endpoints, called directly. hosting_deploy also runs in hostinger-hosting-mcp,
  // whose catalog holds the hosting group only, so it cannot look these operations up.
  private hosting_deploy_wordpressEndpoints: Record<string, string> = {
    import: '/api/hosting/v1/accounts/{username}/websites/{domain}/wordpress/import',
    plugin: '/api/hosting/v1/accounts/{username}/websites/{domain}/wordpress/plugins/deploy',
    theme: '/api/hosting/v1/accounts/{username}/websites/{domain}/wordpress/themes/deploy',
  };

  private async hosting_deploy_callWordpress(kind: string, params: Record<string, any>): Promise<any> {
    return this.executeApiCall({ name: 'wordpress_' + kind, method: 'POST', path: this.hosting_deploy_wordpressEndpoints[kind] } as any, params);
  }

  // The folder of the document root WordPress is installed in ('' for the root, e.g. 'cms' on a headless
  // site), from the installation directory wordpress_installations_list reports (public_html or '' for the root,
  // public_html/<folder> or a bare <folder> otherwise). Absolute paths and .. segments are refused.
  private async hosting_deploy_wordpressDirectory(username: string, domain: string): Promise<string> {
    const response = await this.executeApiCall({ name: 'wordpress_installations_list', method: 'GET', path: '/api/hosting/v1/wordpress/installations' } as any, { username, domain, ownership: 'all' });
    const list = Array.isArray(response) ? response : (response && Array.isArray(response.data) ? response.data : []);
    const installations = list.filter((installation: any) => typeof installation.domain === 'string' && installation.domain.toLowerCase() === domain.toLowerCase());
    if (installations.length === 0) {
      return '';
    }
    if (installations.length > 1) {
      throw new Error('Several WordPress installations found for ' + domain + ' (' + installations.map((installation: any) => installation.directory).join(', ') + '); cannot tell which one to deploy to');
    }
    let directory = typeof installations[0].directory === 'string' ? installations[0].directory : '';
    if (directory.startsWith('/') || directory.split('/').includes('..')) {
      throw new Error('Unrecognized WordPress installation directory for ' + domain + ': ' + String(installations[0].directory));
    }
    while (directory.endsWith('/')) {
      directory = directory.slice(0, -1);
    }
    if (directory === 'public_html') {
      return '';
    }
    if (directory.startsWith('public_html/')) {
      return directory.slice('public_html/'.length);
    }
    return directory;
  }

  private hosting_deploy_randomSuffix(): string {
    return Math.random().toString(36).slice(2, 10).padEnd(8, '0');
  }

  // A directory is zipped into a temp dir (removed by the caller); an archive is used as is.
  private async hosting_deploy_prepareArchive(sourcePath: string, exclude?: string): Promise<{ archivePath: string; tempDir?: string; skipped: string[] }> {
    const resolved = path.resolve(sourcePath);
    if (fs.statSync(resolved).isFile()) {
      const name = path.basename(resolved).toLowerCase();
      const formats = ['.zip', '.tar', '.tar.gz', '.tgz', '.7z', '.gz', '.gzip'];
      if (!formats.some((extension) => name.endsWith(extension))) {
        throw new Error('Invalid archive format. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip');
      }
      return { archivePath: resolved, skipped: [] };
    }

    const { files, skipped } = this.listDeployFiles(resolved, exclude);
    if (files.length === 0) {
      throw new Error('No files to deploy in ' + resolved);
    }
    let baseName = 'site';
    try {
      baseName = this.hosting_deploy_slug(resolved);
    } catch (error) {
      // an unusable directory name only changes the archive's file name
    }
    // A file name made of dots and backslashes would be written into the zip as it is, where an extractor
    // that treats backslashes as separators reads it as a path outside the site.
    for (const file of files) {
      this.assertSafeUploadPath(file);
    }
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hostinger-deploy-'));
    const archivePath = path.join(tempDir, baseName + '_' + this.hosting_deploy_timestamp() + '.zip');
    this.log('info', 'Packing ' + files.length + ' files from ' + resolved);
    await this.hosting_deploy_createZip(resolved, files, archivePath);
    return { archivePath, tempDir, skipped };
  }

  private async hosting_deploy_upload(username: string, domain: string, files: Array<{ absolutePath: string; relativePath: string }>): Promise<void> {
    // Check every name first, so a bad one fails the deploy before anything is uploaded.
    for (const file of files) {
      this.assertSafeUploadPath(file.relativePath);
    }
    let credentials: any;
    try {
      credentials = await this.fetchUploadCredentials(username, domain);
    } catch (error) {
      throw new Error('Failed to fetch upload credentials: ' + (error instanceof Error ? error.message : String(error)));
    }
    const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = credentials;
    if (!uploadUrl || !authToken || !authRestToken) {
      throw new Error('Invalid upload credentials received from API');
    }

    for (const file of files) {
      try {
        await this.uploadFile(file.absolutePath, file.relativePath, uploadUrl, authRestToken, authToken);
      } catch (error) {
        throw new Error('Failed to upload ' + file.relativePath + ': ' + (error instanceof Error ? error.message : String(error)));
      }
    }
  }

  private async hosting_deploy_wordpressExtension(username: string, domain: string, type: string, params: Record<string, any>): Promise<any> {
    const isPlugin = type === 'wordpress-plugin';
    const directory = path.resolve(params.path);
    const slug = params.slug !== undefined ? params.slug : this.hosting_deploy_slug(directory);
    const { files, skipped } = this.listDeployFiles(directory);
    if (files.length === 0) {
      throw new Error('No files found in directory: ' + directory);
    }

    const wordpressDirectory = await this.hosting_deploy_wordpressDirectory(username, domain);
    // The files land in a fresh directory; the deploy call then installs from it.
    const uploadDirName = slug + '-' + this.hosting_deploy_randomSuffix();
    const remoteRoot = (wordpressDirectory ? wordpressDirectory + '/' : '') + (isPlugin ? 'wp-content/plugins/' : 'wp-content/themes/') + uploadDirName;
    await this.hosting_deploy_upload(username, domain, files.map((relativePath) => ({
      absolutePath: path.join(directory, relativePath),
      relativePath: remoteRoot + '/' + relativePath,
    })));

    if (isPlugin) {
      await this.hosting_deploy_callWordpress('plugin', { username, domain, slug, plugin_path: uploadDirName });
    } else {
      await this.hosting_deploy_callWordpress('theme', { username, domain, slug, theme_path: uploadDirName, is_activated: params.activate === true });
    }

    return this.hosting_deploy_withSkipped({
      type,
      domain,
      source: 'path',
      status: 'deployed',
      slug,
      files: files.length,
      ...(isPlugin ? {} : { activated: params.activate === true }),
      ...(wordpressDirectory ? { wordpressDirectory } : {}),
    }, skipped);
  }

  private async hosting_deploy_fromPath(username: string, domain: string, type: string, params: Record<string, any>): Promise<any> {
    if (type === 'wordpress-plugin' || type === 'wordpress-theme') {
      return this.hosting_deploy_wordpressExtension(username, domain, type, params);
    }

    const uploads: Array<{ absolutePath: string; relativePath: string }> = [];
    let databaseDump: string | undefined;
    if (type === 'wordpress-site') {
      databaseDump = path.resolve(params.databaseDump);
      if (!databaseDump.toLowerCase().endsWith('.sql')) {
        throw new Error('databaseDump must be a .sql file');
      }
      if (!fs.existsSync(databaseDump)) {
        throw new Error('Database dump not found: ' + databaseDump);
      }
    }

    const prepared = await this.hosting_deploy_prepareArchive(params.path, databaseDump);
    try {
      const archiveName = path.basename(prepared.archivePath);
      uploads.push({ absolutePath: prepared.archivePath, relativePath: archiveName });
      if (databaseDump !== undefined) {
        uploads.push({ absolutePath: databaseDump, relativePath: path.basename(databaseDump) });
      }
      await this.hosting_deploy_upload(username, domain, uploads);

      if (type === 'static') {
        const result = await this.callOperation('hosting_websites_deploy-static-site-archive', { username, domain, archive_path: archiveName });
        return this.hosting_deploy_withSkipped({ type, domain, source: 'path', status: 'deployed', message: result?.message }, prepared.skipped);
      }

      if (type === 'wordpress-site') {
        const result = await this.hosting_deploy_callWordpress('import', {
          username, domain, archive_path: archiveName, sql_path: path.basename(databaseDump as string),
        });
        return this.hosting_deploy_withSkipped({
          type, domain, source: 'path', status: 'import_started', message: result?.message,
          next: 'Files are extracted on the server and the site is available in a few minutes.',
        }, prepared.skipped);
      }

      // nodejs: let the server detect the settings from the archive, then apply any overrides.
      let detected: any = null;
      let detectionError = '';
      try {
        detected = await this.callOperation('hosting_nodejs_build-settings-from-archive', { username, domain, archive_path: archiveName });
      } catch (error) {
        detectionError = error instanceof Error ? error.message : String(error);
        this.log('warning', 'Build settings detection failed: ' + detectionError);
      }
      let settings: Record<string, any>;
      try {
        settings = this.hosting_deploy_nodeSettings(detected, params, false);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(detectionError ? message + ' (automatic detection failed: ' + detectionError + ')' : message);
      }
      const build = await this.callOperation('hosting_nodejs_start-build', {
        username, domain, ...settings, source_type: 'archive', source_options: { archive_path: archiveName },
      });
      return this.hosting_deploy_withSkipped(this.hosting_deploy_buildStarted(type, domain, 'path', build), prepared.skipped);
    } finally {
      if (prepared.tempDir) {
        fs.rmSync(prepared.tempDir, { recursive: true, force: true });
      }
    }
  }

  private hosting_deploy_buildStarted(type: string, domain: string, source: string, build: any): any {
    return {
      type,
      domain,
      source,
      status: 'build_started',
      buildUuid: build?.uuid,
      state: build?.state,
      next: 'The build runs on the server. Call hosting_get-deployment with this domain until the build state is completed or failed; a failed build comes back with its logs and analysis.',
    };
  }

  // The Git installation that can reach owner/name (GitLab owners may contain slashes). Every active
  // installation is checked, not just until the first match: a GitHub and a GitLab mirror can share a
  // path, the installations come in no set order, and the same request must not deploy one repository
  // one time and the other the next, overwriting the site. With an installation given, the name is taken as it is: the repository list stops at 500 entries, so a
  // repository past that cannot be found by searching it.
  private async hosting_deploy_findRepository(fullName: string, installationUuid?: string): Promise<{ installationUuid: string; owner: string; repository: string }> {
    if (!fullName.includes('/')) {
      throw new Error('git.repository must be given as owner/name');
    }
    if (installationUuid !== undefined) {
      const slash = fullName.lastIndexOf('/');
      const owner = fullName.slice(0, slash);
      const repository = fullName.slice(slash + 1);
      if (owner === '' || repository === '') {
        throw new Error('git.repository must be given as owner/name');
      }
      return { installationUuid, owner, repository };
    }
    const installations = await this.callOperation('hosting_git_list-installations', { status: 'active' });
    if (!Array.isArray(installations) || installations.length === 0) {
      throw new Error('No active Git installation. Connect GitHub or GitLab once in hPanel (Websites, Manage, Advanced, Git), then try again.');
    }
    // The API returns at most this many repositories per installation. A full list without the
    // repository may still hold it past the cut, so a match elsewhere cannot be trusted to be the only one.
    const repositoryLimit = 500;
    const truncated: any[] = [];
    const matches: Array<{ installation: any; installationUuid: string; owner: string; repository: string }> = [];
    for (const installation of installations) {
      const response = await this.callOperation('hosting_git_list-installation-repositories', { uuid: installation.uuid });
      const repositories = Array.isArray(response) ? response : [];
      const repo = repositories.find((candidate: any) => String(candidate.full_name).toLowerCase() === fullName.toLowerCase());
      if (repo) {
        matches.push({ installation, installationUuid: installation.uuid, owner: repo.owner, repository: repo.name });
      } else if (repositories.length >= repositoryLimit) {
        truncated.push(installation);
      }
    }
    const describe = (installation: any): string => (typeof installation.provider === 'string' ? installation.provider : 'git') + ' account ' + (typeof installation.account_login === 'string' ? installation.account_login : '?') + ' (installation ' + installation.uuid + ')';
    if (matches.length > 1) {
      throw new Error('Repository ' + fullName + ' is in ' + matches.length + ' of your Git installations: ' + matches.map((match) => describe(match.installation)).join('; ') + '. Pass git.installationUuid to say which one to deploy.');
    }
    if (matches.length === 1) {
      if (truncated.length > 0) {
        throw new Error('Repository ' + fullName + ' is in ' + describe(matches[0].installation) + ', but it may also be in ' + truncated.map(describe).join('; ') + ': repository lists stop at the first ' + repositoryLimit + '. Pass git.installationUuid to say which one to deploy.');
      }
      const { installationUuid, owner, repository } = matches[0];
      return { installationUuid, owner, repository };
    }
    const notFound = 'Repository ' + fullName + ' was not found in your ' + installations.length + ' active Git installation(s). Check the name, or give the Git provider access to it in hPanel (Websites, Manage, Advanced, Git).';
    if (truncated.length > 0) {
      throw new Error(notFound + ' An installation lists only its first ' + repositoryLimit + ' repositories: if it has more, pass git.installationUuid (from hosting_git_list-installations) to name the repository directly.');
    }
    throw new Error(notFound);
  }

  // What a Git deploy is. There are no local files to look at, so guessing is dangerous: a Node.js
  // repository deployed as a static site would publish its source and switch on push-to-deploy. The
  // type given, the site already running Node.js, or Node.js settings in the request are clear
  // intent; anything else has to say what it is.
  private hosting_deploy_gitType(website: any, params: Record<string, any>): string {
    if (params.type !== undefined) {
      return params.type;
    }
    if (website.website_type === 'nodejs' || this.hosting_deploy_hasNodeOverrides(params)) {
      return 'nodejs';
    }
    throw new Error("A Git deploy needs type ('static' or 'nodejs'): this site is not a Node.js site yet, and a repository's kind cannot be told without its files.");
  }

  private async hosting_deploy_fromGit(website: any, domain: string, git: Record<string, any>, params: Record<string, any>): Promise<any> {
    const username = website.username;
    const type = this.hosting_deploy_gitType(website, params);
    if (type !== 'nodejs' && type !== 'static') {
      throw new Error('A Git deploy supports type static or nodejs, not ' + type);
    }
    const directory = this.hosting_deploy_gitDirectory(git);
    if (type === 'nodejs' && directory !== '') {
      throw new Error('git.directory is for static deploys: a Node.js build has no target folder');
    }
    // On these sites saving auto-deployment settings clones nothing, so a static deploy would report
    // success and publish nothing.
    if (type === 'static' && website.website_type === 'nodejs') {
      throw new Error('This website runs a Node.js app: deploy it with type nodejs, or leave type out. Saving Git settings on a Node.js website does not deploy anything.');
    }
    if (type === 'static' && website.website_type === 'builder') {
      throw new Error('This is a Website Builder website, which cannot deploy from Git: saving Git settings on it does not deploy anything.');
    }
    const repo = await this.hosting_deploy_findRepository(git.repository, git.installationUuid);

    if (type === 'static') {
      // Saving the settings deploys the branch now and again on every push.
      const result = await this.callOperation('hosting_git_update-auto-deployment-settings', {
        username, domain, installation_uuid: repo.installationUuid, owner: repo.owner, repository: repo.repository, branch: git.branch, is_enabled: true,
        ...(directory !== '' ? { directory } : {}),
      });
      return { type, domain, source: 'git', status: 'deployed', autoDeploy: true, message: result?.message };
    }

    // Nothing is uploaded, so there is no archive to detect from: use the settings stored for the site.
    let stored: any = null;
    try {
      stored = await this.callOperation('hosting_nodejs_build-settings', { username, domain });
    } catch (error) {
      if (!(error instanceof ApiExecutionError && error.status === 404)) {
        throw error;
      }
    }
    // The API can return all-null settings, which mean nothing is stored.
    const hasStored = stored !== null && typeof stored === 'object' && stored.app_type !== null && stored.app_type !== undefined;
    let settings: Record<string, any>;
    if (hasStored) {
      settings = this.hosting_deploy_nodeSettings(stored, params, true);
    } else {
      // A first deploy: detect the settings from the branch's package.json. The request's settings beat
      // them, and a different appType drops the build step detected for the other framework.
      let detected: any = null;
      try {
        detected = await this.callOperation('hosting_nodejs_build-settings-from-repository', {
          username, domain, owner: repo.owner, repository: repo.repository, branch: git.branch, installation_uuid: repo.installationUuid,
        });
      } catch (error) {
        if (!(error instanceof ApiExecutionError && error.status === 422)) {
          throw error;
        }
        if (params.appType === undefined || params.appType === null) {
          throw new Error('No Node.js build settings could be detected from the ' + git.branch + ' branch (' + this.formatToolError(error) + '). Pass appType, with outputDirectory and buildScript when the app has a build step, or deploy with type static if the branch has no Node.js app.');
        }
      }
      settings = this.hosting_deploy_nodeSettings(detected, params, true);
    }
    if (!hasStored || this.hosting_deploy_hasNodeOverrides(params)) {
      // Later pushes build with the stored settings, not with this request: keep what was given or detected.
      await this.callOperation('hosting_nodejs_update-build-settings', { username, domain, ...settings });
    }
    const build = await this.callOperation('hosting_nodejs_start-build', {
      username, domain, ...settings, source_type: 'git',
      source_options: { owner: repo.owner, repository: repo.repository, branch: git.branch, installation_uuid: repo.installationUuid },
    });
    return this.hosting_deploy_buildStarted(type, domain, 'git', build);
  }

  private async handleHostingDeploy(params: Record<string, any>): Promise<any> {
    this.hosting_deploy_validate(params);
    const { domain, git } = params;

    if (git === undefined) {
      // Local checks first, so a bad path fails before any request is made.
      this.assertDeployablePath(params.path);
      if (params.databaseDump !== undefined) {
        this.assertDeployablePath(params.databaseDump);
      }
      const type = this.hosting_deploy_resolveType(params);
      const website = await this.findWebsite(domain);
      return this.hosting_deploy_fromPath(website.username, website.domain, type, params);
    }
    // The lookup ignores case: the API calls and the result use the website's own spelling.
    const website = await this.findWebsite(domain);
    return this.hosting_deploy_fromGit(website, website.domain, git, params);
  }

  // The failure analysis re-runs on every call and is limited to 5 a minute, so keep one request per
  // build, stored as soon as it starts so that polls at the same moment share it.
  private hosting_getDeployment_analyses = new Map<string, Promise<any>>();

  // A failed analysis (429, outage) is remembered for a minute, so polling does not retry the
  // rate-limited endpoint on every call; after that it is tried again.
  private hosting_getDeployment_failures = new Map<string, { error: string; at: number }>();

  // Settings that do not exist yet answer 404; that is "none", not a failure.
  private async hosting_getDeployment_orNull(request: Promise<any>): Promise<any> {
    try {
      return await request;
    } catch (error) {
      if (error instanceof ApiExecutionError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  private async hosting_getDeployment_analysis(username: string, domain: string, uuid: string): Promise<any> {
    const key = username + '/' + domain + '/' + uuid;
    const failure = this.hosting_getDeployment_failures.get(key);
    if (failure && Date.now() - failure.at < 60000) {
      return { error: failure.error };
    }
    if (!this.hosting_getDeployment_analyses.has(key)) {
      this.hosting_getDeployment_analyses.set(key, this.callOperation('hosting_nodejs_analyse-failed-build', { username, domain, uuid }));
    }
    try {
      const analysis = await this.hosting_getDeployment_analyses.get(key);
      this.hosting_getDeployment_failures.delete(key);
      return analysis;
    } catch (error) {
      // Rate limited or unavailable: report it, but do not lose the build and its logs.
      this.hosting_getDeployment_analyses.delete(key);
      const message = this.formatToolError(error);
      this.hosting_getDeployment_failures.set(key, { error: message, at: Date.now() });
      return { error: message };
    }
  }

  private async handleHostingGetDeployment(params: Record<string, any>): Promise<any> {
    const { domain: requestedDomain, buildUuid, fromLine } = params;

    if (!requestedDomain || typeof requestedDomain !== 'string') {
      throw new Error('domain is required and must be a string');
    }
    if (buildUuid !== undefined && (typeof buildUuid !== 'string' || buildUuid === '')) {
      throw new Error('buildUuid must be a non-empty string when provided');
    }
    if (fromLine !== undefined && (typeof fromLine !== 'number' || !Number.isInteger(fromLine) || fromLine < 0)) {
      throw new Error('fromLine must be a non-negative integer when provided');
    }

    // The lookup ignores case: from here on use the website's own spelling, so one site has one analysis cache key.
    const { username, domain } = await this.findWebsite(requestedDomain);
    const target = { username, domain };

    const gitSettings = await this.callOperation('hosting_git_auto-deployment-settings', target);
    const gitAutoDeployment = gitSettings && gitSettings.installation_uuid ? gitSettings : null;
    const buildSettings = await this.hosting_getDeployment_orNull(this.callOperation('hosting_nodejs_build-settings', target));

    let build: any = null;
    if (buildUuid !== undefined) {
      build = await this.callOperation('hosting_nodejs_build', { ...target, uuid: buildUuid });
    } else {
      const builds = await this.hosting_getDeployment_orNull(this.callOperation('hosting_nodejs_list-builds', { ...target, per_page: 1 }));
      build = builds && Array.isArray(builds.data) && builds.data.length > 0 ? builds.data[0] : null;
    }

    if (build === null) {
      return {
        domain,
        build: null,
        buildSettings,
        gitAutoDeployment,
        note: 'No Node.js builds found for this website. Static, PHP, plugin and theme deploys finish before hosting_deploy returns, and a WordPress site import is ready a few minutes after it starts; a Node.js build appears here once one has been started.',
      };
    }

    const logs = await this.callOperation('hosting_nodejs_build-logs', { ...target, uuid: build.uuid, from_line: fromLine !== undefined ? fromLine : 0 });

    return {
      domain,
      build,
      logs,
      ...(build.state === 'failed' ? { analysis: await this.hosting_getDeployment_analysis(username, domain, build.uuid) } : {}),
      buildSettings,
      gitAutoDeployment,
    };
  }

  // A 404 means the domain is not a website on the account, which fails the whole call; any other
  // failure only fails its own section.
  private async hosting_websitesGetSettings_section(request: Promise<any>, pick: (response: any) => any): Promise<any> {
    try {
      return pick(await request);
    } catch (error) {
      if (error instanceof ApiExecutionError && error.status === 404) {
        throw error;
      }
      return { error: this.formatToolError(error) };
    }
  }

  private async handleHostingWebsitesGetSettings(params: Record<string, any>): Promise<any> {
    const { domain: requestedDomain } = params;

    if (!requestedDomain || typeof requestedDomain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    const { username, domain } = await this.findWebsite(requestedDomain);
    const target = { username, domain };
    // hosting_cache_status joined the spec after this tool: a catalog without it gets cache: null.
    // Once every catalog has it, make this true (and drop cacheNote).
    const cacheAvailable = this.operations.has('hosting_cache_status');

    const [ssl, cdn, cache] = await Promise.all([
      this.hosting_websitesGetSettings_section(this.callOperation('hosting_ssl_status', target), (response: any) => response),
      this.hosting_websitesGetSettings_section(this.callOperation('hosting_cdn_status', target), (response: any) => ({ is_enabled: response.is_enabled })),
      cacheAvailable
        ? this.hosting_websitesGetSettings_section(this.callOperation('hosting_cache_status', target), (response: any) => ({
          is_enabled: response.is_enabled,
          is_cacheless_mode_enabled: response.is_cacheless_mode_enabled,
        }))
        : Promise.resolve(null),
    ]);

    return {
      domain,
      ssl,
      cdn,
      cache,
      ...(cacheAvailable ? {} : { cacheNote: 'cache status not available yet' }),
    };
  }

  // Application order, and how each setting maps to its operation.
  private hosting_websitesUpdateSettings_steps: Array<{ setting: string; run: (target: { username: string; domain: string }, value: boolean) => Promise<any> }> = [
    { setting: 'cache', run: (target, value) => this.callOperation('hosting_cache_toggle-website', { ...target, enabled: value }) },
    { setting: 'cachelessMode', run: (target, value) => this.callOperation('hosting_cache_toggle-cacheless', { ...target, enabled: value }) },
    { setting: 'cdn', run: (target, value) => this.callOperation(value ? 'hosting_cdn_enable' : 'hosting_cdn_disable', target) },
    { setting: 'httpsRedirect', run: (target, value) => this.callOperation('hosting_ssl_toggle-https-redirect', { ...target, is_enabled: value }) },
  ];

  private async handleHostingWebsitesUpdateSettings(params: Record<string, any>): Promise<any> {
    const { domain: requestedDomain } = params;

    // Models send null for settings they leave unset.
    const requested = this.hosting_websitesUpdateSettings_steps.filter(step => params[step.setting] !== undefined && params[step.setting] !== null);
    for (const step of requested) {
      if (typeof params[step.setting] !== 'boolean') {
        throw new Error(step.setting + ' must be a boolean when provided');
      }
    }
    if (requested.length === 0) {
      throw new Error('Pass at least one of cache, cachelessMode, cdn, httpsRedirect');
    }
    if (!requestedDomain || typeof requestedDomain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    const { username, domain } = await this.findWebsite(requestedDomain);
    const target = { username, domain };

    // The redirect needs an installed certificate: check it before changing anything, so a
    // missing certificate does not leave the other settings half applied.
    if (params.httpsRedirect === true) {
      const ssl = await this.callOperation('hosting_ssl_status', target);
      const status = ssl ? ssl.status : undefined;
      if (status !== 'active') {
        const shown = ['string', 'number', 'boolean'].includes(typeof status) ? String(status) : 'unknown';
        throw new Error('HTTPS redirect needs an active SSL certificate, but the SSL status of ' + domain + ' is ' + shown + '. Install SSL first with hosting_ssl_install and wait until hosting_websites_get-settings shows ssl.status active; no settings were changed.');
      }
    }

    const applied: Record<string, boolean> = {};
    let failed: { setting: string; error: string } | null = null;
    const skipped: string[] = [];
    for (const step of requested) {
      const value = params[step.setting] as boolean;
      if (failed) {
        skipped.push(step.setting);
        continue;
      }
      try {
        await step.run(target, value);
        applied[step.setting] = value;
      } catch (error) {
        failed = { setting: step.setting, error: this.formatToolError(error) };
      }
    }

    const result = {
      domain,
      applied,
      failed,
      skipped,
      ...('cachelessMode' in applied ? { note: 'cachelessMode takes effect in the background within a few minutes; hosting_websites_get-settings shows it once applied.' } : {}),
    };
    // A failed setting is a tool error carrying the same JSON, so execute reports it and a
    // multi-execute batch stops at this step.
    if (failed) {
      throw new Error(JSON.stringify(result));
    }
    return result;
  }

  private async handleHostingCacheClear(params: Record<string, any>): Promise<any> {
    const { domain: requestedDomain } = params;
    // Models send null for fields they leave unset.
    const scope = params.scope ?? 'all';
    const directory = params.directory ?? null;

    if (scope !== 'all' && scope !== 'cdn') {
      throw new Error('scope must be one of: all, cdn');
    }
    if (directory !== null && (typeof directory !== 'string' || directory === '')) {
      throw new Error('directory must be a non-empty string when provided');
    }
    if (scope === 'cdn' && directory !== null) {
      throw new Error('directory applies only when scope is all: the CDN purge clears the whole website');
    }
    if (!requestedDomain || typeof requestedDomain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    const { username, domain } = await this.findWebsite(requestedDomain);

    const response = scope === 'cdn'
      ? await this.callOperation('hosting_cdn_purge-cache', { username, domain })
      : await this.callOperation('hosting_cache_clear-website', { username, domain, ...(directory !== null ? { directory } : {}) });
    return { domain, cleared: scope, directory, response };
  }

  private hosting_importWordpressWebsite_validateArchiveFormat(filePath: string): boolean {
    const validExtensions = ['zip', 'tar', 'tar.gz', 'tgz', '7z', 'gz', 'gzip'];
    const fileName = path.basename(filePath).toLowerCase();
    
    for (const ext of validExtensions) {
      if (fileName.endsWith(`.${ext}`)) {
        return true;
      }
    }
    
    return false;
  }

  private hosting_importWordpressWebsite_validateRequiredParams(params: Record<string, any>): void {
    const { domain, archivePath, databaseDump } = params;

    if (!domain || typeof domain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    if (!archivePath || typeof archivePath !== 'string') {
      throw new Error('archivePath is required and must be a string');
    }

    if (!databaseDump || typeof databaseDump !== 'string') {
      throw new Error('databaseDump is required and must be a string');
    }
  }

  private hosting_importWordpressWebsite_validateArchiveFile(archivePath: string): void {
    this.assertDeployablePath(archivePath);
    if (!fs.existsSync(archivePath)) {
      throw new Error(`Archive file not found: ${archivePath}`);
    }

    const archiveStats = fs.statSync(archivePath);
    if (!archiveStats.isFile()) {
      throw new Error(`Archive path is not a file: ${archivePath}`);
    }

    if (!this.hosting_importWordpressWebsite_validateArchiveFormat(archivePath)) {
      throw new Error('Invalid archive format. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip');
    }
  }

  private hosting_importWordpressWebsite_validateDatabaseFile(databaseDump: string): void {
    this.assertDeployablePath(databaseDump);
    if (!fs.existsSync(databaseDump)) {
      throw new Error(`Database dump file not found: ${databaseDump}`);
    }

    const dbStats = fs.statSync(databaseDump);
    if (!dbStats.isFile()) {
      throw new Error(`Database dump path is not a file: ${databaseDump}`);
    }

    if (!databaseDump.toLowerCase().endsWith('.sql')) {
      throw new Error('Database dump must be a .sql file');
    }
  }

  private async hosting_importWordpressWebsite_checkWebsiteIsEmpty(username: string, domain: string): Promise<boolean> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/domains/${domain}/is-empty`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'get',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`
        },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      const { is_empty } = response.data;

      if (!is_empty) {
        throw new Error('Website is not empty. WordPress import can only be performed on empty sites. Please visit hPanel (https://hpanel.hostinger.com) and remove all existing files from the website before attempting to import.');
      }

      this.log('info', `Website ${domain} is empty, proceeding with import`);
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to check if website is empty: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async hosting_importWordpressWebsite_extractFiles(username: string, domain: string, archivePath: string, databaseDump: string): Promise<boolean> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/wordpress/import`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          archive_path: path.basename(archivePath),
          sql_path: path.basename(databaseDump)
        },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      this.log('info', `Successfully triggered file extraction for ${domain}`);
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger file extraction: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async handleWordpressWebsiteImport(params: Record<string, any>): Promise<any> {
    const { domain, archivePath, databaseDump } = params;

    this.hosting_importWordpressWebsite_validateRequiredParams(params);
    this.hosting_importWordpressWebsite_validateArchiveFile(archivePath);
    this.hosting_importWordpressWebsite_validateDatabaseFile(databaseDump);

    // Auto-resolve username from domain
    this.log('info', `Resolving username from domain: ${domain}`);
    const username = await this.resolveUsername(domain);

    await this.hosting_importWordpressWebsite_checkWebsiteIsEmpty(username, domain);

    const filesToUpload: Array<{absolutePath: string, relativePath: string, type: string}> = [{
      absolutePath: archivePath,
      relativePath: path.basename(archivePath),
      type: 'archive'
    }, {
      absolutePath: databaseDump,
      relativePath: path.basename(databaseDump),
      type: 'database'
    }];

    let uploadCredentials: any;
    try {
      uploadCredentials = await this.fetchUploadCredentials(username, domain);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch upload credentials: ${errorMessage}`);
    }

    const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = uploadCredentials;

    if (!uploadUrl || !authToken || !authRestToken) {
      throw new Error('Invalid upload credentials received from API');
    }

    this.log('info', `Starting website archive import to ${uploadUrl}`);

    const results: any[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (const fileInfo of filesToUpload) {
      try {
        this.log('info', `Uploading ${fileInfo.type}: ${fileInfo.absolutePath}`);

        const stats = fs.statSync(fileInfo.absolutePath);
        const uploadResult = await this.uploadFile(
          fileInfo.absolutePath,
          fileInfo.relativePath,
          uploadUrl,
          authRestToken,
          authToken
        );

        results.push({
          file: fileInfo.absolutePath,
          remotePath: fileInfo.relativePath,
          type: fileInfo.type,
          status: 'success',
          uploadUrl: uploadResult.url,
          size: stats.size
        });

        successCount++;
        this.log('info', `Successfully uploaded ${fileInfo.type}: ${fileInfo.relativePath}`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({
          file: fileInfo.absolutePath,
          remotePath: fileInfo.relativePath,
          type: fileInfo.type,
          status: 'error',
          error: errorMessage
        });

        failureCount++;
        this.log('error', `Failed to upload ${fileInfo.type} ${fileInfo.absolutePath}: ${errorMessage}`);
      }
    }

    const overallStatus = failureCount === 0 ? 'success' : (successCount === 0 ? 'failure' : 'partial');

    if (failureCount === 0) {
      try {
        this.log('info', 'All files uploaded successfully, triggering extraction...');
        await this.hosting_importWordpressWebsite_extractFiles(username, domain, archivePath, databaseDump);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.log('error', `File extraction failed: ${errorMessage}`);
        return {
          status: 'partial',
          summary: {
            total: filesToUpload.length,
            successful: successCount,
            failed: failureCount
          },
          results,
          extractionError: errorMessage
        };
      }
    }

    return {
      status: overallStatus,
      summary: {
        total: filesToUpload.length,
        successful: successCount,
        failed: failureCount
      },
      results
    };
  }

  private hosting_deployWordpressPlugin_generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private hosting_deployWordpressPlugin_validateRequiredParams(params: Record<string, any>): void {
    const { domain, slug, pluginPath } = params;

    if (!domain || typeof domain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    if (!slug || typeof slug !== 'string') {
      throw new Error('slug is required and must be a string');
    }

    if (!pluginPath || typeof pluginPath !== 'string') {
      throw new Error('pluginPath is required and must be a string');
    }
  }

  private hosting_deployWordpressPlugin_validatePluginDirectory(pluginPath: string): void {
    this.assertDeployablePath(pluginPath);
    if (!fs.existsSync(pluginPath)) {
      throw new Error(`Plugin directory not found: ${pluginPath}`);
    }

    const pluginStats = fs.statSync(pluginPath);
    if (!pluginStats.isDirectory()) {
      throw new Error(`Plugin path is not a directory: ${pluginPath}`);
    }
  }

  private async hosting_deployWordpressPlugin_deployPlugin(username: string, domain: string, slug: string, pluginPath: string): Promise<boolean> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/wordpress/plugins/deploy`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          slug,
          plugin_path: pluginPath
        },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      this.log('info', `Successfully triggered plugin deployment for ${domain}`);
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger plugin deployment: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async handleWordpressPluginDeploy(params: Record<string, any>): Promise<any> {
    const { domain, slug, pluginPath } = params;

    this.hosting_deployWordpressPlugin_validateRequiredParams(params);
    this.hosting_deployWordpressPlugin_validatePluginDirectory(pluginPath);

    this.log('info', `Resolving username from domain: ${domain}`);
    const username = await this.resolveUsername(domain);

    const randomSuffix = this.hosting_deployWordpressPlugin_generateRandomString(8);
    const uploadDirName = `${slug}-${randomSuffix}`;

    this.log('info', `Scanning plugin directory: ${pluginPath}`);
    const { files, skipped } = this.listDeployFiles(pluginPath);
    const pluginFiles = files.map((relativePath: string) => ({ absolutePath: path.join(pluginPath, relativePath), relativePath }));

    if (pluginFiles.length === 0) {
      throw new Error(`No files found in plugin directory: ${pluginPath}`);
    }

    this.log('info', `Found ${pluginFiles.length} files to upload`);

    let uploadCredentials: any;
    try {
      uploadCredentials = await this.fetchUploadCredentials(username, domain);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch upload credentials: ${errorMessage}`);
    }

    const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = uploadCredentials;

    if (!uploadUrl || !authToken || !authRestToken) {
      throw new Error('Invalid upload credentials received from API');
    }

    this.log('info', `Starting plugin file upload to ${uploadUrl}`);

    const results: any[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (const fileInfo of pluginFiles) {
      try {
        const normalizedRelativePath = this.normalizePath(fileInfo.relativePath);
        const uploadPath = `wp-content/plugins/${uploadDirName}/${normalizedRelativePath}`;
        this.log('info', `Uploading: ${fileInfo.absolutePath} -> ${uploadPath}`);

        const stats = fs.statSync(fileInfo.absolutePath);
        const uploadResult = await this.uploadFile(
          fileInfo.absolutePath,
          uploadPath,
          uploadUrl,
          authRestToken,
          authToken
        );

        results.push({
          file: fileInfo.absolutePath,
          remotePath: uploadPath,
          status: 'success',
          uploadUrl: uploadResult.url,
          size: stats.size
        });

        successCount++;
        this.log('info', `Successfully uploaded: ${uploadPath}`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const normalizedRelativePath = this.normalizePath(fileInfo.relativePath);
        const uploadPath = `wp-content/plugins/${uploadDirName}/${normalizedRelativePath}`;
        
        results.push({
          file: fileInfo.absolutePath,
          remotePath: uploadPath,
          status: 'error',
          error: errorMessage
        });

        failureCount++;
        this.log('error', `Failed to upload ${fileInfo.absolutePath}: ${errorMessage}`);
      }
    }

    const overallStatus = failureCount === 0 ? 'success' : (successCount === 0 ? 'failure' : 'partial');

    if (failureCount === 0) {
      try {
        this.log('info', 'All files uploaded successfully, triggering plugin deployment...');
        await this.hosting_deployWordpressPlugin_deployPlugin(username, domain, slug, uploadDirName);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.log('error', `Plugin deployment failed: ${errorMessage}`);
        return {
          status: 'partial',
          summary: {
            total: pluginFiles.length,
            successful: successCount,
            failed: failureCount
          },
          results,
          ...(skipped.length > 0 ? { skippedFiles: skipped } : {}),
          deploymentError: errorMessage
        };
      }
    }

    return {
      status: overallStatus,
      summary: {
        total: pluginFiles.length,
        successful: successCount,
        failed: failureCount
      },
      results,
      ...(skipped.length > 0 ? { skippedFiles: skipped } : {}),
      uploadDirName
    };
  }

  private hosting_deployWordpressTheme_generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private hosting_deployWordpressTheme_validateRequiredParams(params: Record<string, any>): void {
    const { domain, slug, themePath } = params;

    if (!domain || typeof domain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    if (!slug || typeof slug !== 'string') {
      throw new Error('slug is required and must be a string');
    }

    if (!themePath || typeof themePath !== 'string') {
      throw new Error('themePath is required and must be a string');
    }
  }

  private hosting_deployWordpressTheme_validateThemeDirectory(themePath: string): void {
    this.assertDeployablePath(themePath);
    if (!fs.existsSync(themePath)) {
      throw new Error(`Theme directory not found: ${themePath}`);
    }

    const themeStats = fs.statSync(themePath);
    if (!themeStats.isDirectory()) {
      throw new Error(`Theme path is not a directory: ${themePath}`);
    }
  }

  private async hosting_deployWordpressTheme_deployTheme(username: string, domain: string, slug: string, themePath: string, activate: boolean = false): Promise<boolean> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/wordpress/themes/deploy`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          slug,
          theme_path: themePath,
          is_activated: activate
        },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      this.log('info', `Successfully triggered theme deployment for ${domain}`);
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger theme deployment: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async handleWordpressThemeDeploy(params: Record<string, any>): Promise<any> {
    const { domain, slug, themePath, activate = false } = params;

    this.hosting_deployWordpressTheme_validateRequiredParams(params);
    this.hosting_deployWordpressTheme_validateThemeDirectory(themePath);

    this.log('info', `Resolving username from domain: ${domain}`);
    const username = await this.resolveUsername(domain);

    const randomSuffix = this.hosting_deployWordpressTheme_generateRandomString(8);
    const uploadDirName = `${slug}-${randomSuffix}`;

    this.log('info', `Scanning theme directory: ${themePath}`);
    const { files, skipped } = this.listDeployFiles(themePath);
    const themeFiles = files.map((relativePath: string) => ({ absolutePath: path.join(themePath, relativePath), relativePath }));

    if (themeFiles.length === 0) {
      throw new Error(`No files found in theme directory: ${themePath}`);
    }

    this.log('info', `Found ${themeFiles.length} files to upload`);

    let uploadCredentials: any;
    try {
      uploadCredentials = await this.fetchUploadCredentials(username, domain);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch upload credentials: ${errorMessage}`);
    }

    const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = uploadCredentials;

    if (!uploadUrl || !authToken || !authRestToken) {
      throw new Error('Invalid upload credentials received from API');
    }

    this.log('info', `Starting theme file upload to ${uploadUrl}`);

    const results: any[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (const fileInfo of themeFiles) {
      try {
        const normalizedRelativePath = this.normalizePath(fileInfo.relativePath);
        const uploadPath = `wp-content/themes/${uploadDirName}/${normalizedRelativePath}`;
        this.log('info', `Uploading: ${fileInfo.absolutePath} -> ${uploadPath}`);

        const stats = fs.statSync(fileInfo.absolutePath);
        const uploadResult = await this.uploadFile(
          fileInfo.absolutePath,
          uploadPath,
          uploadUrl,
          authRestToken,
          authToken
        );

        results.push({
          file: fileInfo.absolutePath,
          remotePath: uploadPath,
          status: 'success',
          uploadUrl: uploadResult.url,
          size: stats.size
        });

        successCount++;
        this.log('info', `Successfully uploaded: ${uploadPath}`);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const normalizedRelativePath = this.normalizePath(fileInfo.relativePath);
        const uploadPath = `wp-content/themes/${uploadDirName}/${normalizedRelativePath}`;
        
        results.push({
          file: fileInfo.absolutePath,
          remotePath: uploadPath,
          status: 'error',
          error: errorMessage
        });

        failureCount++;
        this.log('error', `Failed to upload ${fileInfo.absolutePath}: ${errorMessage}`);
      }
    }

    const overallStatus = failureCount === 0 ? 'success' : (successCount === 0 ? 'failure' : 'partial');

    if (failureCount === 0) {
      try {
        this.log('info', 'All files uploaded successfully, triggering theme deployment...');
        await this.hosting_deployWordpressTheme_deployTheme(username, domain, slug, uploadDirName, activate);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.log('error', `Theme deployment failed: ${errorMessage}`);
        return {
          status: 'partial',
          summary: {
            total: themeFiles.length,
            successful: successCount,
            failed: failureCount
          },
          results,
          ...(skipped.length > 0 ? { skippedFiles: skipped } : {}),
          deploymentError: errorMessage
        };
      }
    }

    return {
      status: overallStatus,
      summary: {
        total: themeFiles.length,
        successful: successCount,
        failed: failureCount
      },
      results,
      ...(skipped.length > 0 ? { skippedFiles: skipped } : {}),
      uploadDirName,
      activated: activate
    };
  }

  private hosting_deployJsApplication_validateArchiveFormat(filePath: string): boolean {
    const validExtensions = ['zip', 'tar', 'tar.gz', 'tgz', '7z', 'gz', 'gzip'];
    const fileName = path.basename(filePath).toLowerCase();
    
    for (const ext of validExtensions) {
      if (fileName.endsWith(`.${ext}`)) {
        return true;
      }
    }
    
    return false;
  }

  private hosting_deployJsApplication_validateRequiredParams(params: Record<string, any>): void {
    const { domain, archivePath, removeArchive } = params;

    if (!domain || typeof domain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    if (!archivePath || typeof archivePath !== 'string') {
      throw new Error('archivePath is required and must be a string');
    }

    if (removeArchive !== undefined && typeof removeArchive !== 'boolean') {
      throw new Error('removeArchive must be a boolean if provided');
    }
  }

  private hosting_deployJsApplication_removeArchive(archivePath: string, removeArchive: boolean): boolean {
    if (!removeArchive) {
      return false;
    }

    try {
      this.log('info', `Removing archive file: ${archivePath}`);
      fs.unlinkSync(archivePath);
      this.log('info', `Successfully removed archive file: ${archivePath}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to remove archive file: ${errorMessage}`);
      // Don't fail the entire operation if archive removal fails
      return false;
    }
  }

  private hosting_deployJsApplication_validateArchiveFile(archivePath: string): void {
    this.assertDeployablePath(archivePath);
    if (!fs.existsSync(archivePath)) {
      throw new Error(`Archive file not found: ${archivePath}`);
    }

    const archiveStats = fs.statSync(archivePath);
    if (!archiveStats.isFile()) {
      throw new Error(`Archive path is not a file: ${archivePath}`);
    }

    if (!this.hosting_deployJsApplication_validateArchiveFormat(archivePath)) {
      throw new Error('Invalid archive format. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip');
    }
  }

  private async hosting_deployJsApplication_fetchBuildSettings(username: string, domain: string, archivePath: string): Promise<any> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const archiveBasename = path.basename(archivePath);
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/nodejs/builds/settings/from-archive?archive_path=${encodeURIComponent(archiveBasename)}`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'get',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`
        },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      this.log('info', `Successfully fetched build settings for ${domain}`);
      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to fetch build settings: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async hosting_deployJsApplication_triggerBuild(username: string, domain: string, archivePath: string, buildSettings: any): Promise<any> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/nodejs/builds`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const archiveBasename = path.basename(archivePath);
      const buildData = {
        ...buildSettings,
        node_version: buildSettings?.node_version || 20,
        source_type: 'archive',
        source_options: {
          archive_path: archiveBasename
        }
      };

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: buildData,
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      this.log('info', `Successfully triggered build for ${domain}`);
      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger build: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async handleJavascriptApplicationDeploy(params: Record<string, any>): Promise<any> {
    const { domain, archivePath, removeArchive = false } = params;

    this.hosting_deployJsApplication_validateRequiredParams(params);
    this.hosting_deployJsApplication_validateArchiveFile(archivePath);

    // Auto-resolve username from domain
    this.log('info', `Resolving username from domain: ${domain}`);
    const username = await this.resolveUsername(domain);

    // Upload archive file
    this.log('info', `Starting archive upload for ${domain}`);
    
    let uploadCredentials: any;
    try {
      uploadCredentials = await this.fetchUploadCredentials(username, domain);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch upload credentials: ${errorMessage}`);
    }

    const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = uploadCredentials;

    if (!uploadUrl || !authToken || !authRestToken) {
      throw new Error('Invalid upload credentials received from API');
    }

    const archiveBasename = path.basename(archivePath);
    let uploadResult: any;
    try {
      const stats = fs.statSync(archivePath);
      uploadResult = await this.uploadFile(
        archivePath,
        archiveBasename,
        uploadUrl,
        authRestToken,
        authToken
      );

      this.log('info', `Successfully uploaded archive: ${archiveBasename}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload archive: ${errorMessage}`);
    }

    // Fetch build settings
    let buildSettings: any;
    try {
      this.log('info', `Fetching build settings for ${domain}`);
      buildSettings = await this.hosting_deployJsApplication_fetchBuildSettings(username, domain, archivePath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to fetch build settings: ${errorMessage}`);
      const archiveRemoved = this.hosting_deployJsApplication_removeArchive(archivePath, removeArchive);

      return {
        upload: {
          status: 'success',
          data: {
            filename: uploadResult.filename
          }
        },
        resolveSettings: {
          status: 'error',
          error: errorMessage
        },
        build: {
          status: 'skipped'
        },
        removeArchive: {
          status: archiveRemoved ? 'success' : 'skipped'
        }
      };
    }

    // Trigger build
    let buildResult: any;
    try {
      this.log('info', `Triggering build for ${domain}`);
      buildResult = await this.hosting_deployJsApplication_triggerBuild(username, domain, archivePath, buildSettings);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger build: ${errorMessage}`);
      const archiveRemoved = this.hosting_deployJsApplication_removeArchive(archivePath, removeArchive);

      return {
        upload: {
          status: 'success',
          data: {
            filename: uploadResult.filename
          }
        },
        resolveSettings: {
          status: 'success',
          data: buildSettings
        },
        build: {
          status: 'error',
          error: errorMessage
        },
        removeArchive: {
          status: archiveRemoved ? 'success' : 'skipped'
        }
      };
    }

    const archiveRemoved = this.hosting_deployJsApplication_removeArchive(archivePath, removeArchive);

    return {
      upload: {
        status: 'success',
        data: {
          filename: uploadResult.filename
        }
      },
      resolveSettings: {
        status: 'success',
        data: buildSettings
      },
      build: {
        status: 'success',
        data: buildResult
      },
      removeArchive: {
        status: archiveRemoved ? 'success' : 'skipped'
      }
    };
  }

  private hosting_deployStaticWebsite_validateArchiveFormat(filePath: string): boolean {
    const validExtensions = ['zip', 'tar', 'tar.gz', 'tgz', '7z', 'gz', 'gzip'];
    const fileName = path.basename(filePath).toLowerCase();
    
    for (const ext of validExtensions) {
      if (fileName.endsWith(`.${ext}`)) {
        return true;
      }
    }
    
    return false;
  }

  private hosting_deployStaticWebsite_validateRequiredParams(params: Record<string, any>): void {
    const { domain, archivePath, removeArchive } = params;

    if (!domain || typeof domain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    if (!archivePath || typeof archivePath !== 'string') {
      throw new Error('archivePath is required and must be a string');
    }

    if (removeArchive !== undefined && typeof removeArchive !== 'boolean') {
      throw new Error('removeArchive must be a boolean if provided');
    }
  }

  private hosting_deployStaticWebsite_removeArchive(archivePath: string, removeArchive: boolean): boolean {
    if (!removeArchive) {
      return false;
    }

    try {
      this.log('info', `Removing archive file: ${archivePath}`);
      fs.unlinkSync(archivePath);
      this.log('info', `Successfully removed archive file: ${archivePath}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to remove archive file: ${errorMessage}`);
      return false;
    }
  }

  private hosting_deployStaticWebsite_validateArchiveFile(archivePath: string): void {
    this.assertDeployablePath(archivePath);
    if (!fs.existsSync(archivePath)) {
      throw new Error(`Archive file not found: ${archivePath}`);
    }

    const archiveStats = fs.statSync(archivePath);
    if (!archiveStats.isFile()) {
      throw new Error(`Archive path is not a file: ${archivePath}`);
    }

    if (!this.hosting_deployStaticWebsite_validateArchiveFormat(archivePath)) {
      throw new Error('Invalid archive format. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip');
    }
  }

  private async hosting_deployStaticWebsite_triggerDeploy(username: string, domain: string, archivePath: string): Promise<any> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/deploy`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const archiveBasename = path.basename(archivePath);
      const deployData = {
        archive_path: archiveBasename
      };

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: deployData,
        timeout: 60000,
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      this.log('info', `Successfully triggered deployment for ${domain}`);
      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger deployment: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async handleStaticWebsiteDeploy(params: Record<string, any>): Promise<any> {
    const { domain, archivePath, removeArchive = false } = params;

    this.hosting_deployStaticWebsite_validateRequiredParams(params);
    this.hosting_deployStaticWebsite_validateArchiveFile(archivePath);

    this.log('info', `Resolving username from domain: ${domain}`);
    const username = await this.resolveUsername(domain);

    this.log('info', `Starting archive upload for ${domain}`);
    
    let uploadCredentials: any;
    try {
      uploadCredentials = await this.fetchUploadCredentials(username, domain);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch upload credentials: ${errorMessage}`);
    }

    const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = uploadCredentials;

    if (!uploadUrl || !authToken || !authRestToken) {
      throw new Error('Invalid upload credentials received from API');
    }

    const archiveBasename = path.basename(archivePath);
    let uploadResult: any;
    try {
      const stats = fs.statSync(archivePath);
      uploadResult = await this.uploadFile(
        archivePath,
        archiveBasename,
        uploadUrl,
        authRestToken,
        authToken
      );

      this.log('info', `Successfully uploaded archive: ${archiveBasename}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload archive: ${errorMessage}`);
    }

    let deployResult: any;
    try {
      this.log('info', `Triggering deployment for ${domain}`);
      deployResult = await this.hosting_deployStaticWebsite_triggerDeploy(username, domain, archivePath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger deployment: ${errorMessage}`);
      const archiveRemoved = this.hosting_deployStaticWebsite_removeArchive(archivePath, removeArchive);

      return {
        upload: {
          status: 'success',
          data: {
            filename: uploadResult.filename
          }
        },
        deploy: {
          status: 'error',
          error: errorMessage
        },
        removeArchive: {
          status: archiveRemoved ? 'success' : 'skipped'
        }
      };
    }

    const archiveRemoved = this.hosting_deployStaticWebsite_removeArchive(archivePath, removeArchive);

    return {
      upload: {
        status: 'success',
        data: {
          filename: uploadResult.filename
        }
      },
      deploy: {
        status: 'success',
        data: deployResult
      },
      removeArchive: {
        status: archiveRemoved ? 'success' : 'skipped'
      }
    };
  }

  private hosting_listJsDeployments_validateRequiredParams(params: Record<string, any>): void {
    const { domain } = params;

    if (!domain || typeof domain !== 'string') {
      throw new Error('domain is required and must be a string');
    }
  }

  private hosting_listJsDeployments_buildQueryParams(params: Record<string, any>): string {
    const { page, perPage, states } = params;
    const queryParams = new URLSearchParams();

    if (page !== undefined && page !== null) {
      queryParams.append('page', page.toString());
    }

    if (perPage !== undefined && perPage !== null) {
      queryParams.append('per_page', perPage.toString());
    }

    if (states && Array.isArray(states) && states.length > 0) {
      states.forEach(state => {
        queryParams.append('states[]', state);
      });
    }

    return queryParams.toString();
  }

  private async hosting_listJsDeployments_fetchDeployments(username: string, domain: string, queryParams: string): Promise<any> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/nodejs/builds`, baseUrl).toString();
    
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'get',
        url: fullUrl,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`
        },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      this.log('info', `Successfully fetched deployments for ${domain}`);
      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to fetch deployments: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async handleListJavascriptDeployments(params: Record<string, any>): Promise<any> {
    const { domain, page, perPage, states } = params;

    this.hosting_listJsDeployments_validateRequiredParams(params);

    // Auto-resolve username from domain
    this.log('info', `Resolving username from domain: ${domain}`);
    const username = await this.resolveUsername(domain);

    // Build query parameters
    const queryParams = this.hosting_listJsDeployments_buildQueryParams(params);

    // Fetch deployments
    let deployments: any;
    try {
      this.log('info', `Fetching deployments for ${domain}`);
      deployments = await this.hosting_listJsDeployments_fetchDeployments(username, domain, queryParams);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to fetch deployments: ${errorMessage}`);
      throw error;
    }

    return {
      status: 'success',
      domain,
      username,
      queryParams: {
        page,
        perPage,
        states
      },
      deployments
    };
  }

  private hosting_showJsDeploymentLogs_validateRequiredParams(params: Record<string, any>): void {
    const { domain, buildUuid, fromLine } = params;

    if (!domain || typeof domain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    if (!buildUuid || typeof buildUuid !== 'string') {
      throw new Error('buildUuid is required and must be a string');
    }

    if (fromLine !== undefined && (typeof fromLine !== 'number' || !Number.isInteger(fromLine) || fromLine < 0)) {
      throw new Error('fromLine must be a non-negative integer when provided');
    }
  }

  private hosting_showJsDeploymentLogs_buildQueryParams(params: Record<string, any>): string {
    const { fromLine } = params;
    const queryParams = new URLSearchParams();

    const line = (typeof fromLine === 'number' && Number.isInteger(fromLine) && fromLine >= 0) ? fromLine : 0;
    queryParams.append('from_line', line.toString());

    return queryParams.toString();
  }

  private async hosting_showJsDeploymentLogs_fetchLogs(username: string, domain: string, buildUuid: string, queryParams: string): Promise<any> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/nodejs/builds/${buildUuid}/logs`, baseUrl).toString();

    const fullUrl = queryParams ? `${url}?${queryParams}` : url;

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'get',
        url: fullUrl,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`
        },
        timeout: 60000,
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      this.log('info', `Successfully fetched logs for ${domain} build ${buildUuid}`);
      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to fetch logs: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async handleShowJsDeploymentLogs(params: Record<string, any>): Promise<any> {
    const { domain, buildUuid, fromLine } = params;

    this.hosting_showJsDeploymentLogs_validateRequiredParams(params);

    this.log('info', `Resolving username from domain: ${domain}`);
    const username = await this.resolveUsername(domain);

    const queryParams = this.hosting_showJsDeploymentLogs_buildQueryParams(params);

    let logs: any;
    try {
      this.log('info', `Fetching logs for ${domain}, build ${buildUuid}`);
      logs = await this.hosting_showJsDeploymentLogs_fetchLogs(username, domain, buildUuid, queryParams);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to fetch logs: ${errorMessage}`);
      throw error;
    }

    const effectiveFromLine = (typeof fromLine === 'number' && Number.isInteger(fromLine) && fromLine >= 0) ? fromLine : 0;

    return {
      domain,
      username,
      buildUuid,
      fromLine: effectiveFromLine,
      logs
    };
  }

  private async handleHostingTriggerWebsiteEvent(params: Record<string, unknown>): Promise<unknown> {
    const { username, domain, event } = params;
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${encodeURIComponent(String(username))}/websites/${encodeURIComponent(String(domain))}/events/trigger`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: { event },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status < 200 || response.status >= 300) {
        throw new ApiExecutionError(response.status, response.data);
      }

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger website event: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private agencyHosting_normalizePath(pathString: string): string {
    return pathString.replace(/\\/g, '/');
  }

  private agencyHosting_generateUploadDir(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private agencyHosting_validateRequiredParams(params: Record<string, any>): void {
    const { domain, archivePath, removeArchive } = params;

    if (!domain || typeof domain !== 'string') {
      throw new Error('domain is required and must be a string');
    }

    if (!archivePath || typeof archivePath !== 'string') {
      throw new Error('archivePath is required and must be a string');
    }

    if (removeArchive !== undefined && typeof removeArchive !== 'boolean') {
      throw new Error('removeArchive must be a boolean if provided');
    }
  }

  private agencyHosting_validateArchiveFile(archivePath: string): void {
    this.assertDeployablePath(archivePath);
    if (!fs.existsSync(archivePath)) {
      throw new Error(`Archive file not found: ${archivePath}`);
    }

    const archiveStats = fs.statSync(archivePath);
    if (!archiveStats.isFile()) {
      throw new Error(`Archive path is not a file: ${archivePath}`);
    }

    // Only an archive is uploaded (and, with removeArchive, deleted afterwards), never any other file.
    const name = path.basename(archivePath).toLowerCase();
    if (!['.zip', '.tar', '.tar.gz', '.tgz', '.7z', '.gz', '.gzip'].some((extension) => name.endsWith(extension))) {
      throw new Error('Invalid archive format. Supported formats: zip, tar, tar.gz, tgz, 7z, gz, gzip');
    }
  }

  private agencyHosting_removeArchive(archivePath: string, removeArchive: boolean): boolean {
    if (!removeArchive) {
      return false;
    }

    try {
      this.log('info', `Removing archive file: ${archivePath}`);
      fs.unlinkSync(archivePath);
      this.log('info', `Successfully removed archive file: ${archivePath}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to remove archive file: ${errorMessage}`);
      return false;
    }
  }

  private async agencyHosting_resolveWebsiteUid(domain: string): Promise<string> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const perPage = 100;

    try {
      const bearerToken = await this.getAuthToken();
      let page = 1;
      let total = 0;

      do {
        const url = new URL(
          `api/agency-hosting/v1/domains?page=${page}&per_page=${perPage}`,
          baseUrl
        ).toString();

        const config: AxiosRequestConfig = {
          method: 'get',
          url,
          headers: {
            ...this.headers,
            'Authorization': `Bearer ${bearerToken}`
          },
          timeout: 60000, // 60s
          validateStatus: function (status: number): boolean {
            return status < 500;
          }
        };

        const response = await axios(config);

        if (response.status !== 200) {
          throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
        }

        const domains = response.data?.data ?? [];
        const match = domains.find((item: any) => item.fqdn === domain);
        if (match?.website_uid) {
          this.log('info', `Resolved website UID: ${match.website_uid} for domain: ${domain}`);
          return match.website_uid;
        }

        total = response.data?.meta?.total ?? domains.length;
        page++;
      } while ((page - 1) * perPage < total);

      throw new Error(`No Agency Plan website found for domain: ${domain}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to resolve website UID for domain ${domain}: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async agencyHosting_fetchUploadCredentials(
    websiteUid: string
  ): Promise<{ url: string; auth_key: string; rest_auth_key: string }> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/agency-hosting/v1/websites/${websiteUid}/files/upload-urls`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to fetch upload credentials: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async agencyHosting_uploadFile(
    filePath: string,
    relativePath: string,
    uploadUrl: string,
    authRestToken: string,
    authToken: string
  ): Promise<{ url: string; filename: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const stats = fs.statSync(filePath);
        const fileStream = fs.createReadStream(filePath);

        const cleanUploadUrl = uploadUrl.replace(new RegExp('/$'), '');
        const normalizedPath = this.agencyHosting_normalizePath(relativePath);
        const uploadUrlWithFile = `${cleanUploadUrl}/${normalizedPath}?override=true`;

        const requestHeaders: Record<string, string> = {
          'X-Auth': authToken,
          'X-Auth-Rest': authRestToken,
          'upload-length': stats.size.toString(),
          'upload-offset': '0'
        };

        try {
          this.log('debug', `Making pre-upload POST request to ${uploadUrlWithFile}`);
          await axios.post(uploadUrlWithFile, '', {
            headers: requestHeaders,
            timeout: 60000, // 60s
            validateStatus: function (status: number): boolean {
              return status == 201;
            }
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          if (axios.isAxiosError(error)) {
            const responseData = error.response?.data;
            const responseStatus = error.response?.status;
            const responseHeaders = error.response?.headers;
            const responseText = typeof responseData === 'object' ? JSON.stringify(responseData) : responseData;

            this.log('error', 'Pre-upload POST request failed - Full Response Details:', {
              status: responseStatus,
              headers: responseHeaders,
              data: responseText,
              message: errorMessage
            });
            reject(new Error(`Pre-upload request failed: ${errorMessage}`));
            return;
          } else {
            this.log('error', `Pre-upload POST request failed: ${errorMessage}`);
            reject(new Error(`Pre-upload request failed: ${errorMessage}`));
            return;
          }
        }

        const upload = new tus.Upload(fileStream, {
          uploadUrl: uploadUrlWithFile,
          retryDelays: [1000, 2000, 4000, 8000, 16000, 20000],
          uploadDataDuringCreation: false,
          parallelUploads: 1,
          chunkSize: 10485760,
          headers: requestHeaders,
          removeFingerprintOnSuccess: true,
          uploadSize: stats.size,
          metadata: {
            filename: path.basename(relativePath)
          },
          onError: (error: Error) => {
            this.log('error', `TUS upload error for ${relativePath}`, { error: error.message });
            reject(new Error(`Upload failed: ${error.message}`));
          },
          onSuccess: () => {
            this.log('info', `TUS upload completed for ${relativePath}`, { url: upload.url });
            resolve({
              url: upload.url || uploadUrlWithFile,
              filename: relativePath
            });
          }
        });

        upload.start();

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.log('error', `Error preparing upload for ${filePath}`, { error: errorMessage });
        reject(new Error(`Failed to prepare upload: ${errorMessage}`));
      }
    });
  }

  private async agencyHosting_deployNodeStatic_triggerBuildAssets(websiteUid: string, archivePath: string): Promise<any> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/agency-hosting/v1/websites/${websiteUid}/build-assets`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          archive_path: archivePath
        },
        timeout: 60000,
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      this.log('info', `Successfully triggered build for website ${websiteUid}`);
      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger build: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async handleNodeStaticDeploy(params: Record<string, any>): Promise<any> {
    const { domain, archivePath, removeArchive = true } = params;

    this.agencyHosting_validateRequiredParams(params);
    this.agencyHosting_validateArchiveFile(archivePath);

    this.log('info', `Resolving website UID from domain: ${domain}`);
    const websiteUid = await this.agencyHosting_resolveWebsiteUid(domain);

    this.log('info', `Starting archive upload for ${domain}`);

    let uploadCredentials: any;
    try {
      uploadCredentials = await this.agencyHosting_fetchUploadCredentials(websiteUid);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch upload credentials: ${errorMessage}`);
    }

    const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = uploadCredentials;

    if (!uploadUrl || !authToken || !authRestToken) {
      throw new Error('Invalid upload credentials received from API');
    }

    const archiveBasename = path.basename(archivePath);
    const uploadDir = `.h5g/${this.agencyHosting_generateUploadDir()}`;
    let uploadResult: any;
    try {
      uploadResult = await this.agencyHosting_uploadFile(
        archivePath,
        `${uploadDir}/${archiveBasename}`,
        uploadUrl,
        authRestToken,
        authToken
      );

      this.log('info', `Successfully uploaded archive: ${archiveBasename}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload archive: ${errorMessage}`);
    }

    let deployResult: any;
    try {
      this.log('info', `Triggering build for ${domain}`);
      deployResult = await this.agencyHosting_deployNodeStatic_triggerBuildAssets(websiteUid, uploadDir);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger build: ${errorMessage}`);
      const archiveRemoved = this.agencyHosting_removeArchive(archivePath, removeArchive);

      return {
        upload: {
          status: 'success',
          data: {
            filename: uploadResult.filename
          }
        },
        deploy: {
          status: 'error',
          error: errorMessage
        },
        removeArchive: {
          status: archiveRemoved ? 'success' : 'skipped'
        }
      };
    }

    const archiveRemoved = this.agencyHosting_removeArchive(archivePath, removeArchive);

    return {
      upload: {
        status: 'success',
        data: {
          filename: uploadResult.filename
        }
      },
      deploy: {
        status: 'success',
        data: deployResult
      },
      removeArchive: {
        status: archiveRemoved ? 'success' : 'skipped'
      }
    };
  }

  private async agencyHosting_deployPhpApp_triggerImportArchive(websiteUid: string, archiveName: string): Promise<any> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/agency-hosting/v1/websites/${websiteUid}/files/import-archive`, baseUrl).toString();

    try {
      const bearerToken = await this.getAuthToken();

      const config: AxiosRequestConfig = {
        method: 'post',
        url,
        headers: {
          ...this.headers,
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          archive_name: archiveName
        },
        timeout: 60000,
        validateStatus: function (status: number): boolean {
          return status < 500;
        }
      };

      const response = await axios(config);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`API returned status ${response.status}: ${JSON.stringify(response.data)}`);
      }

      this.log('info', `Successfully triggered import for website ${websiteUid}`);
      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger import: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const responseStatus = error.response?.status;
        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : responseData
        });
      }

      throw error;
    }
  }

  private async handlePhpAppDeploy(params: Record<string, any>): Promise<any> {
    const { domain, archivePath, removeArchive = true } = params;

    this.agencyHosting_validateRequiredParams(params);
    this.agencyHosting_validateArchiveFile(archivePath);

    this.log('info', `Resolving website UID from domain: ${domain}`);
    const websiteUid = await this.agencyHosting_resolveWebsiteUid(domain);

    this.log('info', `Starting archive upload for ${domain}`);

    let uploadCredentials: any;
    try {
      uploadCredentials = await this.agencyHosting_fetchUploadCredentials(websiteUid);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to fetch upload credentials: ${errorMessage}`);
    }

    const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = uploadCredentials;

    if (!uploadUrl || !authToken || !authRestToken) {
      throw new Error('Invalid upload credentials received from API');
    }

    const archiveBasename = path.basename(archivePath);
    let uploadResult: any;
    try {
      uploadResult = await this.agencyHosting_uploadFile(
        archivePath,
        `.h5g/${archiveBasename}`,
        uploadUrl,
        authRestToken,
        authToken
      );

      this.log('info', `Successfully uploaded archive: ${archiveBasename}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to upload archive: ${errorMessage}`);
    }

    let deployResult: any;
    try {
      this.log('info', `Triggering import for ${domain}`);
      deployResult = await this.agencyHosting_deployPhpApp_triggerImportArchive(websiteUid, archiveBasename);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Failed to trigger import: ${errorMessage}`);
      const archiveRemoved = this.agencyHosting_removeArchive(archivePath, removeArchive);

      return {
        upload: {
          status: 'success',
          data: {
            filename: uploadResult.filename
          }
        },
        deploy: {
          status: 'error',
          error: errorMessage
        },
        removeArchive: {
          status: archiveRemoved ? 'success' : 'skipped'
        }
      };
    }

    const archiveRemoved = this.agencyHosting_removeArchive(archivePath, removeArchive);

    return {
      upload: {
        status: 'success',
        data: {
          filename: uploadResult.filename
        }
      },
      deploy: {
        status: 'success',
        data: deployResult
      },
      removeArchive: {
        status: archiveRemoved ? 'success' : 'skipped'
      }
    };
  }

  private async handleChangelogListEntries(params: Record<string, unknown>): Promise<unknown> {
    // Their key order is the order of the results: upcoming items, then released entries.
    const CHANGELOG_FEEDS = {
      upcoming: "https://www.hostinger.com/roadmap/feed.json",
      released: "https://www.hostinger.com/changelog/feed.json",
    } as const;
    type ChangelogStatus = keyof typeof CHANGELOG_FEEDS;
    interface ChangelogFeedItem {
      url: string;
      title: string;
      summary?: string;
      date_published?: string;
      _hostinger?: { product?: string; plan?: string[]; expected_release_date?: string };
    }
    // Agents often send null for an optional field they don't use; treat it as unset.
    const { status = 'released', product, since, limit = 20 } = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== null));
    const feedStatuses = Object.keys(CHANGELOG_FEEDS) as ChangelogStatus[];
    if (status !== 'all' && !feedStatuses.includes(status as ChangelogStatus)) {
      throw new Error('status must be one of: ' + [...feedStatuses, 'all'].join(', '));
    }
    if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new Error('limit must be an integer from 1 to 100');
    }
    const sinceTime = since === undefined ? undefined : Date.parse(String(since));
    // Only a real YYYY-MM-DD day, the one form that reads back unchanged: Date.parse also takes "Oct 1"
    // (as 2001-10-01) and rolls 2026-02-30 over to March.
    if (sinceTime !== undefined && (Number.isNaN(sinceTime) || new Date(sinceTime).toISOString().slice(0, 10) !== since)) {
      throw new Error(`since must be a day as YYYY-MM-DD: ${since}`);
    }
    const sameText = (a: unknown, b: unknown): boolean => String(a).toLowerCase() === String(b).toLowerCase();
    const time = (date: string | undefined, ifMissing: number): number => Date.parse(date ?? '') || ifMissing;

    const statuses = status === 'all' ? feedStatuses : [status as ChangelogStatus];
    const entriesPerFeed = await Promise.all(statuses.map(async feedStatus => {
      const feed = CHANGELOG_FEEDS[feedStatus];
      // The feeds are public: send only the User-Agent, never the API headers.
      const response = await axios.get<{ items?: ChangelogFeedItem[] }>(feed, { headers: { 'User-Agent': this.headers['User-Agent'] }, timeout: 30000 })
        .catch((error: Error) => { throw new Error(`${feed} could not be read: ${error.message}`); });
      if (!Array.isArray(response.data?.items)) {
        throw new Error(`${feed} returned no items (HTTP ${response.status})`);
      }
      // The feed sets the status: the changelog lists only released entries, the roadmap only unreleased items.
      const toEntry = (item: ChangelogFeedItem) => ({
        title: item.title,
        summary: item.summary,
        product: item._hostinger?.product,
        url: new URL(item.url, feed).toString(),
        status: feedStatus,
        plan: item._hostinger?.plan,
      });
      if (feedStatus === 'released') {
        const publishedTime = (item: ChangelogFeedItem): number => time(item.date_published, 0);
        return response.data.items
          .filter(item => sinceTime === undefined || publishedTime(item) >= sinceTime)
          .sort((a, b) => publishedTime(b) - publishedTime(a))
          .map(item => ({ ...toEntry(item), date: item.date_published }));
      }
      // Roadmap items have no publication date: soonest expected release first, unknown dates last.
      const releaseTime = (item: ChangelogFeedItem): number => time(item._hostinger?.expected_release_date, Number.MAX_SAFE_INTEGER);
      return response.data.items
        .sort((a, b) => releaseTime(a) - releaseTime(b))
        .map(item => ({ ...toEntry(item), expected_release_date: item._hostinger?.expected_release_date }));
    }));
    const entries = entriesPerFeed.flat().filter(entry => product === undefined || sameText(entry.product, product));

    return { feeds: statuses.map(feedStatus => CHANGELOG_FEEDS[feedStatus]), matched: entries.length, entries: entries.slice(0, limit) };
  }

  /**
   * Execute an API call for a tool
   */
  private async executeApiCall(tool: OpenApiTool, params: Record<string, any>): Promise<any> {
    // Get method and path from tool
    const method = tool.method;
    let path = tool.path;

    // Clone params to avoid modifying the original
    const requestParams = { ...params };

    // Replace path parameters with values from params
    Object.entries(requestParams).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      if (path.includes(placeholder)) {
        path = path.replace(placeholder, encodeURIComponent(String(value)));
        delete requestParams[key]; // Remove used parameter
      }
    });

    // Build the full URL
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const url = new URL(cleanPath, baseUrl).toString();

    this.log('debug', `API Request: ${method} ${url}`);

    try {
      // Configure the request
      const config: AxiosRequestConfig = {
        method: method.toLowerCase(),
        url,
        headers: { ...this.headers },
        timeout: 60000, // 60s
        validateStatus: function (status: number): boolean {
          return status < 500; // Resolve only if the status code is less than 500
        }
      };
     
      const envToken = getEnvToken();
      let bearerToken = await this.getAuthToken();
      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${bearerToken}`;
      }

      // Add parameters based on request method
      if (["GET", "DELETE"].includes(method)) {
        // For GET/DELETE, send params as query string
        config.params = { ...(config.params || {}), ...requestParams };
      } else {
        // For POST/PUT/PATCH, send params as JSON body
        config.data = requestParams;
        if (config.headers) {
          config.headers["Content-Type"] = "application/json";
        }
      }

      this.log('debug', "Request config:", {
        url: config.url,
        method: config.method,
        params: config.params,
        headers: config.headers ? Object.keys(config.headers) : []
      });

      // Execute the request
      let response = await axios(config);
      this.log('debug', `Response status: ${response.status}`);

      // Reactive token recovery: a 401 means the bearer was rejected even
      // though our local expiry said it was fine (e.g. revoked, account
      // changed, clock skew). Force a re-auth via refresh-or-login and retry
      // once. Skipped for the env-token path — nothing to refresh.
      if (response.status === 401 && !envToken) {
        this.log('info', 'API returned 401; reauthenticating and retrying once');
        bearerToken = await this.oauth.reauthenticate();
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        response = await axios(config);
        this.log('debug', `Retry response status: ${response.status}`);
      }

      // validateStatus resolves everything under 500, so a 4xx arrives here as
      // an ordinary response. Without this it would be returned to the model as
      // a successful tool result whose body happens to be the API's error.
      if (response.status >= 400) {
        throw new ApiExecutionError(response.status, response.data);
      }

      return response.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `API request failed: ${errorMessage}`);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const responseData = axiosError.response?.data;
        const responseStatus = axiosError.response?.status;

        this.log('error', 'API Error Details:', {
          status: responseStatus,
          data: typeof responseData === 'object' ? JSON.stringify(responseData) : String(responseData)
        });

        // Structured so the CallTool handler can report this as an MCP tool
        // execution error carrying the API's own payload. Status is 0 for a
        // transport failure (DNS, ECONNREFUSED, timeout) — there is no response.
        throw new ApiExecutionError(
          responseStatus ?? 0,
          responseData,
          `API request failed with status ${responseStatus}: ${errorMessage}`
        );
      }

      throw error;
    }
  }

  /**
   * Log messages with appropriate level
   * Only sends to MCP if we're connected
   */
  private log(level: 'debug' | 'info' | 'warning' | 'error', message: string, data?: any): void {
    // Debug logs (which may include request params) only reach stderr when
    // DEBUG=true; info/warning/error always log. This gate also guards the MCP send.
    if (this.debug || level !== 'debug') {
      console.error(`[${level.toUpperCase()}] ${message}${data ? ': ' + JSON.stringify(data) : ''}`);
      try {
        // Only send if server exists and is connected
        if (this.server && (this.server as any).isConnected) {
          this.server.sendLoggingMessage({
            level,
            data: `[MCP Server] ${message}${data ? ': ' + JSON.stringify(data) : ''}`
          });
        }
      } catch (e) {
        // If logging fails, log to stderr
        console.error('Failed to send log via MCP:', (e as Error).message);
      }
    }
  }

  /**
   * Create and configure Express app with shared middleware
   */
  createApp() {
    const app = express();
    app.use(express.json());
    app.use(cors());
    return app;
  }

  /**
   * Start the server with HTTP streaming transport
   */
  async startHttp(host: string, port: number): Promise<void> {
    try {
      const app = this.createApp();

      // Create HTTP transport with session management
      const httpTransport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => {
          // Generate a simple session ID
          return `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        },
      });

      // Set up CORS for all routes
      app.options("/{*splat}", (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id");
        res.sendStatus(200);
      });

      // Health check endpoint
      app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok", transport: "http" });
      });

      // Set up the HTTP transport endpoint
      app.post("/", async (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-session-id");
        await httpTransport.handleRequest(req, res, req.body);
      });

      // Start the server
      const server = app.listen(port, host, () => {
        this.log('info', `MCP Server with HTTP streaming transport started successfully with ${META_TOOLS.length} tools`);
        this.log('info', `Listening on http://${host}:${port}`);
      });

      // Connect the MCP server to the transport
      await this.server.connect(httpTransport);

    } catch (error) {
      console.error("Failed to start MCP server:", error);
      process.exit(1);
    }
  }

  /**
   * Start the stdio server
   */
  async startStdio(): Promise<void> {
    try {
      // Create stdio transport
      const transport = new StdioServerTransport();
      console.error("MCP Server starting on stdio transport");

      // Connect to the transport
      await this.server.connect(transport);

      // Now we can safely log via MCP
      console.error(`Registered ${META_TOOLS.length} tools`);
      this.log('info', `MCP Server with stdio transport started successfully with ${META_TOOLS.length} tools`);
    } catch (error) {
      console.error("Failed to start MCP server:", error);
      process.exit(1);
    }
  }
}

export async function startServer({ name, version, tools, instructions, skills }: { name: string; version: string; tools: OpenApiTool[]; instructions?: string; skills?: Skill[] }): Promise<void> {
  const argv = minimist(process.argv.slice(2), {
    string: ['host'],
    boolean: ['stdio', 'http', 'help', 'version', 'login', 'logout'],
    alias: { v: 'version' },
    default: { host: '127.0.0.1', port: 8100, stdio: true }
  });

  if (argv.version) {
    console.log(version);
    process.exit(0);
  }

  if (argv.help) {
    console.log(`
      ${name}
      Usage: ${name} [options]
      Options:
        --http               Use HTTP streaming transport (requires HOSTINGER_API_TOKEN env var)
        --stdio              Use standard input/output transport (default)
        --host <host>        Host to bind to (default: 127.0.0.1)
        --port <port>        Port to bind to (default: 8100)
        --login              Run OAuth sign-in flow and exit
        --logout             Revoke stored OAuth credentials and exit
        --version, -v        Show version number
        --help               Show this help message
      Environment Variables:
        HOSTINGER_API_TOKEN  Hostinger API token (overrides OAuth when set)
        API_TOKEN            Deprecated alias for HOSTINGER_API_TOKEN (will be removed in a future version)
        OAUTH_ISSUER         OAuth server base URL (default: https://auth.hostinger.com)
        DEBUG                Enable debug logging (true/false)
    `);
    process.exit(0);
  }

  if (argv.login) {
    const provider = new OAuthProvider();
    console.error('[OAuth] Starting sign-in flow...');
    await provider.login();
    console.error('[OAuth] Sign-in successful. Credentials stored.');
    process.exit(0);
  }

  if (argv.logout) {
    const provider = new OAuthProvider();
    await provider.logout();
    console.error('[OAuth] Signed out. Stored credentials revoked and cleared.');
    process.exit(0);
  }

  if (argv.http) {
    const envToken = getEnvToken();
    if (!envToken) {
      console.error('[Error] HTTP transport requires the HOSTINGER_API_TOKEN environment variable. OAuth sign-in is only supported in stdio mode.');
      process.exit(1);
    }
  }

  const server = new MCPServer({ name, version, tools, instructions, skills });
  if (argv.http) {
    await server.startHttp(argv.host, argv.port);
  } else {
    await server.startStdio();
  }
}
