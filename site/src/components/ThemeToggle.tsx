import type { Theme } from "../hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      <span className="theme-toggle-track">
        <span className={`theme-toggle-icon ${theme === "dark" ? "active" : ""}`} aria-hidden="true">
          ☾
        </span>
        <span className={`theme-toggle-icon ${theme === "light" ? "active" : ""}`} aria-hidden="true">
          ☀
        </span>
        <span className="theme-toggle-thumb" />
      </span>
    </button>
  );
}
