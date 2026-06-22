import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { Theme } from "../hooks/useTheme";

interface LayoutProps {
  theme: Theme;
  onToggleTheme: () => void;
  children: ReactNode;
}

export function Layout({ theme, onToggleTheme, children }: LayoutProps) {
  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      {children}
      <Footer />
    </div>
  );
}
