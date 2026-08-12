"use client";

import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/admin/media";
import type { SectionType } from "@/lib/supabase/types";
import { TrashIcon, PlusIcon, UploadIcon } from "./icons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Content = Record<string, any>;

/** Derives the label shown in a section row (.a-section-name) straight from
 * live content instead of a separately-persisted `name` column, so it always
 * reflects the current text as the editor types (matching the mockup's
 * syncBlockName()/syncTitleBlock() behavior). */
export function sectionDisplayName(type: SectionType, content: Content): string {
  switch (type) {
    case "hero":
      return content.headline || "Untitled hero";
    case "stats":
      return content.heading || "Stat row";
    case "photo-text":
      return content.heading || "Untitled photo + text block";
    case "steps":
      return "Step timeline";
    case "voices":
      return content.heading || "Quote carousel";
    case "partners":
      return content.heading || "Partners";
    case "cta":
      return content.heading || "Call-to-action banner";
    case "team-member":
      return "Team member grid";
    case "text":
      return content.heading || (content.text ? String(content.text).slice(0, 60) : "Text block");
    case "content-cards":
      return content.heading || "Card grid";
    case "comparison":
      return content.heading || "Comparison table";
    case "case-study":
      return "Case study cards";
    default:
      return "Section";
  }
}

// ═══════════════════════════════════════════════════════════
// SHARED FIELD PRIMITIVES
// ═══════════════════════════════════════════════════════════

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="a-field">
      <label>{label}</label>
      <input
        className="a-input"
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="a-field">
      <label>{label}</label>
      <textarea
        className="a-textarea"
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="a-field-row">{children}</div>;
}

const SITE_LINKS: [string, string][] = [
  ["/", "Home"],
  ["/about", "About"],
  ["/product", "Product"],
  ["/impact", "Impact"],
  ["/careers", "Careers"],
  ["/contact", "Contact"],
  ["/insights", "Insights / Blog"],
];

