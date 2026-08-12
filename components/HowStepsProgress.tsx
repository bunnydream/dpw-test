"use client";

import { useEffect } from "react";

export default function HowStepsProgress() {
  useEffect(() => {
    const wrap = document.querySelector<HTMLElement>(".how-steps-wrap");
    const bar = document.querySelector<HTMLElement>(".how-steps-progress");
    if (!wrap || !bar) return;

    function update() {
      const rect = wrap!.getBoundingClientRect();
      const viewH = window.innerHeight;
      const scrolled = Math.max(0, viewH * 0.5 - rect.top);
      const total = Math.max(1, wrap!.offsetHeight - 90);
      const pct = Math.min(1, scrolled / total);
      const lineMax = Math.max(0, wrap!.offsetHeight - 112);
      bar!.style.height = pct * lineMax + "px";
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return null;
}
