import { useScrollToSectionOnHome } from "../hooks/useScrollToSection";
import { Hero } from "../components/Hero";
import { DemoShowcase } from "../components/DemoShowcase";
import { ServerGrid } from "../components/ServerGrid";
import { IntegrationGrid } from "../components/IntegrationGrid";

export function HomePage() {
  useScrollToSectionOnHome();

  return (
    <>
      <Hero />
      <DemoShowcase />
      <ServerGrid />
      <IntegrationGrid serverId="asana" serverName="Asana" />
    </>
  );
}
