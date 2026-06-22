interface BrandIconProps {
  name: string;
  color?: string;
}

export function BrandIcon({ name, color }: BrandIconProps) {
  const tint = color ? `#${color.replace("#", "")}` : undefined;

  return (
    <span className="brand-icon" style={tint ? { color: tint } : undefined}>
      <img
        src={`https://cdn.simpleicons.org/${name}/${color ?? "111827"}`}
        alt=""
        loading="lazy"
        onError={(event) => {
          const target = event.currentTarget;
          target.style.display = "none";
          const fallback = target.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.hidden = false;
        }}
      />
      <span className="brand-fallback" hidden>
        {name.slice(0, 2).toUpperCase()}
      </span>
    </span>
  );
}
