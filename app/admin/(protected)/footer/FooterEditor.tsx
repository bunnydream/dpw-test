"use client";

import { useState, useTransition } from "react";
import { updateFooterSettings } from "@/lib/admin/site-settings";
import { uploadMedia } from "@/lib/admin/media";
import LinkPicker from "@/components/admin/LinkPicker";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import type { FooterLink, FooterSettings } from "@/lib/site-settings";

// Small inline icon set, scoped to this route — mirrors the style of
// app/admin/(protected)/pages/[slug]/icons.tsx (viewBox 0 0 24 24, stroke-based).
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

export default function FooterEditor({ initial }: { initial: FooterSettings }) {
  const [settings, setSettings] = useState<FooterSettings>(initial);
  const [dirty, setDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [logoPickerOpen, setLogoPickerOpen] = useState(false);

  function update(patch: Partial<FooterSettings>) {
    setSettings((s) => ({ ...s, ...patch }));
    setDirty(true);
    setMessage(null);
  }

  function updateLink(id: string, patch: Partial<FooterLink>) {
    update({ links: settings.links.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
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

  function handleLogoPicked(url: string) {
    setLogoPickerOpen(false);
    update({ logoUrl: url });
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updateFooterSettings(settings);
        setDirty(false);
        setMessage({ type: "success", text: "Footer updated." });
      } catch (err) {
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Couldn't save footer." });
      }
    });
  }

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>Footer</h1>
          <div className="admin-topbar-sub">Control the text, links, and logo shown in the site footer.</div>
        </div>
        <div className="admin-topbar-actions">
          <span className={`a-save-status${isPending ? " is-saving" : ""}`}>
            {!isPending && !dirty ? <CheckIcon /> : null}
            {isPending ? "Publishing..." : dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          <button type="button" className="a-btn a-btn-copper" onClick={handleSave} disabled={isPending || !dirty}>
            <CheckIcon />
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
            <div className="a-settings-card-sub">Shown in the site footer.</div>

            {settings.logoUrl ? (
              <div className="a-footer-editor-logo-current">
                <img src={settings.logoUrl} alt="" />
                <div className="a-footer-editor-logo-actions">
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
                  <button
                    type="button"
                    className="a-btn a-btn-outline a-btn-sm"
                    onClick={() => setLogoPickerOpen(true)}
                  >
                    Media library
                  </button>
                  <button type="button" className="a-btn a-btn-outline a-btn-sm" onClick={() => update({ logoUrl: null })}>
                    Use default logo
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div className="a-upload" style={{ flex: 1 }}>
                  <div className="a-upload-cta">
                    <UploadIcon />
                    <span>
                      <strong>{uploading ? "Uploading..." : "Click to upload"}</strong>
                      {!uploading ? " a logo (currently using the default logo)" : ""}
                    </span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleLogoFile} disabled={uploading} />
                </div>
                <button
                  type="button"
                  className="a-btn a-btn-outline a-btn-sm"
                  onClick={() => setLogoPickerOpen(true)}
                  disabled={uploading}
                >
                  Media library
                </button>
              </div>
            )}
            {uploadError ? (
              <div className="a-field-hint" style={{ color: "#B91C1C" }}>
                {uploadError}
              </div>
            ) : null}
            {logoPickerOpen ? (
              <MediaLibraryModal onSelect={handleLogoPicked} onClose={() => setLogoPickerOpen(false)} />
            ) : null}
          </div>

          <div className="a-card">
            <div className="a-settings-card-title">Call to action</div>
            <div className="a-field" style={{ marginTop: 0 }}>
              <label htmlFor="footer-cta-label">Label</label>
              <input
                className="a-input"
                id="footer-cta-label"
                value={settings.ctaLabel}
                onChange={(e) => update({ ctaLabel: e.target.value })}
              />
            </div>
            <div className="a-field-row">
              <div className="a-field">
                <label htmlFor="footer-cta-text">Button text</label>
                <input
                  className="a-input"
                  id="footer-cta-text"
                  value={settings.ctaText}
                  onChange={(e) => update({ ctaText: e.target.value })}
                />
              </div>
              <LinkPicker label="Button link" value={settings.ctaLink} onChange={(v) => update({ ctaLink: v })} />
            </div>
          </div>

          <div className="a-card">
            <div className="a-settings-card-title">Details</div>
            <div className="a-field" style={{ marginTop: 0 }}>
              <label htmlFor="footer-tagline">Tagline</label>
              <input
                className="a-input"
                id="footer-tagline"
                value={settings.tagline}
                onChange={(e) => update({ tagline: e.target.value })}
              />
            </div>
            <div className="a-field">
              <label htmlFor="footer-email">Email</label>
              <input
                className="a-input"
                id="footer-email"
                type="email"
                value={settings.email}
                onChange={(e) => update({ email: e.target.value })}
              />
            </div>
            <div className="a-field">
              <label htmlFor="footer-address">Address</label>
              <input
                className="a-input"
                id="footer-address"
                value={settings.address}
                onChange={(e) => update({ address: e.target.value })}
              />
            </div>
          </div>

          <div className="a-card">
            <div className="a-settings-card-title">Links</div>
            <div className="a-footer-editor-links">
              {settings.links.map((link) => (
                <div className="a-footer-editor-link-row" key={link.id}>
                  <div className="a-field">
                    <label>Text</label>
                    <input
                      className="a-input"
                      value={link.label}
                      onChange={(e) => updateLink(link.id, { label: e.target.value })}
                      placeholder="Label"
                    />
                  </div>
                  <LinkPicker
                    label="Text Link"
                    value={link.href}
                    onChange={(v) => updateLink(link.id, { href: v })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
