/** Canonical tool names — keep in sync with registerVercelTools. */
export const VERCEL_TOOL_NAMES = [
  "vercel_get_user",
  "vercel_list_teams",
  "vercel_get_team",
  "vercel_list_projects",
  "vercel_get_project",
  "vercel_list_deployments",
  "vercel_list_failed_deployments",
  "vercel_get_latest_production_deployment",
  "vercel_get_deployment",
  "vercel_get_deployment_events",
  "vercel_list_project_domains",
  "vercel_list_env_vars",
  "vercel_create_env_var",
  "vercel_update_env_var",
  "vercel_delete_env_var",
  "vercel_promote",
  "vercel_rollback",
  "vercel_cancel_deployment",
] as const;

export const VERCEL_PROMPT_NAMES = [
  "deployment_health_check",
  "failed_deploy_triage",
  "production_rollback_plan",
  "project_status_snapshot",
  "build_log_analysis",
  "rollback_candidate_review",
  "release_readiness_check",
  "domain_audit",
] as const;

export const VERCEL_RESOURCE_URIS = [
  "vercel://catalog",
  "vercel://projects",
  "vercel://project/{project_id}",
  "vercel://project/{project_id}/deployments",
  "vercel://deployment/{deployment_id}",
] as const;

export const VERCEL_TOOL_COUNT = VERCEL_TOOL_NAMES.length;
export const VERCEL_PROMPT_COUNT = VERCEL_PROMPT_NAMES.length;
export const VERCEL_RESOURCE_TEMPLATE_COUNT = VERCEL_RESOURCE_URIS.length;
