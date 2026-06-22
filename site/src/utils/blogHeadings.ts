import type { BlogBlock } from "../data/blogTypes";

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface BlogHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function buildHeadingIds(blocks: BlogBlock[]): Map<number, string> {
  const ids = new Map<number, string>();
  const used = new Set<string>();

  blocks.forEach((block, index) => {
    if (block.type !== "h2" && block.type !== "h3") {
      return;
    }
    let id = slugifyHeading(block.text);
    let suffix = 2;
    while (used.has(id)) {
      id = `${slugifyHeading(block.text)}-${suffix++}`;
    }
    used.add(id);
    ids.set(index, id);
  });

  return ids;
}

export function extractBlogHeadings(blocks: BlogBlock[]): BlogHeading[] {
  const headingIds = buildHeadingIds(blocks);

  return blocks.flatMap((block, index) => {
    if (block.type !== "h2" && block.type !== "h3") {
      return [];
    }
    return [
      {
        id: headingIds.get(index)!,
        text: block.text,
        level: block.type === "h2" ? 2 : 3,
      },
    ];
  });
}
