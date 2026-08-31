"use client";

import { useMemo, useState, useTransition } from "react";
import { updateNavSettings } from "@/lib/admin/site-settings";
import { uploadMedia } from "@/lib/admin/media";
import LinkPicker from "@/components/admin/LinkPicker";
import type { NavItem, NavSettings } from "@/lib/site-settings";
import { effectivePageTitle } from "@/lib/admin/page-meta";
import type { Database } from "@/lib/supabase/types";
import { pageSlugToPath } from "@/lib/page-path";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];

// Small inline icon set, scoped to this route — mirrors the style of
// app/admin/(protected)/pages/[slug]/icons.tsx (viewBox 0 0 24 24, stroke-based).
function UpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function DownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function NavEditor({ initial, pages }: { initial: NavSettings; pages: PageRow[] }) {
  const [settings, setSettings] = useState<NavSettings>(initial);
  const [dirty, setDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Names are edited exclusively in Site → Page Options now; this map lets
  // each item's row display that live, always-current name read-only,
  // rather than trusting its own (normally in-sync, but no longer editable
  // here) stored `label`.
  const pageTitleByHref = useMemo(
    () => new Map(pages.map((p) => [pageSlugToPath(p.slug), effectivePageTitle(p)])),
    [pages]
  );

  function update(patch: Partial<NavSettings>) {
    setSettings((s) => ({ ...s, ...patch }));
    setDirty(true);
    setMessage(null);
  }

  function updateItem(id: string, patch: Partial<NavItem>) {
    update({ items: settings.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) });
  }

  function moveItem(id: string, direction: -1 | 1) {
    const idx = settings.items.findIndex((it) => it.id === id);
    const targetIdx = idx + direction;
    if (idx < 0 || targetIdx < 0 || targetIdx >= settings.items.length) return;
    const next = [...settings.items];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    update({ items: next });
  }

  async function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadMedia(fd);
    setUploading(false);
    if (res.ok && res.url) {
      update({ logoUrl: res.url });
    } else {
      setUploadError(res.error || "Upload failed");
    }
    e.target.value = "";
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updateNavSettings(settings);
        setDirty(false);
        setMessage({ type: "success", text: "Navbar updated." });
      } catch (err) {
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Couldn't save navbar." });
      }
    });
  }

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>Navbar</h1>
          <div className="admin-topbar-sub">Control what shows in the site header.</div>
        </div>
        <div className="admin-topbar-actions">
          <span className={`a-save-status${isPending ? " is-saving" : ""}`}>
            {!isPending && !dirty ? <CheckIcon /> : null}
            {isPending ? "Publishing..." : dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <button type="button" className="a-btn a-btn-primary" onClick={handleSave} disabled={isPending || !dirty}>
            {isPending ? "Saving…" : "Publish changes"}
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="a-settings-wrap" style={{ maxWidth: 720 }}>
          {message ? (
            <div className="a-field-hint" style={{ color: message.type === "error" ? "#B91C1C" : "var(--park-green)" }}>
              {message.text}
            </div>
          ) : null}

          <div className="a-card">
            <div className="a-settings-card-title">Logo</div>
            <div className="a-settings-card-sub">Shown at the top-left of the site header.</div>

            {settings.logoUrl ? (
              <div className="a-nav-editor-logo-current">
                <img src={settings.logoUrl} alt="" />
                <div className="a-nav-editor-logo-actions">
                  <label className="a-btn a-btn-outline a-btn-sm" style={{ cursor: uploading ? "not-allowed" : "pointer" }}>
                    {uploading ? "Uploading..." : "Replace logo"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleLogoFile}
                      disabled={uploading}
                    />
                  </label>
                  <button type="button" className="a-btn a-btn-outline a-btn-sm" onClick={() => update({ logoUrl: null })}>
                    Use default logo
                  </button>
                </div>
              </div>
            ) : (
              <div className="a-upload">
                <div className="a-upload-cta">
                  <UploadIcon />
                  <span>
                    <strong>{uploading ? "Uploading..." : "Click to upload"}</strong>
                    {!uploading ? " a logo (currently using the default logo)" : ""}
                  </span>
                </div>
                <input type="file" accept="image/*" onChange={handleLogoFile} disabled={uploading} />
              </div>
            )}
            {uploadError ? (
              <div className="a-field-hint" style={{ color: "#B91C1C" }}>
                {uploadError}
              </div>
            ) : null}
          </div>

          <div className="a-card">
            <div className="a-settings-card-title">Navigation items</div>
            <div className="a-settings-card-sub">
              Toggle visibility and reorder the pages shown in the header.
            </div>
            <div className="a-nav-editor-list">
              {settings.items.map((item, i) => {
                // Falls back to the item's own last-known stored label only
                // if its href matches no known page — expected never to
                // happen in practice, since every item here is created via
                // appendPageToNav and always tied to a real page.
                const displayName = pageTitleByHref.get(item.href) ?? item.label;
                return (
                  <div className={`a-nav-editor-row${item.visible ? "" : " is-hidden"}`} key={`${item.id}-${i}`}>
                    <div className="a-nav-editor-row-order">
                      <button
                        type="button"
                        className="a-icon-btn"
                        onClick={() => moveItem(item.id, -1)}
                        disabled={i === 0}
                        title="Move up"
                      >
                        <UpIcon />
                      </button>
                      <button
                        type="button"
                        className="a-icon-btn"
                        onClick={() => moveItem(item.id, 1)}
                        disabled={i === settings.items.length - 1}
                        title="Move down"
                      >
                        <DownIcon />
                      </button>
                    </div>
                    <div className="a-nav-editor-row-fields is-single">
                      <div className="a-nav-editor-row-name" title="Rename this page under Site → Page Options">
                        {displayName}
                      </div>
                    </div>
                    <div className="a-nav-editor-row-toggle">
                      <span className="a-partner-visible-label">{item.visible ? "Visible" : "Hidden"}</span>
                      <span
                        className={`a-toggle${item.visible ? " is-on" : ""}`}
                        onClick={() => updateItem(item.id, { visible: !item.visible })}
                        role="switch"
                        aria-checked={item.visible}
                        tabIndex={0}
                      >
                        <span className="a-toggle-knob"></span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="a-card">
            <div className="a-settings-card-title">Call to action button</div>
            <div className="a-field-row">
              <div className="a-field">
                <label htmlFor="nav-cta-text">Button text</label>
                <input
                  className="a-input"
                  id="nav-cta-text"
                  value={settings.ctaText}
                  onChange={(e) => update({ ctaText: e.target.value })}
                />
              </div>
              <LinkPicker label="Button link" value={settings.ctaLink} onChange={(v) => update({ ctaLink: v })} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
