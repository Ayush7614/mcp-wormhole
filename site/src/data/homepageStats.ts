import { ASANA_TOOL_COUNT } from "./asanaCatalog";
import { VERCEL_TOOL_COUNT } from "./vercelCatalog";
import { GCAL_TOOL_COUNT } from "./googleCalendarCatalog";
import { LINEAR_TOOL_COUNT } from "./linearCatalog";
import { CLOUDFLARE_TOOL_COUNT } from "./cloudflareCatalog";

export function getHomepageStats() {
  return {
    /** Live tool count from shipped MCP servers */
    toolsLive:
      ASANA_TOOL_COUNT + VERCEL_TOOL_COUNT + GCAL_TOOL_COUNT + LINEAR_TOOL_COUNT + CLOUDFLARE_TOOL_COUNT,
    /** Roadmap — wormhole to every tool */
    infiniteServers: "∞",
    /** AI clients with copy-paste setup guides */
    clientIntegrations: "30+",
  };
}
