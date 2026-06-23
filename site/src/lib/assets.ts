/** Bump when demo GIF binaries change so browsers fetch fresh assets. */
export const DEMO_ASSETS_VERSION = "5";

export function publicAsset(path: string): string {
  const normalized = path.replace(/^\//, "");
  const url = `${import.meta.env.BASE_URL}${normalized}`;
  if (normalized.endsWith(".gif")) {
    return `${url}?v=${DEMO_ASSETS_VERSION}`;
  }
  return url;
}
