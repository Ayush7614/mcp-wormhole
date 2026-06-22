import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LAST_GUIDE_PATH_KEY, SCROLL_SECTION_KEY } from "../hooks/useScrollToSection";

/** Step/section IDs used across server and client guides. */
const GUIDE_ANCHOR_IDS = new Set([
  "prerequisites",
  "token",
  "install",
  "configure",
  "restart",
  "prompts",
  "tools",
  "verify",
  "connect",
  "config-path",
  "preview",
  "demo",
  "frameworks",
  "references",
  "status",
  "auth",
  "config",
]);

/**
 * HashRouter treats `#prompts` as route `/prompts` — redirect back to the last
 * guide (or Asana server guide) and scroll to the section.
 */
export function LegacyAnchorRedirect() {
  const { anchorId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!anchorId || !GUIDE_ANCHOR_IDS.has(anchorId)) {
      navigate("/", { replace: true });
      return;
    }

    sessionStorage.setItem(SCROLL_SECTION_KEY, anchorId);
    const fallback = "/servers/asana/guide";
    const target = sessionStorage.getItem(LAST_GUIDE_PATH_KEY) ?? fallback;
    navigate(target, { replace: true });
  }, [anchorId, navigate]);

  return null;
}
