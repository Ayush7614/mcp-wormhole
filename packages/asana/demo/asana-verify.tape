# Asana MCP verification demo
# Records build + live API verification (token loaded from .env, never shown)
Output packages/asana/demo/asana-verify.gif

Set Shell "zsh"
Set FontSize 16
Set Width 1280
Set Height 720
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms

Hide
Type "cd /Users/ayushkumar/Projects/mcp-wormhole/packages/asana"
Enter
Type "setopt interactivecomments"
Enter
Sleep 500ms
Show

Type "# mcp-wormhole — Asana MCP server"
Enter
Sleep 800ms

Type "pnpm build"
Enter
Sleep 3s

Type "pnpm verify"
Enter
Sleep 12s

Type "# Open the printed Asana URL in your browser to see the task in the UI"
Enter
Sleep 2s
