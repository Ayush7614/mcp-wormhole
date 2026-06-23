import type { BlogPost } from "../blogTypes";
import { linearDeepFlow } from "../blogPosterConnections";

export const insideLinearMcpServer: BlogPost = {
  slug: "inside-linear-mcp-server",
  title: "Inside @mcp-wormhole/linear: 14 tools, 6 prompts, and browsable resources",
  excerpt:
    "Deep dive into the Linear MCP server — architecture, issue tracking tools, prompt workflows, linear:// resources, and live API verification.",
  date: "2026-06-25",
  author: "Ayush Kumar",
  tags: ["linear", "mcp", "deep-dive", "issues"],
  readTime: "12 min",
  poster: {
    posterAsset: "demo/posters/poster-inside-linear-mcp.gif",
    eyebrow: "BLOG / DEEP DIVE",
    headline: "Inside Linear MCP Server",
    tagline:
      "14 tools, 6 prompt workflows, and browsable linear:// resources — teams, issues, search, comments.",
    badge: "v0.1.0 LIVE",
    connection: linearDeepFlow,
    stats: [
      { value: "14", label: "Tools" },
      { value: "6", label: "Prompts" },
      { value: "4", label: "Resources" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "@mcp-wormhole/linear@0.1.0 exposes 14 MCP tools, 6 prompt workflows, and 4 linear:// resource templates.",
        "Architecture: index.ts → mcp/{tools,prompts,resources}.ts → LinearClient → api.linear.app/graphql.",
        "Tools cover viewer, teams, users, projects, workflow states, labels, issues, search, and comments.",
        "Prompts like issue_triage and sprint_board_overview guide multi-step agent workflows.",
        "Run pnpm verify in packages/linear to smoke-test against your real Linear workspace.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "Issue tracking is where agents need structured context — team IDs, workflow states, assignees, and search semantics. The Linear server wraps Linear's official GraphQL API as MCP tools, prompts, and browsable linear:// resources so any client can read and write issues without custom glue code.",
    },
    {
      type: "diagram",
      title: "Server architecture",
      code: `┌─────────────────────────────────────────────────────────────────┐
│  index.ts                                                       │
│  McpServer + StdioServerTransport                               │
│  LINEAR_API_KEY → LinearClient (+ optional LINEAR_TEAM_ID)      │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│  mcp/tools.ts   │ │ mcp/prompts.ts  │ │ mcp/resources.ts    │
│  14 registerTool│ │ 6 registerPrompt│ │ 4 resource templates│
│  Zod schemas    │ │ workflow msgs   │ │ linear:// URIs      │
└────────┬────────┘ └────────┬────────┘ └──────────┬──────────┘
         │                   │                     │
         └───────────────────┼─────────────────────┘
                             ▼
                  ┌─────────────────────┐
                  │  client.ts          │
                  │  LinearClient       │
                  │  GraphQL POST       │
                  └──────────┬──────────┘
                             │ HTTPS Bearer token
                             ▼
                  ┌─────────────────────┐
                  │  api.linear.app     │
                  │  /graphql           │
                  └─────────────────────┘`,
    },
    { type: "h2", text: "Getting started" },
    {
      type: "code",
      language: "json",
      code: `{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/linear"],
      "env": {
        "LINEAR_API_KEY": "lin_api_your_key_here"
      }
    }
  }
}`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Environment variables",
      text: "LINEAR_API_KEY is required. Optional: LINEAR_TEAM_ID for a default team when team_id is omitted on tools.",
    },
    { type: "h2", text: "The 14 tools — by category" },
    { type: "h3", text: "Account & teams" },
    {
      type: "ul",
      items: [
        "linear_get_viewer — authenticated user profile",
        "linear_list_teams — teams accessible to the API key",
        "linear_get_team — team details by ID",
        "linear_list_users — organization members",
      ],
    },
    { type: "h3", text: "Team metadata" },
    {
      type: "ul",
      items: [
        "linear_list_projects — projects for a team",
        "linear_list_workflow_states — Backlog, In Progress, Done, …",
        "linear_list_labels — issue labels for a team",
      ],
    },
    { type: "h3", text: "Issues" },
    {
      type: "ul",
      items: [
        "linear_list_issues — filter by team, assignee, state, priority",
        "linear_get_issue — full issue record by ID or identifier (ENG-123)",
        "linear_search_issues — full-text search via Linear searchIssues API",
        "linear_create_issue — create with title, description, team, state",
        "linear_update_issue — patch title, state, assignee, priority, labels",
      ],
    },
    { type: "h3", text: "Comments" },
    {
      type: "ul",
      items: [
        "linear_list_comments — comments on an issue",
        "linear_add_comment — add a comment body to an issue",
      ],
    },
    { type: "h2", text: "6 MCP prompt workflows" },
    {
      type: "ul",
      items: [
        "my_assigned_issues — issues assigned to the authenticated viewer",
        "sprint_board_overview — issues grouped by workflow state",
        "issue_triage — suggest assignee, labels, and priority for backlog items",
        "blocked_issues_scan — find blocked work via search + comments",
        "create_bug_report — structured bug issue creation",
        "release_readiness_issues — high-priority open issues before release",
      ],
    },
    { type: "h2", text: "Browsable linear:// resources" },
    {
      type: "ul",
      items: [
        "linear://catalog — tool, prompt, and resource index",
        "linear://teams — all teams accessible to your API key",
        "linear://team/{team_id}/issues — issue list for a team",
        "linear://issue/{issue_id} — full issue record",
      ],
    },
    { type: "h2", text: "Verification against the live API" },
    {
      type: "image",
      src: "demo/linear-verify.gif",
      alt: "Live Linear API verification recording",
      caption: "pnpm verify — real API key, real GraphQL calls against api.linear.app.",
    },
    {
      type: "code",
      language: "bash",
      code: `cd packages/linear
cp .env.example .env   # add LINEAR_API_KEY
pnpm install && pnpm build && pnpm verify`,
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "@mcp-wormhole/linear brings issue tracking intelligence to any MCP client. Install with npx, paste your API key, and give your agent real access to teams, issues, search, and comments — the same mcp-wormhole patterns as Asana and Vercel, tuned for how engineering teams actually ship.",
    },
  ],
};
