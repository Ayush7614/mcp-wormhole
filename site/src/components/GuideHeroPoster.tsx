import type { ReactNode } from "react";
import { BrandIcon } from "./BrandIcon";
import { ServerIcon } from "./ServerIcon";
import type { GuidePoster } from "../data/guideTypes";
import { publicAsset } from "../lib/assets";

interface GuideHeroPosterProps {
  title: string;
  subtitle: string;
  poster: GuidePoster;
  status?: ReactNode;
  clientId?: string;
  clientName?: string;
  serverId: string;
  serverName: string;
}

export function GuideHeroPoster({
  title,
  subtitle,
  poster,
  status,
  clientId,
  clientName,
  serverId,
  serverName,
}: GuideHeroPosterProps) {
  const isClientGuide = Boolean(clientId && clientName);

  return (
    <section className="guide-hero-poster" aria-label="Integration overview">
      <div className="guide-poster-bg" aria-hidden="true">
        <div className="guide-poster-orb guide-poster-orb-a" />
        <div className="guide-poster-orb guide-poster-orb-b" />
        <div className="guide-poster-grid" />
      </div>

      <div className="guide-poster-inner">
        <div className="guide-poster-copy">
          <div className="guide-poster-logos">
            {isClientGuide && clientId && clientName && (
              <>
                <BrandIcon integrationId={clientId} alt={clientName} />
                <span className="guide-plus">+</span>
              </>
            )}
            <ServerIcon serverId={serverId} name={serverName} />
            <span className="guide-poster-name">{serverName}</span>
          </div>

          <h1>{title}</h1>
          <p className="guide-poster-subtitle">{subtitle}</p>

          <div className="guide-poster-stats">
            {poster.stats.map((stat) => (
              <div key={stat.label} className="guide-poster-stat">
                <span className="guide-poster-stat-value">{stat.value}</span>
                <span className="guide-poster-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {status && <div className="guide-poster-status">{status}</div>}
        </div>

        <div className="guide-poster-visual">
          <div className="terminal-window guide-poster-terminal">
            <div className="terminal-chrome">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">{poster.demoCaption}</span>
            </div>
            <img
              src={publicAsset(poster.demoAsset)}
              alt={poster.demoCaption}
              className="demo-gif guide-poster-gif"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
