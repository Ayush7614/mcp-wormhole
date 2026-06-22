import { Link } from "react-router-dom";
import { getBlogPostsSorted } from "../data/blogs";

export function BlogPage() {
  const posts = getBlogPostsSorted();

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Blog
          </p>
          <h1>
            Guides, tutorials &amp; <span className="hero-gradient-text">MCP deep dives</span>
          </h1>
          <p className="blog-hero-lead">
            Release notes, integration walkthroughs, and contributor guides for the mcp-wormhole
            ecosystem.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
                <div className="blog-card-meta">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span>{post.readTime}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <div className="blog-card-tags">
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <span className="blog-card-cta">Read article →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
