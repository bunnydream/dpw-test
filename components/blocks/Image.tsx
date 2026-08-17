export type ImageContent = {
  photo_url: string;
  photo_alt?: string | null;
};

/** Standalone image block — a single photo with no surrounding text. */
export default function Image({
  content,
  backgroundColor,
}: {
  content: ImageContent;
  backgroundColor?: string | null;
}) {
  const { photo_url, photo_alt } = content;
  if (!photo_url) return null;

  return (
    <div className="section-pad" style={backgroundColor ? { background: backgroundColor } : undefined}>
      <div className="section-inner">
        <img src={photo_url} alt={photo_alt ?? ""} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
    </div>
  );
}
