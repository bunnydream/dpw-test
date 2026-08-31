"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { publishPageMeta, updatePageSlug, updatePageTitle } from "@/lib/admin/pages";
import { effectivePageSlug, effectivePageTitle } from "@/lib/admin/page-meta";
import type { Database } from "@/lib/supabase/types";
import { FIXED_PAGE_SLUGS, pageSlugToPath } from "@/lib/page-path";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];

// Small inline icon set, scoped to this route — mirrors the style of
// app/admin/(protected)/navbar/NavEditor.tsx and .../pages/[slug]/icons.tsx.
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/** Fixed pages first (in their fixed order), then custom pages alphabetically
 * by title — same ordering used by PageEditor's page-switcher dropdown and
 * the admin dashboard's page grid. */
function sortPages(pages: PageRow[]): PageRow[] {
  const fixed = FIXED_PAGE_SLUGS.map((s) => pages.find((p) => p.slug === s)).filter((p): p is PageRow => !!p);
  const custom = pages.filter((p) => !FIXED_PAGE_SLUGS.includes(p.slug)).sort((a, b) => a.title.localeCompare(b.title));
  return [...fixed, ...custom];
}

// draft_meta is a full snapshot seeded from every live field on first edit
// (see currentPageMeta in lib/admin/pages.ts) — so its presence alone
// doesn't mean a given field has a pending change; compare each field
// against the live column to know whether it's actually pending.
function pagePendingFields(page: PageRow): { namePending: boolean; urlPending: boolean } {
  const isPublished = page.status === "published";
  const draft = isPublished ? (page.draft_meta as { title: string; slug: string } | null) : null;
  return {
    namePending: !!draft && draft.title !== page.title,
    urlPending: !!draft && draft.slug !== page.slug,
  };
}

