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
      <div className="blog-poster-bg" aria-hidden="true">
        <div className="blog-poster-orb blog-poster-orb-a" />
        <div className="blog-poster-orb blog-poster-orb-b" />
        <div className="blog-poster-orb blog-poster-orb-c" />
        <div className="blog-poster-grid" />
        <div className="blog-poster-scanline" />
      </div>

      <div className="blog-poster-inner">
        <div className="blog-poster-copy">
          {poster.badge && <span className="blog-poster-badge">{poster.badge}</span>}

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

          <div className="blog-poster-stats">
            {poster.stats.map((stat) => (
              <div key={stat.label} className="blog-poster-stat">
                <span className="blog-poster-stat-value">{stat.value}</span>
                <span className="blog-poster-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="blog-poster-visual">
          <div className="terminal-window blog-poster-terminal">
            <div className="terminal-chrome">
              <span className="terminal-dot red" />
              <span className="terminal-dot yellow" />
              <span className="terminal-dot green" />
              <span className="terminal-title">{poster.demoCaption}</span>
              <span className="blog-poster-live">
                <span className="blog-poster-live-dot" aria-hidden="true" />
                LIVE
              </span>
            </div>
            <div className="blog-poster-gif-wrap">
              <img
                src={asset(poster.demoAsset)}
                alt={poster.demoCaption}
                className="demo-gif blog-poster-gif"
                loading="eager"
              />
              <div className="blog-poster-gif-shine" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
