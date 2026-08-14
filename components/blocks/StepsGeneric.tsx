export type StepGeneric = {
  heading: string;
  description: string;
};

export type StepsGenericContent = {
  heading?: string | null;
  steps: StepGeneric[];
};

/**
 * Centered, no-photo step timeline (shared.css's .steps/.step/.step-badge/
 * .step-content — the same markup as Product's "The path to a pilot"
 * section). Used ONLY by SectionRenderer.tsx for custom (admin-created)
 * pages — NEVER import this on a fixed page. Home's real "How Verify My
 * Income works" section uses the original Steps.tsx (photo cards + scroll
 * progress bar) and must keep doing so; do not swap it for this component.
 */
export default function StepsGeneric({ content }: { content: StepsGenericContent }) {
  const { heading, steps } = content;

  return (
    <div className="section-pad">
      <div className="section-inner">
        {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
        <div className="steps-generic reveal">
          <div className="steps-generic-line" aria-hidden="true"></div>

          {steps.map((step, i) => (
            <div className="step-generic reveal" key={i}>
              <div className="step-badge" aria-hidden="true">
                <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="step-lbl">Step</span>
              </div>
              <div className="step-generic-content">
                <h3>{step.heading}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
