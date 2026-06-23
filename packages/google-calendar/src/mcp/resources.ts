import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GoogleCalendarClient } from "../client.js";
import {
  GCAL_PROMPT_NAMES,
  GCAL_RESOURCE_URIS,
  GCAL_TOOL_NAMES,
} from "./catalog.js";

function textResource(uri: string, data: unknown) {
  return {
    contents: [
      {
        uri,
        mimeType: "application/json",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function param(value: string | string[]): string {
  return Array.isArray(value) ? value[0]! : value;
}

export function registerGoogleCalendarResources(
  server: McpServer,
  client: GoogleCalendarClient,
) {
  server.registerResource(
    "gcal_catalog",
    "gcal://catalog",
    {
      title: "Google Calendar MCP catalog",
      description: "Tool, prompt, and resource index for mcp-wormhole Google Calendar.",
      mimeType: "application/json",
    },
    async (uri) =>
      textResource(uri.href, {
        server: "mcp-wormhole-google-calendar",
        tools: GCAL_TOOL_NAMES.length,
        tool_names: GCAL_TOOL_NAMES,
        prompts: GCAL_PROMPT_NAMES.length,
        prompt_names: GCAL_PROMPT_NAMES,
        resource_templates: GCAL_RESOURCE_URIS,
      }),
  );

  server.registerResource(
    "gcal_calendars",
    "gcal://calendars",
    {
      title: "All calendars",
      description: "Browse calendars accessible to the authenticated account.",
      mimeType: "application/json",
    },
    async (uri) => textResource(uri.href, { calendars: await client.listCalendars(50) }),
  );

  server.registerResource(
    "gcal_calendar",
    new ResourceTemplate("gcal://calendar/{calendar_id}", {
      list: async () => {
        const calendars = await client.listCalendars(50);
        return {
          resources: calendars.map((c) => ({
            uri: `gcal://calendar/${c.id}`,
            name: c.summary,
            mimeType: "application/json",
          })),
        };
      },
      complete: {
        calendar_id: async () => (await client.listCalendars(50)).map((c) => c.id),
      },
    }),
    {
      title: "Calendar",
      description: "Calendar metadata and navigation links.",
      mimeType: "application/json",
    },
    async (uri, { calendar_id }) => {
      const id = param(calendar_id);
      const calendar = await client.getCalendar(id);
      return textResource(uri.href, {
        calendar_id: id,
        calendar,
        browse: {
          events: `gcal://calendar/${id}/events`,
        },
      });
    },
  );

  server.registerResource(
    "gcal_calendar_events",
    new ResourceTemplate("gcal://calendar/{calendar_id}/events", {
      list: undefined,
      complete: {
        calendar_id: async () => (await client.listCalendars(50)).map((c) => c.id),
      },
    }),
    {
      title: "Calendar events",
      description: "Upcoming events for a calendar.",
      mimeType: "application/json",
    },
    async (uri, { calendar_id }) => {
      const id = param(calendar_id);
      const events = await client.listUpcomingEvents(id, 25);
      return textResource(uri.href, { calendar_id: id, events });
    },
  );
}
