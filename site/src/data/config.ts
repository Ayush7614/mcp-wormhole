import type { McpServer } from "./servers";

function envBlock(server: McpServer, placeholder = true): Record<string, string> {
  return Object.fromEntries(
    server.env.map((item) => [
      item.key,
      placeholder ? `your_${item.key.toLowerCase()}` : "YOUR_TOKEN",
    ]),
  );
}

function mcpBlock(server: McpServer, overrides?: Record<string, unknown>) {
  return {
    command: "npx",
    args: ["-y", server.npmPackage],
    env: envBlock(server),
    ...overrides,
  };
}

export function buildStdioConfig(server: McpServer): string {
  return JSON.stringify({ mcpServers: { [server.id]: mcpBlock(server) } }, null, 2);
}

export function buildLocalDevConfig(server: McpServer): string {
  return JSON.stringify(
    {
      mcpServers: {
        [server.id]: {
          command: "node",
          args: [`/path/to/mcp-wormhole/packages/${server.id}/dist/index.js`],
          env: envBlock(server),
        },
      },
    },
    null,
    2,
  );
}

export function buildCursorConfig(server: McpServer): string {
  return JSON.stringify({ mcpServers: { [server.id]: mcpBlock(server) } }, null, 2);
}

export function buildCursorProjectConfig(server: McpServer): string {
  return `# Project-level: .cursor/mcp.json\n${buildCursorConfig(server)}`;
}

export function buildVsCodeConfig(server: McpServer): string {
  return JSON.stringify({ servers: { [server.id]: mcpBlock(server) } }, null, 2);
}

export function buildClaudeDesktopConfig(server: McpServer): string {
  return JSON.stringify({ mcpServers: { [server.id]: mcpBlock(server) } }, null, 2);
}

export function buildClaudeCodeCommand(server: McpServer): string {
  const envFlags = server.env.map((item) => `--env ${item.key}=YOUR_TOKEN`).join(" ");
  return `claude mcp add --transport stdio ${server.id} -- ${envFlags} npx -y ${server.npmPackage}`;
}

export function buildWindsurfConfig(server: McpServer): string {
  return JSON.stringify({ mcpServers: { [server.id]: mcpBlock(server) } }, null, 2);
}

export function buildZedConfig(server: McpServer): string {
  return JSON.stringify(
    {
      context_servers: {
        [server.id]: {
          source: "custom",
          command: "npx",
          args: ["-y", server.npmPackage],
          env: envBlock(server),
        },
      },
    },
    null,
    2,
  );
}

export function buildOpenCodeConfig(server: McpServer): string {
  return JSON.stringify(
    {
      mcp: {
        [server.id]: {
          type: "stdio",
          command: "npx",
          args: ["-y", server.npmPackage],
          env: envBlock(server),
        },
      },
    },
    null,
    2,
  );
}

export function buildCodexToml(server: McpServer): string {
  const envLines = server.env.map((item) => `${item.key} = "YOUR_TOKEN"`).join("\n");
  return `[mcp_servers.${server.id}]\ncommand = "npx"\nargs = ["-y", "${server.npmPackage}"]\n\n# Set env in shell or config:\n${envLines}`;
}

export function buildInspectorGuide(server: McpServer): string {
  const env = server.env.map((item) => `${item.key}=YOUR_TOKEN`).join("\n");
  return `# 1. Run the inspector
npx @modelcontextprotocol/inspector

# 2. In the UI:
#    Transport: STDIO
#    Command:   npx
#    Args:      -y ${server.npmPackage}
#    Env:
${env}

# 3. Click Connect — tools appear in the sidebar`;
}

export function buildPythonLangChainSnippet(server: McpServer): string {
  const envLines = server.env
    .map((item) => `            "${item.key}": "YOUR_TOKEN",`)
    .join("\n");
  return `from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient({
    "${server.id}": {
        "command": "npx",
        "args": ["-y", "${server.npmPackage}"],
        "env": {
${envLines}
        },
        "transport": "stdio",
    }
})

tools = await client.get_tools()`;
}

export function buildAiSdkSnippet(server: McpServer): string {
  const envLines = server.env
    .map((item) => `    ${item.key}: process.env.${item.key},`)
    .join("\n");
  return `import { experimental_createMCPClient } from "@ai-sdk/mcp";

const client = await experimental_createMCPClient({
  transport: {
    type: "stdio",
    command: "npx",
    args: ["-y", "${server.npmPackage}"],
    env: {
${envLines}
    },
  },
});

const tools = await client.tools();`;
}

export function getConfigForIntegration(
  integrationId: string,
  server: McpServer,
): { label: string; language: string; code: string }[] {
  const stdio = buildStdioConfig(server);
  const local = buildLocalDevConfig(server);

  switch (integrationId) {
    case "cursor":
      return [
        { label: "Cursor MCP config", language: "json", code: buildCursorConfig(server) },
        { label: "Project path", language: "text", code: buildCursorProjectConfig(server) },
        { label: "Local dev (monorepo)", language: "json", code: local },
      ];
    case "vscode":
      return [
        { label: ".vscode/mcp.json", language: "json", code: buildVsCodeConfig(server) },
        { label: "Generic MCP JSON", language: "json", code: stdio },
        { label: "Local dev", language: "json", code: local },
      ];
    case "claude-desktop":
      return [
        { label: "claude_desktop_config.json", language: "json", code: buildClaudeDesktopConfig(server) },
        { label: "macOS path", language: "text", code: "~/Library/Application Support/Claude/claude_desktop_config.json" },
      ];
    case "claude-code":
    case "claude-agents-sdk":
      return [
        { label: "CLI setup", language: "bash", code: buildClaudeCodeCommand(server) },
        { label: "JSON config", language: "json", code: buildClaudeDesktopConfig(server) },
      ];
    case "codex":
      return [
        { label: "config.toml", language: "toml", code: buildCodexToml(server) },
        { label: "CLI", language: "bash", code: `codex mcp add ${server.id} -- npx -y ${server.npmPackage}` },
      ];
    case "windsurf":
      return [
        { label: "Windsurf MCP config", language: "json", code: buildWindsurfConfig(server) },
        { label: "Config path", language: "text", code: "~/.codeium/windsurf/mcp_config.json" },
      ];
    case "zed":
      return [
        { label: "settings.json", language: "json", code: buildZedConfig(server) },
        { label: "Generic", language: "json", code: stdio },
      ];
    case "opencode":
      return [
        { label: "opencode.json", language: "json", code: buildOpenCodeConfig(server) },
        { label: "Generic", language: "json", code: stdio },
      ];
    case "cli":
      return [
        { label: "MCP Inspector", language: "bash", code: buildInspectorGuide(server) },
        { label: "Run server", language: "bash", code: `npx -y ${server.npmPackage}` },
      ];
    case "langchain":
      return [
        { label: "Python client", language: "python", code: buildPythonLangChainSnippet(server) },
        { label: "JSON reference", language: "json", code: stdio },
      ];
    case "ai-sdk":
      return [
        { label: "Vercel AI SDK", language: "typescript", code: buildAiSdkSnippet(server) },
        { label: "JSON reference", language: "json", code: stdio },
      ];
    case "chatgpt":
    case "openai-agents-sdk":
      return [
        { label: "MCP config (stdio bridge)", language: "json", code: stdio },
        {
          label: "Note",
          language: "text",
          code: "ChatGPT Connectors may require a supported bridge.\nSee OpenAI MCP docs for the latest connector UI.",
        },
      ];
    default:
      return [
        { label: "MCP config", language: "json", code: stdio },
        { label: "Local dev (monorepo)", language: "json", code: local },
      ];
  }
}
