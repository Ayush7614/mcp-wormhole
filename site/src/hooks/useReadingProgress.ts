import { useEffect, useState } from "react";

const HEADER_OFFSET = 96;

/** Tracks scroll progress through an article element (0–100, hits 100 at bottom). */
export function useReadingProgress(selector: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.querySelector(selector) as HTMLElement | null;
    if (!target) {
      return;
    }

    const calculate = () => {
      const rect = target.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = target.offsetHeight;
      const viewportHeight = window.innerHeight;

      const start = elementTop - HEADER_OFFSET;
      const end = elementTop + elementHeight - viewportHeight + HEADER_OFFSET;
      const range = Math.max(end - start, 1);
      const scrolled = window.scrollY - start;
      const raw = scrolled / range;

      setProgress(Math.min(100, Math.max(0, Math.round(raw * 100))));
    };

    calculate();
    window.addEventListener("scroll", calculate, { passive: true });
    window.addEventListener("resize", calculate);

    const observer = new ResizeObserver(calculate);
    observer.observe(target);

    return () => {
      window.removeEventListener("scroll", calculate);
      window.removeEventListener("resize", calculate);
      observer.disconnect();
    };
  }, [selector]);

  return progress;
}
