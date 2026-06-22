import { Link } from "react-router-dom";
import type { GuideReference } from "../data/guides";
import { integrations } from "../data/integrations";

interface GuideReferencesProps {
  references: GuideReference[];
  serverId: string;
  serverName: string;
  currentClientId: string;
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
      <div className="container">
        <header className="guide-references-head">
          <p className="framework-picker-eyebrow">References</p>
          <h2>Documentation &amp; related guides</h2>
        </header>

        <div className="guide-references-grid">
          <div className="guide-references-block">
            <h3>Links</h3>
            <ul className="guide-references-list">
              {references.map((ref) => (
                <li key={ref.href}>
                  {ref.external !== false ? (
                    <a href={ref.href} target="_blank" rel="noreferrer">
                      {ref.label} ↗
                    </a>
                  ) : (
                    <Link to={ref.href}>{ref.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="guide-references-block">
            <h3>Other client guides</h3>
            <ul className="guide-references-list guide-references-clients">
              {otherClients.map((client) => (
                <li key={client.id}>
                  <Link to={`/guides/${client.id}/${serverId}`}>
                    {client.name} + {serverName}
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
