import type { BlogPoster } from "../data/blogTypes";

interface BlogHeroPosterProps {
  title: string;
  excerpt: string;
  poster: BlogPoster;
  readTime: string;
  date: string;
}

function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export function BlogHeroPoster({ title, excerpt, poster, readTime, date }: BlogHeroPosterProps) {
  return (
    <section className="blog-hero-poster" aria-label="Article overview">
      <div className="blog-poster-frame">
        <img
          src={asset(poster.posterAsset)}
          alt=""
          className="blog-poster-gif-full"
          loading="eager"
          aria-hidden="true"
        />
        <div className="blog-poster-overlay" aria-hidden="true" />
        <div className="blog-poster-text-layer">
          {poster.badge && <span className="blog-poster-badge">{poster.badge}</span>}
          <p className="blog-poster-headline">{poster.headline}</p>
          <p className="blog-poster-tagline">{poster.tagline}</p>
        </div>
        <div className="blog-poster-live">
          <span className="blog-poster-live-dot" aria-hidden="true" />
          TOOLS CONNECTED
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
