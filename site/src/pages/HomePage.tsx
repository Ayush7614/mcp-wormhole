import { useState } from "react";
import { useScrollToSectionOnHome } from "../hooks/useScrollToSection";
import { Hero } from "../components/Hero";
import { DemoShowcase } from "../components/DemoShowcase";
import { ServerGrid } from "../components/ServerGrid";
import { IntegrationGrid } from "../components/IntegrationGrid";
import { ServerDetail } from "../components/ServerDetail";
import { getServer } from "../data/servers";

export function HomePage() {
  useScrollToSectionOnHome();
  const [selectedServerId, setSelectedServerId] = useState<string>("asana");
  const server = getServer(selectedServerId);

  return (
    <>
      <Hero />
      <DemoShowcase />
      <ServerGrid selectedId={selectedServerId} onSelect={setSelectedServerId} />
      {server && <ServerDetail server={server} />}
      <IntegrationGrid defaultServerId={selectedServerId} />
    </>
  );
}
