import type { McpServer } from "./servers";

function envBlock(server: McpServer): Record<string, string> {
  return Object.fromEntries(server.env.map((item) => [item.key, `your_${item.key.toLowerCase()}`]));
}

export function buildStdioConfig(server: McpServer): string {
  return JSON.stringify(
    {
      mcpServers: {
        [server.id]: {
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

export function buildClaudeCodeCommand(server: McpServer): string {
  const envFlags = server.env.map((item) => `--env ${item.key}=YOUR_TOKEN`).join(" ");
  return `claude mcp add --transport stdio ${server.id} -- ${envFlags} npx -y ${server.npmPackage}`;
}

export function buildInspectorCommand(server: McpServer): string {
  const env = server.env.map((item) => `${item.key}=YOUR_TOKEN`).join(" ");
  return `# In MCP Inspector UI:\n# Command: npx\n# Args: -y ${server.npmPackage}\n# Env: ${env}`;
}

export function buildPythonLangChainSnippet(server: McpServer): string {
  const envLines = server.env
    .map((item) => `                    "${item.key}": "YOUR_TOKEN",`)
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

export function getConfigForIntegration(
  integrationId: string,
  server: McpServer,
): { label: string; language: string; code: string }[] {
  const stdio = buildStdioConfig(server);
  const local = buildLocalDevConfig(server);

  switch (integrationId) {
    case "claude-code":
      return [
        { label: "CLI", language: "bash", code: buildClaudeCodeCommand(server) },
        { label: "JSON config", language: "json", code: stdio },
      ];
    case "cli":
      return [
        { label: "MCP Inspector", language: "bash", code: buildInspectorCommand(server) },
        { label: "Run server directly", language: "bash", code: `npx -y ${server.npmPackage}` },
      ];
    case "langchain":
      return [
        { label: "Python", language: "python", code: buildPythonLangChainSnippet(server) },
        { label: "JSON (reference)", language: "json", code: stdio },
      ];
    case "vscode":
      return [
        { label: ".vscode/mcp.json", language: "json", code: stdio },
        { label: "Local dev", language: "json", code: local },
      ];
    default:
      return [
        { label: "MCP config", language: "json", code: stdio },
        { label: "Local dev (monorepo)", language: "json", code: local },
      ];
  }
}
