import { Link, Navigate, useParams } from "react-router-dom";
import { BlogContent } from "../components/BlogContent";
import { getBlogPost, getBlogPostsSorted } from "../data/blogs";

export function BlogPostPage() {
  const { slug } = useParams();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const related = getBlogPostsSorted()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2);

  return (
    <main className="blog-post-page">
      <div className="container">
        <nav className="guide-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/blog">Blog</Link>
          <span>/</span>
          <span>{post.title}</span>
        </nav>

        <header className="blog-post-header">
          <div className="blog-card-meta blog-post-meta">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span>{post.readTime}</span>
            <span>{post.author}</span>
          </div>
          <h1>{post.title}</h1>
          <p className="blog-post-excerpt">{post.excerpt}</p>
          <div className="blog-card-tags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>

        <BlogContent blocks={post.content} />

        {related.length > 0 && (
          <section className="blog-related">
            <h2>More from the blog</h2>
            <div className="blog-related-grid">
              {related.map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`} className="blog-related-card">
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
