import { HashRouter, Route, Routes } from "react-router-dom";
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
        </Routes>
      </Layout>
    </HashRouter>
  );
}
