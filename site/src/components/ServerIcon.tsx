import { serverLogoUrl } from "../data/logos";

interface ServerIconProps {
  serverId: string;
  name: string;
}

export function ServerIcon({ serverId, name }: ServerIconProps) {
  return (
    <span className="brand-icon server-icon">
      <img src={serverLogoUrl(serverId)} alt={`${name} logo`} loading="lazy" decoding="async" />
    </span>
  );
}
