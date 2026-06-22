import type { McpServer } from "../data/servers";
import { buildStdioConfig } from "../data/config";
import { ConfigBlock } from "./ConfigBlock";

interface ServerDetailProps {
  server: McpServer;
}

export function ServerDetail({ server }: ServerDetailProps) {
  const disabled = server.status === "planned";

  return (
    <section className="section section-tight">
      <div className="container detail-panel">
        <div className="detail-header">
          <div>
            <h2>{server.name}</h2>
            <p>{server.description}</p>
          </div>
          <span className={`status-pill ${server.status}`}>
            {disabled ? "Coming soon" : "Ready to use"}
          </span>
        </div>

        <div className="detail-columns">
          <div>
            <h3>Tools</h3>
            <ul className="tool-list">
              {server.tools.map((tool) => (
                <li key={tool}>
                  <code>{tool}</code>
                </li>
              ))}
            </ul>

            <h3>Environment</h3>
            <ul className="env-list">
              {server.env.map((item) => (
                <li key={item.key}>
                  <code>{item.key}</code>
                  <span>{item.description}</span>
                  {item.docsUrl && (
                    <a href={item.docsUrl} target="_blank" rel="noreferrer">
                      Get token
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ConfigBlock
              label={disabled ? "Config preview (planned)" : "Quick start config"}
              language="json"
              code={buildStdioConfig(server)}
            />
            {!disabled && (
              <p className="hint">
                Install:{" "}
                <code>npx -y {server.npmPackage}</code>
              </p>
            )}
            {server.demoAsset && !disabled && (
              <figure className="demo-figure">
                <figcaption>Live verification demo</figcaption>
                <img
                  src={`${import.meta.env.BASE_URL}${server.demoAsset}`}
                  alt={`${server.name} MCP verification terminal demo`}
                  loading="lazy"
                />
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
