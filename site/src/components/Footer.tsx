import { Link } from "react-router-dom";
import { SectionLink } from "./SectionLink";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="brand-mark" aria-hidden="true" />
            <span>mcp-wormhole</span>
          </Link>
          <p className="footer-tagline">
            Open-source MCP servers that connect AI agents to the tools you already use — Asana,
            Slack, Sentry, and more.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">stdio MCP</span>
            <span className="footer-badge">TypeScript</span>
            <span className="footer-badge">MIT</span>
          </div>
        </div>

        <div className="footer-col">
          <h3>Explore</h3>
          <ul>
            <li>
              <SectionLink sectionId="servers">Servers</SectionLink>
            </li>
            <li>
              <SectionLink sectionId="integrations">Integrations</SectionLink>
            </li>
            <li>
              <SectionLink sectionId="demo">Live demo</SectionLink>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Resources</h3>
          <ul>
            <li>
              <a href="https://github.com/Ayush7614/mcp-wormhole" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
            </li>
            <li>
              <a
                href="https://www.npmjs.com/org/mcp-wormhole"
                target="_blank"
                rel="noreferrer"
              >
                npm packages ↗
              </a>
            </li>
            <li>
              <a href="https://modelcontextprotocol.io" target="_blank" rel="noreferrer">
                MCP docs ↗
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Ayush7614/mcp-wormhole/blob/master/CONTRIBUTING.md"
                target="_blank"
                rel="noreferrer"
              >
                Contributing ↗
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Get started</h3>
          <ul>
            <li>
              <Link to="/servers/asana/guide">Asana server guide</Link>
            </li>
            <li>
              <Link to="/guides/cursor/asana">Cursor + Asana</Link>
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/@mcp-wormhole/asana"
                target="_blank"
                rel="noreferrer"
              >
                @mcp-wormhole/asana ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {year}{" "}
          <a href="https://github.com/Ayush7614" target="_blank" rel="noreferrer">
            @Ayush7614
          </a>
          . MIT License.
        </p>
        <p className="footer-bottom-links">
          <a href="https://ayush7614.github.io/mcp-wormhole/">Docs site</a>
          <span aria-hidden="true">·</span>
          <Link to="/blog">Blog</Link>
        </p>
      </div>
    </footer>
  );
}
