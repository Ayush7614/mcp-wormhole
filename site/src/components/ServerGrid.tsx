import { Link } from "react-router-dom";
import { ServerIcon } from "./ServerIcon";
import { getHomepageStats } from "../data/homepageStats";
import type { McpServer } from "../data/servers";
import { servers } from "../data/servers";
import { asanaToolSummary } from "../data/asanaCatalog";

const statusLabel = {
  available: "Available",
  "in-progress": "In progress",
  planned: "Planned",
} as const;

interface ServerGridProps {
  selectedId?: string;
}

export function ServerGrid({ selectedId }: ServerGridProps) {
  const stats = getHomepageStats();

  return (
    <section className="section" id="servers">
      <div className="container">
        <div className="section-head server-section-head">
          <h2>MCP servers</h2>
          <p>Select a server to view tools, config, and client integrations.</p>
        </div>

        <div className="demo-stats server-grid-stats">
          <div className="demo-stat">
            <strong>{stats.toolsLive}</strong>
            <span>Tools live</span>
          </div>
          <div className="demo-stat">
            <strong className="demo-stat-infinity">{stats.infiniteServers}</strong>
            <span>Infinite servers</span>
          </div>
          <div className="demo-stat">
            <strong>{stats.clientIntegrations}</strong>
            <span>Client integrations</span>
          </div>
        </div>

        <div className="card-grid server-grid">
          {servers.map((server: McpServer) => (
            <article
              key={server.id}
              className={`card server-card ${selectedId === server.id ? "selected" : ""}`}
            >
              <Link to={`/servers/${server.id}`} className="server-card-link">
                <div className="card-top">
                  <ServerIcon serverId={server.id} name={server.name} />
                  <span className={`status-pill ${server.status}`}>
                    {statusLabel[server.status]}
                  </span>
                </div>
                <h3>{server.name}</h3>
                <p>{server.description}</p>
                <span className="card-meta">
                  {server.status === "available" && server.id === "asana"
                    ? asanaToolSummary()
                    : server.auth}
                </span>
              </Link>
              {server.status === "available" && (
                <Link to={`/servers/${server.id}/guide`} className="server-card-guide button ghost">
                  Full integration guide ↗
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
