import { useState } from "react";
import { Link } from "react-router-dom";
import { scrollToSection } from "../hooks/useScrollToSection";
import type { BlogPost } from "../data/blogTypes";

interface BlogSidebarProps {
  post: BlogPost;
  progress: number;
}

const WORMHOLE_TIPS: Record<string, string> = {
  "introducing-mcp-wormhole":
    "Every MCP server in the monorepo runs locally — your credentials never leave your machine.",
  "connect-asana-to-cursor":
    "Cursor loads MCP servers at startup. Fully quit (Cmd+Q) after editing mcp.json.",
  "building-an-mcp-server":
    "Start with read tools before write tools — agents explore before they mutate.",
  "inside-asana-mcp-server":
    "Invoke daily_focus_plan or project_health_scan for multi-step agent workflows.",
};

export function BlogSidebar({ post, progress }: BlogSidebarProps) {
  const [copied, setCopied] = useState(false);
  const tip = WORMHOLE_TIPS[post.slug] ?? "Install with npx — zero clone required.";

  const copyLink = async () => {
    const url = `${window.location.origin}${import.meta.env.BASE_URL}#/blog/${post.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="blog-sidebar" aria-label="Article extras">
      <div className="blog-sidebar-progress">
        <div className="blog-sidebar-progress-ring">
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <path
              className="blog-sidebar-progress-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="blog-sidebar-progress-fill"
              strokeDasharray={`${progress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="blog-sidebar-progress-text">{Math.round(progress)}%</span>
        </div>
        <p className="blog-sidebar-progress-label">Reading progress</p>
      </div>

      <div className="blog-sidebar-card blog-sidebar-author">
        <div className="blog-sidebar-avatar" aria-hidden="true">
          {post.author.charAt(0)}
        </div>
        <div>
          <p className="blog-sidebar-card-label">Written by</p>
          <p className="blog-sidebar-author-name">{post.author}</p>
        </div>
      </div>

      <div className="blog-sidebar-card">
        <p className="blog-sidebar-card-label">Quick jump</p>
        <div className="blog-sidebar-actions">
          <button type="button" className="blog-sidebar-btn" onClick={() => scrollToSection("tldr")}>
            ↓ TL;DR
          </button>
          <button type="button" className="blog-sidebar-btn" onClick={copyLink}>
            {copied ? "✓ Copied!" : "⎘ Share link"}
          </button>
        </div>
      </div>

      <div className="blog-sidebar-card blog-sidebar-wormhole">
        <p className="blog-sidebar-card-label">Wormhole tip</p>
        <p className="blog-sidebar-tip">{tip}</p>
      </div>

      <div className="blog-sidebar-card">
        <p className="blog-sidebar-card-label">Tags</p>
        <div className="blog-sidebar-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="blog-sidebar-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="blog-sidebar-card blog-sidebar-links">
        <p className="blog-sidebar-card-label">Explore</p>
        <Link to="/blog">← All posts</Link>
        <Link to="/servers/asana">Asana server →</Link>
        <a
          href="https://www.npmjs.com/package/@mcp-wormhole/asana"
          target="_blank"
          rel="noreferrer"
        >
          npm package ↗
        </a>
      </div>

      <div className="blog-sidebar-terminal" aria-hidden="true">
        <span className="blog-sidebar-terminal-prompt">$</span>
        <span className="blog-sidebar-terminal-cmd">npx @mcp-wormhole/asana</span>
        <span className="blog-sidebar-terminal-cursor" />
      </div>
    </aside>
  );
}
