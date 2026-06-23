import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { GoogleCalendarClient } from "../client.js";

const calendarArg = {
  calendar_id: z.string().optional().describe("Calendar ID (default: primary)."),
};

function userMessage(text: string) {
  return { role: "user" as const, content: { type: "text" as const, text } };
}

export function registerGoogleCalendarPrompts(server: McpServer, _client: GoogleCalendarClient) {
  server.registerPrompt(
    "today_agenda",
    {
      title: "Today's agenda",
      description: "Summarize today's calendar events with times and prep notes.",
      argsSchema: calendarArg,
    },
    async ({ calendar_id }) => {
      const cal = calendar_id ?? "primary";
      const today = new Date().toISOString().slice(0, 10);
      return {
        messages: [
          userMessage(
            `For calendar ${cal}: call gcal_list_events with time_min ${today}T00:00:00Z and time_max ${today}T23:59:59Z. Output a chronological agenda with start time, title, location, and any prep actions.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "week_ahead_overview",
    {
      title: "Week ahead overview",
      description: "Overview of the next 7 days — key meetings, conflicts, and focus blocks.",
      argsSchema: calendarArg,
    },
    async ({ calendar_id }) => {
      const cal = calendar_id ?? "primary";
      const start = new Date().toISOString();
      const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      return {
        messages: [
          userMessage(
            `For calendar ${cal}: call gcal_list_events from ${start} to ${end}. Group by day. Flag back-to-back meetings, long gaps, and anything that looks like a conflict.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "meeting_prep_brief",
    {
      title: "Meeting prep brief",
      description: "Brief for a specific upcoming event — attendees, agenda hints, logistics.",
      argsSchema: {
        ...calendarArg,
        event_id: z.string().describe("Event ID to brief."),
      },
    },
    async ({ calendar_id, event_id }) => {
      return {
        messages: [
          userMessage(
            `Call gcal_get_event for event ${event_id} on calendar ${calendar_id ?? "primary"}. Produce a prep brief: time, attendees, location/video link, description highlights, and suggested talking points.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "find_meeting_time",
    {
      title: "Find meeting time",
      description: "Find mutual free slots across calendars for scheduling.",
      argsSchema: {
        calendar_ids: z.array(z.string()).min(1).describe("Calendars to check for availability."),
        duration_minutes: z.number().int().min(15).max(480).optional(),
      },
    },
    async ({ calendar_ids, duration_minutes }) => {
      const start = new Date().toISOString();
      const end = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
      const duration = duration_minutes ?? 30;
      return {
        messages: [
          userMessage(
            `Call gcal_find_free_slots for calendars ${calendar_ids.join(", ")} between ${start} and ${end}. Suggest ${duration}-minute meeting slots during business hours, ranked by convenience.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "scheduling_conflict_scan",
    {
      title: "Scheduling conflict scan",
      description: "Detect overlapping events and tight turnarounds in a date range.",
      argsSchema: {
        ...calendarArg,
        days: z.number().int().min(1).max(14).optional(),
      },
    },
    async ({ calendar_id, days }) => {
      const n = days ?? 3;
      const start = new Date().toISOString();
      const end = new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();
      return {
        messages: [
          userMessage(
            `For calendar ${calendar_id ?? "primary"}: list events from ${start} to ${end}. Identify overlaps, meetings with <15 min gaps, and events missing locations or video links.`,
          ),
        ],
      };
    },
  );

  server.registerPrompt(
    "focus_time_planner",
    {
      title: "Focus time planner",
      description: "Suggest open blocks for deep work based on free/busy data.",
      argsSchema: calendarArg,
    },
    async ({ calendar_id }) => {
      const cal = calendar_id ?? "primary";
      const start = new Date().toISOString();
      const end = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      return {
        messages: [
          userMessage(
            `Call gcal_find_free_slots for calendar ${cal} between ${start} and ${end}. Recommend 2–3 focus blocks of at least 90 minutes during weekday business hours. Avoid lunch hour.`,
          ),
        ],
      };
    },
  );
}
