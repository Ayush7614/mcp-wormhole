# @mcp-wormhole/google-calendar

**Full-stack Google Calendar MCP server** — 12 tools, 6 prompt workflows, and browsable `gcal://` resources via the official Google Calendar API.

## Highlights

| | |
|---|---|
| **Tools** | 12 across calendars, events, search, free/busy, quick-add, RSVP |
| **Prompts** | 6 MCP workflow templates (`today_agenda`, `find_meeting_time`, …) |
| **Resources** | Browse calendars → events at `gcal://` URIs |
| **Auth** | OAuth2 refresh token JSON or service account |
| **Transport** | stdio (npx) |

## Quick start

```bash
npx -y @mcp-wormhole/google-calendar
# set GOOGLE_CALENDAR_CREDENTIALS in env
```

```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/google-calendar"],
      "env": {
        "GOOGLE_CALENDAR_CREDENTIALS": "{\"client_id\":\"...\",\"client_secret\":\"...\",\"refresh_token\":\"...\"}"
      }
    }
  }
}
```

Optional: `"GOOGLE_CALENDAR_ID": "primary"` to set a default calendar.

## Authentication

1. Create a Google Cloud project and enable the **Google Calendar API**
2. Create OAuth 2.0 credentials (Desktop app) or a service account
3. For OAuth user access, obtain a **refresh token** with calendar scope
4. Paste the JSON into `GOOGLE_CALENDAR_CREDENTIALS` (inline or file path)

Docs: [Google Calendar API auth](https://developers.google.com/calendar/api/guides/auth)

## MCP prompt workflows

| Prompt | Purpose |
|--------|---------|
| `today_agenda` | Chronological summary of today's events |
| `week_ahead_overview` | Next 7 days — conflicts and gaps |
| `meeting_prep_brief` | Prep brief for a specific event |
| `find_meeting_time` | Mutual free slots across calendars |
| `scheduling_conflict_scan` | Overlaps and tight turnarounds |
| `focus_time_planner` | Suggest deep-work blocks |

## Browsable resources

| URI | Content |
|-----|---------|
| `gcal://catalog` | Tool/prompt/resource index |
| `gcal://calendars` | All calendars |
| `gcal://calendar/{calendar_id}` | Calendar detail |
| `gcal://calendar/{calendar_id}/events` | Upcoming events |

## Tool list

- **Calendars** — `gcal_list_calendars`, `gcal_get_calendar`
- **Events** — list, get, create, update, delete, search, upcoming, quick-add
- **Scheduling** — `gcal_find_free_slots`, `gcal_rsvp_event`

## Development

```bash
cp .env.example .env   # add GOOGLE_CALENDAR_CREDENTIALS
pnpm install && pnpm build
pnpm verify
```

## License

MIT — see [LICENSE](../../LICENSE).
