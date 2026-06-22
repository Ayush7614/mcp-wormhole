import type { McpServer } from "./servers";
import { buildStdioConfig } from "./config";

export interface GuideCodeBlock {
  label: string;
  language: string;
  code: string;
}

export interface GuideDemo {
  title: string;
  asset: string;
}

export interface GuideStep {
  id: string;
  number: number;
  title: string;
  description: string;
  bullets?: string[];
  code?: GuideCodeBlock[];
  demo?: GuideDemo;
  prompts?: string[];
  showClientLinks?: boolean;
  notice?: string;
}

export interface ServerGuide {
  title: string;
  subtitle: string;
  server: McpServer;
  steps: GuideStep[];
}

function asanaPrompts(): string[] {
  return [
    "List my open Asana tasks",
    "Create an Asana task called Ship MCP guide",
    "Search Asana for tasks containing mcp-wormhole",
    "Add a comment to task {task_gid}: Verified from Cursor",
    "Mark Asana task {task_gid} as complete",
  ];
}

function buildAsanaSteps(server: McpServer): GuideStep[] {
  const tokenKey = server.env[0]?.key ?? "ASANA_ACCESS_TOKEN";
  const tokenDocs = server.env[0]?.docsUrl ?? "https://app.asana.com/0/my-apps";

  return [
    {
      id: "prerequisites",
      number: 1,
      title: "Check prerequisites",
      description:
        "Before you start, make sure you have everything needed to run the Asana MCP server.",
      bullets: [
        "Node.js 18 or newer (`node -v` to check)",
        "An MCP-capable AI client — Cursor, Claude Desktop, VS Code, Windsurf, etc.",
        "An Asana account with permission to create and read tasks",
      ],
    },
    {
      id: "token",
      number: 2,
      title: "Create an Asana Personal Access Token",
      description:
        "The server authenticates with Asana using a Personal Access Token (PAT). Create one in the Asana developer console — it is shown only once, so copy it immediately.",
      bullets: [
        `Open ${tokenDocs}`,
        "Click Create new token → give it a name (e.g. mcp-wormhole)",
        "Copy the token — you will paste it into your MCP config as ASANA_ACCESS_TOKEN",
      ],
      notice: "Never commit your token to git or share it publicly.",
    },
    {
      id: "install",
      number: 3,
      title: "Install from npm",
      description:
        "The package is published on npm as @mcp-wormhole/asana. You do not need to clone the repo — npx downloads and runs it automatically.",
      code: [
        {
          label: "Install & run",
          language: "bash",
          code: `# Run directly (stdio MCP server)
export ${tokenKey}=your_token_here
npx -y ${server.npmPackage}`,
        },
        {
          label: "Or install in a project",
          language: "bash",
          code: `npm init -y
npm i ${server.npmPackage}`,
        },
      ],
      demo: {
        title: "npm install + MCP smoke test",
        asset: "demo/asana-npm-install.gif",
      },
    },
    {
      id: "configure",
      number: 4,
      title: "Add to your MCP client config",
      description:
        "Paste the JSON below into your client's MCP settings file. Replace the token placeholder with your real PAT, then save.",
      code: [
        {
          label: "MCP config (stdio)",
          language: "json",
          code: buildStdioConfig(server),
        },
      ],
      bullets: [
        "Cursor: ~/.cursor/mcp.json or .cursor/mcp.json in your project",
        "Claude Desktop: ~/Library/Application Support/Claude/claude_desktop_config.json",
        "VS Code: .vscode/mcp.json in your workspace",
      ],
    },
    {
      id: "restart",
      number: 5,
      title: "Restart your client",
      description:
        "MCP servers load at startup. Fully quit and reopen your AI client (not just reload the window) so it picks up the new Asana server.",
      bullets: [
        "In Cursor: Cmd+Q then reopen, or use MCP settings → refresh",
        "In Claude Desktop: quit from the menu bar, then reopen",
        "You should see asana listed under MCP tools after restart",
      ],
    },
    {
      id: "prompts",
      number: 6,
      title: "Try it — example prompts",
      description:
        "Once connected, ask your agent naturally. It will call Asana tools on your behalf.",
      prompts: asanaPrompts(),
    },
    {
      id: "tools",
      number: 7,
      title: "Available tools",
      description: "The Asana MCP server exposes 9 tools your agent can call:",
      bullets: server.tools.map((tool) => `\`${tool}\``),
    },
    {
      id: "verify",
      number: 8,
      title: "Verify the integration",
      description:
        "Run the verification script locally to confirm your token works and all API calls succeed.",
      code: [
        {
          label: "From the monorepo (developers)",
          language: "bash",
          code: `git clone https://github.com/Ayush7614/mcp-wormhole.git
cd mcp-wormhole/packages/asana
cp .env.example .env   # add your token
pnpm install && pnpm build && pnpm verify`,
        },
        {
          label: "Smoke test published package",
          language: "bash",
          code: `mkdir /tmp/mcp-asana-test && cd /tmp/mcp-asana-test
npm init -y && npm i ${server.npmPackage} @modelcontextprotocol/sdk
export ${tokenKey}=your_token_here
npx -y ${server.npmPackage}   # Ctrl+C to exit`,
        },
      ],
      demo: {
        title: "Live API verification (pnpm verify)",
        asset: server.demoAsset ?? "demo/asana-verify.gif",
      },
    },
    {
      id: "clients",
      number: 9,
      title: "Per-client setup guides",
      description:
        "Need client-specific instructions? Each guide below has copy-paste config tailored for that tool.",
      showClientLinks: true,
    },
  ];
}

function buildPlannedSteps(server: McpServer): GuideStep[] {
  return [
    {
      id: "status",
      number: 1,
      title: "Coming soon",
      description: `${server.name} is on the mcp-wormhole roadmap. The config shape and tools below are previews of what will ship.`,
      notice: `Package name: ${server.npmPackage}`,
    },
    {
      id: "auth",
      number: 2,
      title: "Authentication (planned)",
      description: "When this server ships, you will need:",
      bullets: server.env.map((item) => `${item.key} — ${item.description}`),
    },
    {
      id: "tools",
      number: 3,
      title: "Tools (planned)",
      description: `${server.tools.length} tools planned:`,
      bullets: server.tools.map((tool) => `\`${tool}\``),
    },
    {
      id: "config",
      number: 4,
      title: "Config preview",
      description: "Expected MCP config shape:",
      code: [
        {
          label: "MCP config (stdio)",
          language: "json",
          code: buildStdioConfig(server),
        },
      ],
    },
  ];
}

export function buildServerGuide(server: McpServer): ServerGuide {
  const disabled = server.status === "planned";
  const steps =
    !disabled && server.id === "asana" ? buildAsanaSteps(server) : buildPlannedSteps(server);

  return {
    title: `${server.name} MCP Server`,
    subtitle: disabled
      ? `${server.name} is on the roadmap — preview the integration below`
      : `Complete step-by-step guide to connect ${server.name} to any MCP client`,
    server,
    steps,
  };
}
