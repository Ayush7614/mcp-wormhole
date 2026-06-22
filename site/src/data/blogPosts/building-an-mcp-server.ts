import type { BlogPost } from "../blogTypes";

export const buildingAnMcpServer: BlogPost = {
  slug: "building-an-mcp-server",
  title: "Building your first MCP server in mcp-wormhole",
  excerpt:
    "From template to npm: package structure, tool design, prompts, resources, verification, and the PR checklist for new integrations.",
  date: "2026-06-20",
  author: "Ayush Kumar",
  tags: ["contributing", "typescript", "architecture"],
  readTime: "14 min",
  poster: {
    posterAsset: "demo/posters/poster-building-mcp-server.gif",
    headline: "Build MCP Servers",
    tagline: "Template → npm → PR",
    badge: "Contributor",
    stats: [
      { value: "1", label: "Template" },
      { value: "Zod", label: "Validation" },
      { value: "stdio", label: "Transport" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "Copy packages/_template → packages/<name> and implement against the vendor REST API.",
        "Split code into client.ts (HTTP), mcp/tools.ts, mcp/prompts.ts, mcp/resources.ts.",
        "Validate all tool inputs with Zod; return JSON as MCP text content.",
        "Ship pnpm verify that hits the real API — no mocks.",
        "Open one PR per server; update site/src/data/servers.ts and root README.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "mcp-wormhole grows one server at a time. Each integration is a standalone npm package under @mcp-wormhole/<name> that wraps a vendor API as MCP tools, prompts, and optional browsable resources.",
    },
    {
      type: "p",
      text: "This guide walks through the package architecture, conventions we follow in the Asana server (our reference implementation), and the checklist before you open a PR.",
    },
    {
      type: "diagram",
      title: "Package internal architecture",
      code: `packages/my-service/
├── src/
│   ├── index.ts           ← McpServer + stdio transport
│   ├── client.ts          ← Vendor REST client (fetch + types)
│   ├── verify.ts          ← Live API smoke test
│   └── mcp/
│       ├── catalog.ts     ← Tool/prompt name lists
│       ├── helpers.ts     ← json(), toolError()
│       ├── tools.ts       ← server.registerTool(...)
│       ├── prompts.ts     ← server.registerPrompt(...)
│       └── resources.ts   ← server.registerResource(...)
├── demo/                  ← VHS GIF + verify recording
├── .env.example
└── README.md`,
    },
    {
      type: "diagram",
      title: "Tool call lifecycle",
      code: `Agent calls tool
      │
      ▼
┌─────────────┐    validate     ┌──────────────┐
│ registerTool│ ──────────────► │ Zod schema   │
│ handler     │                 └──────┬───────┘
└──────┬──────┘                        │
       │                               ▼
       │                        ┌──────────────┐
       └──────────────────────► │ client.ts    │──► Vendor API
                                │ HTTP request │
                                └──────┬───────┘
                                       │
                                       ▼
                                JSON text content
                                returned to agent`,
    },
    { type: "h2", text: "Quick start" },
    {
      type: "code",
      language: "bash",
      code: `# From monorepo root
cp -r packages/_template packages/my-service
cd packages/my-service

# Set credentials
cp .env.example .env
# edit .env

pnpm install
pnpm build
pnpm verify`,
    },
    { type: "h2", text: "Implementing the REST client" },
    {
      type: "p",
      text: "client.ts wraps the vendor API with typed methods. Keep HTTP logic here — tools should be thin handlers that validate input, call the client, and format JSON responses.",
    },
    {
      type: "code",
      language: "typescript",
      code: `export class MyServiceClient {
  constructor(private readonly token: string) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(\`https://api.vendor.com\${path}\`, {
      ...init,
      headers: {
        Authorization: \`Bearer \${this.token}\`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new MyServiceError(res.status, await res.text());
    return res.json() as T;
  }

  async listItems(): Promise<Item[]> { /* ... */ }
}`,
    },
    { type: "h2", text: "Registering tools" },
    {
      type: "p",
      text: "Use server.registerTool with a Zod inputSchema. Name tools with a consistent prefix: myservice_list_projects, myservice_create_task.",
    },
    {
      type: "ul",
      items: [
        "Start with read tools: list, get, search",
        "Add write tools: create, update, delete",
        "Return { content: [{ type: 'text', text: JSON.stringify(data) }] }",
        "Catch errors and return structured toolError responses",
      ],
    },
    { type: "h2", text: "Prompts and resources" },
    {
      type: "p",
      text: "MCP prompts are workflow templates the client can invoke — they return messages that instruct the agent which tools to call. See packages/asana/src/mcp/prompts.ts for 18 examples like daily_focus_plan and project_health_scan.",
    },
    {
      type: "p",
      text: "MCP resources let agents browse structured data via URIs. The Asana server uses asana://workspace/{gid}/projects and similar templates with list/complete callbacks.",
    },
    { type: "h2", text: "Verification script" },
    {
      type: "p",
      text: "verify.ts must hit the real API: authenticate, create a test resource, read it back, optionally clean up. This becomes your demo GIF source material.",
    },
    {
      type: "image",
      src: "demo/asana-npm-install.gif",
      alt: "npm install and MCP smoke test demo",
      caption: "Record demos with VHS — npm install + tools/list smoke test.",
    },
    { type: "h2", text: "PR checklist" },
    {
      type: "ol",
      items: [
        "pnpm build passes in the new package",
        "pnpm verify passes with real credentials (document in README)",
        "README: install, env vars, MCP config snippet, tool list",
        ".env.example with all required keys",
        "No secrets committed",
        "Entry added to site/src/data/servers.ts",
        "Root README server table updated",
        "Optional: VHS demo GIF in demo/ and site/public/demo/",
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "One server per PR",
      text: "Keep reviews focused. A single integration per pull request makes it easier to validate API coverage and security.",
    },
    { type: "h2", text: "Publishing to npm" },
    {
      type: "p",
      text: "Packages publish under @mcp-wormhole on npm. Bump version in package.json, build, and publish with npm publish --access public --otp=YOUR_CODE. See CONTRIBUTING.md for GitHub Actions workflow details.",
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "Building an MCP server in mcp-wormhole is straightforward: REST client, Zod-validated tools, optional prompts and resources, real verification. The Asana package at v0.2.0 is the reference — copy its patterns, not its vendor logic.",
    },
    {
      type: "p",
      text: "Pick a vendor on the roadmap, open an issue to claim it, and ship a PR. The next portal to your tools might be yours.",
    },
  ],
};
