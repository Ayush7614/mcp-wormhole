import { ASANA_TOOL_COUNT } from "./asanaCatalog";

export function getHomepageStats() {
  return {
    /** Live tool count from the shipped Asana MCP server */
    toolsLive: ASANA_TOOL_COUNT,
    /** Roadmap — wormhole to every tool */
    infiniteServers: "∞",
    /** AI clients with copy-paste setup guides */
    clientIntegrations: "30+",
  };
}
