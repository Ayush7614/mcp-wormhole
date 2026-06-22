import { Link, Navigate, useParams } from "react-router-dom";
import { SectionLink } from "../components/SectionLink";
import { GuideStepSection } from "../components/GuideStepSection";
import { FrameworkPicker } from "../components/FrameworkPicker";
import { buildServerGuide } from "../data/serverGuides";
import { getServer } from "../data/servers";

export function ServerGuidePage() {
  const { serverId } = useParams();
  const server = serverId ? getServer(serverId) : undefined;

  if (!server) {
    return <Navigate to="/" replace />;
  }

  const guide = buildServerGuide(server);
  const disabled = server.status === "planned";

  return (
    <main className="tutorial-page">
      <div className="container">
        <nav className="guide-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <SectionLink sectionId="servers">Servers</SectionLink>
          <span>/</span>
          <Link to={`/servers/${server.id}`}>{server.name}</Link>
          <span>/</span>
          <span>Guide</span>
        </nav>

        <header className="tutorial-hero">
          <span className="guide-server-badge">{server.name}</span>
          <h1>{guide.title}</h1>
          <p className="tutorial-hero-lead">{guide.subtitle}</p>
          <div className="guide-header-actions">
            <span className={`status-pill ${server.status}`}>
              {disabled ? "Server planned" : "Ready to use"}
            </span>
            <span className="tutorial-meta">
              {guide.steps.length} steps · {server.tools.length} tools ·{" "}
              <code>{server.npmPackage}</code>
            </span>
          </div>
          <div className="tutorial-hero-actions">
            <Link to={`/servers/${server.id}`} className="button secondary">
              ← Back to {server.name}
            </Link>
            {server.docsUrl && (
              <a href={server.docsUrl} target="_blank" rel="noreferrer" className="button secondary">
                {server.name} API docs ↗
              </a>
            )}
          </div>
        </header>

        <div className="tutorial-layout">
          <aside className="tutorial-toc" aria-label="Guide contents">
            <p className="tutorial-toc-label">On this page</p>
            <ol>
              {guide.steps.map((step) => (
                <li key={step.id}>
                  <a href={`#${step.id}`}>{step.title}</a>
                </li>
              ))}
              {!disabled && (
                <li>
                  <a href="#frameworks">Connect your client</a>
                </li>
              )}
            </ol>
          </aside>

          <div className="tutorial-steps">
            {guide.steps.map((step) => (
              <GuideStepSection key={step.id} step={step} />
            ))}

            <footer className="tutorial-footer">
              <p>
                Need help?{" "}
                <a
                  href="https://github.com/Ayush7614/mcp-wormhole/issues"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open an issue on GitHub
                </a>
              </p>
            </footer>
          </div>
        </div>
      </div>

      {!disabled && <FrameworkPicker serverId={server.id} serverName={server.name} />}
    </main>
  );
}
