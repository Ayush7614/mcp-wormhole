import { npmDownloadsBadgeUrl, npmPackageUrl, npmVersionBadgeUrl } from "../lib/npmBadges";

interface NpmPackageBadgesProps {
  pkg: string;
  compact?: boolean;
}

export function NpmPackageBadges({ pkg, compact = false }: NpmPackageBadgesProps) {
  const href = npmPackageUrl(pkg);

  return (
    <div className={`npm-badges${compact ? " npm-badges-compact" : ""}`}>
      <a href={href} target="_blank" rel="noreferrer" className="npm-badge-link">
        <img src={npmVersionBadgeUrl(pkg)} alt={`${pkg} npm version`} loading="lazy" decoding="async" />
      </a>
      <a href={href} target="_blank" rel="noreferrer" className="npm-badge-link">
        <img
          src={npmDownloadsBadgeUrl(pkg)}
          alt={`${pkg} weekly npm downloads`}
          loading="lazy"
          decoding="async"
        />
      </a>
    </div>
  );
}