export default function PageOptionsEditor({ pages }: { pages: PageRow[] }) {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [publishingAll, setPublishingAll] = useState(false);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  const pendingPages = pages.filter((p) => {
    const { namePending, urlPending } = pagePendingFields(p);
    return namePending || urlPending;
  });

  /** Publishes every page with a pending name/URL change in one click.
   * Uses Promise.allSettled (not Promise.all) so one page failing doesn't
   * abort or hide another page's successful publish — failures are named
   * individually in the toast rather than reported as one generic error. */
  async function handlePublishAll() {
    if (pendingPages.length === 0) return;
    setPublishingAll(true);
    const results = await Promise.allSettled(pendingPages.map((p) => publishPageMeta(p.slug)));
    const failed = pendingPages.filter((_, i) => results[i].status === "rejected");
    router.refresh();
    if (failed.length === 0) {
      showToast(`Published ${pendingPages.length} page${pendingPages.length > 1 ? "s" : ""}`);
    } else {
      const names = failed.map((p) => effectivePageTitle(p)).join(", ");
      const okCount = pendingPages.length - failed.length;
      showToast(okCount > 0 ? `Published ${okCount}, failed: ${names}` : `Failed to publish: ${names}`);
    }
    setPublishingAll(false);
  }

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>Page Options</h1>
          <div className="admin-topbar-sub">Rename a page or change its URL.</div>
        </div>
        <div className="admin-topbar-actions">
          <span className={`a-save-status${publishingAll ? " is-saving" : ""}`}>
            {!publishingAll && pendingPages.length === 0 ? <CheckIcon /> : null}
            {publishingAll ? "Publishing..." : pendingPages.length > 0 ? "Unpublished changes" : "All changes saved"}
          </span>
          <button
            type="button"
            className="a-btn a-btn-primary"
            onClick={handlePublishAll}
            disabled={publishingAll || pendingPages.length === 0}
          >
            {publishingAll ? "Publishing..." : "Publish changes"}
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="a-settings-wrap" style={{ maxWidth: 720 }}>
          <div className="a-card">
            <div className="a-settings-card-title">Pages</div>
            <div className="a-settings-card-sub">
              Every page&apos;s name and URL live here. Navigation items shows each page&apos;s name read-only,
              always matching whatever it&apos;s named here.
            </div>
            <div className="a-nav-editor-list">
              {sortPages(pages).map((page) => (
                <PageOptionsRow key={page.id} page={page} onToast={showToast} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`a-toast${toast ? " is-visible" : ""}`}>
        <CheckIcon />
        <span>{toast ?? ""}</span>
      </div>
    </>
  );
}

function PageOptionsRow({ page, onToast }: { page: PageRow; onToast: (message: string) => void }) {
  const router = useRouter();
  const isFixed = FIXED_PAGE_SLUGS.includes(page.slug);
  const isPublished = page.status === "published";
  const { namePending, urlPending } = pagePendingFields(page);

  const currentName = effectivePageTitle(page);
  const [nameValue, setNameValue] = useState(currentName);
  const [nameSaving, setNameSaving] = useState(false);

  const currentSlug = effectivePageSlug(page);
  const [slugValue, setSlugValue] = useState(currentSlug);
  const [slugSaving, setSlugSaving] = useState(false);
  // Holds the trimmed candidate slug while the "old URL will stop working"
  // warning modal is open, for an already-published page only.
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);

  async function handleNameSave() {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === currentName) {
      setNameValue(currentName);
      return;
    }
    setNameSaving(true);
    try {
      await updatePageTitle(page.id, trimmed, isPublished);
      onToast(isPublished ? "Name change saved — publish this page to apply" : "Page name updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      onToast("Failed to update page name");
      setNameValue(currentName);
    } finally {
      setNameSaving(false);
    }
  }

  /** Actually persists a slug change (past the warning modal, if one was
   * shown). Unlike the page editor this field used to live in, this list's
   * own URL never depends on a page's slug, so there's nothing to navigate
   * afterward — just refresh so the row picks up the saved value. */
  async function commitSlugSave(trimmed: string) {
    setSlugSaving(true);
    try {
      await updatePageSlug(page.id, trimmed, isPublished);
      onToast(isPublished ? "URL change saved — publish this page to apply" : "Page URL updated");
      router.refresh();
    } catch (err) {
      console.error(err);
      onToast(err instanceof Error ? err.message : "Failed to update page URL");
      setSlugValue(currentSlug);
    } finally {
      setSlugSaving(false);
    }
  }

  function handleSlugSave() {
    const trimmed = slugValue.trim();
    if (!trimmed || trimmed === currentSlug) {
      setSlugValue(currentSlug);
      return;
    }
    if (isPublished) {
      setPendingSlug(trimmed);
      return;
    }
    commitSlugSave(trimmed);
  }

  return (
    <div className="a-nav-editor-row">
      <div className="a-nav-editor-row-fields">
        <div>
          <input
            className="a-input"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            disabled={nameSaving}
            aria-label="Page name"
          />
          {namePending ? <div className="a-field-hint">Pending — publish this page to apply</div> : null}
        </div>
        <div>
          {isFixed ? (
            <input
              className="a-input a-input-readonly"
              value={pageSlugToPath(page.slug)}
              readOnly
              tabIndex={-1}
              aria-label="Page URL"
              title="Built-in pages can't have their URL changed"
            />
          ) : (
            <>
              <input
                className="a-input"
                value={slugValue}
                onChange={(e) => setSlugValue(e.target.value)}
                onBlur={handleSlugSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
                disabled={slugSaving}
                aria-label="Page URL"
              />
              {urlPending ? <div className="a-field-hint">Pending — publish this page to apply</div> : null}
            </>
          )}
        </div>
      </div>
      <div className="a-nav-editor-row-toggle">
        <span className={`a-status a-status-${page.status}`}>{page.status === "published" ? "Published" : "Draft"}</span>
      </div>

      {pendingSlug ? (
        <div
          className="a-modal-overlay is-open"
          onClick={() => {
            setPendingSlug(null);
            setSlugValue(currentSlug);
          }}
        >
          <div className="a-modal a-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="a-warning-icon">
              <WarningIcon />
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              Change this page&apos;s URL?
            </h2>
            <p className="a-modal-desc" style={{ marginBottom: 4 }}>
              This page is already published at <strong>{pageSlugToPath(page.slug)}</strong>. Once you publish this
              change, that address will stop working — anyone who has bookmarked or linked to it will see a &quot;not
              found&quot; page instead. We don&apos;t redirect old URLs automatically.
            </p>
            <div className="a-modal-actions">
              <button
                className="a-btn a-btn-outline"
                onClick={() => {
                  setPendingSlug(null);
                  setSlugValue(currentSlug);
                }}
              >
                Cancel
              </button>
              <button
                className="a-btn a-btn-danger"
                style={{ background: "#B91C1C", borderColor: "#B91C1C", color: "var(--white)" }}
                onClick={() => {
                  const trimmed = pendingSlug;
                  setPendingSlug(null);
                  commitSlugSave(trimmed);
                }}
              >
                Change URL
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
