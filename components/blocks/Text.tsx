export type TextContent = {
  heading?: string | null;
  text: string;
};

export default function Text({ content }: { content: TextContent }) {
  const { heading, text } = content;

  return (
    <div className="section-pad">
      <div className="section-inner block-text">
        {heading ? <h2 className="section-h reveal">{heading}</h2> : null}
        <p className="reveal">{text}</p>
      </div>
    </div>
  );
}
