import type { BlogPoster } from "../data/blogTypes";

interface BlogConnectionDiagramProps {
  poster: BlogPoster;
}

function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

/** Composio-style: client → mcp-wormhole → tool detail card */
export function BlogConnectionDiagram({ poster }: BlogConnectionDiagramProps) {
  const conn = poster.connection;
  if (!conn) return null;

  return (
    <div className="blog-conn-diagram" aria-hidden="true">
      <div className="blog-conn-row">
        <div className="blog-conn-tile">
          <img src={asset(conn.clientLogo)} alt="" />
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
            <img src={asset(conn.toolLogo)} alt="" className="blog-conn-card-logo" />
            <span className="blog-conn-card-name">{conn.toolName}</span>
            <div className="blog-conn-badges">
              {conn.authBadges.map((b) => (
                <span key={b.label} className={`blog-conn-badge blog-conn-badge-${b.variant}`}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
          <p className="blog-conn-card-desc">{conn.toolDesc}</p>
          <div className="blog-conn-card-stats">
            {conn.cardStats.map((s) => (
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
