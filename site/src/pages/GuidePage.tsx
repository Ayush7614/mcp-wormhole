import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { GuideStepSection } from "../components/GuideStepSection";
import { GuideReferences } from "../components/GuideReferences";
import { GuideHeroPoster } from "../components/GuideHeroPoster";
import { GuideIntroSection } from "../components/GuideIntroSection";
import { TocLink } from "../components/TocLink";
import { buildProviderGuide } from "../data/guides";
import { getIntegration } from "../data/integrations";
import { getServer, servers } from "../data/servers";
import { SCROLL_SECTION_KEY, useScrollToAnchorOnMount } from "../hooks/useScrollToSection";

export function GuidePage() {
  useScrollToAnchorOnMount();
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
          <Link
            to={`/servers/${server.id}/guide`}
            onClick={() => sessionStorage.setItem(SCROLL_SECTION_KEY, "frameworks")}
          >
            Frameworks
          </Link>
          <span>/</span>
          <Link to={`/servers/${server.id}`}>{server.name}</Link>
          <span>/</span>
          <span>{integration.name}</span>
        </nav>

        <GuideHeroPoster
          title={guide.title}
          subtitle={guide.subtitle}
          poster={guide.poster}
          clientId={integration.id}
          clientName={integration.name}
          serverId={server.id}
          serverName={server.name}
          status={
            <>
              <span className={`status-pill ${server.status}`}>
                {disabled ? "Server planned" : "Ready to use"}
              </span>
              <span className="tutorial-meta">
                {guide.steps.length} steps · <code>{server.npmPackage}</code>
              </span>
            </>
          }
        />

        <div className="tutorial-hero-actions">
          <Link to={`/servers/${server.id}/guide`} className="button secondary">
            ← {server.name} guide
          </Link>
          <a href={integration.docsUrl} target="_blank" rel="noreferrer" className="button secondary">
            {integration.name} docs ↗
          </a>
        </div>

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
              <li className="tutorial-toc-overview">
                <TocLink targetId="intro">{guide.intro.title}</TocLink>
              </li>
              {guide.steps.map((step) => (
                <li key={step.id}>
                  <TocLink targetId={step.id}>{step.title}</TocLink>
                </li>
              ))}
              <li>
                <TocLink targetId="references">References</TocLink>
              </li>
            </ol>
          </aside>

          <div className="tutorial-steps">
            <GuideIntroSection intro={guide.intro} />
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
