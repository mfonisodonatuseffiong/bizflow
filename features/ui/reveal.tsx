"use client";

import { useEffect, useRef, useState } from "react";

// Show once at least 15% of the element is on screen (or 15% of the viewport
// height, for elements taller than the screen, which matters on phones).
const SHOW_AT = 0.15;
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  // Which side of the screen the element is hidden on, so it slides in from
  // above when scrolling up and from below when scrolling down.
  const [side, setSide] = useState<"above" | "below">("below");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
        const visibleEnough =
          entry.intersectionRatio >= SHOW_AT ||
          entry.intersectionRect.height >= viewportHeight * SHOW_AT;

        if (entry.isIntersecting && visibleEnough) {
          setShown(true);
        } else if (!entry.isIntersecting) {
          // Fully off screen: hide again, remembering which edge it left by.
          const top = entry.rootBounds?.top ?? 0;
          setSide(entry.boundingClientRect.bottom <= top ? "above" : "below");
          setShown(false);
        }
      },
      { threshold: THRESHOLDS },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // The observed wrapper never moves. Observing the element that is being
    // translated makes it flicker in and out at the screen edge.
    <div ref={ref} className={className}>
      <div
        // Stagger only when appearing, so hiding never lags behind the scroll.
        style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
        className={`h-full transition duration-700 ease-out motion-reduce:transition-none ${
          shown
            ? "translate-y-0 opacity-100"
            : side === "above"
              ? "-translate-y-8 opacity-0"
              : "translate-y-8 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}