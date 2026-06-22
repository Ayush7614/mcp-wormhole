import type { BlogPosterConnection } from "./blogTypes";

export const asanaConnection: BlogPosterConnection = {
  clientLogo: "logos/cursor.svg",
  toolName: "Asana",
  toolLogo: "logos/asana.svg",
  toolDesc:
    "Work management for fast-moving teams. Create tasks, manage projects, and track goals through natural language.",
  authBadges: [
    { label: "PAT", variant: "pat" },
    { label: "STDIO", variant: "stdio" },
  ],
  cardStats: [
    { value: "66", label: "TOOLS" },
    { value: "18", label: "PROMPTS" },
  ],
};

export const asanaCursorConnection: BlogPosterConnection = {
  clientLogo: "logos/cursor.svg",
  toolName: "Asana",
  toolLogo: "logos/asana.svg",
  toolDesc:
    "Securely connect Cursor to Asana with @mcp-wormhole/asana — 66 tools, zero proxy, runs locally.",
  authBadges: [
    { label: "PAT", variant: "pat" },
    { label: "NPX", variant: "npx" },
  ],
  cardStats: [
    { value: "66", label: "TOOLS" },
    { value: "18", label: "PROMPTS" },
  ],
};

export const npmConnection: BlogPosterConnection = {
  clientLogo: "logos/cli.svg",
  toolName: "npm",
  toolLogo: "logos/modelcontextprotocol.svg",
  toolDesc: "TypeScript + Zod + MCP SDK. One package per server under @mcp-wormhole on npm.",
  authBadges: [
    { label: "ZOD", variant: "zod" },
    { label: "STDIO", variant: "stdio" },
  ],
  cardStats: [
    { value: "1", label: "TEMPLATE" },
    { value: "66", label: "REFERENCE" },
  ],
};

export const asanaDeepConnection: BlogPosterConnection = {
  clientLogo: "logos/anthropic.svg",
  toolName: "Asana",
  toolLogo: "logos/asana.svg",
  toolDesc:
    "Tasks, projects, portfolios, goals, dependencies, tags, time tracking — all exposed as MCP tools.",
  authBadges: [
    { label: "PAT", variant: "pat" },
    { label: "LIVE API", variant: "live" },
  ],
  cardStats: [
    { value: "66", label: "TOOLS" },
    { value: "7", label: "RESOURCES" },
  ],
};
