import { integrations } from "../data/integrations";
import { BrandIcon } from "./BrandIcon";

interface IntegrationGridProps {
  onSelect: (id: string) => void;
}

export function IntegrationGrid({ onSelect }: IntegrationGridProps) {
  return (
    <section className="section integrations-section" id="integrations">
      <div className="container">
        <div className="section-head">
          <h2>Connect your client</h2>
          <p>
            Choose a client you want to connect mcp-wormhole with — Cursor, VS Code,
            Claude, ChatGPT, LangChain, and more.
          </p>
        </div>
        <div className="card-grid integration-grid">
          {integrations.map((item) => (
            <button
              key={item.id}
              type="button"
              className="card integration-card"
              onClick={() => onSelect(item.id)}
            >
              <div className="card-top">
                <BrandIcon integrationId={item.id} alt={`${item.name} logo`} />
                <span className="external-hint" aria-hidden="true">
                  ↗
                </span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
