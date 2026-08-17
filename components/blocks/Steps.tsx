export type Step = {
  heading: string;
  description: string;
  photo_url?: string | null;
  photo_alt?: string | null;
};

export type StepsContent = {
  /** Optional heading/footnote — unused by this component (home's fixed
   * "how it works" heading lives at a different DOM level, above this
   * component's siblings, not inside it). Read by product/page.tsx's own
   * bespoke rendering of its "path to a pilot" steps instead. */
  heading?: string | null;
  footnote?: string | null;
  steps: Step[];
};

const STAGGER_CLASSES = ["", "d1", "d2", "d3", "d4"];

/**
 * Renders the scroll-driven step timeline used by home's "how it works"
 * section. Pair with <HowStepsProgress /> rendered as a sibling (it queries
 * .how-steps-wrap / .how-steps-progress by className, so it doesn't need to
 * live inside this component). Step numbers (01/02/03…) are derived from
 * array index, not stored data.
 */
export default function Steps({ content }: { content: StepsContent }) {
  const { steps } = content;

  return (
    <div className="how-steps-wrap">
      <div className="steps-line" aria-hidden="true"></div>
      <div className="how-steps-progress" aria-hidden="true"></div>

      {steps.map((step, i) => (
        <div className={`how-step-row reveal${STAGGER_CLASSES[i] ? ` ${STAGGER_CLASSES[i]}` : ""}`} key={i}>
          <div className="step-badge" aria-hidden="true">
            <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
            <span className="step-lbl">Step</span>
          </div>
          <div className="how-step-card">
            {step.photo_url ? (
              <div className="how-step-img">
                <img src={step.photo_url} alt={step.photo_alt ?? ""} loading="lazy" />
              </div>
            ) : null}
            <div className="how-step-body">
              <h3>{step.heading}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
