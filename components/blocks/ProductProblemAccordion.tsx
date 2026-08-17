export type ProductProblemItem = {
  title: string;
  problem: string;
  solution: string;
};

export type ProductProblemAccordionContent = {
  solution_label: string;
  /** Fixed length 4 — icons are tied to position, not user-choosable, so the
   * item count is intentionally not editable (add/remove is unsupported). */
  items: [ProductProblemItem, ProductProblemItem, ProductProblemItem, ProductProblemItem];
};

const ICONS = [
  <svg key="0" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M17 18H18V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>,
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.75" />
    <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 6L9 3L15 6L21 3V18L15 21L9 18L3 21V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 3V18M15 6V21" stroke="currentColor" strokeWidth="1.75" />
  </svg>,
];

function Chevron() {
  return (
    <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
      <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Product's "The verification problem" 4-item accordion (".ps-acc-list").
 * Page-specific, non-reusable. Interactivity is wired by ProductAccordion.tsx
 * via the ".ps-acc-trigger" class selector, so exact class names/DOM order
 * (trigger button, then its sibling panel) must be preserved. Item 0 starts
 * open (matching the original hardcoded markup); items 1-3 start closed. */
export default function ProductProblemAccordion({ content }: { content: ProductProblemAccordionContent }) {
  const { solution_label, items } = content;

  return (
    <div className="ps-acc-list">
      {items.map((item, i) => (
        <div className="ps-acc-item" key={i}>
          <button className="ps-acc-trigger" aria-expanded={i === 0 ? "true" : "false"} aria-controls={`ps-${i + 1}`}>
            <span className="ps-acc-icon" aria-hidden="true">
              {ICONS[i]}
            </span>
            <span className="ps-acc-title">{item.title}</span>
            <span className="ps-acc-chevron" aria-hidden="true">
              <Chevron />
            </span>
          </button>
          <div className="ps-acc-panel" id={`ps-${i + 1}`} hidden={i !== 0}>
            <p className="ps-acc-problem">{item.problem}</p>
            <div className="ps-acc-solution">
              <span className="ps-acc-sol-label">{solution_label}</span>
              {item.solution}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
