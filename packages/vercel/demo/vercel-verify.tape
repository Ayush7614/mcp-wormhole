# Vercel MCP verification demo
# Records build + live API verification (token loaded from .env, never shown)
Output packages/vercel/demo/vercel-verify.gif

Set Shell "zsh"
Set FontSize 16
Set Width 1280
Set Height 720
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms

Hide
Type "cd /Users/ayushkumar/Projects/mcp-wormhole/packages/vercel"
Enter
Sleep 500ms
Show

Type "echo '# mcp-wormhole — Vercel MCP server'"
Enter
Sleep 800ms

Type "pnpm build"
Enter
Sleep 3s

Type "pnpm verify"
Enter
Sleep 10s

Type "echo '# Connected to Vercel API — list projects & deployments via MCP tools'"
Enter
Sleep 2s
