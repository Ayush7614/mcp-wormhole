import { useScrollToSectionOnHome } from "../hooks/useScrollToSection";
import { Hero } from "../components/Hero";
import { CatalogCliShowcase } from "../components/CatalogCliShowcase";
import { DemoShowcase } from "../components/DemoShowcase";
import { ServerGrid } from "../components/ServerGrid";
import { IntegrationGrid } from "../components/IntegrationGrid";

export function HomePage() {
  useScrollToSectionOnHome();

  return (
    <>
      <Hero />
      <CatalogCliShowcase />
      <DemoShowcase />
      <ServerGrid />
      <IntegrationGrid />
    </>
  );
}
