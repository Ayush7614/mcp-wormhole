import { integrations } from "../data/integrations";
import { servers } from "../data/servers";

export function getHomepageStats() {
  const liveServers = servers.filter((s) => s.status === "available").length;
  const totalServers = servers.length;
  const clientIntegrations = integrations.length;

  return {
    liveServers,
    totalServers,
    clientIntegrations,
  };
}
