import type { BlogPost } from "../blogTypes";
import { asanaDeepConnection } from "../blogPosterConnections";

export const insideAsanaMcpServer: BlogPost = {
  slug: "inside-asana-mcp-server",
  title: "Inside @mcp-wormhole/asana: 66 tools, 18 prompts, and browsable resources",
  excerpt:
    "Deep dive into the Asana MCP server — architecture, tool categories, prompt workflows, asana:// resources, and how we verify against the live API.",
  date: "2026-06-22",
  author: "Ayush Kumar",
  tags: ["asana", "mcp", "deep-dive"],
  readTime: "16 min",
  poster: {
    posterAsset: "demo/posters/poster-inside-asana-mcp.gif",
    eyebrow: "BLOG / DEEP DIVE",
    headline: "Inside Asana MCP Server",
    tagline: "66 tools, 18 prompt workflows, and browsable asana:// resources — full API coverage.",
    badge: "v0.2.0 LIVE",
    connection: asanaDeepConnection,
    stats: [
      { value: "66", label: "Tools" },
      { value: "18", label: "Prompts" },
      { value: "7", label: "Resources" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "@mcp-wormhole/asana@0.2.0 exposes 66 MCP tools, 18 prompt workflows, and 7 asana:// resource templates.",
        "Architecture: index.ts → mcp/{tools,prompts,resources}.ts → AsanaClient → Asana REST API.",
        "Tools cover tasks, projects, sections, tags, dependencies, portfolios, goals, and time tracking.",
        "Prompts like daily_focus_plan and project_health_scan guide multi-step agent workflows.",
        "Run pnpm verify in packages/asana to smoke-test against your real workspace.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "When we set out to build the first mcp-wormhole server, Asana was the obvious choice: rich REST API, personal access tokens for easy auth, and a workflow every engineering team already uses. The goal was not a thin wrapper with ten tools — it was full API coverage so agents could actually run your work management stack.",
    },
    {
      type: "p",
      text: "Version 0.2.0 ships 66 tools, 18 MCP prompts, and browsable asana:// resources. This post walks through how the server is structured, what each layer does, and how to get the most out of it in Cursor, Claude, or any MCP client.",
    },
    {
      type: "diagram",
      title: "Server architecture",
      code: `┌─────────────────────────────────────────────────────────────────┐
│  index.ts                                                       │
│  McpServer + StdioServerTransport                               │
│  ASANA_ACCESS_TOKEN → new AsanaClient(token)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│  mcp/tools.ts   │ │ mcp/prompts.ts  │ │ mcp/resources.ts    │
│  66 registerTool│ │ 18 registerPrompt│ │ 7 resource templates│
│  Zod schemas    │ │ workflow msgs   │ │ asana:// URIs       │
└────────┬────────┘ └────────┬────────┘ └──────────┬──────────┘
         │                   │                     │
         └───────────────────┼─────────────────────┘
                             ▼
                  ┌─────────────────────┐
                  │  client.ts          │
                  │  AsanaClient        │
                  │  fetch + pagination │
                  └──────────┬──────────┘
                             │ HTTPS Bearer PAT
                             ▼
                  ┌─────────────────────┐
                  │  app.asana.com/api  │
                  │  1.0                │
                  └─────────────────────┘`,
    },
    { type: "h2", text: "Getting started" },
    {
      type: "p",
      text: "Install is one line. The server runs as a stdio MCP process — your client spawns it and communicates over JSON-RPC on stdin/stdout.",
    },
    {
      type: "image",
      src: "demo/asana-npm-install.gif",
      alt: "npm install @mcp-wormhole/asana and MCP smoke test",
      caption: "npx @mcp-wormhole/asana — zero install, instant MCP server.",
    },
    {
      type: "code",
      language: "json",
      code: `{
  "mcpServers": {
    "asana": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/asana"],
      "env": {
        "ASANA_ACCESS_TOKEN": "your_personal_access_token"
      }
    }
  }
}`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Environment variables",
      text: "ASANA_ACCESS_TOKEN is required. Optional: ASANA_DEFAULT_WORKSPACE_GID to scope list/search defaults when the agent does not specify a workspace.",
    },
    { type: "h2", text: "The 66 tools — by category" },
    {
      type: "p",
      text: "Every tool is registered in mcp/tools.ts with a Zod inputSchema. Names follow the asana_<verb>_<noun> pattern for predictable discovery.",
    },
    { type: "h3", text: "Identity & workspaces" },
    {
      type: "ul",
      items: [
        "asana_get_me — current user profile",
        "asana_get_user — lookup by GID",
        "asana_list_workspace_users — members in a workspace",
        "asana_list_workspaces — all accessible workspaces",
      ],
    },
    { type: "h3", text: "Projects & sections" },
    {
      type: "ul",
      items: [
        "asana_list_projects, asana_get_project, asana_create_project, asana_update_project, asana_delete_project",
        "asana_list_project_sections, asana_list_project_tasks",
        "asana_create_section, asana_update_section, asana_delete_section",
        "asana_list_section_tasks, asana_add_task_to_section, asana_remove_task_from_section",
      ],
    },
    { type: "h3", text: "Tasks — the core" },
    {
      type: "ul",
      items: [
        "asana_list_my_tasks, asana_search_tasks, asana_get_task, asana_get_tasks_batch",
        "asana_create_task, asana_update_task, asana_delete_task, asana_duplicate_task",
        "asana_add_task_to_project, asana_remove_task_from_project",
        "asana_list_subtasks, asana_create_subtask, asana_set_task_parent",
      ],
    },
    { type: "h3", text: "Dependencies" },
    {
      type: "ul",
      items: [
        "asana_list_task_dependencies, asana_list_task_dependents",
        "asana_add_task_dependency, asana_remove_task_dependency",
      ],
    },
    { type: "h3", text: "Tags, stories, attachments" },
    {
      type: "ul",
      items: [
        "asana_list_tags, asana_create_tag, asana_update_tag, asana_delete_tag",
        "asana_list_task_tags, asana_add_tag_to_task, asana_remove_tag_from_task",
        "asana_list_stories, asana_add_comment, asana_add_comment_html",
        "asana_list_attachments, asana_get_attachment, asana_delete_attachment, asana_attach_external_url",
      ],
    },
    { type: "h3", text: "Teams, typeahead, custom fields" },
    {
      type: "ul",
      items: [
        "asana_list_teams, asana_get_team",
        "asana_typeahead — fast search for users, projects, tasks, tags",
        "asana_list_custom_fields, asana_create_custom_field",
      ],
    },
    { type: "h3", text: "Portfolios, goals, time tracking" },
    {
      type: "ul",
      items: [
        "asana_list_portfolios, asana_get_portfolio, asana_create_portfolio",
        "asana_list_portfolio_items, asana_add_portfolio_item, asana_remove_portfolio_item",
        "asana_list_goals, asana_get_goal, asana_create_goal, asana_update_goal",
        "asana_list_time_entries, asana_create_time_entry, asana_delete_time_entry",
      ],
    },
    {
      type: "diagram",
      title: "Tool selection flow (agent perspective)",
      code: `User: "What's overdue in Project Alpha?"
  │
  ▼
Agent picks tools:
  1. asana_typeahead        → resolve "Project Alpha" → project_gid
  2. asana_list_project_tasks → fetch tasks in project
  3. asana_search_tasks     → filter by due date / incomplete
  │
  ▼
Structured JSON returned → agent summarizes for user`,
    },
    { type: "h2", text: "18 MCP prompt workflows" },
    {
      type: "p",
      text: "Prompts are pre-built instruction templates. When a client invokes a prompt, the server returns messages that tell the agent exactly which tools to call and in what order. No guessing — structured workflows for common PM scenarios.",
    },
    {
      type: "ul",
      items: [
        "daily_focus_plan — prioritize today's work across workspaces",
        "workspace_pulse — high-level health snapshot",
        "task_deep_dive — full context on a single task (subtasks, deps, comments)",
        "ship_readiness_check — blockers before a launch",
        "project_health_scan — overdue, unassigned, stale tasks",
        "stakeholder_brief — executive summary of project status",
        "backlog_prioritizer — rank unscheduled work",
        "overdue_rescue — triage past-due items",
        "comment_draft — write an update comment for a task",
        "standup_builder — yesterday / today / blockers from Asana",
        "risk_radar — dependency and deadline risks",
        "onboarding_snapshot — new teammate project overview",
        "subtask_architect — break a task into subtasks",
        "week_ahead_planner — schedule the coming week",
        "assignee_load_balance — who is overloaded",
        "sprint_closeout — wrap sprint tasks and loose ends",
        "goal_progress_report — OKR / goal tracking",
        "time_log_assistant — review and log time entries",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Prompt vs natural language",
      text: "You can ask naturally (\"list my tasks\") or invoke a prompt workflow if your client supports MCP prompts. Prompts encode multi-step logic the agent would otherwise have to infer.",
    },
    { type: "h2", text: "Browsable asana:// resources" },
    {
      type: "p",
      text: "MCP resources let agents browse structured data without calling tools blindly. The Asana server registers seven URI templates:",
    },
    {
      type: "ul",
      items: [
        "asana://catalog — tool/prompt counts and name lists",
        "asana://workspaces — all workspaces",
        "asana://workspace/{workspace_gid} — workspace detail",
        "asana://workspace/{workspace_gid}/projects — projects in workspace",
        "asana://project/{project_gid} — project detail",
        "asana://project/{project_gid}/tasks — tasks in project",
        "asana://task/{task_gid} — full task detail",
      ],
    },
    {
      type: "diagram",
      title: "Resource URI tree",
      code: `asana://catalog
asana://workspaces
  └── asana://workspace/{gid}
        └── asana://workspace/{gid}/projects
              └── asana://project/{gid}
                    └── asana://project/{gid}/tasks
                          └── asana://task/{gid}`,
    },
    { type: "h2", text: "AsanaClient — the REST layer" },
    {
      type: "p",
      text: "client.ts is the single HTTP gateway. It handles Bearer auth, pagination (offset/limit and next_page tokens), error parsing, and typed responses. Tools never call fetch directly — they go through AsanaClient methods so retries, rate limits, and response shaping stay centralized.",
    },
    {
      type: "code",
      language: "typescript",
      code: `// Simplified pattern from packages/asana/src/client.ts
class AsanaClient {
  async listMyTasks(params: { workspace_gid: string; completed_since?: string }) {
    return this.get("/users/me/tasks", params);
  }

  async createTask(data: CreateTaskInput) {
    return this.post("/tasks", { data });
  }
}`,
    },
    { type: "h2", text: "Verification against the live API" },
    {
      type: "p",
      text: "We do not ship mocks. packages/asana/src/verify.ts authenticates, creates a test task, adds a comment, searches, completes it, and reports pass/fail. This is the same script we record for demo GIFs.",
    },
    {
      type: "image",
      src: "demo/asana-verify.gif",
      alt: "Live Asana API verification recording",
      caption: "pnpm verify — real PAT, real workspace, real task lifecycle.",
    },
    {
      type: "code",
      language: "bash",
      code: `cd packages/asana
cp .env.example .env   # add ASANA_ACCESS_TOKEN
pnpm verify`,
    },
    { type: "h2", text: "Site catalog mirror" },
    {
      type: "p",
      text: "The docs site mirrors the full tool and prompt catalog at site/src/data/asanaCatalog.ts — searchable on the Asana server page and integration guides. When we add tools, we update catalog.ts in the same PR.",
    },
    {
      type: "image",
      src: "demo/mcp-wormhole-catalog.gif",
      alt: "mcp-wormhole server catalog CLI",
      caption: "The monorepo catalog CLI — Asana highlighted as the first live server.",
    },
    { type: "h2", text: "What's next for Asana MCP" },
    {
      type: "ul",
      items: [
        "Webhook-triggered resource refresh (when Asana supports agent-side patterns)",
        "Batch write helpers for bulk task updates",
        "Custom field value setters on tasks",
        "Improved HTML comment templates in comment_draft prompt",
      ],
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "@mcp-wormhole/asana is the reference implementation for every future mcp-wormhole server: full API coverage, Zod-validated tools, workflow prompts, browsable resources, and live verification. Install with npx, paste your MCP config, and give your agent real access to how your team tracks work.",
    },
    {
      type: "p",
      text: "Explore the full tool reference on the docs site, follow the Cursor integration guide, or read our building-an-mcp-server post if you want to contribute the next server in the catalog.",
    },
  ],
};
