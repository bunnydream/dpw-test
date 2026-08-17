"use client";

import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/admin/media";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import type { SectionType } from "@/lib/supabase/types";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, TrashIcon, PlusIcon, UploadIcon } from "./icons";

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
      return "Stat row";
    case "photo-text":
      return content.heading || "Untitled photo + text block";
    case "steps":
      return content.heading || "Step timeline";
    case "voices":
      return content.heading || "Quote carousel";
    case "partners":
      return content.heading || "Partners";
    case "cta":
      return content.heading || "Call-to-action banner";
    case "team-member":
      return content.heading || "Team member grid";
    case "text":
      return content.heading || (content.text ? String(content.text).slice(0, 60) : "Text block");
    case "content-cards":
      return content.heading || "Card grid";
    case "comparison":
      return content.heading || "Comparison table";
    case "case-study":
      return "Case study cards";
    case "icon-cards":
      return content.heading || "Icon cards";
    case "home-compare-table":
      return content.heading || "Compare table";
    case "product-problem-accordion":
      return "Problem accordion";
    case "product-talk-cta":
      return content.heading || "Talk CTA banner";
    case "product-compare-table":
      return content.heading || "Compare table";
    case "product-vendor-questions":
      return content.heading || "Vendor questions";
    case "impact-manual-table":
      return "Manual vs. VMI table";
    case "impact-year-in-review":
      return content.heading || "Year in review";
    case "contact-form-section":
      return content.heading || "Contact form section";
    case "accordion":
      return content.heading || "Accordion";
    case "image":
      return "Image";
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
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="a-field">
      <label>
        {label}
        {maxLength ? (
          <span className="a-field-counter">
            {(value ?? "").length}/{maxLength}
          </span>
        ) : null}
      </label>
      <input
        className="a-input"
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
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
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="a-field">
      <label>
        {label}
        {maxLength ? (
          <span className="a-field-counter">
            {(value ?? "").length}/{maxLength}
          </span>
        ) : null}
      </label>
      <textarea
        className="a-textarea"
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="a-field-row">{children}</div>;
}

import LinkPicker from "@/components/admin/LinkPicker";
export { LinkPicker };

