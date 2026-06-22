import type { ReactNode } from "react";
import { AmbientBackground } from "./AmbientBackground";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useTrackGuidePath } from "../hooks/useScrollToSection";
import type { Theme } from "../hooks/useTheme";

interface LayoutProps {
  theme: Theme;
  onToggleTheme: () => void;
  children: ReactNode;
}

export function Layout({ theme, onToggleTheme, children }: LayoutProps) {
  useTrackGuidePath();

  return (
    <div className="app">
      <AmbientBackground />
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      <div className="app-content">{children}</div>
      <Footer />
    </div>
  );
}
