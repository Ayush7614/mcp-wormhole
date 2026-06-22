import type { McpServer } from "../data/servers";
import { servers } from "../data/servers";

interface ServerGridProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

const statusLabel = {
  available: "Available",
  "in-progress": "In progress",
  planned: "Planned",
} as const;

export function ServerGrid({ selectedId, onSelect }: ServerGridProps) {
  return (
    <section className="section" id="servers">
      <div className="container">
        <div className="section-head">
          <h2>MCP servers</h2>
          <p>Select a server to preview tools and config snippets below.</p>
        </div>
        <div className="card-grid server-grid">
          {servers.map((server: McpServer) => (
            <button
              key={server.id}
              type="button"
              className={`card server-card ${selectedId === server.id ? "selected" : ""}`}
              onClick={() => onSelect(server.id)}
            >
              <div className="card-top">
                <span className={`status-pill ${server.status}`}>
                  {statusLabel[server.status]}
                </span>
              </div>
              <h3>{server.name}</h3>
              <p>{server.description}</p>
              <span className="card-meta">{server.auth}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
