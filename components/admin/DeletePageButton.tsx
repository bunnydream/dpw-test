"use client";

import { useState, useTransition } from "react";
import { softDeletePage } from "@/lib/admin/deleted-pages";

/** Trash icon button on a dashboard page card. Opens a confirm modal
 * (matches ADMIN PAGES/admin-dashboard.html's #delete-page-modal), then
 * soft-deletes the page via a Server Action and shows an inline toast.
 * revalidatePath("/admin") inside softDeletePage refreshes the dashboard's
 * server data automatically; `isDeleted` just gives instant feedback while
 * that refresh lands. */
export default function DeletePageButton({
  pageId,
  slug,
  title,
}: {
  pageId: string;
  slug: string;
  title: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await softDeletePage(pageId, slug, title);
        setIsOpen(false);
        setIsDeleted(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2400);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete page");
      }
    });
  }

  if (isDeleted) {
    return (
      <>
        <span className="a-page-meta" style={{ color: "#B91C1C", marginBottom: 0 }}>
          Deleted — kept for 30 days
        </span>
        <div className={`a-toast${showToast ? " is-visible" : ""}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Page deleted — kept for 30 days</span>
        </div>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        className="a-icon-btn a-page-delete"
        title="Delete page"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>

      <div className={`a-modal-overlay${isOpen ? " is-open" : ""}`}>
        <div className="a-modal a-modal-sm">
          <div className="a-warning-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            Delete <span>{title}</span>?
          </h2>
          <p className="a-modal-desc" style={{ marginBottom: 4 }}>
            This page will move to Deleted pages in the sidebar, where it&rsquo;s kept for 30 days before it&rsquo;s
            removed for good.
          </p>
          {error && (
            <p className="a-modal-desc" style={{ color: "#B91C1C", marginBottom: 4 }}>
              {error}
            </p>
          )}
          <div className="a-modal-actions">
            <button
              type="button"
              className="a-btn a-btn-outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="a-btn a-btn-danger"
              style={{ background: "#B91C1C", borderColor: "#B91C1C", color: "var(--white)" }}
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting…" : "Delete page"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
