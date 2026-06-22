export interface BlogPosterStat {
  label: string;
  value: string;
}

export interface BlogPosterAuthBadge {
  label: string;
  variant: "pat" | "stdio" | "npx" | "live" | "zod";
}

export type BlogPosterAgentPosition = "left" | "right" | "top" | "bottom";

export interface BlogPosterAgent {
  logo: string;
  label?: string;
  position: BlogPosterAgentPosition;
}

export interface BlogPosterFlowEnd {
  toolName: string;
  toolLogo: string;
  toolDesc: string;
  authBadges: BlogPosterAuthBadge[];
  cardStats: BlogPosterStat[];
}

export type BlogPosterConnection =
  | {
      layout: "hub";
      agents: BlogPosterAgent[];
    }
  | {
      layout: "flow";
      clientLogo: string;
      end: BlogPosterFlowEnd;
    };

export interface BlogPoster {
  posterAsset: string;
  headline: string;
  tagline: string;
  eyebrow?: string;
  badge?: string;
  stats: BlogPosterStat[];
  connection?: BlogPosterConnection;
}

export type BlogBlock =
  | { type: "tldr"; items: string[] }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; language?: string; code: string }
  | { type: "diagram"; title?: string; code: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "callout"; variant?: "info" | "tip" | "warn"; title?: string; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
  poster: BlogPoster;
  content: BlogBlock[];
}
