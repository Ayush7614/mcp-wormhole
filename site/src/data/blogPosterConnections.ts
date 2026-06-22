import type { BlogPosterConnection } from "./blogTypes";

/** Introducing post — agents orbit the wormhole, no vendor tool card */
export const wormholeHubConnection: BlogPosterConnection = {
  layout: "hub",
  agents: [
    { logo: "logos/cursor.svg", label: "Cursor", position: "left" },
    { logo: "logos/anthropic.svg", label: "Claude", position: "top" },
    { logo: "logos/openai.svg", label: "ChatGPT", position: "right" },
    { logo: "logos/vscode.svg", label: "VS Code", position: "bottom" },
  ],
};

/** Cursor + Asana tutorial — client flows through wormhole to Asana */
export const asanaCursorFlow: BlogPosterConnection = {
  layout: "flow",
  clientLogo: "logos/cursor.svg",
  end: {
    toolName: "Asana",
    toolLogo: "logos/asana.svg",
    toolDesc: "Connect Cursor to @mcp-wormhole/asana — list tasks, create work, search projects via MCP.",
    authBadges: [
      { label: "PAT", variant: "pat" },
      { label: "NPX", variant: "npx" },
    ],
    cardStats: [
      { value: "66", label: "TOOLS" },
      { value: "5 min", label: "SETUP" },
    ],
  },
};

/** Cursor + Vercel tutorial — client flows through wormhole to Vercel */
export const vercelCursorFlow: BlogPosterConnection = {
  layout: "flow",
  clientLogo: "logos/cursor.svg",
  end: {
    toolName: "Vercel",
    toolLogo: "logos/vercel.png",
    toolDesc: "Connect Cursor to @mcp-wormhole/vercel — list deployments, read build logs, promote and rollback via MCP.",
    authBadges: [
      { label: "API", variant: "pat" },
      { label: "NPX", variant: "npx" },
    ],
    cardStats: [
      { value: "18", label: "TOOLS" },
      { value: "5 min", label: "SETUP" },
    ],
  },
};

/** Contributor guide — CLI template through wormhole to npm */
export const buildServerFlow: BlogPosterConnection = {
  layout: "flow",
  clientLogo: "logos/cli.svg",
  end: {
    toolName: "npm",
    toolLogo: "logos/modelcontextprotocol.svg",
    toolDesc: "Copy packages/_template, implement tools, verify live API, publish under @mcp-wormhole.",
    authBadges: [
      { label: "ZOD", variant: "zod" },
      { label: "STDIO", variant: "stdio" },
    ],
    cardStats: [
      { value: "1", label: "TEMPLATE" },
      { value: "TS", label: "SDK" },
    ],
  },
};

/** Asana deep dive — Asana through wormhole to full Asana MCP */
export const asanaDeepFlow: BlogPosterConnection = {
  layout: "flow",
  clientLogo: "logos/asana.svg",
  end: {
    toolName: "Asana MCP",
    toolLogo: "logos/asana.svg",
    toolDesc: "66 tools, 18 prompts, 7 asana:// resources — tasks, projects, goals, time tracking.",
    authBadges: [
      { label: "PAT", variant: "pat" },
      { label: "LIVE", variant: "live" },
    ],
    cardStats: [
      { value: "66", label: "TOOLS" },
      { value: "18", label: "PROMPTS" },
    ],
  },
};

/** Vercel deep dive — Vercel through wormhole to full Vercel MCP */
export const vercelDeepFlow: BlogPosterConnection = {
  layout: "flow",
  clientLogo: "logos/vercel.png",
  end: {
    toolName: "Vercel MCP",
    toolLogo: "logos/vercel.png",
    toolDesc: "18 tools, 8 prompts, 5 vercel:// resources — deployments, logs, env vars, rollback.",
    authBadges: [
      { label: "API", variant: "pat" },
      { label: "LIVE", variant: "live" },
    ],
    cardStats: [
      { value: "18", label: "TOOLS" },
      { value: "8", label: "PROMPTS" },
    ],
  },
};

/** Contributor hub — dev agents around wormhole */
export const buildHubConnection: BlogPosterConnection = {
  layout: "hub",
  agents: [
    { logo: "logos/cli.svg", label: "CLI", position: "left" },
    { logo: "logos/modelcontextprotocol.svg", label: "MCP SDK", position: "top" },
    { logo: "logos/vscode.svg", label: "TypeScript", position: "right" },
    { logo: "logos/vercel.png", label: "npm", position: "bottom" },
  ],
};
