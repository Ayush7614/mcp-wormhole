# mcp-wormhole

A monorepo of **Model Context Protocol (MCP) servers** — one directory per integration. Each server wraps a third-party API so AI agents (Cursor, Claude Desktop, etc.) can read and act on your tools.

**Owner:** [@Ayush7614](https://github.com/Ayush7614)

**Website:** [ayush7614.github.io/mcp-wormhole](https://ayush7614.github.io/mcp-wormhole/) — integration guides, server catalog, copy-paste configs for Cursor, Claude, VS Code, and more.

## Structure

```
mcp-wormhole/
├── packages/
│   ├── asana/          # one MCP server per directory
│   ├── slack/
│   ├── sentry/
│   └── ...
├── site/               # GitHub Pages docs + integration gallery
├── package.json
└── pnpm-workspace.yaml
```

Each package is a standalone MCP server with its own `package.json`, tools, resources, and README.

## Planned servers

| Server | Status | Auth |
|--------|--------|------|
| Asana | available | PAT |
| Slack | planned | Bot token |
| Sentry | planned | Auth token |
| Vercel | planned | API token |
| Google Calendar | planned | OAuth |
| Airtable | planned | PAT |
| Stripe | planned | Secret key |
| Cloudflare | planned | API token |
| GitHub Actions | planned | PAT |
| PagerDuty | planned | API key |
| Linear | planned | API key |

> Each server calls the **vendor's existing API** — we don't host new backends.

## Quick start (development)

```bash
git clone https://github.com/Ayush7614/mcp-wormhole.git
cd mcp-wormhole
pnpm install
pnpm build
```

Run a specific server (once published):

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

## Adding a new server

1. Copy `packages/_template` to `packages/<name>`
2. Implement tools against the vendor API
3. Open a PR — one server per PR

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).
