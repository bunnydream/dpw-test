export type TextContent = {
  heading?: string | null;
  text: string;
  pullquote?: string | null;
  footnote?: string | null;
  callout_number?: string | null;
  callout_text?: string | null;
};

export default function Text({
  content,
  backgroundColor,
}: {
  content: TextContent;
  backgroundColor?: string | null;
}) {
  const { heading, text, pullquote, footnote, callout_number, callout_text } = content;

  return (
    <div className="section-pad" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="section-inner block-text">
        {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
        <p className="body-p reveal">{text}</p>
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
