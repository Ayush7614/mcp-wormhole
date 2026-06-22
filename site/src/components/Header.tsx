import { ThemeToggle } from "./ThemeToggle";
import type { Theme } from "../hooks/useTheme";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true" />
          <span>mcp-wormhole</span>
        </a>
        <nav className="nav">
          <a href="#servers">Servers</a>
          <a href="#integrations">Integrations</a>
          <a href="#demo">Demo</a>
          <a
            href="https://github.com/Ayush7614/mcp-wormhole"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </nav>
      </div>
    </header>
  );
}
