import type { BlogPost } from "../blogTypes";
import { asanaCursorFlow } from "../blogPosterConnections";

export const connectAsanaToCursor: BlogPost = {
  slug: "connect-asana-to-cursor",
  title: "Connect Asana to Cursor in 5 minutes",
  excerpt:
    "Complete walkthrough: PAT setup, mcp.json config, verification, example prompts, and troubleshooting for Cursor + Asana MCP.",
  date: "2026-06-18",
  author: "Ayush Kumar",
  tags: ["asana", "cursor", "tutorial"],
  readTime: "10 min",
  poster: {
    posterAsset: "demo/posters/poster-connect-asana-cursor.gif",
    eyebrow: "BLOG / TUTORIAL",
    headline: "Asana MCP for Cursor",
    tagline:
      "Paste one JSON block into mcp.json and ask Cursor to list tasks, create work, and search projects.",
    badge: "5 MIN SETUP",
    connection: asanaCursorFlow,
    stats: [
      { value: "5 min", label: "Setup" },
      { value: "66", label: "Tools" },
      { value: "Cursor", label: "Client" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "Create an Asana Personal Access Token at app.asana.com/0/my-apps.",
        "Add @mcp-wormhole/asana to ~/.cursor/mcp.json (or .cursor/mcp.json per project).",
        "Fully quit and reopen Cursor — MCP servers load at startup.",
        "Ask naturally: \"List my open Asana tasks\" or \"Create a task called …\".",
        "Full interactive guide: /guides/cursor/asana on the docs site.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "Cursor's agent can call external tools through MCP — but only if you wire them up first. This guide connects Asana to Cursor so your agent can list tasks, create work, search projects, post comments, and manage dependencies without leaving the editor.",
    },
    {
      type: "p",
      text: "The Asana server runs locally via npx. No repo clone, no Docker, no cloud proxy. Your token stays in your MCP config env block on your machine.",
    },
    {
      type: "diagram",
      title: "Cursor + Asana MCP architecture",
      code: `┌──────────────────────────────────────────────────────────────┐
│  Cursor IDE                                                  │
│  ┌─────────────┐    MCP stdio     ┌────────────────────────┐ │
│  │ Agent /     │ ◄──────────────► │ npx @mcp-wormhole/asana│ │
│  │ Composer    │  tools/list      │ 66 tools · 18 prompts  │ │
│  └─────────────┘  tools/call      └───────────┬────────────┘ │
└───────────────────────────────────────────────│──────────────┘
                                                │ HTTPS + PAT
                                                ▼
                                     ┌─────────────────────┐
                                     │  app.asana.com API  │
                                     └─────────────────────┘`,
    },
    { type: "h2", text: "Prerequisites" },
    {
      type: "ul",
      items: [
        "Cursor with MCP support enabled",
        "Node.js 18+ (for npx)",
        "An Asana account with permission to read and create tasks",
        "A Personal Access Token (PAT) from the Asana developer console",
      ],
    },
    { type: "h2", text: "Step 1 — Create an Asana token" },
    {
      type: "ol",
      items: [
        "Open https://app.asana.com/0/my-apps",
        "Click Create new token",
        "Name it (e.g. cursor-mcp-wormhole)",
        "Copy the token immediately — it is shown only once",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: "Security",
      text: "Never commit your token to git or share it in chat logs. Keep it in mcp.json env vars only on your local machine.",
    },
    { type: "h2", text: "Step 2 — Add MCP config" },
    {
      type: "p",
      text: "Global config (all projects): ~/.cursor/mcp.json. Per-project config: .cursor/mcp.json in your repo root.",
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
        "ASANA_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}`,
    },
    { type: "h2", text: "Step 3 — Restart Cursor" },
    {
      type: "p",
      text: "MCP servers load at startup. A window reload is not enough — fully quit Cursor (Cmd+Q on macOS) and reopen. You should see asana listed under MCP tools in settings.",
    },
    { type: "h2", text: "Step 4 — Verify it works" },
    {
      type: "p",
      text: "Open Agent or Composer and try a simple prompt. Cursor will call asana_list_my_tasks or asana_search_tasks under the hood.",
    },
    {
      type: "image",
      src: "demo/asana-verify.gif",
      alt: "Asana MCP server verification demo",
      caption: "What verification looks like — real API calls, real tasks created.",
    },
    { type: "h2", text: "Example prompts" },
    { type: "h3", text: "Read operations" },
    {
      type: "ul",
      items: [
        "List my open Asana tasks",
        "Search Asana for tasks containing mcp-wormhole",
        "Show me tasks due this week in workspace {name}",
        "Get details for Asana task {task_gid}",
      ],
    },
    { type: "h3", text: "Write operations" },
    {
      type: "ul",
      items: [
        "Create an Asana task called Ship MCP blog post in my default workspace",
        "Add a comment to task {task_gid}: Verified from Cursor",
        "Mark Asana task {task_gid} as complete",
        "Create subtasks for task {task_gid} to break down the work",
      ],
    },
    { type: "h3", text: "MCP prompt workflows" },
    {
      type: "p",
      text: "If your client supports MCP prompts, invoke built-in workflows like daily_focus_plan, project_health_scan, or standup_builder — they guide the agent through multi-step Asana analysis.",
    },
    { type: "h2", text: "Troubleshooting" },
    { type: "h3", text: "Tools not showing up" },
    {
      type: "ul",
      items: [
        "Fully quit Cursor (not just reload window)",
        "Check mcp.json syntax with a JSON validator",
        "Run npx -y @mcp-wormhole/asana manually to see startup errors",
      ],
    },
    { type: "h3", text: "Authentication errors" },
    {
      type: "ul",
      items: [
        "Verify ASANA_ACCESS_TOKEN is set in the env block (not hardcoded elsewhere)",
        "Regenerate token if expired or revoked",
        "Ensure token has access to the workspace you are querying",
      ],
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "You now have Asana wired into Cursor with 66 tools, 18 prompt workflows, and browsable asana:// resources. Start with simple list/search prompts, then explore project health scans and subtask creation.",
    },
    {
      type: "p",
      text: "For the full tool reference, hero demo, and copy-paste config variants, visit the Cursor + Asana guide on the docs site.",
    },
  ],
};
