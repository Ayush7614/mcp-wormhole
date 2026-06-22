export function DemoShowcase() {
  const demoSrc = `${import.meta.env.BASE_URL}demo/asana-verify.gif`;

  return (
    <section className="section demo-showcase" id="demo">
      <div className="container">
        <div className="section-head centered">
          <p className="eyebrow">Live verification</p>
          <h2>Real API calls. Real tasks. Recorded in the terminal.</h2>
          <p>
            Every server ships with a verify script — watch Asana auth, create a task,
            comment, and mark it complete against the live API.
          </p>
        </div>

        <div className="demo-stage">
          <div className="demo-stage-glow" aria-hidden="true" />
          <div className="terminal-window">
            <div className="terminal-chrome">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">asana — pnpm verify</span>
            </div>
            <img
              src={demoSrc}
              alt="Terminal recording of Asana MCP server verification"
              className="demo-gif"
              loading="lazy"
            />
          </div>

          <div className="demo-stats">
            <div className="demo-stat">
              <strong>9</strong>
              <span>Asana tools</span>
            </div>
            <div className="demo-stat">
              <strong>20</strong>
              <span>Client integrations</span>
            </div>
            <div className="demo-stat">
              <strong>11</strong>
              <span>Servers planned</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
