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

## Questions

Open an issue or tag @Ayush7614 on the PR.
