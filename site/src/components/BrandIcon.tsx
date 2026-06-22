import { logoUrl } from "../data/logos";

interface BrandIconProps {
  integrationId: string;
  alt: string;
}

export function BrandIcon({ integrationId, alt }: BrandIconProps) {
  return (
    <span className="brand-icon">
      <img src={logoUrl(integrationId)} alt={alt} loading="lazy" decoding="async" />
    </span>
  );
}
