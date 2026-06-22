import { Link } from "react-router-dom";
import { BrandIcon } from "./BrandIcon";
import { integrations } from "../data/integrations";

interface FrameworkPickerProps {
  serverId: string;
  serverName: string;
}

export function FrameworkPicker({ serverId, serverName }: FrameworkPickerProps) {
  return (
    <section className="framework-picker" id="frameworks">
      <div className="container">
        <header className="framework-picker-head">
          <p className="framework-picker-eyebrow">Frameworks</p>
          <h2>Use {serverName} with any AI Agent Framework</h2>
          <p>Choose a Framework you want to connect {serverName} with</p>
        </header>

        <div className="framework-grid">
          {integrations.map((integration) => (
            <Link
              key={integration.id}
              to={`/guides/${integration.id}/${serverId}`}
              className="framework-card"
            >
              <div className="framework-card-top">
                <BrandIcon integrationId={integration.id} alt={`${integration.name} logo`} />
                <span className="external-hint" aria-hidden="true">
                  ↗
                </span>
              </div>
              <h3>{integration.name}</h3>
              <p>
                Use {serverName} MCP with {integration.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
