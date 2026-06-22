export interface BlogBlock {
  type: "p" | "h2" | "h3" | "code" | "ul";
  text?: string;
  language?: string;
  code?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  content: BlogBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "introducing-mcp-wormhole",
    title: "Introducing mcp-wormhole: MCP servers for every tool",
    excerpt:
      "Why we built a monorepo of MCP servers, how each package wraps a vendor API, and what ships first.",
    date: "2026-06-15",
    author: "Ayush Kumar",
    tags: ["announcement", "mcp"],
    readTime: "4 min",
    content: [
      {
        type: "p",
        text: "AI agents are only as useful as the tools they can reach. Model Context Protocol (MCP) gives Cursor, Claude Desktop, VS Code Copilot, and dozens of other clients a standard way to call external APIs — but someone still has to build the server for each integration.",
      },
      {
        type: "p",
        text: "mcp-wormhole is that layer: one open-source monorepo where each directory is a standalone MCP server wrapping a third-party API. No new backends, no proprietary proxies — just stdio servers published to npm that talk to the vendor's official REST API.",
      },
      { type: "h2", text: "Design principles" },
      {
        type: "ul",
        items: [
          "One server per package — install only what you need via npx",
          "Copy-paste MCP configs for 20+ AI clients",
          "Verify scripts that hit the real API (no mocks)",
          "TypeScript + Zod + @modelcontextprotocol/sdk everywhere",
        ],
      },
      { type: "h2", text: "What's live today" },
      {
        type: "p",
        text: "Asana is the first published server (@mcp-wormhole/asana on npm) with nine tools: list workspaces, search tasks, create tasks, add comments, and more. Slack, Sentry, Linear, and others are on the roadmap.",
      },
      {
        type: "p",
        text: "Browse the integration gallery, pick your client, and follow the step-by-step guide — each one includes a hero demo GIF and copy-paste JSON config.",
      },
    ],
  },
  {
    slug: "connect-asana-to-cursor",
    title: "Connect Asana to Cursor in 5 minutes",
    excerpt:
      "Get a Personal Access Token, paste one JSON block into mcp.json, and ask Cursor to manage your tasks.",
    date: "2026-06-18",
    author: "Ayush Kumar",
    tags: ["asana", "cursor", "tutorial"],
    readTime: "5 min",
    content: [
      {
        type: "p",
        text: "Cursor reads MCP servers from ~/.cursor/mcp.json (global) or .cursor/mcp.json (per project). The Asana server runs locally via npx — no repo clone required.",
      },
      { type: "h2", text: "Step 1 — Asana token" },
      {
        type: "p",
        text: "Open the Asana developer console, create a Personal Access Token, and copy it immediately — it is shown only once.",
      },
      { type: "h2", text: "Step 2 — MCP config" },
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
        text: "Fully quit Cursor (Cmd+Q) and reopen. MCP servers load at startup. You should see asana under available tools.",
      },
      { type: "h2", text: "Try these prompts" },
      {
        type: "ul",
        items: [
          "List my open Asana tasks",
          "Create an Asana task called Ship MCP blog post",
          "Search Asana for tasks containing mcp-wormhole",
        ],
      },
      {
        type: "p",
        text: "Full guide with screenshots and tool reference: open the Cursor + Asana integration page on the docs site.",
      },
    ],
  },
  {
    slug: "building-an-mcp-server",
    title: "Building your first MCP server in mcp-wormhole",
    excerpt:
      "Copy the template package, implement tools against a vendor API, and open a PR — conventions and checklist included.",
    date: "2026-06-20",
    author: "Ayush Kumar",
    tags: ["contributing", "typescript"],
    readTime: "6 min",
    content: [
      {
        type: "p",
        text: "Every server in mcp-wormhole follows the same shape: packages/<name>/ with TypeScript, tsup build, stdio transport, and Zod-validated tool inputs.",
      },
      { type: "h2", text: "Quick start" },
      {
        type: "code",
        language: "bash",
        code: `cp -r packages/_template packages/my-service
cd packages/my-service
pnpm install
# implement src/tools/*.ts
pnpm build
pnpm verify`,
      },
      { type: "h2", text: "Tool design tips" },
      {
        type: "ul",
        items: [
          "Start with read tools (list, get, search) before write tools",
          "Name tools clearly: myservice_list_projects, myservice_create_issue",
          "Return JSON as MCP text content — agents parse structured data well",
          "Document env vars in README and .env.example",
        ],
      },
      { type: "h2", text: "PR checklist" },
      {
        type: "ul",
        items: [
          "pnpm build passes in the new package",
          "README with install + MCP config snippet",
          "No secrets committed",
          "Root README roadmap updated",
          "Site server catalog entry added in site/src/data/servers.ts",
        ],
      },
      {
        type: "p",
        text: "See CONTRIBUTING.md in the repo for publishing workflow and npm org details.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsSorted(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}
