export function Hero() {
  const demoSrc = `${import.meta.env.BASE_URL}demo/asana-verify.gif`;

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-grid" />
      </div>

      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Model Context Protocol
          </p>
          <h1>
            One repo.
            <br />
            <span className="hero-gradient-text">Many portals</span> to your tools.
          </h1>
          <p className="hero-lead">
            MCP servers for Asana, Slack, Sentry, and more — connect any AI client
            with copy-paste configs. Each integration wraps the vendor&apos;s official API.
          </p>
          <div className="hero-actions">
            <a className="button primary glow" href="#integrations">
              Connect your client
            </a>
            <a className="button secondary" href="#demo">
              Watch live demo
            </a>
            <a
              className="button ghost"
              href="https://github.com/Ayush7614/mcp-wormhole"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
          <div className="hero-tags">
            <span>stdio MCP</span>
            <span>TypeScript</span>
            <span>copy-paste configs</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-terminal">
            <div className="terminal-chrome">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">packages/asana</span>
            </div>
            <img
              src={demoSrc}
              alt="Asana MCP verification demo"
              className="hero-gif"
              loading="eager"
            />
          </div>
          <p className="hero-visual-caption">Live Asana API verification — no mocks</p>
        </div>
      </div>
    </section>
  );
}
