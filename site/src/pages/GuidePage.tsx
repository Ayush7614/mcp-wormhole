import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BrandIcon } from "../components/BrandIcon";
import { ConfigBlock } from "../components/ConfigBlock";
import { buildProviderGuide } from "../data/guides";
import { getIntegration } from "../data/integrations";
import { getServer, servers } from "../data/servers";

export function GuidePage() {
  const { clientId, serverId = "asana" } = useParams();
  const navigate = useNavigate();
  const integration = clientId ? getIntegration(clientId) : undefined;
  const server = getServer(serverId ?? "asana");

  if (!integration || !server) {
    return <Navigate to="/" replace />;
  }

  const guide = buildProviderGuide(integration, server);
  const disabled = server.status === "planned";

  return (
    <main className="guide-page">
      <div className="container">
        <nav className="guide-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/#integrations">Integrations</Link>
          <span>/</span>
          <span>{integration.name}</span>
          <span>/</span>
          <span>{server.name}</span>
        </nav>

        <header className="guide-header">
          <div className="guide-header-logos">
            <BrandIcon integrationId={integration.id} alt={integration.name} />
            <span className="guide-plus">+</span>
            <span className="guide-server-badge">{server.name}</span>
          </div>
          <h1>{guide.title}</h1>
          <p className="guide-subtitle">{guide.subtitle}</p>
          <div className="guide-header-actions">
            <span className={`status-pill ${server.status}`}>
              {disabled ? "Server planned" : "Ready to use"}
            </span>
            <a href={integration.docsUrl} target="_blank" rel="noreferrer" className="button secondary">
              {integration.name} docs ↗
            </a>
          </div>
        </header>

        <div className="guide-toolbar">
          <label htmlFor="guide-server">MCP server</label>
          <select
            id="guide-server"
            value={server.id}
            onChange={(event) => {
              navigate(`/guides/${integration.id}/${event.target.value}`);
            }}
          >
            {servers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
                {item.status === "planned" ? " (planned)" : ""}
              </option>
            ))}
          </select>
        </div>

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
              <h2>Configuration</h2>
              <p className="hint">
                Copy the config for <strong>{integration.name}</strong>, set{" "}
                <code>{server.env.map((e) => e.key).join(", ")}</code>, then restart your client.
              </p>
              <div className="config-stack">
                {guide.configs.map((block) => (
                  <ConfigBlock
                    key={block.label}
                    label={block.label}
                    language={block.language}
                    code={block.code}
                  />
                ))}
              </div>
            </section>

            {guide.verifyCommand && (
              <section className="guide-panel">
                <h2>Verify locally</h2>
                <ConfigBlock label="Terminal" language="bash" code={guide.verifyCommand} />
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
                  The <strong>{server.name}</strong> MCP server is on the roadmap. This guide shows
                  the config shape — swap in <strong>Asana</strong> today using the selector above.
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
