import { Link } from "react-router-dom";
import { LogoMark } from "./LogoMark";
import { ThemeToggle } from "./ThemeToggle";
import { SectionLink } from "./SectionLink";
import type { Theme } from "../hooks/useTheme";

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" to="/">
          <LogoMark size={30} />
          <span>mcp-wormhole</span>
        </Link>
        <nav className="nav">
          <SectionLink sectionId="servers">Servers</SectionLink>
          <SectionLink sectionId="integrations">Integrations</SectionLink>
          <SectionLink sectionId="demo">Demo</SectionLink>
          <Link to="/blog">Blog</Link>
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
