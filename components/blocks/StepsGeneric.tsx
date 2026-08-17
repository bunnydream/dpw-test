export type StepGeneric = {
  heading: string;
  description: string;
  photo_url?: string | null;
  photo_alt?: string | null;
};

export type StepsGenericContent = {
  heading?: string | null;
  footnote?: string | null;
  pullquote?: string | null;
  callout_number?: string | null;
  callout_text?: string | null;
  /** Background color applied to each step's content card (independent of
   * the section's own background_color). */
  card_background_color?: string | null;
  steps: StepGeneric[];
};

/**
 * Centered step timeline (shared.css's .steps/.step/.step-badge/.step-content
 * — the same markup as Product's "The path to a pilot" section). Used ONLY
 * by SectionRenderer.tsx for custom (admin-created) pages — NEVER import
 * this on a fixed page. Home's real "How Verify My Income works" section
 * uses the original Steps.tsx (photo cards + scroll progress bar) and must
 * keep doing so; do not swap it for this component.
 */
export default function StepsGeneric({
  content,
  backgroundColor,
}: {
  content: StepsGenericContent;
  backgroundColor?: string | null;
}) {
  const { heading, footnote, pullquote, callout_number, callout_text, steps, card_background_color } = content;

  return (
    <div className="section-pad" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="section-inner">
        {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
        <div className="steps reveal">
          <div className="steps-line" aria-hidden="true"></div>

          {steps.map((step, i) => (
            <div className="step reveal" key={i}>
              <div className="step-badge" aria-hidden="true">
                <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="step-lbl">Step</span>
              </div>
              <div className="step-content" style={card_background_color ? { background: card_background_color } : undefined}>
                {step.photo_url ? (
                  <img
                    src={step.photo_url}
                    alt={step.photo_alt ?? ""}
                    loading="lazy"
                    style={{ width: "100%", height: "auto", borderRadius: "2px", marginBottom: "16px", display: "block" }}
                  />
                ) : null}
                <h3>{step.heading}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        {pullquote ? (
          <div className="pullquote reveal">
            <p className="pq-text">{pullquote}</p>
          </div>
        ) : null}
        {callout_number || callout_text ? (
          <div className="callout-stat reveal">
            <span className="callout-stat-num">{callout_number}</span>
            <p className="callout-stat-text">{callout_text}</p>
          </div>
        ) : null}
        {footnote ? <p className="inline-note reveal">{footnote}</p> : null}
      </div>
    </div>
  );
}
