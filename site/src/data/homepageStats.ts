import { ASANA_TOOL_COUNT } from "./asanaCatalog";
import { VERCEL_TOOL_COUNT } from "./vercelCatalog";

export function getHomepageStats() {
  return {
    /** Live tool count from shipped MCP servers */
    toolsLive: ASANA_TOOL_COUNT + VERCEL_TOOL_COUNT,
    /** Roadmap — wormhole to every tool */
    infiniteServers: "∞",
    /** AI clients with copy-paste setup guides */
    clientIntegrations: "30+",
  };
}
