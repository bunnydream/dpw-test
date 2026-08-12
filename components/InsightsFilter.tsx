"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Ports the insights-FINAL.html category filter script:
 *   const catBtns = document.querySelectorAll('.cat-btn');
 *   const postCards = document.querySelectorAll('.case-card');
 *   catBtns.forEach(btn => btn.addEventListener('click', () => { ... }));
 *
 * Pills are rendered here, driven by the distinct category strings actually
 * present among published posts (passed down from page.tsx, which fetches
 * them from Supabase) — "All" is always first. Post cards are passed in as
 * children with a matching `data-cat` attribute so the filter can show/hide
 * them without page.tsx needing to know about this component's state.
 */
export default function InsightsFilter({ categories, children }: { categories: string[]; children: ReactNode }) {
  const [active, setActive] = useState("All");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll<HTMLElement>(".case-card");
    cards.forEach((card) => {
      if (active === "All" || card.dataset.cat === active) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }, [active]);

  return (
    <>
      <div className="cat-filter" role="group" aria-label="Filter by category">
        <button
          type="button"
          className={`cat-btn${active === "All" ? " active" : ""}`}
          data-cat="All"
          onClick={() => setActive("All")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cat-btn${active === cat ? " active" : ""}`}
            data-cat={cat}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="io-grid" id="postGrid" ref={gridRef}>
        {children}
      </div>
    </>
  );
}
