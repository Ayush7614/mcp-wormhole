/** Canonical tool names — keep in sync with registerVercelTools. */
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
