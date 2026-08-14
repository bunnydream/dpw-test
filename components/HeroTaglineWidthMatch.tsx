"use client";

import { useEffect, useRef } from "react";

/** Measures the nearest preceding h1's rendered width and applies it as
 * max-width to this tagline paragraph, so the subtitle wraps at exactly the
 * same line length as the headline. The headline and subtitle render at
 * different font sizes, so a shared max-width unit (ch, %, etc.) can't
 * guarantee matching wrap points at every viewport — this needs an actual
 * measurement. Recalculates on resize. */
export default function HeroTaglineWidthMatch({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    const h1 = el?.closest(".hero-left")?.querySelector("h1");
    if (!el || !h1) return;

    function sync() {
      el!.style.maxWidth = `${h1!.getBoundingClientRect().width}px`;
    }

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return (
    <p className="hero-tagline" ref={ref}>
      {children}
    </p>
  );
}
