import { Link, Navigate, useParams } from "react-router-dom";
import { BlogContent } from "../components/BlogContent";
import { BlogHeroPoster } from "../components/BlogHeroPoster";
import { BlogSidebar } from "../components/BlogSidebar";
import { BlogTableOfContents } from "../components/BlogTableOfContents";
import { getBlogPost, getBlogPostsSorted } from "../data/blogs";
import { useActiveHeading } from "../hooks/useActiveHeading";
import { useReadingProgress } from "../hooks/useReadingProgress";
import { useScrollToAnchorOnMount } from "../hooks/useScrollToSection";
import { extractBlogHeadings } from "../utils/blogHeadings";

export function BlogPostPage() {
  useScrollToAnchorOnMount();
  const { slug } = useParams();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const headings = extractBlogHeadings(post.content);
  const activeId = useActiveHeading(headings);
  const progress = useReadingProgress(".blog-post-main");

  const related = getBlogPostsSorted()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

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

        <BlogHeroPoster
          title={post.title}
          excerpt={post.excerpt}
          poster={post.poster}
          readTime={post.readTime}
          date={post.date}
        />

        <div className="blog-post-meta-bar">
          <div className="blog-card-tags">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <span className="blog-post-author-inline">{post.author}</span>
        </div>

        <div className="blog-post-layout">
          <BlogTableOfContents headings={headings} activeId={activeId} />

          <div className="blog-post-main">
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

          <BlogSidebar post={post} progress={progress} />
        </div>
      </div>
    </main>
  );
}
