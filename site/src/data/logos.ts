/** Local bundled logos — avoids CDN failures on GitHub Pages. */
export const integrationLogos: Record<string, string> = {
  cursor: "logos/cursor.svg",
  vscode: "logos/vscode.svg",
  "claude-desktop": "logos/anthropic.svg",
  "claude-code": "logos/anthropic.svg",
  "claude-agents-sdk": "logos/anthropic.svg",
  chatgpt: "logos/openai.svg",
  codex: "logos/codex.svg",
  "openai-agents-sdk": "logos/openai.svg",
  windsurf: "logos/windsurf.svg",
  opencode: "logos/opencode.svg",
  zed: "logos/zed.svg",
  cli: "logos/mcp-inspector.svg",
  langchain: "logos/langchain.svg",
  llamaindex: "logos/llamaindex.svg",
  crewai: "logos/crewai.svg",
  mastra: "logos/mastra.svg",
  "ai-sdk": "logos/vercel.svg",
  "google-adk": "logos/google.svg",
  kimi: "logos/moonshotai.svg",
  openclaw: "logos/openclaw.svg",
};

export function logoUrl(integrationId: string): string {
  const path = integrationLogos[integrationId] ?? "logos/modelcontextprotocol.svg";
  return `${import.meta.env.BASE_URL}${path}`;
}
