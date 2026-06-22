# @mcp-wormhole/asana

**Full-stack Asana MCP server** — 66 tools, 18 prompt workflows, and browsable `asana://` resources via the official REST API.

## Highlights

| | |
|---|---|
| **Tools** | 66 across tasks, projects, sections, tags, portfolios, goals, time tracking |
| **Prompts** | 18 MCP workflow templates (`daily_focus_plan`, `project_health_scan`, …) |
| **Resources** | Browse workspaces → projects → tasks at `asana://` URIs |
| **Auth** | Asana Personal Access Token |
| **Transport** | stdio (npx) |

## Quick start

```bash
npx -y @mcp-wormhole/asana
# set ASANA_ACCESS_TOKEN in env
```

```json
{
  "mcpServers": {
    "asana": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/asana"],
      "env": {
        "ASANA_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

Get a token: [Asana developer console](https://app.asana.com/0/my-apps)

## MCP prompt workflows

Invoke from any MCP client that supports prompts:

| Prompt | Purpose |
|--------|---------|
| `daily_focus_plan` | Prioritized plan from open tasks |
| `workspace_pulse` | Workspace activity snapshot |
| `task_deep_dive` | Task brief with blockers and subtasks |
| `ship_readiness_check` | 0–100 readiness score with gaps |
| `project_health_scan` | Overdue / unassigned / stale signals |
| `stakeholder_brief` | Executive project update |
| `backlog_prioritizer` | P0/P1/P2 ranking |
| `overdue_rescue` | Triage late tasks |
| `standup_builder` | Yesterday / today / blockers |
| `subtask_architect` | Break task into subtasks |
| `time_log_assistant` | Retro time logging |

Plus: `comment_draft`, `risk_radar`, `onboarding_snapshot`, `week_ahead_planner`, `assignee_load_balance`, `sprint_closeout`, `goal_progress_report`.

## Browsable resources

| URI | Content |
|-----|---------|
| `asana://catalog` | Tool/prompt/resource index |
| `asana://workspaces` | All workspaces |
| `asana://workspace/{gid}/projects` | Projects in workspace |
| `asana://project/{gid}` | Project + sections |
| `asana://project/{gid}/tasks` | Tasks in project |
| `asana://task/{gid}` | Task + subtasks + stories |

## Tool categories

- **Users & workspaces** (4)
- **Projects & sections** (13)
- **Tasks** (17) — search, batch, subtasks, dependencies, duplicate
- **Tags** (7)
- **Stories & attachments** (7)
- **Teams & typeahead** (3)
- **Custom fields** (2)
- **Portfolios** (6)
- **Goals** (4)
- **Time tracking** (3)

Run `asana://catalog` or see `src/mcp/catalog.ts` for the full tool name list.

## Development

```bash
cp .env.example .env
pnpm install && pnpm build
pnpm verify
```

## Env vars

| Variable | Required | Description |
|----------|----------|-------------|
| `ASANA_ACCESS_TOKEN` | Yes | Asana Personal Access Token |

## API docs

https://developers.asana.com/reference/rest-api-reference

## License

MIT
