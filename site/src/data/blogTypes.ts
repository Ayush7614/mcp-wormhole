export interface BlogPosterStat {
  label: string;
  value: string;
}

export interface BlogPoster {
  demoAsset: string;
  demoCaption: string;
  badge?: string;
  stats: BlogPosterStat[];
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
