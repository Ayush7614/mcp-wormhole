import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { GoogleCalendarClient } from "../client.js";
import { json, ok, toolError } from "./helpers.js";

const calendarId = z.string().optional().describe("Calendar ID (defaults to GOOGLE_CALENDAR_ID or primary).");
const eventId = z.string().describe("Google Calendar event ID.");
const maxResults = z.number().int().min(1).max(250).optional();
const isoDateTime = z.string().describe("ISO 8601 datetime (e.g. 2026-06-23T09:00:00Z).");

function wrap(client: GoogleCalendarClient, fn: () => Promise<unknown>) {
  return async () => {
    try {
      return json(await fn());
    } catch (error) {
      return toolError(error);
    }
  };
}

export function registerGoogleCalendarTools(server: McpServer, client: GoogleCalendarClient) {
  server.registerTool(
    "gcal_list_calendars",
    {
      title: "List calendars",
      description: "All calendars accessible to the authenticated account.",
      inputSchema: { max_results: maxResults.describe("Max calendars (default 50).") },
    },
    async ({ max_results }) => {
      try {
        return json({ calendars: await client.listCalendars(max_results ?? 50) });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "gcal_get_calendar",
    {
      title: "Get calendar",
      description: "Calendar metadata by ID.",
      inputSchema: { calendar_id: z.string().describe("Calendar ID.") },
    },
    async ({ calendar_id }) => wrap(client, () => client.getCalendar(calendar_id))(),
  );

  server.registerTool(
    "gcal_list_events",
    {
      title: "List events",
      description: "Events in a calendar, optionally filtered by time range or search query.",
      inputSchema: {
        calendar_id: calendarId,
        time_min: isoDateTime.optional(),
        time_max: isoDateTime.optional(),
        max_results: maxResults.describe("Max events (default 25)."),
        q: z.string().optional().describe("Free-text search query."),
      },
    },
    async ({ calendar_id, time_min, time_max, max_results, q }) => {
      try {
        return json({
          events: await client.listEvents({
            calendarId: calendar_id,
            timeMin: time_min,
            timeMax: time_max,
            maxResults: max_results ?? 25,
            q,
          }),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "gcal_get_event",
    {
      title: "Get event",
      description: "Full event record by ID.",
      inputSchema: { calendar_id: calendarId, event_id: eventId },
    },
    async ({ calendar_id, event_id }) => wrap(client, () => client.getEvent(calendar_id, event_id))(),
  );

  server.registerTool(
    "gcal_create_event",
    {
      title: "Create event",
      description: "Create a calendar event with summary, times, attendees, and location.",
      inputSchema: {
        calendar_id: calendarId,
        summary: z.string().describe("Event title."),
        description: z.string().optional(),
        location: z.string().optional(),
        start: isoDateTime.describe("Start time (dateTime)."),
        end: isoDateTime.describe("End time (dateTime)."),
        time_zone: z.string().optional().describe("IANA timezone (e.g. America/Los_Angeles)."),
        attendees: z.array(z.string().email()).optional().describe("Attendee email addresses."),
      },
    },
    async ({ calendar_id, summary, description, location, start, end, time_zone, attendees }) => {
      try {
        const event = await client.createEvent(calendar_id, {
          summary,
          description,
          location,
          start: { dateTime: start, timeZone: time_zone },
          end: { dateTime: end, timeZone: time_zone },
          attendees: attendees?.map((email) => ({ email })),
        });
        return ok("Event created", { event });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "gcal_update_event",
    {
      title: "Update event",
      description: "Patch an existing event — only provided fields are updated.",
      inputSchema: {
        calendar_id: calendarId,
        event_id: eventId,
        summary: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        start: isoDateTime.optional(),
        end: isoDateTime.optional(),
        time_zone: z.string().optional(),
      },
    },
    async ({ calendar_id, event_id, summary, description, location, start, end, time_zone }) => {
      try {
        const patch: Record<string, unknown> = {};
        if (summary !== undefined) patch.summary = summary;
        if (description !== undefined) patch.description = description;
        if (location !== undefined) patch.location = location;
        if (start !== undefined) patch.start = { dateTime: start, timeZone: time_zone };
        if (end !== undefined) patch.end = { dateTime: end, timeZone: time_zone };

        const event = await client.updateEvent(calendar_id, event_id, patch);
        return ok("Event updated", { event });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "gcal_delete_event",
    {
      title: "Delete event",
      description: "Permanently delete an event.",
      inputSchema: { calendar_id: calendarId, event_id: eventId },
    },
    async ({ calendar_id, event_id }) => {
      try {
        await client.deleteEvent(calendar_id, event_id);
        return ok("Event deleted", { event_id });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "gcal_search_events",
    {
      title: "Search events",
      description: "Search events by free-text query across a calendar.",
      inputSchema: {
        calendar_id: calendarId,
        query: z.string().describe("Search query."),
        max_results: maxResults.describe("Max results (default 25)."),
      },
    },
    async ({ calendar_id, query, max_results }) => {
      try {
        return json({
          events: await client.searchEvents(calendar_id, query, max_results ?? 25),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "gcal_find_free_slots",
    {
      title: "Find free/busy slots",
      description: "Query free/busy information for one or more calendars in a time window.",
      inputSchema: {
        calendar_ids: z.array(z.string()).min(1).describe("Calendar IDs to check."),
        time_min: isoDateTime,
        time_max: isoDateTime,
        time_zone: z.string().optional(),
      },
    },
    async ({ calendar_ids, time_min, time_max, time_zone }) =>
      wrap(client, () =>
        client.findFreeSlots({
          calendarIds: calendar_ids,
          timeMin: time_min,
          timeMax: time_max,
          timeZone: time_zone,
        }),
      )(),
  );

  server.registerTool(
    "gcal_quick_add_event",
    {
      title: "Quick add event",
      description: "Create an event using natural language (Google quick-add syntax).",
      inputSchema: {
        calendar_id: calendarId,
        text: z.string().describe('Natural language event, e.g. "Lunch with Alex tomorrow at noon".'),
      },
    },
    async ({ calendar_id, text }) => {
      try {
        const event = await client.quickAddEvent(calendar_id, text);
        return ok("Event created via quick add", { event });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "gcal_list_upcoming_events",
    {
      title: "List upcoming events",
      description: "Next events starting from now on the default or specified calendar.",
      inputSchema: {
        calendar_id: calendarId,
        max_results: maxResults.describe("Max events (default 10)."),
      },
    },
    async ({ calendar_id, max_results }) => {
      try {
        return json({
          events: await client.listUpcomingEvents(calendar_id, max_results ?? 10),
        });
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerTool(
    "gcal_rsvp_event",
    {
      title: "RSVP to event",
      description: "Accept, decline, or mark tentative for a meeting invitation.",
      inputSchema: {
        calendar_id: calendarId,
        event_id: eventId,
        response_status: z.enum(["accepted", "declined", "tentative"]),
        attendee_email: z.string().email().optional().describe("Your email if not the organizer."),
      },
    },
    async ({ calendar_id, event_id, response_status, attendee_email }) => {
      try {
        const event = await client.rsvpEvent(
          calendar_id,
          event_id,
          response_status,
          attendee_email,
        );
        return ok("RSVP updated", { event });
      } catch (error) {
        return toolError(error);
      }
    },
  );
}
