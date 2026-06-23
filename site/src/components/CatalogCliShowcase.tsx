import { publicAsset } from "../lib/assets";

export function CatalogCliShowcase() {
  const demoSrc = publicAsset("demo/mcp-wormhole-catalog.gif");

  return (
    <section className="section catalog-cli-showcase" id="catalog">
      <div className="container">
        <div className="catalog-cli-layout">
          <div className="catalog-cli-copy">
            <p className="eyebrow eyebrow-orange">
              <span className="eyebrow-dot" aria-hidden="true" />
              Server catalog
            </p>
            <h2>
              Every integration, <span className="hero-gradient-text">one monorepo</span>
            </h2>
            <p>
              Three servers are live on npm — Asana (66 tools), Vercel (18 tools), and Google
              Calendar (12 tools). Slack, Sentry, Linear, and seven more are on the roadmap —
              each wraps the vendor&apos;s official API.
            </p>
            <ul className="catalog-cli-highlights">
              <li>
                <span className="catalog-dot available" aria-hidden="true" />
                <strong>Asana</strong> — @mcp-wormhole/asana@0.2.0
              </li>
              <li>
                <span className="catalog-dot available" aria-hidden="true" />
                <strong>Vercel</strong> — @mcp-wormhole/vercel@0.2.0
              </li>
              <li>
                <span className="catalog-dot available" aria-hidden="true" />
                <strong>Google Calendar</strong> — @mcp-wormhole/google-calendar@0.1.0
              </li>
              <li>
                <span className="catalog-dot planned" aria-hidden="true" />
                <strong>8 more</strong> — coming soon
              </li>
              <li>
                <span className="catalog-dot planned" aria-hidden="true" />
                Open a PR to add the next server
              </li>
            </ul>
          </div>

          <div className="catalog-cli-visual">
            <div className="terminal-window terminal-window-orange">
              <div className="terminal-chrome terminal-chrome-orange">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
                <span className="terminal-title">mcp-wormhole — server catalog</span>
              </div>
              <img
                src={demoSrc}
                alt="mcp-wormhole CLI server catalog demo with orange terminal theme"
                className="demo-gif catalog-cli-gif"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
