import type { McpServer } from "./servers";
import { buildStdioConfig } from "./config";
import type { GuideIntro, GuidePoster } from "./guideTypes";

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
  notice?: string;
}

export interface ServerGuide {
  title: string;
  subtitle: string;
  server: McpServer;
  intro: GuideIntro;
  poster: GuidePoster;
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
      id: "mcp-prompts",
      number: 7,
      title: "MCP prompt workflows",
      description: `The server ships ${server.promptCount ?? 18} built-in MCP prompt templates — multi-step workflows your client can invoke directly (not just chat suggestions):`,
      bullets: [
        "`daily_focus_plan` — prioritized plan from your open tasks",
        "`project_health_scan` — overdue, unassigned, and stale task signals",
        "`stakeholder_brief` — executive-ready project update",
        "`overdue_rescue` — triage late work (reschedule, reassign, drop)",
        "`subtask_architect` — break a task into scoped subtasks",
        "`standup_builder` — yesterday / today / blockers",
        "`time_log_assistant` — retro time logging on a task",
        "…and 11 more (`workspace_pulse`, `risk_radar`, `sprint_closeout`, etc.)",
      ],
    },
    {
      id: "tools",
      number: 8,
      title: "Available tools",
      description: `The Asana MCP server exposes ${server.tools.length} tools across tasks, projects, sections, tags, portfolios, goals, time tracking, and more:`,
      bullets: [
        "**Users & workspaces** — get_me, list_workspaces, list_workspace_users",
        "**Projects & sections** — CRUD projects, sections, move tasks between columns",
        "**Tasks** — search, batch get, subtasks, dependencies, duplicate, multi-project",
        "**Tags & custom fields** — full tag CRUD, custom field definitions",
        "**Stories & attachments** — comments (plain + HTML), external URL attachments",
        "**Portfolios & goals** — portfolio items, goal CRUD",
        "**Time tracking** — log and manage time entries",
        "**Typeahead** — fuzzy search tasks, projects, users, tags, teams",
      ],
    },
    {
      id: "resources",
      number: 9,
      title: "Browsable resources",
      description:
        "Browse your Asana hierarchy without guessing GIDs. Resources use the asana:// URI scheme:",
      bullets: [
        "`asana://catalog` — tool, prompt, and resource index",
        "`asana://workspaces` — all accessible workspaces",
        "`asana://workspace/{gid}/projects` — project list",
        "`asana://project/{gid}/tasks` — tasks in a project",
        "`asana://task/{gid}` — task snapshot with subtasks and stories",
      ],
    },
    {
      id: "verify",
      number: 10,
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
    },
  ];
}

function vercelPrompts(): string[] {
  return [
    "List my Vercel projects",
    "Show the last 5 production deployments for project my-app",
    "Get build logs for deployment dpl_abc123",
    "List rollback candidates for project my-app",
    "Roll back project my-app to deployment dpl_xyz789",
  ];
}

