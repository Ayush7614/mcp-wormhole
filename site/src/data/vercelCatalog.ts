/** Site catalog — mirrors packages/vercel/src/mcp/catalog.ts */
export const VERCEL_TOOL_NAMES = [
  "vercel_get_user",
  "vercel_list_teams",
  "vercel_list_projects",
  "vercel_get_project",
  "vercel_list_deployments",
  "vercel_get_deployment",
  "vercel_get_deployment_events",
  "vercel_list_project_domains",
  "vercel_promote",
  "vercel_rollback",
  "vercel_cancel_deployment",
] as const;

export const VERCEL_TOOL_COUNT = VERCEL_TOOL_NAMES.length;

export function vercelServerDescription(): string {
  return `Vercel MCP — ${VERCEL_TOOL_COUNT} tools for deployments, build logs, promote, rollback, and project status.`;
}

export function vercelToolSummary(): string {
  return `${VERCEL_TOOL_COUNT} tools`;
}
