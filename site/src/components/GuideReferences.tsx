import { Link } from "react-router-dom";
import type { GuideReference } from "../data/guides";
import { integrations } from "../data/integrations";
import { BrandIcon } from "./BrandIcon";

interface GuideReferencesProps {
  references: GuideReference[];
  serverId: string;
  serverName: string;
  currentClientId: string;
}

function refKind(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes("npm")) return "npm";
  if (lower.includes("github")) return "github";
  if (lower.includes("api")) return "api";
  if (lower.includes("mcp") || lower.includes("protocol")) return "mcp";
  if (lower.includes("token") || lower.includes("get ")) return "key";
  if (lower.includes("guide") || lower.includes("overview")) return "guide";
  return "link";
}

export function GuideReferences({
  references,
  serverId,
  serverName,
  currentClientId,
}: GuideReferencesProps) {
  const otherClients = integrations.filter((item) => item.id !== currentClientId);

  return (
    <section className="guide-references" id="references">
      <div className="guide-references-bg" aria-hidden="true">
        <div className="guide-references-orb" />
      </div>
      <div className="container">
        <header className="guide-references-head">
          <p className="framework-picker-eyebrow">References</p>
          <h2>Documentation &amp; related guides</h2>
          <p>Official docs, npm packages, and setup guides for every supported client.</p>
        </header>

        <div className="guide-references-grid">
          <div className="guide-references-block">
            <h3>
              <span className="guide-ref-icon guide-ref-icon-docs" aria-hidden="true" />
              Documentation
            </h3>
            <ul className="guide-ref-cards">
              {references.map((ref) => (
                <li key={ref.href}>
                  {ref.external !== false ? (
                    <a href={ref.href} target="_blank" rel="noreferrer" className="guide-ref-card">
                      <span className={`guide-ref-card-icon guide-ref-card-icon-${refKind(ref.label)}`} aria-hidden="true" />
                      <span className="guide-ref-card-label">{ref.label}</span>
                      <span className="guide-ref-card-arrow">↗</span>
                    </a>
                  ) : (
                    <Link to={ref.href} className="guide-ref-card">
                      <span className={`guide-ref-card-icon guide-ref-card-icon-${refKind(ref.label)}`} aria-hidden="true" />
                      <span className="guide-ref-card-label">{ref.label}</span>
                      <span className="guide-ref-card-arrow">→</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="guide-references-block">
            <h3>
              <span className="guide-ref-icon guide-ref-icon-clients" aria-hidden="true" />
              Other client guides
            </h3>
            <p className="guide-references-hint">
              Same {serverName} server — different MCP client setup.
            </p>
            <ul className="guide-ref-clients">
              {otherClients.map((client) => (
                <li key={client.id}>
                  <Link to={`/guides/${client.id}/${serverId}`} className="guide-ref-client-chip">
                    <BrandIcon integrationId={client.id} alt={client.name} />
                    <span>{client.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
