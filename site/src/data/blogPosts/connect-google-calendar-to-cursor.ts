import type { BlogPost } from "../blogTypes";
import { googleCalendarCursorFlow } from "../blogPosterConnections";

export const connectGoogleCalendarToCursor: BlogPost = {
  slug: "connect-google-calendar-to-cursor",
  title: "Connect Google Calendar to Cursor in 5 minutes",
  excerpt:
    "Complete walkthrough: Google OAuth setup, mcp.json config, verification, example prompts, and troubleshooting for Cursor + Google Calendar MCP.",
  date: "2026-06-24",
  author: "Ayush Kumar",
  tags: ["google-calendar", "cursor", "tutorial", "scheduling"],
  readTime: "10 min",
  poster: {
    posterAsset: "demo/posters/poster-connect-google-calendar-cursor.gif",
    eyebrow: "BLOG / TUTORIAL",
    headline: "Google Calendar MCP for Cursor",
    tagline:
      "Paste one JSON block into mcp.json and ask Cursor to list events, find free slots, and create meetings.",
    badge: "5 MIN SETUP",
    connection: googleCalendarCursorFlow,
    stats: [
      { value: "5 min", label: "Setup" },
      { value: "12", label: "Tools" },
      { value: "Cursor", label: "Client" },
    ],
  },
  content: [
    {
      type: "tldr",
      items: [
        "Enable Google Calendar API and create OAuth Desktop credentials in Google Cloud Console.",
        "Obtain a refresh token with calendar scope (monorepo helper: packages/google-calendar/scripts/oauth-setup.mjs).",
        "Add @mcp-wormhole/google-calendar to ~/.cursor/mcp.json with GOOGLE_CALENDAR_CREDENTIALS.",
        "Fully quit and reopen Cursor — MCP servers load at startup.",
        "Ask naturally: \"What's on my calendar today?\" or \"Find a 30-minute slot tomorrow afternoon.\"",
        "Full interactive guide: /guides/cursor/google-calendar on the docs site.",
      ],
    },
    { type: "h2", text: "Introduction" },
    {
      type: "p",
      text: "Cursor's agent can read your schedule, find meeting times, and create events — but only if Google Calendar is wired up through MCP first. This guide connects @mcp-wormhole/google-calendar so your agent can manage calendars without leaving the editor.",
    },
    {
      type: "p",
      text: "The server runs locally via npx. No repo clone, no Docker, no cloud proxy. Your OAuth credentials stay in your MCP config env block on your machine.",
    },
    {
      type: "diagram",
      title: "Cursor + Google Calendar MCP architecture",
      code: `┌──────────────────────────────────────────────────────────────┐
│  Cursor IDE                                                  │
│  ┌─────────────┐    MCP stdio     ┌────────────────────────┐ │
│  │ Agent /     │ ◄──────────────► │ npx @mcp-wormhole/     │ │
│  │ Composer    │  tools/list      │ google-calendar        │ │
│  └─────────────┘  tools/call      └───────────┬────────────┘ │
└───────────────────────────────────────────────│──────────────┘
                                                │ HTTPS + OAuth
                                                ▼
                                     ┌─────────────────────┐
                                     │  Google Calendar API│
                                     └─────────────────────┘`,
    },
    { type: "h2", text: "Prerequisites" },
    {
      type: "ul",
      items: [
        "Cursor with MCP support enabled",
        "Node.js 18+ (for npx)",
        "A Google account with calendar access",
        "A Google Cloud project with the Calendar API enabled",
      ],
    },
    { type: "h2", text: "Step 1 — Google Cloud OAuth setup" },
    {
      type: "ol",
      items: [
        "Open Google Cloud Console and create or select a project",
        "Enable the Google Calendar API (APIs & Services → Library)",
        "Create OAuth 2.0 credentials — Application type: Desktop app",
        "If the app is in Testing mode, add your Google account under Audience → Test users",
        "Run the oauth-setup helper or complete the browser consent flow manually to get a refresh token",
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: "Security",
      text: "Never commit client_secret or refresh_token to git or paste them in chat logs. Keep GOOGLE_CALENDAR_CREDENTIALS in mcp.json env vars only on your local machine. Rotate credentials if exposed.",
    },
    {
      type: "code",
      language: "bash",
      code: `# From the monorepo (optional helper)
cd packages/google-calendar
GOOGLE_OAUTH_CLIENT_ID="your_client_id" \\
GOOGLE_OAUTH_CLIENT_SECRET="your_client_secret" \\
node scripts/oauth-setup.mjs

# Prints GOOGLE_CALENDAR_CREDENTIALS JSON for your .env or mcp.json`,
    },
    { type: "h2", text: "Step 2 — Add MCP config" },
    {
      type: "p",
      text: "Global config (all projects): ~/.cursor/mcp.json. Per-project config: .cursor/mcp.json in your repo root.",
    },
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
      variant: "tip",
      title: "Default calendar",
      text: "Optional: set GOOGLE_CALENDAR_ID to a specific calendar ID. When omitted, tools default to primary.",
    },
    { type: "h2", text: "Step 3 — Restart Cursor" },
    {
      type: "p",
      text: "MCP servers load at startup. A window reload is not enough — fully quit Cursor (Cmd+Q on macOS) and reopen. You should see google-calendar listed under MCP tools in settings.",
    },
    { type: "h2", text: "Step 4 — Verify it works" },
    {
      type: "p",
      text: "Open Agent or Composer and try a simple prompt. Cursor will call gcal_list_calendars or gcal_list_upcoming_events under the hood.",
    },
    {
      type: "image",
      src: "demo/google-calendar-verify.gif",
      alt: "Google Calendar MCP server verification demo",
      caption: "What verification looks like — real API calls against Google Calendar.",
    },
    { type: "h2", text: "Example prompts" },
    { type: "h3", text: "Read operations" },
    {
      type: "ul",
      items: [
        "What's on my calendar today?",
        "Show my upcoming events this week",
        "Find a 30-minute free slot tomorrow between 9am and 6pm",
        "Search my calendar for meetings with TechLatest",
      ],
    },
    { type: "h3", text: "Write operations" },
    {
      type: "ul",
      items: [
        "Create a meeting called Standup tomorrow at 9am for 30 minutes",
        "Quick-add: Lunch with Alex Friday at noon",
        "Accept the invite for event abc123",
        "Move my 2pm meeting to 3pm",
      ],
    },
    { type: "h2", text: "Troubleshooting" },
    { type: "h3", text: "Tools not showing up" },
    {
      type: "ul",
      items: [
        "Fully quit Cursor (not just reload window)",
        "Check mcp.json syntax — credentials JSON must be escaped inside the string",
        "Run npx -y @mcp-wormhole/google-calendar manually to see startup errors",
      ],
    },
    { type: "h3", text: "403 access_denied during OAuth" },
    {
      type: "ul",
      items: [
        "Add your Google account as a Test user if the OAuth app is in Testing mode",
        "Confirm Calendar API is enabled on the same Cloud project as your OAuth client",
        "Re-run oauth-setup with prompt=consent to refresh the refresh token",
      ],
    },
    { type: "h3", text: "Empty calendar or auth errors" },
    {
      type: "ul",
      items: [
        "Verify GOOGLE_CALENDAR_CREDENTIALS includes client_id, client_secret, and refresh_token",
        "Check refresh token was issued with https://www.googleapis.com/auth/calendar scope",
        "Run pnpm verify in packages/google-calendar to test outside Cursor",
      ],
    },
    { type: "h2", text: "Conclusion" },
    {
      type: "p",
      text: "You now have Google Calendar wired into Cursor with 12 tools for events, search, free/busy, and RSVP. Start with read prompts, then try find_meeting_time or today_agenda MCP prompt workflows for richer scheduling help.",
    },
    {
      type: "p",
      text: "For the full tool reference, hero demo, and copy-paste config variants, visit the Cursor + Google Calendar guide on the docs site.",
    },
  ],
};
