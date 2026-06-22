import type { BlogBlock } from "../data/blogs";

interface BlogContentProps {
  blocks: BlogBlock[];
}

export function BlogContent({ blocks }: BlogContentProps) {
  return (
    <article className="blog-article-body">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return <h2 key={index}>{block.text}</h2>;
          case "h3":
            return <h3 key={index}>{block.text}</h3>;
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
          case "code":
            return (
              <pre key={index} className="blog-code">
                <code>{block.code}</code>
              </pre>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
