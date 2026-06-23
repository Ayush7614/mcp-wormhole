/** Canonical tool names — keep in sync with registerGoogleCalendarTools. */
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

export const GCAL_PROMPT_NAMES = [
  "today_agenda",
  "week_ahead_overview",
  "meeting_prep_brief",
  "find_meeting_time",
  "scheduling_conflict_scan",
  "focus_time_planner",
] as const;

export const GCAL_RESOURCE_URIS = [
  "gcal://catalog",
  "gcal://calendars",
  "gcal://calendar/{calendar_id}",
  "gcal://calendar/{calendar_id}/events",
] as const;

export const GCAL_TOOL_COUNT = GCAL_TOOL_NAMES.length;
export const GCAL_PROMPT_COUNT = GCAL_PROMPT_NAMES.length;
export const GCAL_RESOURCE_TEMPLATE_COUNT = GCAL_RESOURCE_URIS.length;
