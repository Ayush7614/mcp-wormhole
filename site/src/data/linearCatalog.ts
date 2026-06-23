/** Site catalog — mirrors packages/linear/src/mcp/catalog.ts */
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

export const LINEAR_PROMPT_COUNT = 6;
export const LINEAR_RESOURCE_TEMPLATE_COUNT = 4;

export const LINEAR_TOOL_COUNT = LINEAR_TOOL_NAMES.length;

export function linearServerDescription(): string {
  return `Full-stack Linear MCP — ${LINEAR_TOOL_COUNT} tools, ${LINEAR_PROMPT_COUNT} prompt workflows, and ${LINEAR_RESOURCE_TEMPLATE_COUNT} browsable resources.`;
}

export function linearToolSummary(): string {
  return `${LINEAR_TOOL_COUNT} tools · ${LINEAR_PROMPT_COUNT} prompts · ${LINEAR_RESOURCE_TEMPLATE_COUNT} resources`;
}
