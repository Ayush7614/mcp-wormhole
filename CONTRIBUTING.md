# Contributing to mcp-wormhole

Thanks for helping build MCP servers. One integration = one PR.

## Workflow

1. **Fork** [Ayush7614/mcp-wormhole](https://github.com/Ayush7614/mcp-wormhole)
2. **Branch** from `main`: `feat/<server-name>-mcp` (e.g. `feat/asana-mcp`)
3. **Copy** `packages/_template` → `packages/<server-name>`
4. **Implement** tools + resources using the vendor's official API
5. **Document** env vars and Cursor/Claude config in the package README
6. **Open a PR** with:
   - Server name and link to API docs
   - List of tools/resources
   - Example MCP client config snippet

## Package conventions

- **Directory:** `packages/<name>/` (lowercase, no `-mcp-server` suffix in folder name)
- **npm name:** `@mcp-wormhole/<name>`
- **Stack:** TypeScript, `@modelcontextprotocol/sdk`, `zod`, `tsup`
- **Entry:** `src/index.ts` → stdio transport
- **Env:** Document required keys in README + `.env.example`

## Tool design

- Prefer **read** tools first (search, get, list)
- Add **write** tools with clear names (`create_`, `update_`, `delete_`)
- Validate inputs with Zod
- Return JSON as MCP text content

## PR checklist

- [ ] `pnpm build` passes in the new package
- [ ] README includes install + env setup
- [ ] No secrets committed
- [ ] Root README roadmap updated (status → done or in progress)

## Publishing

Packages publish to npm under `@mcp-wormhole/<name>` when ready.

### One-time setup

1. Create the [`@mcp-wormhole`](https://www.npmjs.com/org/create) npm organization (free, public packages).
2. Generate an npm **Automation** token at [npmjs.com/settings/~/tokens](https://www.npmjs.com/settings/~/tokens).
3. Add it as `NPM_TOKEN` in the repo's GitHub Actions secrets.

### Publish manually (local)

```bash
pnpm --filter @mcp-wormhole/asana build
cd packages/asana
npm login
npm publish --access public
```

### Publish via GitHub Actions

Use **Actions → Publish npm packages → Run workflow**, pick the package (e.g. `asana`).

Or cut a GitHub Release — the workflow runs on `release: published`.

## Questions

Open an issue or tag @Ayush7614 on the PR.
