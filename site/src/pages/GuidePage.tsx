import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BrandIcon } from "../components/BrandIcon";
import { GuideStepSection } from "../components/GuideStepSection";
import { GuideReferences } from "../components/GuideReferences";
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
    <main className="tutorial-page">
      <div className="container">
        <nav className="guide-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/servers/${server.id}/guide#frameworks`}>Frameworks</Link>
          <span>/</span>
          <Link to={`/servers/${server.id}`}>{server.name}</Link>
          <span>/</span>
          <span>{integration.name}</span>
        </nav>

        <header className="tutorial-hero">
          <div className="guide-header-logos">
            <BrandIcon integrationId={integration.id} alt={integration.name} />
            <span className="guide-plus">+</span>
            <span className="guide-server-badge">{server.name}</span>
          </div>
          <h1>{guide.title}</h1>
          <p className="tutorial-hero-lead">{guide.subtitle}</p>
          <div className="guide-header-actions">
            <span className={`status-pill ${server.status}`}>
              {disabled ? "Server planned" : "Ready to use"}
            </span>
            <span className="tutorial-meta">
              {guide.steps.length} steps · <code>{server.npmPackage}</code>
            </span>
          </div>
          <div className="tutorial-hero-actions">
            <Link to={`/servers/${server.id}/guide`} className="button secondary">
              ← {server.name} guide
            </Link>
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

        <div className="tutorial-layout">
          <aside className="tutorial-toc" aria-label="Guide contents">
            <p className="tutorial-toc-label">On this page</p>
            <ol>
              {guide.steps.map((step) => (
                <li key={step.id}>
                  <a href={`#${step.id}`}>{step.title}</a>
                </li>
              ))}
              <li>
                <a href="#references">References</a>
              </li>
            </ol>
          </aside>

          <div className="tutorial-steps">
            {guide.steps.map((step) => (
              <GuideStepSection key={step.id} step={step} />
            ))}
          </div>
        </div>
      </div>

      <GuideReferences
        references={guide.references}
        serverId={server.id}
        serverName={server.name}
        currentClientId={integration.id}
      />
    </main>
  );
}