export function BackgroundColorField({
  value,
  onChange,
  label = "Background color",
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  label?: string;
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
      <label>{label}</label>
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


/** Shared "replace photo" / "click to upload" field — uploads a new file
 * via uploadMedia(), or lets the user pick an already-uploaded one from the
 * media library instead. Mirrors uploadBlock()/emptyPhotoField() from the
 * mockup. */
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
  const [pickerOpen, setPickerOpen] = useState(false);
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

  function handlePicked(pickedUrl: string) {
    setPickerOpen(false);
    onUrlChange(pickedUrl);
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
              {uploading ? "Uploading..." : "Upload photo"}
            </button>
            <button type="button" className="a-btn a-btn-outline a-btn-sm" onClick={() => setPickerOpen(true)} disabled={uploading}>
              Media library
            </button>
            <button
              type="button"
              className="a-btn a-btn-outline a-btn-sm"
              onClick={() => onUrlChange("")}
              disabled={uploading}
            >
              Remove photo
            </button>
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        </div>
      ) : (
        <div className="a-upload-empty">
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
          <button type="button" className="a-btn a-btn-outline a-btn-sm" onClick={() => setPickerOpen(true)} disabled={uploading}>
            Media library
          </button>
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
      {pickerOpen ? <MediaLibraryModal onSelect={handlePicked} onClose={() => setPickerOpen(false)} /> : null}
    </div>
  );
}

/** 4-arrow nudge control for a hero photo's object-position, stored as
 * {x, y} percentages. Nudges by 10 points per click, clamped 0–100. */
export function PhotoPositionField({
  value,
  onChange,
}: {
  value: { x: number; y: number };
  onChange: (v: { x: number; y: number }) => void;
}) {
  const step = 10;
  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  function nudge(dx: number, dy: number) {
    onChange({ x: clamp(value.x + dx), y: clamp(value.y + dy) });
  }

  return (
    <div className="a-field">
      <label>Photo position</label>
      <div className="a-field-hint">Move the visible part of the photo within its frame.</div>
      <div className="a-photo-position-control">
        <button type="button" className="a-icon-btn" onClick={() => nudge(0, -step)} title="Move focus up">
          <ArrowUpIcon />
        </button>
        <div className="a-photo-position-row">
          <button type="button" className="a-icon-btn" onClick={() => nudge(-step, 0)} title="Move focus left">
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            className="a-icon-btn"
            onClick={() => onChange({ x: 50, y: 50 })}
            title="Reset to center"
          >
            <span style={{ fontSize: 10, fontWeight: 700 }}>{Math.round(value.x)},{Math.round(value.y)}</span>
          </button>
          <button type="button" className="a-icon-btn" onClick={() => nudge(step, 0)} title="Move focus right">
            <ArrowRightIcon />
          </button>
        </div>
        <button type="button" className="a-icon-btn" onClick={() => nudge(0, step)} title="Move focus down">
          <ArrowDownIcon />
        </button>
      </div>
    </div>
  );
}

/** Compact square variant used for partner logos (44×44, click-anywhere to
 * replace), matching the inline-styled .a-upload used by addPartner() in the
 * mockup rather than the full-width uploadBlock() layout. */
export function CompactPhotoField({ url, onChange }: { url?: string | null; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  function handlePicked(pickedUrl: string) {
    setPickerOpen(false);
    onChange(pickedUrl);
  }

  return (
    <div className="a-compact-photo-field">
      <div className="a-compact-photo-preview">{url ? <img src={url} alt="" /> : <UploadIcon />}</div>
      <div className="a-compact-photo-buttons">
        <button
          type="button"
          className="a-btn a-btn-outline a-btn-sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload photo"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} disabled={uploading} />
        <button
          type="button"
          className="a-btn a-btn-outline a-btn-sm"
          onClick={() => setPickerOpen(true)}
          disabled={uploading}
        >
          Media library
        </button>
        {url ? (
          <button
            type="button"
            className="a-btn a-btn-outline a-btn-sm"
            onClick={() => onChange("")}
            disabled={uploading}
          >
            Remove photo
          </button>
        ) : null}
      </div>
      {pickerOpen ? <MediaLibraryModal onSelect={handlePicked} onClose={() => setPickerOpen(false)} /> : null}
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
  /** Omit to hide the remove button — for fixed-length lists (e.g. product's
   * problem accordion, which always has exactly 4 items). */
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="a-mini-card">
      <div className="a-mini-card-head">
        <span className="a-mini-card-label">{label}</span>
        {onRemove ? (
          <button type="button" className="a-icon-btn-xs" onClick={onRemove} title="Remove">
            <TrashIcon />
          </button>
        ) : null}
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

function HeroButtonField({
  label,
  button,
  onChange,
  onRemove,
  onAdd,
}: {
  label: string;
  button: { text?: string; link?: string } | null;
  onChange: (v: { text: string; link: string }) => void;
  onRemove: () => void;
  onAdd: () => void;
}) {
  if (!button) {
    return (
      <AddMiniCardButton label={`Add ${label.toLowerCase()}`} onClick={onAdd} />
    );
  }
  return (
    <MiniCard label={label} onRemove={onRemove}>
      <FieldRow>
        <TextField label="Button text" value={button.text ?? ""} onChange={(v) => onChange({ text: v, link: button.link ?? "" })} />
        <LinkPicker label="Button links to" value={button.link ?? ""} onChange={(v) => onChange({ text: button.text ?? "", link: v })} />
      </FieldRow>
    </MiniCard>
  );
}

function HeroFields({ content, onChange }: FieldsProps) {
  const primary = content.button_primary as { text?: string; link?: string } | null;
  const secondary = content.button_secondary as { text?: string; link?: string } | null;
  return (
    <>
      <TextAreaField label="Headline" rows={2} value={content.headline} onChange={(v) => onChange({ ...content, headline: v })} />
      <TextField
        label="Subtitle (optional)"
        value={content.subtitle}
        onChange={(v) => onChange({ ...content, subtitle: v })}
      />
      <TextAreaField
        label="Text (optional)"
        rows={4}
        value={content.text}
        onChange={(v) => onChange({ ...content, text: v })}
      />
      <TextAreaField
        label="Footnote text (optional)"
        rows={2}
        value={content.footnote}
        onChange={(v) => onChange({ ...content, footnote: v })}
      />
      <PhotoField
        label="Hero photo"
        url={content.photo_url}
        alt={content.photo_alt}
        onUrlChange={(v) => onChange({ ...content, photo_url: v })}
        onAltChange={(v) => onChange({ ...content, photo_alt: v })}
      />
      {content.photo_url ? (
        <PhotoPositionField
          value={content.photo_position ?? { x: 50, y: 50 }}
          onChange={(v) => onChange({ ...content, photo_position: v })}
        />
      ) : null}
      <div className="a-field">
        <label>Buttons</label>
        <HeroButtonField
          label="Primary button"
          button={primary}
          onChange={(v) => onChange({ ...content, button_primary: v })}
          onRemove={() => onChange({ ...content, button_primary: null })}
          onAdd={() => onChange({ ...content, button_primary: { text: "", link: "" } })}
        />
      </div>
      <div className="a-field">
        <HeroButtonField
          label="Secondary button"
          button={secondary}
          onChange={(v) => onChange({ ...content, button_secondary: v })}
          onRemove={() => onChange({ ...content, button_secondary: null })}
          onAdd={() => onChange({ ...content, button_secondary: { text: "", link: "" } })}
        />
      </div>
    </>
  );
}

function StatsFields({ content, onChange }: FieldsProps) {
  const stats: { number: string; label: string }[] = content.stats ?? [];
  return (
    <>
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
      {content.button_text || content.button_link ? (
        <>
          <TextField
            label="Button text"
            value={content.button_text ?? ""}
            onChange={(v) => onChange({ ...content, button_text: v })}
          />
          <LinkPicker label="Button links to" value={content.button_link ?? ""} onChange={(v) => onChange({ ...content, button_link: v })} />
          <button
            type="button"
            className="a-btn a-btn-outline a-btn-sm"
            onClick={() => onChange({ ...content, button_text: null, button_link: null })}
          >
            Remove button
          </button>
        </>
      ) : (
        <AddMiniCardButton label="Add button" onClick={() => onChange({ ...content, button_text: "Learn more", button_link: "" })} />
      )}
      <FieldRow>
        <TextField
          label="Callout stat number (optional)"
          value={content.stat_number ?? ""}
          onChange={(v) => onChange({ ...content, stat_number: v })}
        />
        <TextField
          label="Callout stat text (optional)"
          value={content.stat_text ?? ""}
          onChange={(v) => onChange({ ...content, stat_text: v })}
        />
      </FieldRow>
    </>
  );
}

function StepsFields({ content, onChange }: FieldsProps) {
  const steps: { heading: string; description: string; photo_url?: string; photo_alt?: string }[] = content.steps ?? [];
  return (
    <>
      <TextField label="Heading (optional)" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
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
              label="Step photo"
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
      <TextAreaField
        label="Footnote (optional)"
        rows={2}
        value={content.footnote ?? ""}
        onChange={(v) => onChange({ ...content, footnote: v })}
      />
    </>
  );
}

function VoicesFields({ content, onChange }: FieldsProps) {
  const quotes: { quote: string; name: string; role: string }[] = content.quotes ?? [];
  return (
    <>
      <TextField label="Heading (optional)" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
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
  const partners: { logo_url: string; link: string; visible?: boolean }[] = content.partners ?? [];
  return (
    <>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <div className="a-field">
        <label>Partners</label>
        <div className="a-mini-card-list">
          {partners.map((p, i) => (
            <div className="a-partner-row" key={i}>
              <CompactPhotoField url={p.logo_url} onChange={(v) => onChange({ ...content, partners: updateAt(partners, i, { logo_url: v }) })} />
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
          onClick={() => onChange({ ...content, partners: [...partners, { logo_url: "", link: "", visible: true }] })}
        />
      </div>
      {partners.map((p, i) => (
        <div className="a-field" key={`link-${i}`}>
          <label>Partner {i + 1} website link</label>
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
      <TextAreaField label="Text (optional)" rows={2} value={content.text} onChange={(v) => onChange({ ...content, text: v })} />
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
      <TextField label="Heading (optional)" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
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
  const cards: { title?: string; heading: string; text: string; photo_url?: string; photo_alt?: string }[] = content.cards ?? [];
  return (
    <>
      <TextField label="Heading (optional)" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextAreaField label="Intro text (optional)" rows={2} value={content.text} onChange={(v) => onChange({ ...content, text: v })} />
      <MiniCardList>
        {cards.map((c, i) => (
          <MiniCard key={i} label={c.heading || `Card ${i + 1}`} onRemove={() => onChange({ ...content, cards: removeAt(cards, i) })}>
            <TextField
              label="Title"
              value={c.title ?? ""}
              onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { title: v }) })}
            />
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
        onClick={() => onChange({ ...content, cards: [...cards, { title: "", heading: "", text: "", photo_url: "", photo_alt: "" }] })}
      />
      <TextAreaField
        label="Footnote (optional)"
        rows={2}
        value={content.footnote ?? ""}
        onChange={(v) => onChange({ ...content, footnote: v })}
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
            <TextField
              label="Column A text"
              value={r.heading}
              onChange={(v) => onChange({ ...content, rows: updateAt(rows, i, { heading: v }) })}
            />
            <TextAreaField
              label="Column B text"
              rows={2}
              value={r.text}
              onChange={(v) => onChange({ ...content, rows: updateAt(rows, i, { text: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton label="Add row" onClick={() => onChange({ ...content, rows: [...rows, { heading: "", text: "" }] })} />
    </>
  );
}

function CaseStudyFields({ content, onChange }: FieldsProps) {
  const cards: { title?: string; heading: string; text: string; photo_url?: string; photo_alt?: string; link?: string }[] =
    content.cards ?? [];
  return (
    <>
      <TextField label="Heading (optional)" value={content.heading ?? ""} onChange={(v) => onChange({ ...content, heading: v })} />
      <MiniCardList>
        {cards.map((c, i) => (
          <MiniCard key={i} label={c.heading || `Card ${i + 1}`} onRemove={() => onChange({ ...content, cards: removeAt(cards, i) })}>
            <TextField
              label="Title"
              value={c.title ?? ""}
              onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { title: v }) })}
            />
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
            <LinkPicker label="Card links to" value={c.link ?? ""} onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { link: v }) })} />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton
        label="Add card"
        onClick={() => onChange({ ...content, cards: [...cards, { title: "", heading: "", text: "", photo_url: "", photo_alt: "", link: "" }] })}
      />
    </>
  );
}

const ICON_CARD_OPTIONS: { value: string; label: string }[] = [
  { value: "document", label: "Document" },
  { value: "eye-slash", label: "Crossed-out eye" },
  { value: "refresh", label: "Refresh" },
  { value: "gift", label: "Gift" },
  { value: "trend-down", label: "Downward trend" },
  { value: "lock-open", label: "Open lock" },
  { value: "custom", label: "Custom (upload)" },
];

function IconSelectField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="a-field">
      <label>Icon</label>
      <select className="a-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {ICON_CARD_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function IconCardsFields({ content, onChange }: FieldsProps) {
  const cards: { icon: string; icon_url?: string; label?: string; heading: string; text: string }[] = content.cards ?? [];
  return (
    <>
      <TextField label="Heading (optional)" value={content.heading ?? ""} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextAreaField label="Intro text (optional)" rows={2} value={content.text ?? ""} onChange={(v) => onChange({ ...content, text: v })} />
      <MiniCardList>
        {cards.map((c, i) => (
          <MiniCard key={i} label={c.heading || `Card ${i + 1}`} onRemove={() => onChange({ ...content, cards: removeAt(cards, i) })}>
            <IconSelectField value={c.icon} onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { icon: v }) })} />
            {c.icon === "custom" ? (
              <PhotoField
                label="Custom icon"
                url={c.icon_url}
                onUrlChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { icon_url: v }) })}
              />
            ) : null}
            <TextField
              label="Label (optional)"
              value={c.label ?? ""}
              onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { label: v }) })}
            />
            <TextField label="Heading" value={c.heading} onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { heading: v }) })} />
            <TextAreaField
              label="Text"
              rows={3}
              value={c.text}
              onChange={(v) => onChange({ ...content, cards: updateAt(cards, i, { text: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton
        label="Add card"
        onClick={() => onChange({ ...content, cards: [...cards, { icon: "document", label: "", heading: "", text: "" }] })}
      />
      <TextAreaField
        label="Footnote (optional)"
        rows={2}
        value={content.footnote ?? ""}
        onChange={(v) => onChange({ ...content, footnote: v })}
      />
    </>
  );
}

function CompareRowsFields({ content, onChange }: FieldsProps) {
  const rows: { traditional: string; vmi: string }[] = content.rows ?? [];
  return (
    <>
      <FieldRow>
        <TextField label="Traditional column label" value={content.traditional_label} onChange={(v) => onChange({ ...content, traditional_label: v })} />
        <TextField label="VMI column label" value={content.vmi_label} onChange={(v) => onChange({ ...content, vmi_label: v })} />
      </FieldRow>
      <MiniCardList>
        {rows.map((r, i) => (
          <MiniCard key={i} label={`Row ${i + 1}`} onRemove={() => onChange({ ...content, rows: removeAt(rows, i) })}>
            <TextAreaField
              label="Traditional approaches text"
              rows={2}
              value={r.traditional}
              onChange={(v) => onChange({ ...content, rows: updateAt(rows, i, { traditional: v }) })}
            />
            <TextAreaField
              label="VMI text"
              rows={2}
              value={r.vmi}
              onChange={(v) => onChange({ ...content, rows: updateAt(rows, i, { vmi: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton label="Add row" onClick={() => onChange({ ...content, rows: [...rows, { traditional: "", vmi: "" }] })} />
    </>
  );
}

function HomeCompareTableFields({ content, onChange }: FieldsProps) {
  return (
    <>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <FieldRow>
        <TextField label="Link text" value={content.link_text} onChange={(v) => onChange({ ...content, link_text: v })} />
        <LinkPicker label="Link goes to" value={content.link ?? ""} onChange={(v) => onChange({ ...content, link: v })} />
      </FieldRow>
      <CompareRowsFields content={content} onChange={onChange} />
    </>
  );
}

function ProductProblemAccordionFields({ content, onChange }: FieldsProps) {
  const items: { title: string; problem: string; solution: string }[] = content.items ?? [];
  return (
    <>
      <TextField label="'Solution' label" value={content.solution_label} onChange={(v) => onChange({ ...content, solution_label: v })} />
      <MiniCardList>
        {items.map((item, i) => (
          <MiniCard key={i} label={item.title || `Item ${i + 1}`}>
            <TextField label="Title" value={item.title} onChange={(v) => onChange({ ...content, items: updateAt(items, i, { title: v }) })} />
            <TextAreaField
              label="Problem"
              rows={3}
              value={item.problem}
              onChange={(v) => onChange({ ...content, items: updateAt(items, i, { problem: v }) })}
            />
            <TextAreaField
              label="Solution"
              rows={3}
              value={item.solution}
              onChange={(v) => onChange({ ...content, items: updateAt(items, i, { solution: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <div className="a-field-hint">This design has a fixed set of 4 items — text only, can&apos;t be added or removed.</div>
    </>
  );
}

function ProductTalkCtaFields({ content, onChange }: FieldsProps) {
  return (
    <>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextField label="Subtext" value={content.subtext} onChange={(v) => onChange({ ...content, subtext: v })} />
      <LinkPicker label="Links to" value={content.link ?? ""} onChange={(v) => onChange({ ...content, link: v })} />
    </>
  );
}

function ProductCompareTableFields({ content, onChange }: FieldsProps) {
  return (
    <>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <CompareRowsFields content={content} onChange={onChange} />
    </>
  );
}

function ProductVendorQuestionsFields({ content, onChange }: FieldsProps) {
  const items: { question: string; answer: string }[] = content.items ?? [];
  return (
    <>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <MiniCardList>
        {items.map((item, i) => (
          <MiniCard key={i} label={item.question || `Question ${i + 1}`} onRemove={() => onChange({ ...content, items: removeAt(items, i) })}>
            <TextField label="Question" value={item.question} onChange={(v) => onChange({ ...content, items: updateAt(items, i, { question: v }) })} />
            <TextAreaField
              label="Answer"
              rows={3}
              value={item.answer}
              onChange={(v) => onChange({ ...content, items: updateAt(items, i, { answer: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton label="Add question" onClick={() => onChange({ ...content, items: [...items, { question: "", answer: "" }] })} />
    </>
  );
}

function ImpactManualTableFields({ content, onChange }: FieldsProps) {
  const rows: { manual: string; vmi: string }[] = content.rows ?? [];
  return (
    <>
      <FieldRow>
        <TextField label="Manual column label" value={content.manual_label} onChange={(v) => onChange({ ...content, manual_label: v })} />
        <TextField label="VMI column label" value={content.vmi_label} onChange={(v) => onChange({ ...content, vmi_label: v })} />
      </FieldRow>
      <MiniCardList>
        {rows.map((r, i) => (
          <MiniCard key={i} label={`Row ${i + 1}`} onRemove={() => onChange({ ...content, rows: removeAt(rows, i) })}>
            <TextAreaField
              label="Manual process text"
              rows={2}
              value={r.manual}
              onChange={(v) => onChange({ ...content, rows: updateAt(rows, i, { manual: v }) })}
            />
            <TextAreaField
              label="With VMI text"
              rows={2}
              value={r.vmi}
              onChange={(v) => onChange({ ...content, rows: updateAt(rows, i, { vmi: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton label="Add row" onClick={() => onChange({ ...content, rows: [...rows, { manual: "", vmi: "" }] })} />
    </>
  );
}

function ImpactYearInReviewFields({ content, onChange }: FieldsProps) {
  return (
    <>
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextAreaField label="Text" rows={3} value={content.text} onChange={(v) => onChange({ ...content, text: v })} />
      <TextField label="Button text" value={content.button_text} onChange={(v) => onChange({ ...content, button_text: v })} />
      <LinkPicker label="Button links to" value={content.link ?? ""} onChange={(v) => onChange({ ...content, link: v })} />
    </>
  );
}

function ContactFormSectionFields({ content, onChange }: FieldsProps) {
  return (
    <>
      <TextField label="Kicker label" value={content.kicker_label} onChange={(v) => onChange({ ...content, kicker_label: v })} />
      <TextField label="Heading" value={content.heading} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextAreaField label="Text" rows={3} value={content.text} onChange={(v) => onChange({ ...content, text: v })} />
      <FieldRow>
        <TextField label="First name label" value={content.first_name_label} onChange={(v) => onChange({ ...content, first_name_label: v })} />
        <TextField label="First name placeholder" value={content.first_name_placeholder} onChange={(v) => onChange({ ...content, first_name_placeholder: v })} />
      </FieldRow>
      <FieldRow>
        <TextField label="Last name label" value={content.last_name_label} onChange={(v) => onChange({ ...content, last_name_label: v })} />
        <TextField label="Last name placeholder" value={content.last_name_placeholder} onChange={(v) => onChange({ ...content, last_name_placeholder: v })} />
      </FieldRow>
      <FieldRow>
        <TextField label="Email label" value={content.email_label} onChange={(v) => onChange({ ...content, email_label: v })} />
        <TextField label="Email placeholder" value={content.email_placeholder} onChange={(v) => onChange({ ...content, email_placeholder: v })} />
      </FieldRow>
      <FieldRow>
        <TextField label="Organization label (optional)" value={content.org_label ?? ""} onChange={(v) => onChange({ ...content, org_label: v })} />
        <TextField label="Organization placeholder (optional)" value={content.org_placeholder ?? ""} onChange={(v) => onChange({ ...content, org_placeholder: v })} />
      </FieldRow>
      <TextField label="State dropdown label (optional)" value={content.state_field_label ?? ""} onChange={(v) => onChange({ ...content, state_field_label: v })} />
      <FieldRow>
        <TextField label="Subject label (optional)" value={content.subject_label ?? ""} onChange={(v) => onChange({ ...content, subject_label: v })} />
        <TextField label="Subject placeholder (optional)" value={content.subject_placeholder ?? ""} onChange={(v) => onChange({ ...content, subject_placeholder: v })} />
      </FieldRow>
      <FieldRow>
        <TextField label="Message label" value={content.message_label} onChange={(v) => onChange({ ...content, message_label: v })} />
        <TextField label="Message placeholder" value={content.message_placeholder} onChange={(v) => onChange({ ...content, message_placeholder: v })} />
      </FieldRow>
      <TextField label="Submit button text" value={content.submit_label} onChange={(v) => onChange({ ...content, submit_label: v })} />
      <TextAreaField label="Success message" rows={2} value={content.success_message} onChange={(v) => onChange({ ...content, success_message: v })} />
      <div className="a-field-hint">Community section only, below:</div>
      <TextField label="Address: organization name (optional)" value={content.address_org_name ?? ""} onChange={(v) => onChange({ ...content, address_org_name: v })} />
      <TextField label="Address: line 1 (optional)" value={content.address_line1 ?? ""} onChange={(v) => onChange({ ...content, address_line1: v })} />
      <TextField label="Address: line 2 (optional)" value={content.address_line2 ?? ""} onChange={(v) => onChange({ ...content, address_line2: v })} />
      <TextField label="Address: email (optional)" value={content.address_email ?? ""} onChange={(v) => onChange({ ...content, address_email: v })} />
    </>
  );
}

function AccordionFields({ content, onChange }: FieldsProps) {
  const panels: { header: string; content: string }[] = content.panels ?? [];
  return (
    <>
      <TextField label="Heading (optional)" value={content.heading ?? ""} onChange={(v) => onChange({ ...content, heading: v })} />
      <MiniCardList>
        {panels.map((p, i) => (
          <MiniCard key={i} label={p.header || `Panel ${i + 1}`} onRemove={() => onChange({ ...content, panels: removeAt(panels, i) })}>
            <TextField label="Header" value={p.header} onChange={(v) => onChange({ ...content, panels: updateAt(panels, i, { header: v }) })} />
            <TextAreaField
              label="Content"
              rows={3}
              value={p.content}
              onChange={(v) => onChange({ ...content, panels: updateAt(panels, i, { content: v }) })}
            />
          </MiniCard>
        ))}
      </MiniCardList>
      <AddMiniCardButton label="Add panel" onClick={() => onChange({ ...content, panels: [...panels, { header: "", content: "" }] })} />
    </>
  );
}

function ImageFields({ content, onChange }: FieldsProps) {
  return (
    <PhotoField
      label="Photo"
      url={content.photo_url}
      alt={content.photo_alt}
      onUrlChange={(v) => onChange({ ...content, photo_url: v })}
      onAltChange={(v) => onChange({ ...content, photo_alt: v })}
    />
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
    case "icon-cards":
      return <IconCardsFields content={content} onChange={onChange} />;
    case "home-compare-table":
      return <HomeCompareTableFields content={content} onChange={onChange} />;
    case "product-problem-accordion":
      return <ProductProblemAccordionFields content={content} onChange={onChange} />;
    case "product-talk-cta":
      return <ProductTalkCtaFields content={content} onChange={onChange} />;
    case "product-compare-table":
      return <ProductCompareTableFields content={content} onChange={onChange} />;
    case "product-vendor-questions":
      return <ProductVendorQuestionsFields content={content} onChange={onChange} />;
    case "impact-manual-table":
      return <ImpactManualTableFields content={content} onChange={onChange} />;
    case "impact-year-in-review":
      return <ImpactYearInReviewFields content={content} onChange={onChange} />;
    case "contact-form-section":
      return <ContactFormSectionFields content={content} onChange={onChange} />;
    case "accordion":
      return <AccordionFields content={content} onChange={onChange} />;
    case "image":
      return <ImageFields content={content} onChange={onChange} />;
    default:
      return null;
  }
}
