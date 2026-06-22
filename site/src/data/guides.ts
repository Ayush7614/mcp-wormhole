import type { Integration } from "./integrations";
import type { McpServer } from "./servers";
import { getConfigForIntegration } from "./config";

export interface GuideSection {
  id: string;
  title: string;
  body?: string;
  items?: string[];
}

export interface ProviderGuide {
  title: string;
  subtitle: string;
  integration: Integration;
  server: McpServer;
  prerequisites: string[];
  sections: GuideSection[];
  configs: { label: string; language: string; code: string }[];
  examplePrompts: string[];
  verifyCommand?: string;
}

function asanaPrompts(serverName: string): string[] {
  return [
    `"List my open ${serverName} tasks"`,
    `"Create an ${serverName} task called 'Ship MCP guide' with notes about the integration"`,
    `"Search ${serverName} for tasks containing 'mcp-wormhole'"`,
    `"Add a comment to ${serverName} task {task_gid}: 'Verified from Cursor'"`,
    `"Mark ${serverName} task {task_gid} as complete"`,
  ];
}

function genericVerify(server: McpServer): string | undefined {
  if (server.status !== "available") return undefined;
  return `# Clone repo & verify locally
git clone https://github.com/Ayush7614/mcp-wormhole.git
cd mcp-wormhole/packages/${server.id}
cp .env.example .env   # add your token
pnpm install && pnpm build && pnpm verify`;
}

export function buildProviderGuide(integration: Integration, server: McpServer): ProviderGuide {
  const configs = getConfigForIntegration(integration.id, server);
  const disabled = server.status === "planned";

  return {
    title: `${server.name} + ${integration.name}`,
    subtitle: disabled
      ? `Setup guide (preview) — ${server.name} server coming soon`
      : `Connect ${server.name} to ${integration.name} with copy-paste config`,
    integration,
    server,
    prerequisites: disabled
      ? [`${integration.name} with MCP support`, `${server.name} account (when server ships)`]
      : [
          `${integration.name} installed with MCP support`,
          `${server.name} account`,
          ...server.env.map((item) => `${item.key} — ${item.description}`),
        ],
    sections: [
      {
        id: "setup",
        title: "Setup steps",
        items: integration.steps,
      },
      {
        id: "config-path",
        title: "Config file location",
        body: integration.configPath,
      },
      {
        id: "env",
        title: "Environment variables",
        items: disabled
          ? server.env.map((item) => `${item.key}`)
          : server.env.map((item) => `${item.key} — ${item.description}`),
      },
      {
        id: "tools",
        title: `Available tools (${server.tools.length})`,
        items: server.tools,
      },
      {
        id: "official-docs",
        title: "Official documentation",
        body: `${integration.docsUrl}${server.docsUrl ? `\n${server.name} API: ${server.docsUrl}` : ""}`,
      },
    ],
    configs,
    examplePrompts: disabled ? [] : asanaPrompts(server.name),
    verifyCommand: genericVerify(server),
  };
}
