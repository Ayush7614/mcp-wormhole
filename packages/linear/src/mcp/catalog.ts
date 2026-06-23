/** Canonical tool names — keep in sync with registerLinearTools. */
export const LINEAR_TOOL_NAMES = [
  "linear_get_viewer",
  "linear_list_teams",
  "linear_get_team",
  "linear_list_users",
  "linear_list_projects",
  "linear_list_workflow_states",
  "linear_list_labels",
  "linear_list_issues",
  "linear_get_issue",
  "linear_search_issues",
  "linear_create_issue",
  "linear_update_issue",
  "linear_add_comment",
  "linear_list_comments",
] as const;

export const LINEAR_PROMPT_NAMES = [
  "my_assigned_issues",
  "sprint_board_overview",
  "issue_triage",
  "blocked_issues_scan",
  "create_bug_report",
  "release_readiness_issues",
] as const;

export const LINEAR_RESOURCE_URIS = [
  "linear://catalog",
  "linear://teams",
  "linear://team/{team_id}/issues",
  "linear://issue/{issue_id}",
] as const;

export const LINEAR_TOOL_COUNT = LINEAR_TOOL_NAMES.length;
export const LINEAR_PROMPT_COUNT = LINEAR_PROMPT_NAMES.length;
export const LINEAR_RESOURCE_TEMPLATE_COUNT = LINEAR_RESOURCE_URIS.length;
