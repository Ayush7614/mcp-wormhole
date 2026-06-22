import type { MouseEvent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SCROLL_SECTION_KEY, scrollToSection } from "../hooks/useScrollToSection";

interface SectionLinkProps {
  sectionId: string;
  className?: string;
  children: ReactNode;
}

export function SectionLink({ sectionId, className, children }: SectionLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (location.pathname !== "/") {
      sessionStorage.setItem(SCROLL_SECTION_KEY, sectionId);
      navigate("/");
      return;
    }

    scrollToSection(sectionId);
  };

  return (
    <a href={`#${sectionId}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
