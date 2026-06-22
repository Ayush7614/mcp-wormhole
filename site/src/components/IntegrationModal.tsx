import { useState } from "react";
import type { Integration } from "../data/integrations";
import type { McpServer } from "../data/servers";
import { servers } from "../data/servers";
import { getConfigForIntegration } from "../data/config";
import { BrandIcon } from "./BrandIcon";
import { ConfigBlock } from "./ConfigBlock";

interface IntegrationModalProps {
  integration: Integration;
  server: McpServer;
  onClose: () => void;
  onServerChange: (id: string) => void;
}

export function IntegrationModal({
  integration,
  server,
  onClose,
  onServerChange,
}: IntegrationModalProps) {
  const [copied, setCopied] = useState(false);
  const configs = getConfigForIntegration(integration.id, server);

  async function copyPrimary() {
    await navigator.clipboard.writeText(configs[0]?.code ?? "");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="integration-title"
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-head">
          <BrandIcon integrationId={integration.id} alt={`${integration.name} logo`} />
          <div>
            <h2 id="integration-title">{integration.name}</h2>
            <p>{integration.description}</p>
          </div>
        </div>

        <div className="modal-toolbar">
          <label htmlFor="server-select">Server</label>
          <select
            id="server-select"
            value={server.id}
            onChange={(event) => onServerChange(event.target.value)}
          >
            {servers.map((item) => (
              <option key={item.id} value={item.id} disabled={item.status === "planned"}>
                {item.name}
                {item.status === "planned" ? " (planned)" : ""}
              </option>
            ))}
          </select>
          <a href={integration.docsUrl} target="_blank" rel="noreferrer">
            Official docs ↗
          </a>
        </div>

        <div className="modal-body">
          <div>
            <h3>Setup steps</h3>
            <ol className="steps">
              {integration.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="hint">
              Config file: <code>{integration.configPath}</code>
            </p>
          </div>

          <div className="config-stack">
            {configs.map((block) => (
              <ConfigBlock
                key={block.label}
                label={block.label}
                language={block.language}
                code={block.code}
              />
            ))}
            <button type="button" className="button primary copy-btn" onClick={copyPrimary}>
              {copied ? "Copied!" : "Copy primary config"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