export function LinkPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [customMode, setCustomMode] = useState(() => !!value && !SITE_LINKS.some(([v]) => v === value));
  const selectValue = customMode ? "custom" : value || "";
  return (
    <div className="a-field">
      <label>{label}</label>
      <select
        className="a-select"
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "custom") {
            setCustomMode(true);
          } else {
            setCustomMode(false);
            onChange(v);
          }
        }}
      >
        {!value && !customMode ? (
          <option value="" disabled>
            Choose a page...
          </option>
        ) : null}
        {SITE_LINKS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
        <option value="custom">Custom link...</option>
      </select>
      {customMode ? (
        <input
          className="a-input"
          type="text"
          placeholder="https://..."
          style={{ marginTop: 8 }}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}

export function BackgroundColorField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const colors: [string, string][] = [
    ["", "Default (page background)"],
    ["var(--white)", "White"],
    ["var(--cool-white)", "Cool white"],
    ["var(--pale-verdigris)", "Pale verdigris"],
    ["var(--forge)", "Forge (dark)"],
    ["var(--copper)", "Copper"],
    ["var(--deep-copper)", "Deep copper"],
    ["var(--steel)", "Steel"],
    ["var(--aluminum)", "Aluminum"],
    ["var(--light-al)", "Light aluminum"],
    ["var(--verdigris)", "Verdigris"],
  ];
  return (
    <div className="a-field a-bg-color-field">
      <label>Background color</label>
      <select
        className="a-select"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
      >
        {colors.map(([v, l]) => (
          <option key={v || "default"} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Shared "replace photo" / "click to upload" field — uploads immediately
 * via uploadMedia() and reports back the public URL. Mirrors uploadBlock()/
 * emptyPhotoField() from the mockup, minus the media-library option (out of
 * scope per task brief: direct upload only). */
export function PhotoField({
  label,
  url,
  alt,
  onUrlChange,
  onAltChange,
  altLabel = "Photo alt text (for screen readers)",
}: {
  label: string;
  url?: string | null;
  alt?: string | null;
  onUrlChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
  altLabel?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadMedia(fd);
    setUploading(false);
    if (res.ok && res.url) {
      onUrlChange(res.url);
    } else {
      setError(res.error || "Upload failed");
    }
    e.target.value = "";
  }

  return (
    <div className="a-field">
      <label>{label}</label>
      {url ? (
        <div className="a-upload-block">
          <img src={url} alt={alt ?? ""} />
          <div className="a-upload-actions">
            <button
              type="button"
              className="a-btn a-btn-outline a-btn-sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Replace photo"}
            </button>
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        </div>
      ) : (
        <div className="a-upload">
          <div className="a-upload-cta">
            <UploadIcon />
            <span>
              <strong>{uploading ? "Uploading..." : "Click to upload"}</strong>
              {!uploading ? " a photo" : ""}
            </span>
          </div>
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
        </div>
      )}
      {error ? (
        <div className="a-field-hint" style={{ color: "#B91C1C" }}>
          {error}
        </div>
      ) : null}
      {onAltChange ? (
        <input
          className="a-input"
          type="text"
          placeholder={altLabel}
          style={{ marginTop: 8 }}
          value={alt ?? ""}
          onChange={(e) => onAltChange(e.target.value)}
        />
      ) : null}
    </div>
  );
}

/** Compact square variant used for partner logos (44×44, click-anywhere to
 * replace), matching the inline-styled .a-upload used by addPartner() in the
 * mockup rather than the full-width uploadBlock() layout. */
export function CompactPhotoField({ url, onChange }: { url?: string | null; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadMedia(fd);
    setUploading(false);
    if (res.ok && res.url) onChange(res.url);
    e.target.value = "";
  }

  return (
    <div className="a-upload" style={{ width: 44, height: 44, padding: 0, flexShrink: 0 }} title="Click to replace logo">
      {url ? (
        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 6 }} />
      ) : (
        <div className="a-upload-cta" style={{ padding: 0, height: 44, justifyContent: "center" }}>
          <UploadIcon />
        </div>
      )}
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
    </div>
  );
}

export function MiniCardList({ children }: { children: React.ReactNode }) {
  return <div className="a-mini-card-list">{children}</div>;
}

export function MiniCard({
  label,
  onRemove,
  children,
}: {
  label: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="a-mini-card">
      <div className="a-mini-card-head">
        <span className="a-mini-card-label">{label}</span>
        <button type="button" className="a-icon-btn-xs" onClick={onRemove} title="Remove">
          <TrashIcon />
        </button>
      </div>
      {children}
    </div>
  );
}

export function AddMiniCardButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="a-add-mini-card-btn" onClick={onClick}>
      <PlusIcon /> {label}
    </button>
  );
}

// small array helpers
function updateAt<T>(arr: T[], i: number, patch: Partial<T>): T[] {
  return arr.map((item, idx) => (idx === i ? { ...item, ...patch } : item));
}
function removeAt<T>(arr: T[], i: number): T[] {
  return arr.filter((_, idx) => idx !== i);
}

// ═══════════════════════════════════════════════════════════
// PER-TYPE FIELD EDITORS
// ═══════════════════════════════════════════════════════════

type FieldsProps = { content: Content; onChange: (content: Content) => void };

function HeroFields({ content, onChange }: FieldsProps) {
  const primary = content.button_primary as { text?: string; link?: string } | null;
  const secondary = content.button_secondary as { text?: string; link?: string } | null;
  return (
    <>
      <TextAreaField label="Headline" rows={2} value={content.headline} onChange={(v) => onChange({ ...content, headline: v })} />
      <TextField label="Subtitle" value={content.subtitle} onChange={(v) => onChange({ ...content, subtitle: v })} />
      <TextAreaField label="Text" rows={4} value={content.text} onChange={(v) => onChange({ ...content, text: v })} />
      <TextAreaField label="Footnote text" rows={2} value={content.footnote} onChange={(v) => onChange({ ...content, footnote: v })} />
      <PhotoField
        label="Hero photo"
        url={content.photo_url}
        alt={content.photo_alt}
        onUrlChange={(v) => onChange({ ...content, photo_url: v })}
        onAltChange={(v) => onChange({ ...content, photo_alt: v })}
      />
      <FieldRow>
        <TextField
          label="Primary button text"
          value={primary?.text ?? ""}
          onChange={(v) => onChange({ ...content, button_primary: v ? { text: v, link: primary?.link ?? "" } : null })}
        />
        <LinkPicker
          label="Primary button links to"
          value={primary?.link ?? ""}
          onChange={(v) => onChange({ ...content, button_primary: primary?.text ? { text: primary.text, link: v } : { text: "", link: v } })}
        />
      </FieldRow>
      <FieldRow>
        <TextField
          label="Secondary button text"
          value={secondary?.text ?? ""}
          onChange={(v) => onChange({ ...content, button_secondary: v ? { text: v, link: secondary?.link ?? "" } : null })}
        />
        <LinkPicker
          label="Secondary button links to"
          value={secondary?.link ?? ""}
          onChange={(v) =>
            onChange({ ...content, button_secondary: secondary?.text ? { text: secondary.text, link: v } : { text: "", link: v } })
          }
        />
      </FieldRow>
      <div className="a-field-hint">Leave a button&apos;s text empty to hide it on the live page.</div>
    </>
  );
}

function StatsFields({ content, onChange }: FieldsProps) {
  const stats: { number: string; label: string }[] = content.stats ?? [];
  return (
    <>
      <TextField label="Heading (optional)" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <MiniCardList>
        {stats.map((stat, i) => (
          <MiniCard key={i} label={`Stat ${i + 1}`} onRemove={() => onChange({ ...content, stats: removeAt(stats, i) })}>
            <FieldRow>
              <TextField label="Number" value={stat.number} onChange={(v) => onChange({ ...content, stats: updateAt(stats, i, { number: v }) })} />
              <TextField label="Label" value={stat.label} onChange={(v) => onChange({ ...content, stats: updateAt(stats, i, { label: v }) })} />
            </FieldRow>
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton label="Add stat" onClick={() => onChange({ ...content, stats: [...stats, { number: "", label: "" }] })} />
    </>
  );
}

function PhotoTextFields({ content, onChange }: FieldsProps) {
  const paragraphs: string = Array.isArray(content.text) ? content.text.join("\n\n") : content.text ?? "";
  return (
    <>
      <div className="a-field">
        <label>Photo position</label>
        <div className="a-side-toggle">
          <button
            type="button"
            className={content.side === "left" ? "is-active" : ""}
            onClick={() => onChange({ ...content, side: "left" })}
          >
            Photo left
          </button>
          <button
            type="button"
            className={content.side === "right" ? "is-active" : ""}
            onClick={() => onChange({ ...content, side: "right" })}
          >
            Photo right
          </button>
        </div>
      </div>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextAreaField
        label="Text"
        rows={6}
        value={paragraphs}
        onChange={(v) =>
          onChange({
            ...content,
            text: v
              .split(/\n\s*\n/)
              .map((p) => p.trim())
              .filter(Boolean),
          })
        }
      />
      <div className="a-field-hint">Separate paragraphs with a blank line.</div>
      <TextAreaField
        label="Pullquote (optional)"
        rows={2}
        value={content.pullquote ?? ""}
        onChange={(v) => onChange({ ...content, pullquote: v || null })}
      />
      <PhotoField
        label="Photo"
        url={content.photo_url}
        alt={content.photo_alt}
        onUrlChange={(v) => onChange({ ...content, photo_url: v })}
        onAltChange={(v) => onChange({ ...content, photo_alt: v })}
      />
    </>
  );
}

function StepsFields({ content, onChange }: FieldsProps) {
  const steps: { heading: string; description: string; photo_url?: string; photo_alt?: string }[] = content.steps ?? [];
  return (
    <>
      <MiniCardList>
        {steps.map((step, i) => (
          <MiniCard key={i} label={`Step ${i + 1}`} onRemove={() => onChange({ ...content, steps: removeAt(steps, i) })}>
            <TextField
              label="Step heading"
              value={step.heading}
              onChange={(v) => onChange({ ...content, steps: updateAt(steps, i, { heading: v }) })}
            />
            <TextAreaField
              label="Description"
              rows={3}
              value={step.description}
              onChange={(v) => onChange({ ...content, steps: updateAt(steps, i, { description: v }) })}
            />
            <PhotoField
              label="Step photo (optional)"
              url={step.photo_url}
              alt={step.photo_alt}
              onUrlChange={(v) => onChange({ ...content, steps: updateAt(steps, i, { photo_url: v }) })}
              onAltChange={(v) => onChange({ ...content, steps: updateAt(steps, i, { photo_alt: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton
        label="Add step"
        onClick={() => onChange({ ...content, steps: [...steps, { heading: "", description: "", photo_url: "", photo_alt: "" }] })}
      />
    </>
  );
}

function VoicesFields({ content, onChange }: FieldsProps) {
  const quotes: { quote: string; name: string; role: string }[] = content.quotes ?? [];
  return (
    <>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <MiniCardList>
        {quotes.map((q, i) => (
          <MiniCard key={i} label={`Card ${i + 1}`} onRemove={() => onChange({ ...content, quotes: removeAt(quotes, i) })}>
            <TextAreaField
              label="Quote"
              rows={3}
              value={q.quote}
              onChange={(v) => onChange({ ...content, quotes: updateAt(quotes, i, { quote: v }) })}
            />
            <FieldRow>
              <TextField label="Name" value={q.name} onChange={(v) => onChange({ ...content, quotes: updateAt(quotes, i, { name: v }) })} />
              <TextField
                label="Role / attribution"
                value={q.role}
                onChange={(v) => onChange({ ...content, quotes: updateAt(quotes, i, { role: v }) })}
              />
            </FieldRow>
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton label="Add quote card" onClick={() => onChange({ ...content, quotes: [...quotes, { quote: "", name: "", role: "" }] })} />
    </>
  );
}

function PartnersFields({ content, onChange }: FieldsProps) {
  const partners: { name: string; logo_url: string; link: string; visible?: boolean }[] = content.partners ?? [];
  return (
    <>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <div className="a-field">
        <label>Partners</label>
        <div className="a-mini-card-list">
          {partners.map((p, i) => (
            <div className="a-partner-row" key={i}>
              <CompactPhotoField url={p.logo_url} onChange={(v) => onChange({ ...content, partners: updateAt(partners, i, { logo_url: v }) })} />
              <div className="a-partner-body">
                <input
                  className="a-partner-name-input"
                  type="text"
                  placeholder="Partner name"
                  value={p.name}
                  onChange={(e) => onChange({ ...content, partners: updateAt(partners, i, { name: e.target.value }) })}
                />
              </div>
              <div className="a-partner-actions">
                <span className="a-partner-visible-label">{p.visible === false ? "Hidden" : "Visible"}</span>
                <span
                  className={`a-toggle${p.visible === false ? "" : " is-on"}`}
                  onClick={() => onChange({ ...content, partners: updateAt(partners, i, { visible: p.visible === false }) })}
                >
                  <span className="a-toggle-knob"></span>
                </span>
                <button
                  type="button"
                  className="a-icon-btn-xs"
                  onClick={() => onChange({ ...content, partners: removeAt(partners, i) })}
                  title="Delete partner"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
        <AddMiniCardButton
          label="Add partner"
          onClick={() => onChange({ ...content, partners: [...partners, { name: "", logo_url: "", link: "", visible: true }] })}
        />
      </div>
      {partners.map((p, i) => (
        <div className="a-field" key={`link-${i}`}>
          <label>{p.name || `Partner ${i + 1}`} website link</label>
          <input
            className="a-input"
            type="text"
            placeholder="https://..."
            value={p.link ?? ""}
            onChange={(e) => onChange({ ...content, partners: updateAt(partners, i, { link: e.target.value }) })}
          />
        </div>
      ))}
    </>
  );
}

function CtaFields({ content, onChange }: FieldsProps) {
  return (
    <>
      <TextAreaField label="Heading" rows={2} value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextField label="Button text" value={content.button_text} onChange={(v) => onChange({ ...content, button_text: v })} />
      <LinkPicker label="Button links to" value={content.link ?? ""} onChange={(v) => onChange({ ...content, link: v })} />
      <PhotoField
        label="Background photo"
        url={content.background_photo_url}
        onUrlChange={(v) => onChange({ ...content, background_photo_url: v })}
      />
    </>
  );
}

function TeamMemberFields({ content, onChange }: FieldsProps) {
  const members: { name: string; title: string; text: string; photo_url?: string; photo_alt?: string }[] = content.members ?? [];
  return (
    <>
      <MiniCardList>
        {members.map((m, i) => (
          <MiniCard key={i} label={m.name || "Team member"} onRemove={() => onChange({ ...content, members: removeAt(members, i) })}>
            <FieldRow>
              <TextField label="Name" value={m.name} onChange={(v) => onChange({ ...content, members: updateAt(members, i, { name: v }) })} />
              <TextField label="Title" value={m.title} onChange={(v) => onChange({ ...content, members: updateAt(members, i, { title: v }) })} />
            </FieldRow>
            <TextAreaField label="Text" rows={3} value={m.text} onChange={(v) => onChange({ ...content, members: updateAt(members, i, { text: v }) })} />
            <PhotoField
              label="Photo"
              url={m.photo_url}
              alt={m.photo_alt}
              onUrlChange={(v) => onChange({ ...content, members: updateAt(members, i, { photo_url: v }) })}
              onAltChange={(v) => onChange({ ...content, members: updateAt(members, i, { photo_alt: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton
        label="Add team member"
        onClick={() => onChange({ ...content, members: [...members, { name: "", title: "", text: "", photo_url: "", photo_alt: "" }] })}
      />
    </>
  );
}

function TextFields({ content, onChange }: FieldsProps) {
  return (
    <>
      <TextField label="Heading (optional)" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextAreaField label="Text" rows={5} value={content.text} onChange={(v) => onChange({ ...content, text: v })} />
    </>
  );
}

function ContentCardsFields({ content, onChange }: FieldsProps) {
  const cards: { heading: string; text: string; photo_url?: string; photo_alt?: string }[] = content.cards ?? [];
  return (
    <>
      <TextField label="Heading (optional)" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextAreaField label="Intro text (optional)" rows={2} value={content.text} onChange={(v) => onChange({ ...content, text: v })} />
      <MiniCardList>
        {cards.map((c, i) => (
          <MiniCard key={i} label={c.heading || `Card ${i + 1}`} onRemove={() => onChange({ ...content, cards: removeAt(cards, i) })}>
            <TextField label="Heading" value={c.heading} onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { heading: v }) })} />
            <TextAreaField
              label="Text"
              rows={2}
              value={c.text}
              onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { text: v }) })}
            />
            <PhotoField
              label="Photo (optional)"
              url={c.photo_url}
              alt={c.photo_alt}
              onUrlChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { photo_url: v }) })}
              onAltChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { photo_alt: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton
        label="Add card"
        onClick={() => onChange({ ...content, cards: [...cards, { heading: "", text: "", photo_url: "", photo_alt: "" }] })}
      />
    </>
  );
}

function ComparisonFields({ content, onChange }: FieldsProps) {
  const rows: { heading: string; text: string }[] = content.rows ?? [];
  return (
    <>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <FieldRow>
        <TextField
          label="Column A title"
          value={content.column_a_title}
          onChange={(v) => onChange({ ...content, column_a_title: v })}
        />
        <TextField
          label="Column B title"
          value={content.column_b_title}
          onChange={(v) => onChange({ ...content, column_b_title: v })}
        />
      </FieldRow>
      <MiniCardList>
        {rows.map((r, i) => (
          <MiniCard key={i} label={r.heading || `Row ${i + 1}`} onRemove={() => onChange({ ...content, rows: removeAt(rows, i) })}>
            <TextField label="Heading" value={r.heading} onChange={(v) => onChange({ ...content, rows: updateAt(rows, i, { heading: v }) })} />
            <TextAreaField label="Text" rows={2} value={r.text} onChange={(v) => onChange({ ...content, rows: updateAt(rows, i, { text: v }) })} />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton label="Add row" onClick={() => onChange({ ...content, rows: [...rows, { heading: "", text: "" }] })} />
    </>
  );
}

function CaseStudyFields({ content, onChange }: FieldsProps) {
  const cards: { heading: string; text: string; photo_url?: string; photo_alt?: string; link?: string }[] = content.cards ?? [];
  return (
    <>
      <MiniCardList>
        {cards.map((c, i) => (
          <MiniCard key={i} label={c.heading || `Card ${i + 1}`} onRemove={() => onChange({ ...content, cards: removeAt(cards, i) })}>
            <TextField label="Heading" value={c.heading} onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { heading: v }) })} />
            <TextAreaField
              label="Text"
              rows={2}
              value={c.text}
              onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { text: v }) })}
            />
            <PhotoField
              label="Photo"
              url={c.photo_url}
              alt={c.photo_alt}
              onUrlChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { photo_url: v }) })}
              onAltChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { photo_alt: v }) })}
            />
            <LinkPicker label="Card links to" value={c.link ?? ""} onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { link: v }) })} />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton
        label="Add card"
        onClick={() => onChange({ ...content, cards: [...cards, { heading: "", text: "", photo_url: "", photo_alt: "", link: "" }] })}
      />
    </>
  );
}

export function SectionContentFields({ type, content, onChange }: { type: SectionType } & FieldsProps) {
  switch (type) {
    case "hero":
      return <HeroFields content={content} onChange={onChange} />;
    case "stats":
      return <StatsFields content={content} onChange={onChange} />;
    case "photo-text":
      return <PhotoTextFields content={content} onChange={onChange} />;
    case "steps":
      return <StepsFields content={content} onChange={onChange} />;
    case "voices":
      return <VoicesFields content={content} onChange={onChange} />;
    case "partners":
      return <PartnersFields content={content} onChange={onChange} />;
    case "cta":
      return <CtaFields content={content} onChange={onChange} />;
    case "team-member":
      return <TeamMemberFields content={content} onChange={onChange} />;
    case "text":
      return <TextFields content={content} onChange={onChange} />;
    case "content-cards":
      return <ContentCardsFields content={content} onChange={onChange} />;
    case "comparison":
      return <ComparisonFields content={content} onChange={onChange} />;
    case "case-study":
      return <CaseStudyFields content={content} onChange={onChange} />;
    default:
      return null;
  }
}
