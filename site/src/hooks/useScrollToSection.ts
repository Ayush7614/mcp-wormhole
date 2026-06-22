import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const SCROLL_SECTION_KEY = "mcp-scroll-section";
export const LAST_GUIDE_PATH_KEY = "mcp-last-guide-path";

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Scroll to a home-page section after navigating from another route. */
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

/** Scroll to an anchor after navigating to a guide page (legacy hash fix). */
export function useScrollToAnchorOnMount() {
  const location = useLocation();

  useEffect(() => {
    const sectionId = sessionStorage.getItem(SCROLL_SECTION_KEY);
    if (!sectionId) {
      return;
    }

    sessionStorage.removeItem(SCROLL_SECTION_KEY);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToSection(sectionId));
    });
  }, [location.pathname]);
}

/** Remember guide URL so broken `#/prompts` links can redirect back. */
export function useTrackGuidePath() {
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.startsWith("/servers/") ||
      location.pathname.startsWith("/guides/")
    ) {
      sessionStorage.setItem(LAST_GUIDE_PATH_KEY, location.pathname);
    }
  }, [location.pathname]);
}
