import type { BlogPoster, BlogPosterConnection } from "../data/blogTypes";

interface BlogConnectionDiagramProps {
  poster: BlogPoster;
}

function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

function HubDiagram({ connection }: { connection: Extract<BlogPosterConnection, { layout: "hub" }> }) {
  const byPosition = Object.fromEntries(connection.agents.map((a) => [a.position, a]));

  const positions = ["top", "left", "right", "bottom"] as const;

  return (
    <div className="blog-conn-hub" aria-hidden="true">
      <div className="blog-conn-hub-ring" />
      {positions.map((pos) => {
        const agent = byPosition[pos];
        if (!agent) return null;
        return (
          <div key={pos} className={`blog-conn-hub-agent blog-conn-hub-${pos}`}>
            <div className="blog-conn-tile">
              <img src={asset(agent.logo)} alt="" />
            </div>
            {agent.label && <span className="blog-conn-hub-label">{agent.label}</span>}
            <span className={`blog-conn-hub-line blog-conn-hub-line-${pos}`}>
              <span className="blog-conn-pulse" />
            </span>
          </div>
        );
      })}
      <div className="blog-conn-hub-center">
        <div className="blog-conn-tile blog-conn-tile-wormhole">
          <img src={asset("logo.svg")} alt="" />
        </div>
        <span className="blog-conn-hub-label blog-conn-hub-label-center">mcp-wormhole</span>
      </div>
    </div>
  );
}

function FlowDiagram({ connection }: { connection: Extract<BlogPosterConnection, { layout: "flow" }> }) {
  const { clientLogo, end } = connection;

  return (
    <div className="blog-conn-diagram" aria-hidden="true">
      <div className="blog-conn-row">
        <div className="blog-conn-tile blog-conn-tile-brand">
          <img src={asset(clientLogo)} alt="" />
        </div>
        <div className="blog-conn-line">
          <span className="blog-conn-pulse" />
        </div>
        <div className="blog-conn-tile blog-conn-tile-wormhole">
          <img src={asset("logo.svg")} alt="" />
        </div>
        <div className="blog-conn-line">
          <span className="blog-conn-pulse blog-conn-pulse-delay" />
        </div>
        <div className="blog-conn-card">
          <div className="blog-conn-card-header">
            <img src={asset(end.toolLogo)} alt="" className="blog-conn-card-logo" />
            <span className="blog-conn-card-name">{end.toolName}</span>
            <div className="blog-conn-badges">
              {end.authBadges.map((b) => (
                <span key={b.label} className={`blog-conn-badge blog-conn-badge-${b.variant}`}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
          <p className="blog-conn-card-desc">{end.toolDesc}</p>
          <div className="blog-conn-card-stats">
            {end.cardStats.map((s) => (
              <span key={s.label}>
                <strong>{s.value}</strong> {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Blog poster visual — hub (agents → wormhole) or flow (client → wormhole → tool) */
export function BlogConnectionDiagram({ poster }: BlogConnectionDiagramProps) {
  const conn = poster.connection;
  if (!conn) return null;

  if (conn.layout === "hub") {
    return <HubDiagram connection={conn} />;
  }

  return <FlowDiagram connection={conn} />;
}
