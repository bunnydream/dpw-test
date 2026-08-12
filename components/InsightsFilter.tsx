"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "product", label: "Product" },
  { value: "policy", label: "Policy" },
  { value: "service-design", label: "Service Design" },
  { value: "accessibility", label: "Accessibility" },
  { value: "field-notes", label: "Field Notes" },
];

/**
 * Ports the insights-FINAL.html category filter script:
 *   const catBtns = document.querySelectorAll('.cat-btn');
 *   const postCards = document.querySelectorAll('.case-card');
 *   catBtns.forEach(btn => btn.addEventListener('click', () => { ... }));
 *
 * Pills are rendered here (exact labels/order/data-cat values from the source
 * markup). Post cards are passed in as children so page.tsx can keep the
 * hardcoded placeholder cards as plain static JSX, matching the current
 * mockup — no Supabase-driven data yet, that's future work.
 */
export default function InsightsFilter({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("all");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll<HTMLElement>(".case-card");
    cards.forEach((card) => {
      if (active === "all" || card.dataset.cat === active) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }, [active]);

  return (
    <>
      <div className="cat-filter" role="group" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            className={`cat-btn${active === cat.value ? " active" : ""}`}
            data-cat={cat.value}
            onClick={() => setActive(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="io-grid" id="postGrid" ref={gridRef}>
        {children}
      </div>
    </>
  );
}
