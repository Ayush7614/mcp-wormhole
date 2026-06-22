import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ServerGrid } from "./components/ServerGrid";
import { IntegrationGrid } from "./components/IntegrationGrid";
import { IntegrationModal } from "./components/IntegrationModal";
import { ServerDetail } from "./components/ServerDetail";
import { Footer } from "./components/Footer";
import { getIntegration } from "./data/integrations";
import { getServer } from "./data/servers";

export default function App() {
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<string | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string>("asana");

  const integration = useMemo(
    () => (selectedIntegrationId ? getIntegration(selectedIntegrationId) : undefined),
    [selectedIntegrationId],
  );
  const server = useMemo(() => getServer(selectedServerId), [selectedServerId]);

  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <ServerGrid
          selectedId={selectedServerId}
          onSelect={setSelectedServerId}
        />
        {server && <ServerDetail server={server} />}
        <IntegrationGrid onSelect={setSelectedIntegrationId} />
      </main>
      <Footer />
      {integration && server && (
        <IntegrationModal
          integration={integration}
          server={server}
          onClose={() => setSelectedIntegrationId(null)}
          onServerChange={setSelectedServerId}
        />
      )}
    </div>
  );
}
