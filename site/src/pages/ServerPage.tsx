import { Link, Navigate, useParams } from "react-router-dom";
import { SectionLink } from "../components/SectionLink";
import { ServerDetail } from "../components/ServerDetail";
import { IntegrationGrid } from "../components/IntegrationGrid";
import { NpmPackageBadges } from "../components/NpmPackageBadges";
import { getServer, shouldShowNpmBadges } from "../data/servers";

export function ServerPage() {
  const { serverId } = useParams();
  const server = serverId ? getServer(serverId) : undefined;

  if (!server) {
    return <Navigate to="/" replace />;
  }

  const showGuideLink = server.status === "available";

  return (
    <main className="server-page">
      <div className="container">
        <nav className="guide-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <SectionLink sectionId="servers">Servers</SectionLink>
          <span>/</span>
          <span>{server.name}</span>
        </nav>

        <header className="server-page-header">
          <div>
            <h1>{server.name} MCP</h1>
            <p className="guide-subtitle">{server.description}</p>
            {shouldShowNpmBadges(server) && (
              <div className="server-page-badges">
                <NpmPackageBadges pkg={server.npmPackage} />
              </div>
            )}
          </div>
          <div className="guide-header-actions">
            <span className={`status-pill ${server.status}`}>
              {server.status === "available" ? "Ready to use" : "Coming soon"}
            </span>
            {showGuideLink && (
              <Link to={`/servers/${server.id}/guide`} className="button primary">
                Full integration guide ↗
              </Link>
            )}
            {server.docsUrl && (
              <a href={server.docsUrl} target="_blank" rel="noreferrer" className="button secondary">
                {server.name} API docs ↗
              </a>
            )}
          </div>
        </header>
      </div>

      <ServerDetail server={server} showGuideLink={showGuideLink} />
      <IntegrationGrid serverId={server.id} serverName={server.name} />
    </main>
  );
}
