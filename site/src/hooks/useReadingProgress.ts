import { useEffect, useState } from "react";

/** Tracks scroll progress through the main article column (0–100). */
export function useReadingProgress(selector: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.querySelector(selector);
    if (!target) {
      return;
    }

    const onScroll = () => {
      const rect = target.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const start = scrollTop + rect.top - 96;
      const end = start + target.scrollHeight - window.innerHeight * 0.4;
      const raw = (scrollTop - start) / Math.max(end - start, 1);
      setProgress(Math.min(100, Math.max(0, raw * 100)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [selector]);

  return progress;
}
