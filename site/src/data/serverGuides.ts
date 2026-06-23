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
      id: "mcp-prompts",
      number: 7,
      title: "MCP prompt workflows",
      description: `The server ships ${server.promptCount ?? 8} built-in MCP prompt templates for deployment ops:`,
      bullets: [
        "`deployment_health_check` — latest production deployment status",
        "`failed_deploy_triage` — ERROR deploys + build log errors",
        "`production_rollback_plan` — rollback candidates (no auto-execute)",
        "`build_log_analysis` — parse build events for root cause",
        "`release_readiness_check` — pre-promote go/no-go checklist",
        "`domain_audit` — domain verification review",
        "…and `project_status_snapshot`, `rollback_candidate_review`",
      ],
    },
    {
      id: "tools",
      number: 8,
      title: "Available tools",
      description: `The Vercel MCP server exposes ${server.tools.length} tools for projects, deployments, logs, env vars, and production ops:`,
      bullets: [
        "**Account** — vercel_get_user, vercel_list_teams, vercel_get_team",
        "**Projects & domains** — list/get projects, list domains",
        "**Deployments** — list, failed list, latest prod, get record, build logs",
        "**Env vars** — list, create, update, delete",
        "**Ops** — vercel_promote, vercel_rollback, vercel_cancel_deployment",
      ],
    },
    {
      id: "resources",
      number: 9,
      title: "Browsable resources",
      description:
        "Browse Vercel data without guessing IDs. Resources use the vercel:// URI scheme:",
      bullets: [
        "`vercel://catalog` — tool, prompt, and resource index",
        "`vercel://projects` — all projects",
        "`vercel://project/{project_id}` — project detail",
        "`vercel://project/{project_id}/deployments` — recent deployments",
        "`vercel://deployment/{deployment_id}` — deployment record",
      ],
    },
    {
      id: "verify",
      number: 10,
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
      `${server.tools.length} MCP tools — projects, deployments, logs, env vars, promote, rollback`,
      `${server.promptCount ?? 8} MCP prompt workflows (failed deploy triage, rollback plan, …)`,
      `${server.resourceTemplateCount ?? 5} browsable resource templates (vercel:// URIs)`,
      `Published on npm as ${server.npmPackage}@0.2.0`,
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

function buildGoogleCalendarSteps(server: McpServer): GuideStep[] {
  const credKey = server.env[0]?.key ?? "GOOGLE_CALENDAR_CREDENTIALS";
  const authDocs = server.env[0]?.docsUrl ?? "https://developers.google.com/calendar/api/guides/auth";

  return [
    {
      id: "prerequisites",
      number: 1,
      title: "Check prerequisites",
      description:
        "Before you start, make sure you have everything needed to run the Google Calendar MCP server.",
      bullets: [
        "Node.js 18 or newer (`node -v` to check)",
        "An MCP-capable AI client — Cursor, Claude Desktop, VS Code, Windsurf, etc.",
        "A Google Cloud project with the Calendar API enabled",
      ],
    },
    {
      id: "credentials",
      number: 2,
      title: "Set up Google Calendar credentials",
      description:
        "The server authenticates with Google using OAuth2 refresh credentials or a service account JSON.",
      bullets: [
        `Follow ${authDocs}`,
        "Enable the Google Calendar API in Google Cloud Console",
        "Create OAuth Desktop credentials and obtain a refresh token with calendar scope",
        `Paste the JSON into your MCP config as ${credKey}`,
        "Optional: set GOOGLE_CALENDAR_ID (defaults to primary)",
      ],
      notice: "Never commit credentials to git or share them publicly.",
    },
    {
      id: "install",
      number: 3,
      title: "Install from npm",
      description:
        "The package is published on npm as @mcp-wormhole/google-calendar. You do not need to clone the repo — npx downloads and runs it automatically.",
      code: [
        {
          label: "Run directly (stdio MCP server)",
          language: "bash",
          code: `# Run directly (stdio MCP server)
export ${credKey}='{"client_id":"...","client_secret":"...","refresh_token":"..."}'
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
        asset: "demo/google-calendar-verify.gif",
      },
    },
    {
      id: "configure",
      number: 4,
      title: "Add to your MCP client config",
      description:
        "Paste the JSON below into your client's MCP settings file. Replace the credentials placeholder with your real JSON, then save.",
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
        "MCP servers load at startup. Fully quit and reopen your AI client so it picks up the new Google Calendar server.",
      bullets: [
        "In Cursor: Cmd+Q then reopen, or use MCP settings → refresh",
        "In Claude Desktop: quit from the menu bar, then reopen",
        "You should see google-calendar listed under MCP tools after restart",
      ],
    },
    {
      id: "prompts",
      number: 6,
      title: "Try it — example prompts",
      description:
        "Once connected, ask your agent naturally. It will call Google Calendar tools on your behalf.",
      prompts: [
        "What's on my calendar today?",
        "Find a 30-minute slot tomorrow afternoon for a sync",
        "Create a meeting called Standup tomorrow at 9am",
        "Show my upcoming events this week",
        "Accept the invite for event abc123",
      ],
    },
    {
      id: "mcp-prompts",
      number: 7,
      title: "MCP prompt workflows",
      description: `The server ships ${server.promptCount ?? 6} built-in MCP prompt templates for scheduling:`,
      bullets: [
        "`today_agenda` — chronological summary of today's events",
        "`week_ahead_overview` — next 7 days with conflicts and gaps",
        "`meeting_prep_brief` — prep brief for a specific event",
        "`find_meeting_time` — mutual free slots across calendars",
        "`scheduling_conflict_scan` — overlaps and tight turnarounds",
        "`focus_time_planner` — suggest deep-work blocks",
      ],
    },
    {
      id: "tools",
      number: 8,
      title: "Available tools",
      description: `The Google Calendar MCP server exposes ${server.tools.length} tools for calendars, events, search, and scheduling:`,
      bullets: [
        "**Calendars** — gcal_list_calendars, gcal_get_calendar",
        "**Events** — list, get, create, update, delete, search, upcoming, quick-add",
        "**Scheduling** — gcal_find_free_slots, gcal_rsvp_event",
      ],
    },
    {
      id: "resources",
      number: 9,
      title: "Browsable resources",
      description:
        "Browse calendar data without guessing IDs. Resources use the gcal:// URI scheme:",
      bullets: [
        "`gcal://catalog` — tool, prompt, and resource index",
        "`gcal://calendars` — all calendars",
        "`gcal://calendar/{calendar_id}` — calendar detail",
        "`gcal://calendar/{calendar_id}/events` — upcoming events",
      ],
    },
    {
      id: "verify",
      number: 10,
      title: "Verify the integration",
      description:
        "Run the verification script locally to confirm your credentials work and API calls succeed.",
      code: [
        {
          label: "From the monorepo (developers)",
          language: "bash",
          code: `git clone https://github.com/Ayush7614/mcp-wormhole.git
cd mcp-wormhole/packages/google-calendar
cp .env.example .env   # add your credentials JSON
pnpm install && pnpm build && pnpm verify`,
        },
        {
          label: "Smoke test published package",
          language: "bash",
          code: `mkdir /tmp/mcp-gcal-test && cd /tmp/mcp-gcal-test
npm init -y && npm i ${server.npmPackage} @modelcontextprotocol/sdk
export ${credKey}='{"client_id":"...","client_secret":"...","refresh_token":"..."}'
npx -y ${server.npmPackage}   # Ctrl+C to exit`,
        },
      ],
    },
  ];
}

function buildGoogleCalendarIntro(server: McpServer): GuideIntro {
  return {
    title: "What you'll set up",
    paragraphs: [
      `The ${server.name} MCP server wraps Google's official Calendar API as MCP tools your AI client can call. Install from npm, add one JSON block to your MCP config, and your agent can list events, find free slots, create meetings, and RSVP — no custom integration code.`,
      "This guide walks through prerequisites, OAuth setup, npm install, client configuration, and verification. When you're finished, use Connect your client below to wire up Cursor, Claude Desktop, VS Code, and 17 other frameworks.",
    ],
    highlights: [
      `${server.tools.length} MCP tools — calendars, events, search, free/busy, RSVP`,
      `${server.promptCount ?? 6} MCP prompt workflows (today agenda, find meeting time, …)`,
      `${server.resourceTemplateCount ?? 4} browsable resource templates (gcal:// URIs)`,
      `Published on npm as ${server.npmPackage}@0.1.0`,
    ],
  };
}

function buildLinearSteps(server: McpServer): GuideStep[] {
  const apiKey = server.env[0]?.key ?? "LINEAR_API_KEY";
  const keyDocs = server.env[0]?.docsUrl ?? "https://linear.app/settings/account/security";

  return [
    {
      id: "prerequisites",
      number: 1,
      title: "Check prerequisites",
      description:
        "Before you start, make sure you have everything needed to run the Linear MCP server.",
      bullets: [
        "Node.js 18 or newer (`node -v` to check)",
        "An MCP-capable AI client — Cursor, Claude Desktop, VS Code, Windsurf, etc.",
        "A Linear workspace with API access",
      ],
    },
    {
      id: "api-key",
      number: 2,
      title: "Create a Linear API key",
      description:
        "The server authenticates with Linear using a personal API key from your account settings.",
      bullets: [
        `Open ${keyDocs}`,
        "Create a new personal API key (e.g. mcp-wormhole)",
        `Copy the key — paste it into your MCP config as ${apiKey}`,
        "Optional: set LINEAR_TEAM_ID for a default team when team_id is omitted",
      ],
      notice: "Never commit your API key to git or share it publicly.",
    },
    {
      id: "install",
      number: 3,
      title: "Install from npm",
      description:
        "The package is published on npm as @mcp-wormhole/linear. You do not need to clone the repo — npx downloads and runs it automatically.",
      code: [
        {
          label: "Run directly (stdio MCP server)",
          language: "bash",
          code: `# Run directly (stdio MCP server)
export ${apiKey}=lin_api_your_key_here
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
        asset: "demo/linear-verify.gif",
      },
    },
    {
      id: "configure",
      number: 4,
      title: "Add to your MCP client config",
      description:
        "Paste the JSON below into your client's MCP settings file. Replace the API key placeholder with your real key, then save.",
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
        "MCP servers load at startup. Fully quit and reopen your AI client so it picks up the new Linear server.",
      bullets: [
        "In Cursor: Cmd+Q then reopen, or use MCP settings → refresh",
        "In Claude Desktop: quit from the menu bar, then reopen",
        "You should see linear listed under MCP tools after restart",
      ],
    },
    {
      id: "prompts",
      number: 6,
      title: "Try it — example prompts",
      description:
        "Once connected, ask your agent naturally. It will call Linear tools on your behalf.",
      prompts: [
        "What issues are assigned to me?",
        "Search Linear for open bugs in the ENG team",
        "Create an issue called Fix login timeout on team ENG",
        "Add a comment to ENG-123 with the root cause analysis",
        "Show workflow states for my default team",
      ],
    },
    {
      id: "mcp-prompts",
      number: 7,
      title: "MCP prompt workflows",
      description: `The server ships ${server.promptCount ?? 6} built-in MCP prompt templates for issue tracking:`,
      bullets: [
        "`my_assigned_issues` — issues assigned to the authenticated viewer",
        "`sprint_board_overview` — issues grouped by workflow state",
        "`issue_triage` — suggest assignee, labels, and priority",
        "`blocked_issues_scan` — find blocked work via search + comments",
        "`create_bug_report` — structured bug issue creation",
        "`release_readiness_issues` — high-priority open issues before release",
      ],
    },
    {
      id: "tools",
      number: 8,
      title: "Available tools",
      description: `The Linear MCP server exposes ${server.tools.length} tools for teams, issues, and comments:`,
      bullets: [
        "**Account** — linear_get_viewer, linear_list_users",
        "**Teams** — list/get teams, projects, workflow states, labels",
        "**Issues** — list, get, search, create, update",
        "**Comments** — linear_add_comment, linear_list_comments",
      ],
    },
    {
      id: "resources",
      number: 9,
      title: "Browsable resources",
      description:
        "Browse Linear data without guessing IDs. Resources use the linear:// URI scheme:",
      bullets: [
        "`linear://catalog` — tool, prompt, and resource index",
        "`linear://teams` — all teams",
        "`linear://team/{team_id}/issues` — team issue list",
        "`linear://issue/{issue_id}` — full issue record",
      ],
    },
    {
      id: "verify",
      number: 10,
      title: "Verify the integration",
      description:
        "Run the verification script locally to confirm your API key works and GraphQL calls succeed.",
      code: [
        {
          label: "From the monorepo (developers)",
          language: "bash",
          code: `git clone https://github.com/Ayush7614/mcp-wormhole.git
cd mcp-wormhole/packages/linear
cp .env.example .env   # add LINEAR_API_KEY
pnpm install && pnpm build && pnpm verify`,
        },
        {
          label: "Run published package",
          language: "bash",
          code: `export ${apiKey}=lin_api_your_key_here
npx -y ${server.npmPackage}   # Ctrl+C to exit`,
        },
      ],
    },
  ];
}

function buildLinearIntro(server: McpServer): GuideIntro {
  return {
    title: "What you'll set up",
    paragraphs: [
      `The ${server.name} MCP server wraps Linear's official GraphQL API as MCP tools your AI client can call. Install from npm, add one JSON block to your MCP config, and your agent can list issues, search, triage, create work, and comment — no custom integration code.`,
      "This guide walks through prerequisites, API key setup, npm install, client configuration, and verification. When you're finished, use Connect your client below to wire up Cursor, Claude Desktop, VS Code, and 17 other frameworks.",
    ],
    highlights: [
      `${server.tools.length} MCP tools — teams, issues, search, comments, labels`,
      `${server.promptCount ?? 6} MCP prompt workflows (triage, sprint board, release readiness, …)`,
      `${server.resourceTemplateCount ?? 4} browsable resource templates (linear:// URIs)`,
      `Published on npm as ${server.npmPackage}@0.1.0`,
    ],
  };
}

function buildCloudflareSteps(server: McpServer): GuideStep[] {
  const apiToken = server.env[0]?.key ?? "CLOUDFLARE_API_TOKEN";
  const tokenDocs = server.env[0]?.docsUrl ?? "https://dash.cloudflare.com/profile/api-tokens";

  return [
    {
      id: "prerequisites",
      number: 1,
      title: "Check prerequisites",
      description:
        "Before you start, make sure you have everything needed to run the Cloudflare MCP server.",
      bullets: [
        "Node.js 18 or newer (`node -v` to check)",
        "An MCP-capable AI client — Cursor, Claude Desktop, VS Code, Windsurf, etc.",
        "A Cloudflare account with zones and/or Workers access",
      ],
    },
    {
      id: "api-token",
      number: 2,
      title: "Create a Cloudflare API token",
      description:
        "The server authenticates with Cloudflare using a scoped API token from your dashboard.",
      bullets: [
        `Open ${tokenDocs}`,
        "Create Custom Token or use a template (Edit zone DNS, Workers, Cache Purge, …)",
        `Copy the token — paste it into your MCP config as ${apiToken}`,
        "Optional: set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_ZONE_ID for defaults",
      ],
      notice: "Never commit your API token to git or share it publicly.",
    },
    {
      id: "install",
      number: 3,
      title: "Install from npm",
      description:
        "The package is published on npm as @mcp-wormhole/cloudflare. You do not need to clone the repo — npx downloads and runs it automatically.",
      code: [
        {
          label: "Run directly (stdio MCP server)",
          language: "bash",
          code: `# Run directly (stdio MCP server)
export ${apiToken}=your_token_here
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
        asset: "demo/cloudflare-verify.gif",
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
        "MCP servers load at startup. Fully quit and reopen your AI client so it picks up the new Cloudflare server.",
      bullets: [
        "In Cursor: Cmd+Q then reopen, or use MCP settings → refresh",
        "In Claude Desktop: quit from the menu bar, then reopen",
        "You should see cloudflare listed under MCP tools after restart",
      ],
    },
    {
      id: "prompts",
      number: 6,
      title: "Try it — example prompts",
      description:
        "Once connected, ask your agent naturally. It will call Cloudflare tools on your behalf.",
      prompts: [
        "List my Cloudflare zones",
        "Show DNS records for my default zone",
        "Purge cache for zone example.com — everything",
        "List Workers scripts in my account",
        "Review firewall rules for my production zone",
      ],
    },
    {
      id: "mcp-prompts",
      number: 7,
      title: "MCP prompt workflows",
      description: `The server ships ${server.promptCount ?? 6} built-in MCP prompt templates for Cloudflare ops:`,
      bullets: [
        "`dns_audit` — review DNS records, duplicates, apex coverage",
        "`cache_purge_plan` — recommend safe cache purge strategy",
        "`workers_inventory` — list Workers scripts in an account",
        "`zone_health_snapshot` — zone status, DNS count, firewall rules",
        "`firewall_rules_review` — review legacy firewall rules",
        "`incident_dns_check` — DNS verification during an outage",
      ],
    },
    {
      id: "tools",
      number: 8,
      title: "Available tools",
      description: `The Cloudflare MCP server exposes ${server.tools.length} tools for zones, DNS, cache, Workers, and firewall:`,
      bullets: [
        "**Account** — cf_verify_token, cf_get_user, cf_list_accounts",
        "**Zones** — cf_list_zones, cf_get_zone",
        "**DNS** — list, get, create, update, delete records",
        "**Cache** — cf_purge_cache",
        "**Workers** — cf_list_workers, cf_get_worker",
        "**Firewall** — cf_list_firewall_rules",
      ],
    },
    {
      id: "resources",
      number: 9,
      title: "Browsable resources",
      description:
        "Browse Cloudflare data without guessing IDs. Resources use the cf:// URI scheme:",
      bullets: [
        "`cf://catalog` — tool, prompt, and resource index",
        "`cf://zones` — all zones",
        "`cf://zone/{zone_id}` — zone details",
        "`cf://zone/{zone_id}/dns` — DNS records for a zone",
      ],
    },
    {
      id: "verify",
      number: 10,
      title: "Verify the integration",
      description:
        "Run the verification script locally to confirm your API token works and API calls succeed.",
      code: [
        {
          label: "From the monorepo (developers)",
          language: "bash",
          code: `git clone https://github.com/Ayush7614/mcp-wormhole.git
cd mcp-wormhole/packages/cloudflare
cp .env.example .env   # add CLOUDFLARE_API_TOKEN
pnpm install && pnpm build && pnpm verify`,
        },
        {
          label: "Run published package",
          language: "bash",
          code: `export ${apiToken}=your_token_here
npx -y ${server.npmPackage}   # Ctrl+C to exit`,
        },
      ],
    },
  ];
}

function buildCloudflareIntro(server: McpServer): GuideIntro {
  return {
    title: "What you'll set up",
    paragraphs: [
      `The ${server.name} MCP server wraps Cloudflare's official API v4 as MCP tools your AI client can call. Install from npm, add one JSON block to your MCP config, and your agent can manage DNS, purge cache, inspect Workers, and review firewall rules — no custom integration code.`,
      "This guide walks through prerequisites, API token setup, npm install, client configuration, and verification. When you're finished, use Connect your client below to wire up Cursor, Claude Desktop, VS Code, and 17 other frameworks.",
    ],
    highlights: [
      `${server.tools.length} MCP tools — zones, DNS, cache purge, Workers, firewall`,
      `${server.promptCount ?? 6} MCP prompt workflows (DNS audit, cache purge plan, incident check, …)`,
      `${server.resourceTemplateCount ?? 4} browsable resource templates (cf:// URIs)`,
      `Published on npm as ${server.npmPackage}@0.1.0`,
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
        : server.id === "google-calendar"
          ? buildGoogleCalendarSteps(server)
          : server.id === "linear"
            ? buildLinearSteps(server)
            : server.id === "cloudflare"
              ? buildCloudflareSteps(server)
              : buildPlannedSteps(server)
    : buildPlannedSteps(server);

  const intro = !disabled
    ? server.id === "asana"
      ? buildAsanaIntro(server)
      : server.id === "vercel"
        ? buildVercelIntro(server)
        : server.id === "google-calendar"
          ? buildGoogleCalendarIntro(server)
          : server.id === "linear"
            ? buildLinearIntro(server)
            : server.id === "cloudflare"
              ? buildCloudflareIntro(server)
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
