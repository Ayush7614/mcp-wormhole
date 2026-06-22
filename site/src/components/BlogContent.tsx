import { useMemo } from "react";
import type { BlogBlock } from "../data/blogTypes";
import { buildHeadingIds } from "../utils/blogHeadings";

interface BlogContentProps {
  blocks: BlogBlock[];
}

function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export function BlogContent({ blocks }: BlogContentProps) {
  const headingIds = useMemo(() => buildHeadingIds(blocks), [blocks]);

  return (
    <article className="blog-article-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "tldr":
            return (
              <aside key={index} id="tldr" className="blog-tldr" aria-label="TL;DR">
                <p className="blog-tldr-label">TL;DR</p>
                <ul>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>
            );
          case "h2":
            return (
              <h2 key={index} id={headingIds.get(index)}>
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} id={headingIds.get(index)}>
                {block.text}
              </h3>
            );
          case "p":
            return <p key={index}>{block.text}</p>;
          case "ul":
            return (
              <ul key={index}>
                {block.items?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index}>
                {block.items?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          case "code":
            return (
              <pre key={index} className="blog-code">
                <code>{block.code}</code>
              </pre>
            );
          case "diagram":
            return (
              <figure key={index} className="blog-diagram">
                {block.title && <figcaption>{block.title}</figcaption>}
                <pre className="blog-diagram-code">
                  <code>{block.code}</code>
                </pre>
              </figure>
            );
          case "image":
            return (
              <figure key={index} className="blog-figure">
                <div className="blog-figure-frame">
                  <img src={asset(block.src)} alt={block.alt} loading="lazy" />
                </div>
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          case "callout":
            return (
              <aside
                key={index}
                className={`blog-callout blog-callout-${block.variant ?? "info"}`}
              >
                {block.title && <p className="blog-callout-title">{block.title}</p>}
                <p>{block.text}</p>
              </aside>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
