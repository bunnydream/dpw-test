export type ProductVendorQuestion = {
  question: string;
  answer: string;
};

export type ProductVendorQuestionsContent = {
  heading: string;
  items: ProductVendorQuestion[];
};

/** Product's "Questions to Ask Any Income Verification Vendor" FAQ accordion
 * (".vendor-q", id="vendor-questions"). Page-specific, non-reusable.
 * Interactivity wired by ProductAccordion.tsx via the ".vq-trigger" class
 * selector — all items start closed, matching the original markup. Fidelity
 * note: one live answer has an inline <em> emphasis that a plain text field
 * can't represent; it renders as plain text (same accepted tradeoff used
 * elsewhere for inline markup inside admin-editable copy). */
export default function ProductVendorQuestions({
  content,
  backgroundColor,
}: {
  content: ProductVendorQuestionsContent;
  backgroundColor?: string | null;
}) {
  const { heading, items } = content;

  return (
    <section className="vendor-q section-pad" id="vendor-questions" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="section-inner">
        <h2 className="section-h reveal">{heading}</h2>
        <div className="vq-list reveal d1">
          {items.map((item, i) => (
            <div className="vq-item" key={i}>
              <button className="vq-trigger" aria-expanded="false" aria-controls={`vq-${i + 1}`}>
                <span className="vq-q">{item.question}</span>
                <span className="vq-chevron" aria-hidden="true">
                  <svg width="28" height="18" viewBox="0 0 14 9" fill="none">
                    <path d="M1 1L6.5 6.5L12 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
              <div className="vq-panel" id={`vq-${i + 1}`} hidden>
                <p className="vq-a">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
