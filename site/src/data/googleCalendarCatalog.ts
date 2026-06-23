/** Site catalog — mirrors packages/google-calendar/src/mcp/catalog.ts */
export const GCAL_TOOL_NAMES = [
  "gcal_list_calendars",
  "gcal_get_calendar",
  "gcal_list_events",
  "gcal_get_event",
  "gcal_create_event",
  "gcal_update_event",
  "gcal_delete_event",
  "gcal_search_events",
  "gcal_find_free_slots",
  "gcal_quick_add_event",
  "gcal_list_upcoming_events",
  "gcal_rsvp_event",
] as const;

export const GCAL_PROMPT_COUNT = 6;
export const GCAL_RESOURCE_TEMPLATE_COUNT = 4;

export const GCAL_TOOL_COUNT = GCAL_TOOL_NAMES.length;

export function googleCalendarServerDescription(): string {
  return `Full-stack Google Calendar MCP — ${GCAL_TOOL_COUNT} tools, ${GCAL_PROMPT_COUNT} prompt workflows, and ${GCAL_RESOURCE_TEMPLATE_COUNT} browsable resources.`;
}

export function googleCalendarToolSummary(): string {
  return `${GCAL_TOOL_COUNT} tools · ${GCAL_PROMPT_COUNT} prompts · ${GCAL_RESOURCE_TEMPLATE_COUNT} resources`;
}
