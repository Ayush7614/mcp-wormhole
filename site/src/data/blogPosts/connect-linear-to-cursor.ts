import type { BlogPost } from "../blogTypes";
import { linearCursorFlow } from "../blogPosterConnections";

export const connectLinearToCursor: BlogPost = {
  slug: "connect-linear-to-cursor",
  title: "Connect Linear to Cursor in 5 minutes",
  excerpt:
    "Complete walkthrough: API key setup, mcp.json config, verification, example prompts, and troubleshooting for Cursor + Linear MCP.",
  date: "2026-06-25",
  author: "Ayush Kumar",
  tags: ["linear", "cursor", "tutorial", "issues"],
  readTime: "8 min",
  poster: {
    posterAsset: "demo/posters/poster-connect-linear-cursor.gif",
    eyebrow: "BLOG / TUTORIAL",
    headline: "Linear MCP for Cursor",
    tagline:
      "Paste one JSON block into mcp.json and ask Cursor to list issues, search your backlog, and create work.",
    badge: "5 MIN SETUP",
    connection: linearCursorFlow,
    stats: [
      { value: "5 min", label: "Setup" },
      { value: "14", label: "Tools" },
      { value: "Cursor", label: "Client" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "Create a personal API key at linear.app/settings/account/security.",
        "Add @mcp-wormhole/linear to ~/.cursor/mcp.json with LINEAR_API_KEY.",
        "Optional: set LINEAR_TEAM_ID for a default team when team_id is omitted.",
        "Fully quit and reopen Cursor — MCP servers load at startup.",
        "Ask naturally: \"What issues are assigned to me?\" or \"Search Linear for open bugs.\"",
        "Full interactive guide: /guides/cursor/linear on the docs site.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "Cursor's agent can read your Linear backlog, triage issues, and create work — but only if Linear is wired up through MCP first. This guide connects @mcp-wormhole/linear so your agent can manage issues without leaving the editor.",
    },
    {
      type: "p",
      text: "The server runs locally via npx. No repo clone, no Docker, no cloud proxy. Your API key stays in your MCP config env block on your machine.",
    },
    {
      type: "diagram",
      title: "Cursor + Linear MCP architecture",
      code: `┌──────────────────────────────────────────────────────────────┐
│  Cursor IDE                                                  │
│  ┌─────────────┐    MCP stdio     ┌────────────────────────┐ │
│  │ Agent /     │ ◄──────────────► │ npx @mcp-wormhole/     │ │
│  │ Composer    │  tools/list      │ linear                 │ │
│  └─────────────┘  tools/call      └───────────┬────────────┘ │
└───────────────────────────────────────────────│──────────────┘
                                                │ HTTPS + API key
                                                ▼
                                     ┌─────────────────────┐
                                     │  api.linear.app     │
                                     │  /graphql           │
                                     └─────────────────────┘`,
    },
    { type: "h2", text: "Prerequisites" },
    {
      type: "ul",
      items: [
        "Cursor with MCP support enabled",
        "Node.js 18+ (for npx)",
        "A Linear workspace with API access",
        "A Linear personal API key from account settings",
      ],
    },
    { type: "h2", text: "Step 1 — Create a Linear API key" },
    {
      type: "ol",
      items: [
        "Open https://linear.app/settings/account/security",
        "Click Create key under Personal API keys",
        "Name it (e.g. cursor-mcp-wormhole)",
        "Copy the key immediately — it starts with lin_api_",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: "Security",
      text: "Never commit your API key to git or share it in chat logs. Keep it in mcp.json env vars only on your local machine. Rotate immediately if exposed.",
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
    "linear": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/linear"],
      "env": {
        "LINEAR_API_KEY": "lin_api_your_key_here",
        "LINEAR_TEAM_ID": "optional_default_team_id"
      }
    }
  }
}`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Default team",
      text: "LINEAR_TEAM_ID is optional. When set, tools default to that team when team_id is omitted. Find team IDs with linear_list_teams or browse linear://teams.",
    },
    { type: "h2", text: "Step 3 — Restart Cursor" },
    {
      type: "p",
      text: "MCP servers load at startup. A window reload is not enough — fully quit Cursor (Cmd+Q on macOS) and reopen. You should see linear listed under MCP tools in settings.",
    },
    { type: "h2", text: "Step 4 — Verify it works" },
    {
      type: "p",
      text: "Open Agent or Composer and try a simple prompt. Cursor will call linear_get_viewer or linear_list_issues under the hood.",
    },
    {
      type: "image",
      src: "demo/linear-verify.gif",
      alt: "Linear MCP server verification demo",
      caption: "What verification looks like — real GraphQL calls against api.linear.app.",
    },
    { type: "h2", text: "Example prompts" },
    { type: "h3", text: "Read operations" },
    {
      type: "ul",
      items: [
        "What issues are assigned to me?",
        "Show workflow states for my default team",
        "Search Linear for issues about import",
        "List comments on ENG-123",
        "Show open high-priority issues on team AYU",
      ],
    },
    { type: "h3", text: "Write operations" },
    {
      type: "ul",
      items: [
        "Create an issue called Fix login timeout on team ENG",
        "Move ENG-42 to In Progress",
        "Add a comment to ENG-123 with the root cause analysis",
        "Update priority on ENG-55 to urgent",
      ],
    },
    { type: "h2", text: "Troubleshooting" },
    { type: "h3", text: "Tools not showing up" },
    {
      type: "ul",
      items: [
        "Fully quit Cursor (not just reload window)",
        "Check mcp.json syntax with a JSON validator",
        "Run npx -y @mcp-wormhole/linear manually to see startup errors",
      ],
    },
    { type: "h3", text: "Authentication errors" },
    {
      type: "ul",
      items: [
        "Verify LINEAR_API_KEY is set in the env block",
        "Regenerate the key if revoked or expired",
        "Confirm the key has access to the workspace you expect",
      ],
    },
    { type: "h3", text: "Empty issue list or wrong team" },
    {
      type: "ul",
      items: [
        "Set LINEAR_TEAM_ID to your team's UUID from linear_list_teams",
        "Pass team_id explicitly in tool calls when working across teams",
        "Run pnpm verify in packages/linear to test outside Cursor",
      ],
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "You now have Linear wired into Cursor with 14 tools for teams, issues, search, and comments. Start with read prompts, then try issue_triage or sprint_board_overview MCP prompt workflows for richer triage help.",
    },
    {
      type: "p",
      text: "For the full tool reference, hero demo, and copy-paste config variants, visit the Cursor + Linear guide on the docs site.",
    },
  ],
};
