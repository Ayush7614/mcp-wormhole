import type { BlogPost } from "../blogTypes";
import { vercelCursorFlow } from "../blogPosterConnections";

export const connectVercelToCursor: BlogPost = {
  slug: "connect-vercel-to-cursor",
  title: "Connect Vercel to Cursor in 5 minutes",
  excerpt:
    "Complete walkthrough: API token setup, mcp.json config, verification, example prompts, and troubleshooting for Cursor + Vercel MCP.",
  date: "2026-06-23",
  author: "Ayush Kumar",
  tags: ["vercel", "cursor", "tutorial", "deployments"],
  readTime: "8 min",
  poster: {
    posterAsset: "demo/posters/poster-connect-vercel-cursor.gif",
    eyebrow: "BLOG / TUTORIAL",
    headline: "Vercel MCP for Cursor",
    tagline:
      "Paste one JSON block into mcp.json and ask Cursor to list deployments, read build logs, and roll back production.",
    badge: "5 MIN SETUP",
    connection: vercelCursorFlow,
    stats: [
      { value: "5 min", label: "Setup" },
      { value: "11", label: "Tools" },
      { value: "Cursor", label: "Client" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "Create a Vercel API token at vercel.com/account/tokens.",
        "Add @mcp-wormhole/vercel to ~/.cursor/mcp.json (or .cursor/mcp.json per project).",
        "Fully quit and reopen Cursor — MCP servers load at startup.",
        "Ask naturally: \"List my Vercel projects\" or \"Show build logs for deployment dpl_…\".",
        "Full interactive guide: /guides/cursor/vercel on the docs site.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "Cursor's agent can inspect deployments, read build logs, and trigger rollbacks — but only if Vercel is wired up through MCP first. This guide connects the @mcp-wormhole/vercel server so your agent can manage projects and deployments without leaving the editor.",
    },
    {
      type: "p",
      text: "The server runs locally via npx. No repo clone, no Docker, no cloud proxy. Your token stays in your MCP config env block on your machine.",
    },
    {
      type: "diagram",
      title: "Cursor + Vercel MCP architecture",
      code: `┌──────────────────────────────────────────────────────────────┐
│  Cursor IDE                                                  │
│  ┌─────────────┐    MCP stdio     ┌────────────────────────┐ │
│  │ Agent /     │ ◄──────────────► │ npx @mcp-wormhole/vercel│ │
│  │ Composer    │  tools/list      │ 11 deployment tools    │ │
│  └─────────────┘  tools/call      └───────────┬────────────┘ │
└───────────────────────────────────────────────│──────────────┘
                                                │ HTTPS + token
                                                ▼
                                     ┌─────────────────────┐
                                     │  api.vercel.com     │
                                     └─────────────────────┘`,
    },
    { type: "h2", text: "Prerequisites" },
    {
      type: "ul",
      items: [
        "Cursor with MCP support enabled",
        "Node.js 18+ (for npx)",
        "A Vercel account with at least one project (optional for auth test)",
        "A Vercel API token from account settings",
      ],
    },
    { type: "h2", text: "Step 1 — Create a Vercel API token" },
    {
      type: "ol",
      items: [
        "Open https://vercel.com/account/tokens",
        "Click Create Token",
        "Name it (e.g. cursor-mcp-wormhole)",
        "Choose scope — Full Account or a team with deployment access",
        "Copy the token immediately",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: "Security",
      text: "Never commit your token to git or share it in chat logs. Keep it in mcp.json env vars only on your local machine. Rotate immediately if exposed.",
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
    "vercel": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/vercel"],
      "env": {
        "VERCEL_TOKEN": "your_token_here"
      }
    }
  }
}`,
    },
    {
      type: "callout",
      variant: "tip",
      title: "Team-scoped projects",
      text: "If projects live under a Vercel team, add VERCEL_TEAM_ID to the env block. The server auto-detects your default team when omitted.",
    },
    { type: "h2", text: "Step 3 — Restart Cursor" },
    {
      type: "p",
      text: "MCP servers load at startup. A window reload is not enough — fully quit Cursor (Cmd+Q on macOS) and reopen. You should see vercel listed under MCP tools in settings.",
    },
    { type: "h2", text: "Step 4 — Verify it works" },
    {
      type: "p",
      text: "Open Agent or Composer and try a simple prompt. Cursor will call vercel_get_user or vercel_list_projects under the hood.",
    },
    {
      type: "image",
      src: "demo/vercel-verify.gif",
      alt: "Vercel MCP server verification demo",
      caption: "What verification looks like — real API calls against api.vercel.com.",
    },
    { type: "h2", text: "Example prompts" },
    { type: "h3", text: "Read operations" },
    {
      type: "ul",
      items: [
        "Who am I on Vercel? (vercel_get_user)",
        "List my Vercel projects",
        "Show the last 5 production deployments for project my-app",
        "Get build logs for deployment dpl_abc123",
        "List rollback candidates for project my-app",
      ],
    },
    { type: "h3", text: "Write operations" },
    {
      type: "ul",
      items: [
        "Promote deployment dpl_abc123 to production for project my-app",
        "Roll back project my-app to deployment dpl_xyz789",
        "Cancel the in-flight deployment dpl_building",
      ],
    },
    { type: "h2", text: "Troubleshooting" },
    { type: "h3", text: "Tools not showing up" },
    {
      type: "ul",
      items: [
        "Fully quit Cursor (not just reload window)",
        "Check mcp.json syntax with a JSON validator",
        "Run npx -y @mcp-wormhole/vercel manually to see startup errors",
      ],
    },
    { type: "h3", text: "Authentication errors" },
    {
      type: "ul",
      items: [
        "Verify VERCEL_TOKEN is set in the env block",
        "Regenerate token if expired or revoked",
        "Add VERCEL_TEAM_ID if projects are under a team",
      ],
    },
    { type: "h3", text: "Empty project list" },
    {
      type: "ul",
      items: [
        "Confirm you have deployed projects on the account or team",
        "Set VERCEL_TEAM_ID to your team ID from the Vercel dashboard",
        "Run pnpm verify in packages/vercel to test outside Cursor",
      ],
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "You now have Vercel wired into Cursor with 11 tools for deployments, build logs, promote, and rollback. Start with list/get prompts, then explore rollback candidates when debugging production issues.",
    },
    {
      type: "p",
      text: "For the full tool reference, hero demo, and copy-paste config variants, visit the Cursor + Vercel guide on the docs site.",
    },
  ],
};
