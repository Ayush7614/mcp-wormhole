# @mcp-wormhole/asana

MCP server for [Asana](https://asana.com) — list, search, create, update tasks and post comments via the official REST API.

## Setup

1. Create a [Personal Access Token](https://app.asana.com/0/my-apps) in Asana.
2. Copy env template and add your token locally (**never commit `.env`**):

```bash
cp .env.example .env
# edit .env → ASANA_ACCESS_TOKEN=...
```

3. Build:

```bash
pnpm build
```

## Verify locally

Runs real API calls: auth, list tasks, create a task, comment, search, mark complete.

```bash
pnpm verify
```

The script prints an Asana **permalink URL** — open it in your browser to see the task in the Asana UI.

## Cursor / Claude Desktop config

```json
{
  "mcpServers": {
    "asana": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-wormhole/packages/asana/dist/index.js"],
      "env": {
        "ASANA_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

Or after publish:

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

## Tools

| Tool | Description |
|------|-------------|
| `asana_get_me` | Current authenticated user |
| `asana_list_workspaces` | List workspaces |
| `asana_list_projects` | List projects in a workspace |
| `asana_list_my_tasks` | Tasks assigned to you |
| `asana_search_tasks` | Search tasks in a workspace |
| `asana_get_task` | Get task by GID |
| `asana_create_task` | Create task in project or workspace |
| `asana_update_task` | Update name, notes, due date, completion |
| `asana_add_comment` | Add comment to a task |

## Env vars

| Variable | Required | Description |
|----------|----------|-------------|
| `ASANA_ACCESS_TOKEN` | Yes | Asana Personal Access Token |

## API docs

https://developers.asana.com/reference/rest-api-reference

## Demo

See [`demo/asana-verify.gif`](./demo/asana-verify.gif) for a terminal recording of `pnpm build` + `pnpm verify` against the live API.

> This MCP server has **no built-in UI** — it speaks stdio MCP. Created tasks appear in the Asana web/mobile app.
