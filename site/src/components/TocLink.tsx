import type { MouseEvent, ReactNode } from "react";
import { scrollToSection } from "../hooks/useScrollToSection";

interface TocLinkProps {
  targetId: string;
  children: ReactNode;
}

/** In-page TOC link that scrolls without breaking HashRouter routes. */
export function TocLink({ targetId, children }: TocLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(targetId);
  };

  return (
    <a href={`#${targetId}`} onClick={handleClick}>
      {children}
    </a>
  );
}
