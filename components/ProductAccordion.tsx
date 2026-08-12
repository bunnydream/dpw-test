"use client";

import { useEffect } from "react";

/**
 * Ports the inline <script> at the bottom of product-FINAL.html.
 *
 * Source behavior (identical logic, run twice for two independent groups):
 *   document.querySelectorAll('.ps-acc-trigger').forEach(btn => {
 *     btn.addEventListener('click', () => {
 *       const isOpen = btn.getAttribute('aria-expanded') === 'true';
 *       document.querySelectorAll('.ps-acc-trigger').forEach(b => {
 *         b.setAttribute('aria-expanded', 'false');
 *         b.nextElementSibling.hidden = true;
 *       });
 *       if (!isOpen) {
 *         btn.setAttribute('aria-expanded', 'true');
 *         btn.nextElementSibling.hidden = false;
 *       }
 *     });
 *   });
 *
 * Same block repeated for '.vq-trigger'. Each group is a single-open
 * accordion: clicking a trigger closes every trigger in its group, then
 * (only if the clicked trigger was previously closed) re-opens that one —
 * so clicking an already-open item just closes it.
 */
export default function ProductAccordion() {
  useEffect(() => {
    function wireGroup(selector: string) {
      const triggers = Array.from(document.querySelectorAll<HTMLButtonElement>(selector));

      const handlerFor = (btn: HTMLButtonElement) => () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        triggers.forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          const panel = b.nextElementSibling as HTMLElement | null;
          if (panel) panel.hidden = true;
        });
        if (!isOpen) {
          btn.setAttribute("aria-expanded", "true");
          const panel = btn.nextElementSibling as HTMLElement | null;
          if (panel) panel.hidden = false;
        }
      };

      const bound = triggers.map((btn) => {
        const handler = handlerFor(btn);
        btn.addEventListener("click", handler);
        return { btn, handler };
      });

      return () => {
        bound.forEach(({ btn, handler }) => btn.removeEventListener("click", handler));
      };
    }

    const unwirePs = wireGroup(".ps-acc-trigger");
    const unwireVq = wireGroup(".vq-trigger");

    return () => {
      unwirePs();
      unwireVq();
    };
  }, []);

  return null;
}
