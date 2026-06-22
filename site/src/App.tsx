import { HashRouter, Route, Routes } from "react-router-dom";
import { SectionRedirect } from "./components/SectionRedirect";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { GuidePage } from "./pages/GuidePage";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <HashRouter>
      <Layout theme={theme} onToggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guides/:clientId/:serverId?" element={<GuidePage />} />
          <Route path="/servers" element={<SectionRedirect sectionId="servers" />} />
          <Route path="/integrations" element={<SectionRedirect sectionId="integrations" />} />
          <Route path="/demo" element={<SectionRedirect sectionId="demo" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
