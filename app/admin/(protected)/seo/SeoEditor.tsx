"use client";

import { useState, useTransition } from "react";
import { updateSeoSettings } from "@/lib/admin/site-settings";
import { uploadMedia } from "@/lib/admin/media";
import type { SeoSettings } from "@/lib/site-settings";

// Mirrors app/admin/(protected)/footer/FooterEditor.tsx's icon set.
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

export default function SeoEditor({ initial }: { initial: SeoSettings }) {
  const [settings, setSettings] = useState<SeoSettings>(initial);
  const [dirty, setDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploadingOg, setUploadingOg] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function update(patch: Partial<SeoSettings>) {
    setSettings((s) => ({ ...s, ...patch }));
    setDirty(true);
    setMessage(null);
  }

  async function handleOgFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingOg(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadMedia(fd);
    setUploadingOg(false);
    if (res.ok && res.url) {
      update({ defaultOgImageUrl: res.url });
    } else {
      setUploadError(res.error || "Upload failed");
    }
    e.target.value = "";
  }

  async function handleFaviconFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFavicon(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadMedia(fd);
    setUploadingFavicon(false);
    if (res.ok && res.url) {
      update({ faviconUrl: res.url });
    } else {
      setUploadError(res.error || "Upload failed");
    }
    e.target.value = "";
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await updateSeoSettings(settings);
        setDirty(false);
        setMessage({ type: "success", text: "SEO settings updated." });
      } catch (err) {
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Couldn't save SEO settings." });
      }
    });
  }

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>SEO</h1>
          <div className="admin-topbar-sub">Sitewide defaults for search engines and social sharing.</div>
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
            <div className="a-settings-card-title">Defaults</div>
            <div className="a-settings-card-sub">Used when a page or post doesn&apos;t set its own SEO fields.</div>

            <div className="a-field">
              <label htmlFor="seo-title-suffix">Title suffix</label>
              <input
                className="a-input"
                id="seo-title-suffix"
                value={settings.titleSuffix}
                onChange={(e) => update({ titleSuffix: e.target.value })}
                placeholder="— Digital Public Works"
              />
              <div className="a-field-hint">Appended to a page&apos;s own title, e.g. &quot;About {settings.titleSuffix}&quot;.</div>
            </div>

            <div className="a-field">
              <label htmlFor="seo-default-description">Default meta description</label>
              <textarea
                className="a-textarea"
                id="seo-default-description"
                rows={3}
                value={settings.defaultMetaDescription}
                onChange={(e) => update({ defaultMetaDescription: e.target.value })}
              />
            </div>
          </div>

          <div className="a-card">
            <div className="a-settings-card-title">Default social share image</div>
            <div className="a-settings-card-sub">Used when a page or post has no OG image of its own.</div>

            {settings.defaultOgImageUrl ? (
              <div className="a-footer-editor-logo-current">
                <img src={settings.defaultOgImageUrl} alt="" />
                <div className="a-footer-editor-logo-actions">
                  <label className="a-btn a-btn-outline a-btn-sm" style={{ cursor: uploadingOg ? "not-allowed" : "pointer" }}>
                    {uploadingOg ? "Uploading..." : "Replace image"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleOgFile}
                      disabled={uploadingOg}
                    />
                  </label>
                  <button type="button" className="a-btn a-btn-outline a-btn-sm" onClick={() => update({ defaultOgImageUrl: null })}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="a-upload">
                <div className="a-upload-cta">
                  <UploadIcon />
                  <span>
                    <strong>{uploadingOg ? "Uploading..." : "Click to upload"}</strong>
                    {!uploadingOg ? " a default share image" : ""}
                  </span>
                </div>
                <input type="file" accept="image/*" onChange={handleOgFile} disabled={uploadingOg} />
              </div>
            )}
          </div>

          <div className="a-card">
            <div className="a-settings-card-title">Favicon</div>
            <div className="a-settings-card-sub">Falls back to the site&apos;s default icon if not set.</div>

            {settings.faviconUrl ? (
              <div className="a-footer-editor-logo-current">
                <img src={settings.faviconUrl} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
                <div className="a-footer-editor-logo-actions">
                  <label className="a-btn a-btn-outline a-btn-sm" style={{ cursor: uploadingFavicon ? "not-allowed" : "pointer" }}>
                    {uploadingFavicon ? "Uploading..." : "Replace favicon"}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFaviconFile}
                      disabled={uploadingFavicon}
                    />
                  </label>
                  <button type="button" className="a-btn a-btn-outline a-btn-sm" onClick={() => update({ faviconUrl: null })}>
                    Use default icon
                  </button>
                </div>
              </div>
            ) : (
              <div className="a-upload">
                <div className="a-upload-cta">
                  <UploadIcon />
                  <span>
                    <strong>{uploadingFavicon ? "Uploading..." : "Click to upload"}</strong>
                    {!uploadingFavicon ? " a favicon (currently using the default icon)" : ""}
                  </span>
                </div>
                <input type="file" accept="image/*" onChange={handleFaviconFile} disabled={uploadingFavicon} />
              </div>
            )}
            {uploadError ? (
              <div className="a-field-hint" style={{ color: "#B91C1C" }}>
                {uploadError}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