function buildVercelSteps(server: McpServer): GuideStep[] {
  const tokenKey = server.env[0]?.key ?? "VERCEL_TOKEN";
  const tokenDocs = server.env[0]?.docsUrl ?? "https://vercel.com/account/tokens";

  return [
    {
      id: "prerequisites",
      number: 1,
      title: "Check prerequisites",
      description:
        "Before you start, make sure you have everything needed to run the Vercel MCP server.",
      bullets: [
        "Node.js 18 or newer (`node -v` to check)",
        "An MCP-capable AI client — Cursor, Claude Desktop, VS Code, Windsurf, etc.",
        "A Vercel account with API token access",
      ],
    },
    {
      id: "token",
      number: 2,
      title: "Create a Vercel API token",
      description:
        "The server authenticates with Vercel using an API token from your account settings.",
      bullets: [
        `Open ${tokenDocs}`,
        "Click Create Token → give it a name (e.g. mcp-wormhole)",
        "Copy the token — paste it into your MCP config as VERCEL_TOKEN",
        "Optional: add VERCEL_TEAM_ID if your projects live under a team",
      ],
      notice: "Never commit your token to git or share it publicly.",
    },
    {
      id: "install",
      number: 3,
      title: "Install from npm",
      description:
        "The package is published on npm as @mcp-wormhole/vercel. You do not need to clone the repo — npx downloads and runs it automatically.",
      code: [
        {
          label: "Run directly (stdio MCP server)",
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
        title: "Build + verify against live API",
        asset: "demo/vercel-verify.gif",
      },
    },
    {
      id: "configure",
      number: 4,
      title: "Add to your MCP client config",
      description:
        "Paste the JSON below into your client's MCP settings file. Replace the token placeholder with your real token, then save.",
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
        "MCP servers load at startup. Fully quit and reopen your AI client (not just reload the window) so it picks up the new Vercel server.",
      bullets: [
        "In Cursor: Cmd+Q then reopen, or use MCP settings → refresh",
        "In Claude Desktop: quit from the menu bar, then reopen",
        "You should see vercel listed under MCP tools after restart",
      ],
    },
    {
      id: "prompts",
      number: 6,
      title: "Try it — example prompts",
      description:
        "Once connected, ask your agent naturally. It will call Vercel tools on your behalf.",
      prompts: vercelPrompts(),
    },
    {
      id: "tools",
      number: 7,
      title: "Available tools",
      description: `The Vercel MCP server exposes ${server.tools.length} tools for projects, deployments, logs, and production ops:`,
      bullets: [
        "**Account** — vercel_get_user, vercel_list_teams",
        "**Projects** — vercel_list_projects, vercel_get_project",
        "**Deployments** — list with filters, get record, build event logs",
        "**Domains** — vercel_list_project_domains",
        "**Ops** — vercel_promote, vercel_rollback, vercel_cancel_deployment",
      ],
    },
    {
      id: "verify",
      number: 8,
      title: "Verify the integration",
      description:
        "Run the verification script locally to confirm your token works and API calls succeed.",
      code: [
        {
          label: "From the monorepo (developers)",
          language: "bash",
          code: `git clone https://github.com/Ayush7614/mcp-wormhole.git
cd mcp-wormhole/packages/vercel
cp .env.example .env   # add your token
pnpm install && pnpm build && pnpm verify`,
        },
        {
          label: "Smoke test published package",
          language: "bash",
          code: `mkdir /tmp/mcp-vercel-test && cd /tmp/mcp-vercel-test
npm init -y && npm i ${server.npmPackage} @modelcontextprotocol/sdk
export ${tokenKey}=your_token_here
npx -y ${server.npmPackage}   # Ctrl+C to exit`,
        },
      ],
    },
  ];
}

function buildVercelIntro(server: McpServer): GuideIntro {
  return {
    title: "What you'll set up",
    paragraphs: [
      `The ${server.name} MCP server wraps Vercel's official REST API as MCP tools your AI client can call. Install from npm, add one JSON block to your MCP config, and your agent can list deployments, read build logs, promote releases, and roll back production — no custom integration code.`,
      "This guide walks through prerequisites, token creation, npm install, client configuration, and verification. When you're finished, use Connect your client below to wire up Cursor, Claude Desktop, VS Code, and 17 other frameworks.",
    ],
    highlights: [
      `${server.tools.length} MCP tools — projects, deployments, logs, promote, rollback`,
      "Auto team scope from defaultTeamId when VERCEL_TEAM_ID is omitted",
      `Published on npm as ${server.npmPackage}@0.1.0`,
      "Live verification demo on the docs site",
    ],
  };
}

function buildAsanaIntro(server: McpServer): GuideIntro {
  return {
    title: "What you'll set up",
    paragraphs: [
      `The ${server.name} MCP server wraps Asana's official REST API as MCP tools your AI client can call. Install from npm, add one JSON block to your MCP config, and your agent can list tasks, create work, search projects, and post comments — no custom integration code.`,
      "This guide walks through prerequisites, token creation, npm install, client configuration, and verification. When you're finished, use Connect your client below to wire up Cursor, Claude Desktop, VS Code, and 17 other frameworks.",
    ],
    highlights: [
      `${server.tools.length} MCP tools — tasks, projects, tags, portfolios, goals, time tracking`,
      `${server.promptCount ?? 18} MCP prompt workflows (daily plan, health scan, standup, …)`,
      `${server.resourceTemplateCount ?? 7} browsable resource templates (asana:// URIs)`,
      `Published on npm as ${server.npmPackage}@0.2.0`,
    ],
  };
}

function buildPlannedIntro(server: McpServer): GuideIntro {
  return {
    title: "What's coming",
    paragraphs: [
      `${server.name} is on the mcp-wormhole roadmap. This page previews the MCP config shape, authentication requirements, and planned tools so you can plan your integration early.`,
      "When the server ships, this guide will expand into the same step-by-step format as Asana — install, configure, verify, and connect your client.",
    ],
    highlights: [
      `${server.tools.length} tools planned`,
      `Package name: ${server.npmPackage}`,
      server.env.map((e) => e.key).join(", ") + " authentication",
    ],
  };
}

function buildServerPoster(server: McpServer): GuidePoster {
  const npmShort = server.npmPackage.replace("@mcp-wormhole/", "");
  const stats: GuidePoster["stats"] = [
    { value: String(server.tools.length), label: "Tools" },
    { value: String(server.promptCount ?? 0), label: "Prompts" },
    { value: String(server.resourceTemplateCount ?? 0), label: "Resources" },
    { value: npmShort, label: "npm" },
  ];
  if (!server.promptCount) {
    stats.splice(1, 2);
  }
  return {
    demoAsset: server.demoAsset ?? "demo/asana-verify.gif",
    demoCaption: `${server.name} MCP — live verification`,
    stats,
  };
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
  const steps = !disabled
    ? server.id === "asana"
      ? buildAsanaSteps(server)
      : server.id === "vercel"
        ? buildVercelSteps(server)
        : buildPlannedSteps(server)
    : buildPlannedSteps(server);

  const intro = !disabled
    ? server.id === "asana"
      ? buildAsanaIntro(server)
      : server.id === "vercel"
        ? buildVercelIntro(server)
        : buildPlannedIntro(server)
    : buildPlannedIntro(server);

  return {
    title: `${server.name} MCP Server`,
    subtitle: disabled
      ? `${server.name} is on the roadmap — preview the integration below`
      : `Connect ${server.name} to any MCP client — install, configure, and verify in minutes`,
    server,
    intro,
    poster: buildServerPoster(server),
    steps,
  };
}
