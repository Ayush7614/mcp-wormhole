import type { BlogPost } from "./blogTypes";
import { introducingMcpWormhole } from "./blogPosts/introducing-mcp-wormhole";
import { connectAsanaToCursor } from "./blogPosts/connect-asana-to-cursor";
import { connectVercelToCursor } from "./blogPosts/connect-vercel-to-cursor";
import { insideVercelMcpServer } from "./blogPosts/inside-vercel-mcp-server";
import { buildingAnMcpServer } from "./blogPosts/building-an-mcp-server";
import { insideAsanaMcpServer } from "./blogPosts/inside-asana-mcp-server";

export type { BlogBlock, BlogPost } from "./blogTypes";

export const blogPosts: BlogPost[] = [
  insideVercelMcpServer,
  connectVercelToCursor,
  insideAsanaMcpServer,
  buildingAnMcpServer,
  connectAsanaToCursor,
  introducingMcpWormhole,
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsSorted(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}
