import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SCROLL_SECTION_KEY = "mcp-scroll-section";

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Scroll to a home-page section after navigating from another route or legacy hash URL. */
export function useScrollToSectionOnHome() {
  const location = useLocation();

  useEffect(() => {
    const fromState = (location.state as { scrollTo?: string } | null)?.scrollTo;
    const fromSession = sessionStorage.getItem(SCROLL_SECTION_KEY);
    const sectionId = fromState ?? fromSession;

    if (!sectionId || location.pathname !== "/") {
      return;
    }

    sessionStorage.removeItem(SCROLL_SECTION_KEY);
    if (fromState) {
      window.history.replaceState({}, document.title);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToSection(sectionId));
    });
  }, [location]);
}
