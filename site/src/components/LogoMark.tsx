interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 28, className = "" }: LogoMarkProps) {
  const src = `${import.meta.env.BASE_URL}logo.svg`;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`logo-mark ${className}`.trim()}
      width={size}
      height={size}
      decoding="async"
    />
  );
}
