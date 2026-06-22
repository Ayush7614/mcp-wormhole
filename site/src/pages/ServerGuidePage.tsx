import { Link, Navigate, useParams } from "react-router-dom";
import { SectionLink } from "../components/SectionLink";
import { ConfigBlock } from "../components/ConfigBlock";
import { BrandIcon } from "../components/BrandIcon";
import { buildServerGuide } from "../data/serverGuides";
import { integrations } from "../data/integrations";
import { getServer } from "../data/servers";

export function ServerGuidePage() {
  const { serverId } = useParams();
  const server = serverId ? getServer(serverId) : undefined;

  if (!server) {
    return <Navigate to="/" replace />;
  }

  const guide = buildServerGuide(server);
  const disabled = server.status === "planned";

  return (
    <main className="guide-page">
      <div className="container">
        <nav className="guide-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <SectionLink sectionId="servers">Servers</SectionLink>
          <span>/</span>
          <Link to={`/servers/${server.id}`}>{server.name}</Link>
          <span>/</span>
          <span>Guide</span>
        </nav>

        <header className="guide-header">
          <span className="guide-server-badge">{server.name}</span>
          <h1>{guide.title}</h1>
          <p className="guide-subtitle">{guide.subtitle}</p>
          <div className="guide-header-actions">
            <span className={`status-pill ${server.status}`}>
              {disabled ? "Server planned" : "Ready to use"}
            </span>
            <Link to={`/servers/${server.id}`} className="button secondary">
              Back to {server.name}
            </Link>
            {server.docsUrl && (
              <a href={server.docsUrl} target="_blank" rel="noreferrer" className="button secondary">
                API docs ↗
              </a>
            )}
          </div>
        </header>

        <div className="guide-layout">
          <aside className="guide-sidebar">
            <section className="guide-panel">
              <h2>Prerequisites</h2>
              <ul>
                {guide.prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            {guide.sections.map((section) => (
              <section key={section.id} className="guide-panel" id={section.id}>
                <h2>{section.title}</h2>
                {section.body && <p className="guide-body">{section.body}</p>}
                {section.items && (
                  <ul className={section.id === "tools" ? "tool-list guide-tools" : undefined}>
                    {section.items.map((item) => (
                      <li key={item}>
                        {section.id === "tools" ? <code>{item}</code> : item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {!disabled && guide.examplePrompts.length > 0 && (
              <section className="guide-panel">
                <h2>Example prompts</h2>
                <ul className="prompt-list">
                  {guide.examplePrompts.map((prompt) => (
                    <li key={prompt}>
                      <code>{prompt}</code>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>

          <div className="guide-main">
            <section className="guide-panel">
              <h2>Quick start</h2>
              <p className="hint">
                Add this to your MCP client config. Set{" "}
                <code>{server.env.map((e) => e.key).join(", ")}</code>, then restart.
              </p>
              <ConfigBlock label="MCP config (stdio)" language="json" code={guide.quickStartConfig} />
            </section>

            <section className="guide-panel">
              <h2>Run from anywhere</h2>
              <ConfigBlock label="Terminal" language="bash" code={guide.npmInstallCommand} />
            </section>

            {guide.verifyCommand && (
              <section className="guide-panel">
                <h2>Verify install</h2>
                <ConfigBlock label="Terminal" language="bash" code={guide.verifyCommand} />
              </section>
            )}

            {!disabled && (
              <section className="guide-panel">
                <h2>Per-client setup guides</h2>
                <p className="hint">
                  Step-by-step config for Cursor, Claude, VS Code, LangChain, and more.
                </p>
                <div className="client-guide-grid">
                  {integrations.map((integration) => (
                    <Link
                      key={integration.id}
                      to={`/guides/${integration.id}/${server.id}`}
                      className="client-guide-card"
                    >
                      <BrandIcon integrationId={integration.id} alt={integration.name} />
                      <span>{integration.name}</span>
                      <span className="external-hint" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {server.demoAsset && !disabled && (
              <section className="guide-panel">
                <h2>Live demo</h2>
                <div className="terminal-window">
                  <div className="terminal-chrome">
                    <span className="terminal-dot red" />
                    <span className="terminal-dot yellow" />
                    <span className="terminal-dot green" />
                    <span className="terminal-title">pnpm verify — {server.name}</span>
                  </div>
                  <img
                    src={`${import.meta.env.BASE_URL}${server.demoAsset}`}
                    alt={`${server.name} verification demo`}
                    className="demo-gif"
                    loading="lazy"
                  />
                </div>
              </section>
            )}

            {disabled && (
              <section className="guide-panel guide-notice">
                <h2>Coming soon</h2>
                <p>
                  The <strong>{server.name}</strong> MCP server is on the roadmap. Check back or
                  open an issue on GitHub to track progress.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
