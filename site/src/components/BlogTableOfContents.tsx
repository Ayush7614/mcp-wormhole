import { TocLink } from "./TocLink";
import type { BlogHeading } from "../utils/blogHeadings";

interface BlogTableOfContentsProps {
  headings: BlogHeading[];
  activeId: string;
}

export function BlogTableOfContents({ headings, activeId }: BlogTableOfContentsProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc-label">On this page</p>
      <ol>
        <li className={`blog-toc-item blog-toc-overview ${activeId === "tldr" ? "active" : ""}`}>
          <TocLink targetId="tldr">TL;DR</TocLink>
        </li>
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`blog-toc-item blog-toc-level-${heading.level} ${
              activeId === heading.id ? "active" : ""
            }`}
          >
            <TocLink targetId={heading.id}>{heading.text}</TocLink>
          </li>
        ))}
      </ol>
    </aside>
  );
}
