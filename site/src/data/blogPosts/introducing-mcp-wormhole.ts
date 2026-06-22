import type { BlogPost } from "../blogTypes";

export const introducingMcpWormhole: BlogPost = {
  slug: "introducing-mcp-wormhole",
  title: "Introducing mcp-wormhole: MCP servers for every tool",
  excerpt:
    "Why we built an open-source monorepo of MCP servers, how the architecture works, and what's shipping first on npm.",
  date: "2026-06-15",
  author: "Ayush Kumar",
  tags: ["announcement", "mcp", "architecture"],
  readTime: "12 min",
  content: [
    {
      type: "tldr",
      items: [
        "mcp-wormhole is a monorepo of stdio MCP servers — one npm package per vendor API.",
        "No proxy backends: each server talks directly to the official REST API.",
        "@mcp-wormhole/asana@0.2.0 is live with 66 tools, 18 prompts, and browsable resources.",
        "Docs site ships copy-paste configs for 20 AI clients (Cursor, Claude, VS Code, …).",
        "Slack, Sentry, Linear, and 8 more servers are on the roadmap — PRs welcome.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "Your AI agent is only as capable as the systems it can reach. You can ask Cursor to refactor code, Claude to draft prose, or Copilot to explain a function — but without a bridge to Asana, Slack, or Sentry, the agent cannot create tasks, post messages, or triage incidents on your behalf.",
    },
    {
      type: "p",
      text: "Model Context Protocol (MCP) solves the wiring problem. It standardizes how clients discover tools, call them, and browse resources. What MCP does not solve is implementation: someone still has to build the server for each vendor API, document the config for each client, and verify it against real endpoints.",
    },
    {
      type: "p",
      text: "That is why we built mcp-wormhole — one open-source monorepo where each package is a production-ready MCP server published to npm. Install with npx, paste one JSON block into your client config, and your agent gains real tool access.",
    },
    {
      type: "callout",
      variant: "info",
      title: "What mcp-wormhole is not",
      text: "We do not host new backends or proxy your data. Every server runs locally on your machine via stdio and calls the vendor's official API with your credentials.",
    },
    { type: "h2", text: "Architecture overview" },
    {
      type: "p",
      text: "The system has three layers: your AI client, an MCP server process, and the vendor API. The client spawns the server at startup; the server exposes tools, prompts, and resources over JSON-RPC on stdin/stdout.",
    },
    {
      type: "diagram",
      title: "End-to-end MCP flow",
      code: `┌─────────────────┐     stdio JSON-RPC      ┌──────────────────────┐
│  AI Client      │ ◄──────────────────────► │  @mcp-wormhole/asana  │
│  Cursor, Claude │   tools / prompts /      │  (local Node process) │
│  VS Code, …     │   resources              └──────────┬───────────┘
└─────────────────┘                                      │
        ▲                                                │ HTTPS
        │ natural language                               ▼
        │                                         ┌──────────────┐
   "List my tasks"                                │  Asana REST  │
                                                  │  API         │
                                                  └──────────────┘`,
    },
    {
      type: "diagram",
      title: "Monorepo layout",
      code: `mcp-wormhole/
├── packages/
│   ├── asana/              ← @mcp-wormhole/asana (live)
│   │   ├── src/client.ts   ← REST wrapper
│   │   ├── src/mcp/        ← tools, prompts, resources
│   │   └── demo/           ← verify GIF + scripts
│   ├── _template/          ← copy to start a new server
│   └── slack/ …            ← planned
├── site/                   ← docs + integration guides
└── demo/                   ← catalog CLI GIF`,
    },
    {
      type: "image",
      src: "demo/mcp-wormhole-catalog.gif",
      alt: "Orange CLI demo listing all mcp-wormhole servers",
      caption: "The server catalog — Asana live, ten more integrations coming soon.",
    },
    { type: "h2", text: "Design principles" },
    {
      type: "p",
      text: "Every package in the monorepo follows the same conventions so contributors and users know exactly what to expect.",
    },
    { type: "h3", text: "One server per package" },
    {
      type: "p",
      text: "Install only what you need. `@mcp-wormhole/asana` does not pull in Slack or Sentry. Each package is independently versioned and published under the @mcp-wormhole npm org.",
    },
    { type: "h3", text: "Real API verification" },
    {
      type: "p",
      text: "Every server ships with a `pnpm verify` script that hits the live vendor API — create a resource, read it back, clean up. No mocks, no fake responses.",
    },
    {
      type: "image",
      src: "demo/asana-verify.gif",
      alt: "Terminal recording of Asana MCP verification against live API",
      caption: "Live Asana API verification — auth, create task, comment, search, complete.",
    },
    { type: "h3", text: "Client-agnostic configs" },
    {
      type: "p",
      text: "The docs site ships step-by-step guides for 20 AI clients. Same stdio config shape everywhere — only the file path changes (Cursor: `~/.cursor/mcp.json`, VS Code: `.vscode/mcp.json`, Claude Desktop: `claude_desktop_config.json`).",
    },
    { type: "h3", text: "TypeScript + Zod + MCP SDK" },
    {
      type: "ul",
      items: [
        "TypeScript for type-safe API clients",
        "Zod for tool input validation",
        "@modelcontextprotocol/sdk for tools, prompts, and resources",
        "tsup for ESM builds targeting Node 18+",
      ],
    },
    { type: "h2", text: "What's live today" },
    {
      type: "p",
      text: "Asana is the first published server. Version 0.2.0 includes 66 MCP tools covering tasks, projects, sections, tags, portfolios, goals, time tracking, and more — plus 18 prompt workflows and browsable asana:// resources.",
    },
    {
      type: "code",
      language: "json",
      code: `{
  "mcpServers": {
    "asana": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/asana"],
      "env": { "ASANA_ACCESS_TOKEN": "your_token" }
    }
  }
}`,
    },
    { type: "h2", text: "Roadmap" },
    {
      type: "ul",
      items: [
        "Slack — search channels, read threads, post messages",
        "Sentry — search issues, inspect events, resolve",
        "Linear — issues, teams, comments",
        "Vercel — deployments, logs, rollbacks",
        "Google Calendar, Airtable, Stripe, Cloudflare, GitHub Actions, PagerDuty",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Want to contribute?",
      text: "Copy packages/_template, implement tools against a vendor API, and open a PR. One server per PR — see our building guide on the blog.",
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "mcp-wormhole exists to make MCP integrations boring in the best way: npm install, paste config, ask your agent naturally. We are starting with Asana and expanding to every tool your team already uses.",
    },
    {
      type: "p",
      text: "Explore the docs site, pick your client integration guide, and connect your first server in minutes. If you build something cool — or ship the next server — we would love to see your PR.",
    },
  ],
};
