import { HashRouter, Route, Routes } from "react-router-dom";
import { SectionRedirect } from "./components/SectionRedirect";
import { LegacyAnchorRedirect } from "./components/LegacyAnchorRedirect";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { GuidePage } from "./pages/GuidePage";
import { ServerPage } from "./pages/ServerPage";
import { ServerGuidePage } from "./pages/ServerGuidePage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <HashRouter>
      <Layout theme={theme} onToggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servers/:serverId" element={<ServerPage />} />
          <Route path="/servers/:serverId/guide" element={<ServerGuidePage />} />
          <Route path="/guides/:clientId/:serverId?" element={<GuidePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/servers" element={<SectionRedirect sectionId="servers" />} />
          <Route path="/integrations" element={<SectionRedirect sectionId="integrations" />} />
          <Route path="/demo" element={<SectionRedirect sectionId="demo" />} />
          <Route path="/:anchorId" element={<LegacyAnchorRedirect />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
