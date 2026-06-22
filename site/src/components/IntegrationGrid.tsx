import { Link } from "react-router-dom";
import { integrations } from "../data/integrations";
import { BrandIcon } from "./BrandIcon";

interface IntegrationGridProps {
  serverId?: string;
  /** When omitted, shows generic home-page copy instead of naming a server. */
  serverName?: string;
}

export function IntegrationGrid({ serverId = "asana", serverName }: IntegrationGridProps) {
  const isHome = !serverName;

  return (
    <section className="section integrations-section" id="integrations">
      <div className="container">
        <div className="section-head">
          <h2>{isHome ? "Works with your AI client" : `Connect ${serverName} to your client`}</h2>
          <p>
            {isHome ? (
              <>
                Choose a client below — each card opens a step-by-step setup guide with copy-paste
                config.
              </>
            ) : (
              <>
                Choose a client to connect <strong>{serverName}</strong> — each card opens a full
                setup guide with copy-paste config.
              </>
            )}
          </p>
        </div>
        <div className="card-grid integration-grid">
          {integrations.map((item) => (
            <Link
              key={item.id}
              to={`/guides/${item.id}/${serverId}`}
              className="card integration-card"
            >
              <div className="card-top">
                <BrandIcon integrationId={item.id} alt={`${item.name} logo`} />
                <span className="external-hint" aria-hidden="true">
                  ↗
                </span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
