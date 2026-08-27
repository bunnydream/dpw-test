"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/admin/media";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";

export type SeoFieldsValue = {
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
};

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/**
 * Self-contained per-page/post SEO fields UI, shared by PageEditor.tsx and
 * BlogEditor.tsx. Collapsed by default and visually separate from block
 * editing. Purely controlled (value/onChange) — the parent editor folds
 * these fields into its own existing Save draft/Publish flow rather than
 * this card managing its own save action.
 */
export default function SeoFieldsCard({
  value,
  onChange,
}: {
  value: SeoFieldsValue;
  onChange: (patch: Partial<SeoFieldsValue>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadMedia(fd);
    setUploading(false);
    if (res.ok && res.url) onChange({ og_image_url: res.url });
    e.target.value = "";
  }

  const descLength = (value.meta_description ?? "").length;

  return (
    <div className="a-card a-seo-card">
      <button
        type="button"
        className="a-seo-card-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="a-card-title" style={{ marginBottom: 0 }}>
          SEO
        </span>
        <span className={`a-seo-card-chevron${open ? " is-open" : ""}`}>
          <ChevronIcon />
        </span>
      </button>

      {open ? (
        <div className="a-seo-card-body">
          <div className="a-field" style={{ marginTop: 0 }}>
            <label>Meta title</label>
            <input
              className="a-input"
              type="text"
              placeholder="Leave blank to use the default title"
              value={value.meta_title ?? ""}
              onChange={(e) => onChange({ meta_title: e.target.value || null })}
            />
          </div>

          <div className="a-field">
            <label>Meta description</label>
            <textarea
              className="a-textarea"
              rows={3}
              placeholder="Leave blank to use the site default description"
              value={value.meta_description ?? ""}
              onChange={(e) => onChange({ meta_description: e.target.value || null })}
            />
            <div className="a-seo-char-count">{descLength}/160</div>
          </div>

          <div className="a-field">
            <label>Social share image</label>
            {value.og_image_url ? (
              <div className="a-upload-block">
                <img src={value.og_image_url} alt="" />
                <div className="a-upload-actions">
                  <label className="a-btn a-btn-outline a-btn-sm" style={{ cursor: "pointer" }}>
                    {uploading ? "Uploading..." : "Replace"}
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} disabled={uploading} />
                  </label>
                  <button type="button" className="a-btn a-btn-outline a-btn-sm" onClick={() => setPickerOpen(true)} disabled={uploading}>
                    Media library
                  </button>
                  <button
                    type="button"
                    className="a-btn a-btn-outline a-btn-sm"
                    onClick={() => onChange({ og_image_url: null })}
                    disabled={uploading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="a-upload-empty">
                <div className="a-upload">
                  <div className="a-upload-cta">
                    <span>
                      <strong>{uploading ? "Uploading..." : "Click to upload"}</strong>
                      {!uploading ? " (uses the site default if not set)" : ""}
                    </span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
                </div>
                <button type="button" className="a-btn a-btn-outline a-btn-sm" onClick={() => setPickerOpen(true)} disabled={uploading}>
                  Media library
                </button>
              </div>
            )}
            {pickerOpen ? (
              <MediaLibraryModal
                onSelect={(url) => {
                  setPickerOpen(false);
                  onChange({ og_image_url: url });
                }}
                onClose={() => setPickerOpen(false)}
              />
            ) : null}
          </div>

          <div className="a-field">
            <label>Canonical URL</label>
            <input
              className="a-input"
              type="text"
              placeholder="Leave blank to use this page's own URL"
              value={value.canonical_url ?? ""}
              onChange={(e) => onChange({ canonical_url: e.target.value || null })}
            />
          </div>

          <div className="a-field a-seo-noindex-row">
            <span className="a-partner-visible-label">Hide from search engines</span>
            <span
              className={`a-toggle${value.noindex ? " is-on" : ""}`}
              onClick={() => onChange({ noindex: !value.noindex })}
              role="switch"
              aria-checked={value.noindex}
              tabIndex={0}
            >
              <span className="a-toggle-knob"></span>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
