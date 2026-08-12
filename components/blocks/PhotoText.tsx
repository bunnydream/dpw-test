import type { ReactNode } from "react";

export type PhotoTextContent = {
  side: "left" | "right";
  heading: string;
  text: string[];
  pullquote?: string | null;
  photo_url: string;
  photo_alt?: string | null;
};

/**
 * Renders the DOM structure used by home's "pressure" (photo left) and
 * "model" (photo right) sections. Side is achieved via DOM order (image div
 * first for 'left', text div first for 'right'), matching home.css's
 * .pressure / .model 2-column grid (no CSS `order` is used there).
 *
 * Note on fidelity: the live "pressure" section's pullquote is a plain
 * <div className="pullquote">, while "model"'s is a <blockquote
 * className="pullquote">. That inconsistency is preserved via `pullquoteTag`.
 */
export default function PhotoText({
  content,
  backgroundColor,
  pullquoteTag = "div",
  imgWidth,
  imgHeight,
  loading = "lazy",
  id,
  children,
}: {
  content: PhotoTextContent;
  backgroundColor?: string | null;
  /** which tag wraps the pullquote — home's two instances differ ("div" vs "blockquote") */
  pullquoteTag?: "div" | "blockquote";
  imgWidth?: number;
  imgHeight?: number;
  loading?: "lazy" | "eager";
  /** optional section id (home's "pressure" section carries id="pressure") */
  id?: string;
  /** extra fixed JSX to render after the text block (e.g. the "pressure" section's CTA button) */
  children?: ReactNode;
}) {
  const { side, heading, text, pullquote, photo_url, photo_alt } = content;
  const isLeft = side === "left";
  const sectionClass = isLeft ? "pressure" : "model";
  const imgWrapClass = isLeft ? "pressure-img" : "model-photo";
  const contentWrapClass = isLeft ? "pressure-right" : "model-content";

  const imgEl = (
    <div className={`${imgWrapClass} reveal${!isLeft ? " d2" : ""}`}>
      <img
        src={photo_url}
        alt={photo_alt ?? ""}
        loading={loading}
        width={imgWidth}
        height={imgHeight}
      />
    </div>
  );

  const PullquoteTag = pullquoteTag;

  const contentEl = (
    <div className={contentWrapClass}>
      <h2 className="section-h reveal">{heading}</h2>
      <div className="body-text reveal d1">
        {text.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      {pullquote ? (
        <PullquoteTag className="pullquote reveal d2">
          <p className="pq-text">{pullquote}</p>
        </PullquoteTag>
      ) : null}
      {children}
    </div>
  );

  return (
    <section
      className={sectionClass}
      id={id}
      style={backgroundColor ? { background: backgroundColor } : undefined}
    >
      {isLeft ? (
        <>
          {imgEl}
          {contentEl}
        </>
      ) : (
        <>
          {contentEl}
          {imgEl}
        </>
      )}
    </section>
  );
}
