"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "@/lib/admin/pages";

/** Replaces the old disabled "Add a new page" dashboard card. Opens a small
 * modal (same a-modal/a-modal-sm pattern as DeletePageButton) asking for a
 * title, creates a draft page via createPage(), then routes straight into
 * its editor so the admin can start adding blocks right away. */
export default function AddPageButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function close() {
    if (isPending) return;
    setIsOpen(false);
    setTitle("");
    setError(null);
  }

  function handleCreate() {
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Give the page a title first.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const page = await createPage(trimmed);
        router.push(`/admin/pages/${page.slug}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create page");
      }
    });
  }

  return (
    <>
      <button type="button" className="a-page-add-card" onClick={() => setIsOpen(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add a new page
      </button>

      <div className={`a-modal-overlay${isOpen ? " is-open" : ""}`} onClick={close}>
        <div className="a-modal a-modal-sm" onClick={(e) => e.stopPropagation()}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            Add a new page
          </h2>
          <p className="a-modal-desc" style={{ marginBottom: 4 }}>
            Give your new page a title. You can add blocks and publish it once it&rsquo;s created.
          </p>
          <div className="a-field" style={{ marginTop: 16 }}>
            <label>Page title</label>
            <input
              type="text"
              className="a-input"
              placeholder="e.g. Partners"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
              autoFocus
              disabled={isPending}
            />
          </div>
          {error && (
            <p className="a-modal-desc" style={{ color: "#B91C1C", marginTop: 8, marginBottom: 0 }}>
              {error}
            </p>
          )}
          <div className="a-modal-actions">
            <button type="button" className="a-btn a-btn-outline" onClick={close} disabled={isPending}>
              Cancel
            </button>
            <button type="button" className="a-btn a-btn-copper" onClick={handleCreate} disabled={isPending}>
              {isPending ? "Creating…" : "Create page"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
