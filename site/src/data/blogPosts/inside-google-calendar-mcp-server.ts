import type { BlogPost } from "../blogTypes";
import { googleCalendarDeepFlow } from "../blogPosterConnections";

export const insideGoogleCalendarMcpServer: BlogPost = {
  slug: "inside-google-calendar-mcp-server",
  title: "Inside @mcp-wormhole/google-calendar: 12 tools, 6 prompts, and browsable resources",
  excerpt:
    "Deep dive into the Google Calendar MCP server — architecture, scheduling tools, prompt workflows, gcal:// resources, and live API verification.",
  date: "2026-06-24",
  author: "Ayush Kumar",
  tags: ["google-calendar", "mcp", "deep-dive", "scheduling"],
  readTime: "12 min",
  poster: {
    posterAsset: "demo/posters/poster-inside-google-calendar-mcp.gif",
    eyebrow: "BLOG / DEEP DIVE",
    headline: "Inside Google Calendar MCP Server",
    tagline:
      "12 tools, 6 prompt workflows, and browsable gcal:// resources — events, free/busy, search, RSVP.",
    badge: "v0.1.0 LIVE",
    connection: googleCalendarDeepFlow,
    stats: [
      { value: "12", label: "Tools" },
      { value: "6", label: "Prompts" },
      { value: "4", label: "Resources" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "@mcp-wormhole/google-calendar@0.1.0 exposes 12 MCP tools, 6 prompt workflows, and 4 gcal:// resource templates.",
        "Architecture: index.ts → mcp/{tools,prompts,resources}.ts → GoogleCalendarClient → Google Calendar API v3.",
        "Tools cover calendars, events, search, free/busy, quick-add, upcoming list, and RSVP.",
        "Prompts like today_agenda and find_meeting_time guide multi-step agent scheduling workflows.",
        "Run pnpm verify in packages/google-calendar to smoke-test against your real Google account.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "Scheduling is where agents hit real-world friction — OAuth is harder than a PAT, time zones matter, and free/busy logic is easy to get wrong. The Google Calendar server wraps the official Calendar API v3 as MCP tools, prompts, and browsable gcal:// resources so any client can read and write calendars without custom glue code.",
    },
    {
      type: "diagram",
      title: "Server architecture",
      code: `┌─────────────────────────────────────────────────────────────────┐
│  index.ts                                                       │
│  McpServer + StdioServerTransport                               │
│  GOOGLE_CALENDAR_CREDENTIALS → GoogleCalendarClient             │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│  mcp/tools.ts   │ │ mcp/prompts.ts  │ │ mcp/resources.ts    │
│  12 registerTool│ │ 6 registerPrompt│ │ 4 resource templates│
│  Zod schemas    │ │ workflow msgs   │ │ gcal:// URIs        │
└────────┬────────┘ └────────┬────────┘ └──────────┬──────────┘
         │                   │                     │
         └───────────────────┼─────────────────────┘
                             ▼
                  ┌─────────────────────┐
                  │  client.ts          │
                  │  GoogleCalendarClient│
                  │  OAuth2 / SA auth   │
                  └──────────┬──────────┘
                             │ HTTPS
                             ▼
                  ┌─────────────────────┐
                  │  calendar.googleapis│
                  │  .com/v3            │
                  └─────────────────────┘`,
    },
    { type: "h2", text: "Getting started" },
    {
      type: "code",
      language: "json",
      code: `{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/google-calendar"],
      "env": {
        "GOOGLE_CALENDAR_CREDENTIALS": "{\\"client_id\\":\\"...\\",\\"client_secret\\":\\"...\\",\\"refresh_token\\":\\"...\\"}"
      }
    }
  }
}`,
    },
    {
      type: "callout",
      variant: "info",
      title: "Environment variables",
      text: "GOOGLE_CALENDAR_CREDENTIALS is required — OAuth refresh JSON or service account JSON. Optional: GOOGLE_CALENDAR_ID (defaults to primary).",
    },
    { type: "h2", text: "The 12 tools — by category" },
    { type: "h3", text: "Calendars" },
    {
      type: "ul",
      items: [
        "gcal_list_calendars — all calendars for the authenticated account",
        "gcal_get_calendar — metadata for a single calendar ID",
      ],
    },
    { type: "h3", text: "Events" },
    {
      type: "ul",
      items: [
        "gcal_list_events — time-range and text search within a calendar",
        "gcal_get_event — full event record by ID",
        "gcal_create_event — structured create with title, times, attendees",
        "gcal_update_event — patch fields on an existing event",
        "gcal_delete_event — remove an event",
        "gcal_search_events — free-text search across events",
        "gcal_list_upcoming_events — next N events from now",
        "gcal_quick_add_event — natural-language quick add (Google's parser)",
      ],
    },
    { type: "h3", text: "Scheduling" },
    {
      type: "ul",
      items: [
        "gcal_find_free_slots — busy blocks and gaps across one or more calendars",
        "gcal_rsvp_event — accept, decline, or tentative on an invite",
      ],
    },
    { type: "h2", text: "6 MCP prompt workflows" },
    {
      type: "ul",
      items: [
        "today_agenda — chronological summary of today's events with prep notes",
        "week_ahead_overview — next 7 days with conflicts and focus gaps",
        "meeting_prep_brief — prep brief for a specific upcoming event",
        "find_meeting_time — mutual free slots across calendars for scheduling",
        "scheduling_conflict_scan — back-to-back meetings and tight turnarounds",
        "focus_time_planner — suggest deep-work blocks in open calendar gaps",
      ],
    },
    { type: "h2", text: "Browsable gcal:// resources" },
    {
      type: "ul",
      items: [
        "gcal://catalog — tool, prompt, and resource index",
        "gcal://calendars — all accessible calendars",
        "gcal://calendar/{calendar_id} — calendar detail",
        "gcal://calendar/{calendar_id}/events — upcoming events for a calendar",
      ],
    },
    { type: "h2", text: "Verification against the live API" },
    {
      type: "image",
      src: "demo/google-calendar-verify.gif",
      alt: "Live Google Calendar API verification recording",
      caption: "pnpm verify — real OAuth credentials, real Calendar API calls.",
    },
    {
      type: "code",
      language: "bash",
      code: `cd packages/google-calendar
cp .env.example .env   # add GOOGLE_CALENDAR_CREDENTIALS
pnpm verify

# Optional Q&A smoke test
node scripts/calendar-qa.mjs`,
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "@mcp-wormhole/google-calendar brings scheduling intelligence to any MCP client. Install with npx, paste your OAuth JSON, and give your agent real access to calendars, events, and free/busy — the same mcp-wormhole patterns as Asana and Vercel, tuned for how people actually manage time.",
    },
  ],
};
