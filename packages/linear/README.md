# @mcp-wormhole/linear

**Full-stack Linear MCP server** — 14 tools, 6 prompt workflows, and browsable `linear://` resources via the official GraphQL API.

## Highlights

| | |
|---|---|
| **Tools** | 14 across teams, issues, search, comments, labels, workflow states |
| **Prompts** | 6 MCP workflow templates (`issue_triage`, `sprint_board_overview`, …) |
| **Resources** | Browse teams → issues at `linear://` URIs |
| **Auth** | Linear API key (`LINEAR_API_KEY`) + optional `LINEAR_TEAM_ID` |
| **Transport** | stdio (npx) |

## Quick start

```bash
npx -y @mcp-wormhole/linear
# set LINEAR_API_KEY in env
```

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@mcp-wormhole/linear"],
      "env": {
        "LINEAR_API_KEY": "lin_api_..."
      }
    }
  }
}
```

Optional: `"LINEAR_TEAM_ID": "team-uuid"` to set a default team.

Create a key: [Linear Settings → API](https://linear.app/settings/account/security)

## MCP prompt workflows

| Prompt | Purpose |
|--------|---------|
| `my_assigned_issues` | Issues assigned to the authenticated viewer |
| `sprint_board_overview` | Issues grouped by workflow state |
| `issue_triage` | Suggest assignee, labels, priority for backlog items |
| `blocked_issues_scan` | Find blocked issues via search + comments |
| `create_bug_report` | Structured bug issue creation |
| `release_readiness_issues` | Open high-priority issues before release |

## Browsable resources

| URI | Content |
|-----|---------|
| `linear://catalog` | Tool/prompt/resource index |
| `linear://teams` | All teams |
| `linear://team/{team_id}/issues` | Team issue list |
| `linear://issue/{issue_id}` | Full issue record |

## Tool list

- **Account** — `linear_get_viewer`, `linear_list_users`
- **Teams** — `linear_list_teams`, `linear_get_team`, `linear_list_projects`, `linear_list_workflow_states`, `linear_list_labels`
- **Issues** — list, get, search, create, update
- **Comments** — `linear_add_comment`, `linear_list_comments`

## Development

```bash
cp .env.example .env   # add LINEAR_API_KEY
pnpm install && pnpm build
pnpm verify
```

## License

MIT
