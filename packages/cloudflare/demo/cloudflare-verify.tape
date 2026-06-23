# Cloudflare MCP verification demo
Output packages/cloudflare/demo/cloudflare-verify.gif

Set Shell "zsh"
Set FontSize 16
Set Width 1280
Set Height 720
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms

Hide
Type "cd /Users/ayushkumar/Projects/mcp-wormhole/packages/cloudflare"
Enter
Sleep 500ms
Show

Type "echo '# mcp-wormhole — Cloudflare MCP server'"
Enter
Sleep 800ms

Type "pnpm build"
Enter
Sleep 3s

Type "pnpm verify"
Enter
Sleep 10s

Type "echo '# Connected to Cloudflare API — zones, DNS & cache'"
Enter
Sleep 2s
