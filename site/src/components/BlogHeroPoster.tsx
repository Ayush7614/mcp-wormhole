import type { BlogPoster } from "../data/blogTypes";
import { BlogConnectionDiagram } from "./BlogConnectionDiagram";
import { publicAsset } from "../lib/assets";

interface BlogHeroPosterProps {
  title: string;
  excerpt: string;
  poster: BlogPoster;
  readTime: string;
  date: string;
}

export function BlogHeroPoster({ title, excerpt, poster, readTime, date }: BlogHeroPosterProps) {
  return (
    <section className="blog-hero-poster blog-hero-composio" aria-label="Article overview">
      <div className="blog-composio-layout">
        <div className="blog-composio-copy">
          {poster.eyebrow && <p className="blog-composio-eyebrow">{poster.eyebrow}</p>}
          <p className="blog-composio-headline">{poster.headline}</p>
          <p className="blog-composio-tagline">{poster.tagline}</p>
          {poster.badge && <span className="blog-composio-badge">{poster.badge}</span>}
        </div>

        <div className="blog-composio-visual">
          {poster.connection ? (
            <BlogConnectionDiagram poster={poster} />
          ) : (
            <img
              src={publicAsset(poster.posterAsset)}
              alt=""
              className="blog-poster-gif-composio"
              loading="eager"
            />
          )}
        </div>
      </div>

      <div className="blog-poster-below">
        <div className="blog-poster-below-copy">
          <h1>{title}</h1>
          <p className="blog-poster-excerpt">{excerpt}</p>
          <div className="blog-poster-meta">
            <time dateTime={date}>
              {new Date(date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span className="blog-poster-meta-dot" aria-hidden="true" />
            <span>{readTime} read</span>
          </div>
        </div>
        <div className="blog-poster-stats">
          {poster.stats.map((stat) => (
            <div key={stat.label} className="blog-poster-stat">
              <span className="blog-poster-stat-value">{stat.value}</span>
              <span className="blog-poster-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
