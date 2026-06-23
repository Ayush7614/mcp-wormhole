import { Link } from "react-router-dom";
import { LogoMark } from "./LogoMark";
import { SectionLink } from "./SectionLink";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Ayush7614",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ayush-kumar-984443191/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 4.126 0 2.063 2.063 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/AYUSHKUMAR82274",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "NeuralVerse",
    href: "https://neural-verse-peach.vercel.app/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path strokeLinecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M7.05 7.05l2.12 2.12M14.83 14.83l2.12 2.12M16.95 7.05l-2.12 2.12M9.17 14.83l-2.12 2.12" />
      </svg>
    ),
  },
  {
    label: "Substack",
    href: "https://substack.com/@felixayush",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
  {
    label: "Reddit",
    href: "https://www.reddit.com/user/bytewithayush/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.03 4.87-6.77 4.87-3.74 0-6.77-2.176-6.77-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-orb footer-orb-a" aria-hidden="true" />
      <div className="footer-orb footer-orb-b" aria-hidden="true" />

      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <LogoMark size={28} />
            <span>mcp-wormhole</span>
          </Link>
          <p className="footer-tagline">
            Open-source MCP servers that connect AI agents to the tools you already use — Asana,
            Vercel, Google Calendar, and more.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">stdio MCP</span>
            <span className="footer-badge">TypeScript</span>
            <span className="footer-badge">MIT</span>
          </div>
          <div className="footer-social">
            <p className="footer-social-label">Connect with Ayush</p>
            <div className="footer-social-links">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link"
                  aria-label={link.label}
                  title={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
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
              <a href="https://www.npmjs.com/org/mcp-wormhole" target="_blank" rel="noreferrer">
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
              <Link to="/servers/vercel/guide">Vercel server guide</Link>
            </li>
            <li>
              <Link to="/servers/google-calendar/guide">Google Calendar guide</Link>
            </li>
            <li>
              <Link to="/guides/cursor/asana">Cursor + Asana</Link>
            </li>
            <li>
              <Link to="/guides/cursor/vercel">Cursor + Vercel</Link>
            </li>
            <li>
              <Link to="/guides/cursor/google-calendar">Cursor + Calendar</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="footer-copyright">
          © {year}{" "}
          <a href="https://github.com/Ayush7614" target="_blank" rel="noreferrer">
            Ayush Kumar
          </a>
          . MIT License.
        </p>
        <p className="footer-bottom-links">
          <a href="https://neural-verse-peach.vercel.app/" target="_blank" rel="noreferrer">
            NeuralVerse
          </a>
          <span aria-hidden="true">·</span>
          <a href="https://ayush7614.github.io/mcp-wormhole/">Docs</a>
          <span aria-hidden="true">·</span>
          <Link to="/blog">Blog</Link>
        </p>
      </div>
    </footer>
  );
}
