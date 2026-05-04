
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
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import axios,{ AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import * as tus from "tus-js-client";
import fs from "fs";
import path from "path";

// Load environment variables
dotenvConfig();

// Define tool and security scheme types
interface OpenApiTool extends Tool {
  method: string;
  path: string;
  security: any[];
  custom?: boolean;
}

interface SecurityScheme {
  type: string;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
}

const SECURITY_SCHEMES: Record<string, SecurityScheme> = {
  "apiToken": {
    "type": "http",
    "description": "API Token authentication",
    "scheme": "bearer"
  }
};

/**
 * MCP Server for Hostinger API
 * Generated from OpenAPI spec version 0.11.7
 */
class MCPServer {
  private readonly name: string;
  private readonly version: string;
  private readonly toolList: OpenApiTool[];
  private server: Server;
  private tools: Map<string, Tool> = new Map();
  private debug: boolean;
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor({ name, version, tools }: { name: string; version: string; tools: OpenApiTool[] }) {
    // Initialize class properties
    this.name = name;
    this.version = version;
    this.toolList = tools;
    this.debug = process.env.DEBUG === "true";
    this.baseUrl = process.env.API_BASE_URL || "https://developers.hostinger.com";
    this.headers = this.parseHeaders(process.env.API_HEADERS || "");

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
        },
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
    
    headers['User-Agent'] = `hostinger-mcp-server/${this.version}`;
    
    return headers;
  }

  /**
   * Initialize tools map from OpenAPI spec
   * This runs before the server is connected, so don't log here
   */
  private initializeTools(): void {
    // Initialize each tool in the tools map
    for (const tool of this.toolList) {
      this.tools.set(tool.name, {
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        // Don't include security at the tool level
      });
    }

    // Don't log here, we're not connected yet
    console.error(`Initialized ${this.tools.size} tools`);
  }

  /**
   * Set up request handlers
   */
  private setupHandlers(): void {
    // Handle tool listing requests
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      this.log('debug', "Handling ListTools request");
      // Return tools in the format expected by MCP SDK
      return {
        tools: Array.from(this.tools.entries()).map(([id, tool]) => ({
          id,
          ...tool,
        })),
      };
    });

    // Handle tool execution requests
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { id, name, arguments: params } = request.params;
      this.log('debug', "Handling CallTool request", { id, name, params });

      let toolName: string | undefined;
      let toolDetails: OpenApiTool | undefined;

      // Find the requested tool
      for (const [tid, tool] of this.tools.entries()) {
        if (tool.name === name) {
          toolName = name;
          break;
        }
      }

      if (!toolName) {
        throw new Error(`Tool not found: ${name}`)
      }

      toolDetails = this.toolList.find(t => t.name === toolName);
      if (!toolDetails) {
        throw new Error(`Tool details not found for ID: ${toolName}`);
      }
        
      try {
        this.log('info', `Executing tool: ${toolName}`);

        let result: any;
        
        if (toolDetails.custom) {
          result = await this.executeCustomTool(toolDetails, params || {});
        } else {
          result = await this.executeApiCall(toolDetails, params || {});
        }

        // Return the result in correct MCP format
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result)
            }
          ]
        };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.log('error', `Error executing tool ${toolName}: ${errorMessage}`);
        
        throw error;
      }
    });
  }

  private async executeCustomTool(tool: OpenApiTool, params: Record<string, any>): Promise<any> {
    switch (tool.name) {
      case 'hosting_importWordpressWebsite':
        return await this.handleWordpressWebsiteImport(params);
      case 'hosting_deployWordpressPlugin':
        return await this.handleWordpressPluginDeploy(params);
      case 'hosting_deployWordpressTheme':
        return await this.handleWordpressThemeDeploy(params);
      case 'hosting_deployJsApplication':
        return await this.handleJavascriptApplicationDeploy(params);
      case 'hosting_deployStaticWebsite':
        return await this.handleStaticWebsiteDeploy(params);
      case 'hosting_listJsDeployments':
        return await this.handleListJavascriptDeployments(params);
      case 'hosting_showJsDeploymentLogs':
        return await this.handleShowJsDeploymentLogs(params);
      default:
        throw new Error(`Unknown custom tool: ${tool.name}`);
    }
  }

  private normalizePath(pathString: string): string {
    return pathString.replace(/\\/g, '/');
  }

  private async resolveUsername(domain: string): Promise<string> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/websites?domain=${encodeURIComponent(domain)}`, baseUrl).toString();
    
    try {
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }
      
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
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
        
        const cleanUploadUrl = uploadUrl.replace(new RegExp('/$'), '');
        const normalizedPath = this.normalizePath(relativePath);
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
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
    if (!fs.existsSync(pluginPath)) {
      throw new Error(`Plugin directory not found: ${pluginPath}`);
    }

    const pluginStats = fs.statSync(pluginPath);
    if (!pluginStats.isDirectory()) {
      throw new Error(`Plugin path is not a directory: ${pluginPath}`);
    }
  }

  private hosting_deployWordpressPlugin_scanDirectory(dirPath: string, basePath: string = dirPath): Array<{absolutePath: string, relativePath: string}> {
    const files: Array<{absolutePath: string, relativePath: string}> = [];
    
    const scanDir = (currentPath: string) => {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanDir(itemPath);
        } else if (stats.isFile()) {
          const relativePath = path.relative(basePath, itemPath);
          files.push({
            absolutePath: itemPath,
            relativePath: relativePath
          });
        }
      }
    };
    
    scanDir(dirPath);
    return files;
  }

  private async hosting_deployWordpressPlugin_deployPlugin(username: string, domain: string, slug: string, pluginPath: string): Promise<boolean> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/wordpress/plugins/deploy`, baseUrl).toString();

    try {
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
    const pluginFiles = this.hosting_deployWordpressPlugin_scanDirectory(pluginPath);

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
    if (!fs.existsSync(themePath)) {
      throw new Error(`Theme directory not found: ${themePath}`);
    }

    const themeStats = fs.statSync(themePath);
    if (!themeStats.isDirectory()) {
      throw new Error(`Theme path is not a directory: ${themePath}`);
    }
  }

  private hosting_deployWordpressTheme_scanDirectory(dirPath: string, basePath: string = dirPath): Array<{absolutePath: string, relativePath: string}> {
    const files: Array<{absolutePath: string, relativePath: string}> = [];
    
    const scanDir = (currentPath: string) => {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanDir(itemPath);
        } else if (stats.isFile()) {
          const relativePath = path.relative(basePath, itemPath);
          files.push({
            absolutePath: itemPath,
            relativePath: relativePath
          });
        }
      }
    };
    
    scanDir(dirPath);
    return files;
  }

  private async hosting_deployWordpressTheme_deployTheme(username: string, domain: string, slug: string, themePath: string, activate: boolean = false): Promise<boolean> {
    const baseUrl = this.baseUrl.endsWith("/") ? this.baseUrl : `${this.baseUrl}/`;
    const url = new URL(`api/hosting/v1/accounts/${username}/websites/${domain}/wordpress/themes/deploy`, baseUrl).toString();

    try {
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
    const themeFiles = this.hosting_deployWordpressTheme_scanDirectory(themePath);

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
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN'];
      if (!bearerToken) {
        throw new Error('API_TOKEN environment variable not found');
      }

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
     
      const bearerToken = process.env['API_TOKEN'] || process.env['APITOKEN']; // APITOKEN for backwards compatibility
      if (bearerToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${bearerToken}`;
      } else {
        this.log('error', `Bearer Token environment variable not found: API_TOKEN`);
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
      const response = await axios(config);
      this.log('debug', `Response status: ${response.status}`);

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

        // Rethrow with more context for better error handling
        const detailedError = new Error(`API request failed with status ${responseStatus}: ${errorMessage}`);
        (detailedError as any).response = axiosError.response;
        throw detailedError;
      }

      throw error;
    }
  }

  /**
   * Log messages with appropriate level
   * Only sends to MCP if we're connected
   */
  private log(level: 'debug' | 'info' | 'warning' | 'error', message: string, data?: any): void {
    // Always log to stderr for visibility
    console.error(`[${level.toUpperCase()}] ${message}${data ? ': ' + JSON.stringify(data) : ''}`);

    // Only try to send via MCP if we're in debug mode or it's important
    if (this.debug || level !== 'debug') {
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
      app.options("*", (req, res) => {
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
        this.log('info', `MCP Server with HTTP streaming transport started successfully with ${this.tools.size} tools`);
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
      console.error(`Registered ${this.tools.size} tools`);
      this.log('info', `MCP Server with stdio transport started successfully with ${this.tools.size} tools`);
    } catch (error) {
      console.error("Failed to start MCP server:", error);
      process.exit(1);
    }
  }
}

export async function startServer({ name, version, tools }: { name: string; version: string; tools: OpenApiTool[] }): Promise<void> {
  const argv = minimist(process.argv.slice(2), {
    string: ['host'],
    boolean: ['stdio', 'http', 'help'],
    default: { host: '127.0.0.1', port: 8100, stdio: true }
  });
  if (argv.help) {
    console.log(`
      ${name}
      Usage: ${name} [options]
      Options:
        --http           Use HTTP streaming transport
        --stdio          Use standard input/output transport (default)
        --host <host>    Host to bind to (default: 127.0.0.1)
        --port <port>    Port to bind to (default: 8100)
        --help           Show this help message
      Environment Variables:
        API_TOKEN        Your Hostinger API token (required)
        DEBUG            Enable debug logging (true/false)
    `);
    process.exit(0);
  }
  const server = new MCPServer({ name, version, tools });
  if (argv.http) {
    await server.startHttp(argv.host, argv.port);
  } else {
    await server.startStdio();
  }
}
