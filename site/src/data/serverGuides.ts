import type { McpServer } from "./servers";
import { buildStdioConfig } from "./config";

export interface ServerGuideSection {
  id: string;
  title: string;
  body?: string;
  items?: string[];
}

export interface ServerGuide {
  title: string;
  subtitle: string;
  server: McpServer;
  prerequisites: string[];
  sections: ServerGuideSection[];
  quickStartConfig: string;
  examplePrompts: string[];
  verifyCommand?: string;
  npmInstallCommand: string;
}

function asanaPrompts(): string[] {
  return [
    '"List my open Asana tasks"',
    '"Create an Asana task called Ship MCP guide with notes about the integration"',
    '"Search Asana for tasks containing mcp-wormhole"',
    '"Add a comment to Asana task {task_gid}: Verified from Cursor"',
    '"Mark Asana task {task_gid} as complete"',
  ];
}

export function buildServerGuide(server: McpServer): ServerGuide {
  const disabled = server.status === "planned";

  return {
    title: `${server.name} MCP Server`,
    subtitle: disabled
      ? `${server.name} is on the roadmap — preview tools and config shape below`
      : `Install, configure, and use ${server.name} with any MCP client`,
    server,
    prerequisites: disabled
      ? [`${server.name} account (when server ships)`, "An MCP-capable AI client"]
      : [
          "Node.js 18+",
          "An MCP-capable client (Cursor, Claude Desktop, VS Code, etc.)",
          ...server.env.map((item) => `${item.key} — ${item.description}`),
        ],
    sections: [
      {
        id: "install",
        title: "Install from npm",
        body: disabled
          ? `Package name: ${server.npmPackage} (not published yet)`
          : `Published on npm as ${server.npmPackage}. No clone required — npx downloads and runs it.`,
      },
      {
        id: "auth",
        title: "Authentication",
        items: server.env.map((item) => {
          const link = item.docsUrl ? ` → ${item.docsUrl}` : "";
          return `${item.key} — ${item.description}${link}`;
        }),
      },
      {
        id: "tools",
        title: `Tools (${server.tools.length})`,
        items: server.tools,
      },
      {
        id: "clients",
        title: "Connect a client",
        body: disabled
          ? "Per-client setup guides will appear here when this server ships."
          : "Pick your AI client below — each guide has copy-paste config for this server.",
      },
    ],
    quickStartConfig: buildStdioConfig(server),
    examplePrompts: disabled ? [] : server.id === "asana" ? asanaPrompts() : [],
    npmInstallCommand: `npx -y ${server.npmPackage}`,
    verifyCommand: disabled
      ? undefined
      : `# Smoke-test the published package (any directory)
mkdir /tmp/mcp-test && cd /tmp/mcp-test
npm init -y
npm i ${server.npmPackage}

export ${server.env.map((e) => `${e.key}=your_token`).join("\nexport ")}

# Starts MCP server on stdio (Ctrl+C to exit)
npx -y ${server.npmPackage}`,
  };
}
