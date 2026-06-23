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
  "connect-vercel-to-cursor":
    "Add VERCEL_TEAM_ID if your Vercel projects live under a team account.",
  "building-an-mcp-server":
    "Start with read tools before write tools — agents explore before they mutate.",
  "inside-asana-mcp-server":
    "Invoke daily_focus_plan or project_health_scan for multi-step agent workflows.",
  "inside-vercel-mcp-server":
    "Use failed_deploy_triage or production_rollback_plan before touching production.",
  "connect-google-calendar-to-cursor":
    "OAuth apps in Testing mode require your Google account under Audience → Test users.",
  "inside-google-calendar-mcp-server":
    "Invoke find_meeting_time or today_agenda for multi-step scheduling workflows.",
  "connect-linear-to-cursor":
    "Set LINEAR_TEAM_ID in mcp.json when you work across multiple Linear teams.",
  "inside-linear-mcp-server":
    "Invoke issue_triage or sprint_board_overview for multi-step backlog workflows.",
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

  const completed = progress >= 100;

  return (
    <aside className="blog-sidebar" aria-label="Article extras">
      <div className={`blog-sidebar-progress ${completed ? "blog-sidebar-progress-done" : ""}`}>
        <div className="blog-sidebar-progress-ring">
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <path
              className="blog-sidebar-progress-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="blog-sidebar-progress-fill"
              strokeDasharray={`${Math.min(progress, 100)}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="blog-sidebar-progress-text">
            {completed ? "✓" : `${Math.round(progress)}%`}
          </span>
        </div>
        <p className="blog-sidebar-progress-label">
          {completed ? "Article completed!" : "Reading progress"}
        </p>
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
