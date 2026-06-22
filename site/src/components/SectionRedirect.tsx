import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SCROLL_SECTION_KEY } from "../hooks/useScrollToSection";

interface SectionRedirectProps {
  sectionId: string;
}

/** Handles legacy hash URLs like #servers that HashRouter treats as routes. */
export function SectionRedirect({ sectionId }: SectionRedirectProps) {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem(SCROLL_SECTION_KEY, sectionId);
    navigate("/", { replace: true });
  }, [sectionId, navigate]);

  return null;
}
