export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <p className="eyebrow">Model Context Protocol</p>
        <h1>One repo. Many portals to your tools.</h1>
        <p className="hero-lead">
          MCP servers for Asana, Slack, Sentry, and more — connect any AI client
          with copy-paste configs. Each integration wraps the vendor&apos;s official API.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#integrations">
            Connect your client
          </a>
          <a
            className="button secondary"
            href="https://github.com/Ayush7614/mcp-wormhole"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
