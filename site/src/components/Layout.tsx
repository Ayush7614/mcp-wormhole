import type { ReactNode } from "react";
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
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      {children}
      <Footer />
    </div>
  );
}
