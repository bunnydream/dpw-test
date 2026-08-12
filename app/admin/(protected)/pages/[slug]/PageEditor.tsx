"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSection, deleteSection, publishPage, reorderSections, updateSectionContent } from "@/lib/admin/pages";
import type { Database, SectionType } from "@/lib/supabase/types";
import { BLOCK_TYPES, SECTION_TYPE_LABEL, starterContent, starterName } from "./block-types";
import { BackgroundColorField, SectionContentFields, sectionDisplayName } from "./section-fields";
import {
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  DownIcon,
  ExternalLinkIcon,
  GripIcon,
  PlusIcon,
  RefreshIcon,
  TrashIcon,
  UpIcon,
  WarningIcon,
} from "./icons";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];
type SectionRow = Database["public"]["Tables"]["sections"]["Row"];

const SLUG_TO_LIVE_PATH: Record<string, string> = {
  home: "/",
  about: "/about",
  product: "/product",
  impact: "/impact",
  careers: "/careers",
  contact: "/contact",
};

const PAGE_OPTIONS: { slug: string; label: string }[] = [
  { slug: "home", label: "Home page" },
  { slug: "about", label: "About page" },
  { slug: "product", label: "Product page" },
  { slug: "impact", label: "Impact page" },
  { slug: "careers", label: "Careers page" },
  { slug: "contact", label: "Contact page" },
];

export default function PageEditor({
  slug,
  page,
  initialSections,
}: {
  slug: string;
  page: PageRow;
  initialSections: SectionRow[];
}) {
  const router = useRouter();
  const [sections, setSections] = useState<SectionRow[]>(initialSections);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const livePath = SLUG_TO_LIVE_PATH[slug] ?? "/";
  const hasUnsaved = dirtyIds.size > 0;

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  function toggleOpen(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function updateSectionLocal(id: string, patch: Partial<SectionRow>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    setDirtyIds((prev) => new Set(prev).add(id));
  }

  /** Persists every section with pending edits via updateSectionContent — this
   * only writes to the DB, it never revalidates the public route on its own
   * (see lib/admin/pages.ts). Shared by both "Save draft" and the first half
   * of "Publish changes". */
  async function persistDirty(): Promise<boolean> {
    const ids = Array.from(dirtyIds);
    if (ids.length === 0) return true;
    try {
      await Promise.all(
        ids.map((id) => {
          const s = sections.find((sec) => sec.id === id);
          if (!s) return Promise.resolve();
          return updateSectionContent(id, s.content, s.background_color);
        })
      );
      setDirtyIds(new Set());
      return true;
    } catch (err) {
      console.error(err);
      showToast("Failed to save changes");
      return false;
    }
  }

  async function handleSaveDraft() {
    setSaving(true);
    const ok = await persistDirty();
    setSaving(false);
    if (ok) showToast("Draft saved");
  }

  async function handlePublish() {
    setSaving(true);
    const ok = await persistDirty();
    if (ok) {
      try {
        await publishPage(slug);
        setPreviewKey((k) => k + 1);
        showToast("Published to the live site");
      } catch (err) {
        console.error(err);
        showToast("Saved, but publishing failed");
      }
    }
    setSaving(false);
  }

  async function handleAddSection(type: SectionType) {
    setAddModalOpen(false);
    try {
      const created = await createSection(page.id, type, starterName(type), starterContent(type), sections.length);
      setSections((prev) => [...prev, created]);
      setOpenIds((prev) => new Set(prev).add(created.id));
      showToast("Block added");
    } catch (err) {
      console.error(err);
      showToast("Failed to add block");
    }
  }

  async function handleDeleteConfirmed() {
    const id = deleteTargetId;
    if (!id) return;
    setDeleteTargetId(null);
    try {
      await deleteSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
      setDirtyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast("Block deleted");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete block");
    }
  }

  async function moveSection(id: string, direction: -1 | 1) {
    const idx = sections.findIndex((s) => s.id === id);
    const targetIdx = idx + direction;
    if (idx < 0 || targetIdx < 0 || targetIdx >= sections.length) return;
    const next = [...sections];
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    setSections(next);
    try {
      await reorderSections(next.map((s) => s.id));
    } catch (err) {
      console.error(err);
      showToast("Failed to reorder blocks");
    }
  }

  return (
    <>
      <header className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <select
            className="a-select"
            style={{ width: 200, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            value={slug}
            onChange={(e) => router.push(`/admin/pages/${e.target.value}`)}
          >
            {PAGE_OPTIONS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.label}
              </option>
            ))}
          </select>
          <button className="a-icon-btn" onClick={() => setPreviewKey((k) => k + 1)} title="Refresh preview">
            <RefreshIcon />
          </button>
        </div>
        <div className="admin-topbar-actions">
          <span className={`a-save-status${saving ? " is-saving" : ""}`}>
            {!saving && !hasUnsaved ? <CheckIcon /> : null}
            {saving ? "Saving..." : hasUnsaved ? "Unsaved changes" : "All changes saved"}
          </span>
          <a href={livePath} target="_blank" rel="noreferrer" className="a-btn a-btn-ghost">
            <ExternalLinkIcon />
            View live site
          </a>
          <button className="a-btn a-btn-outline" onClick={handleSaveDraft} disabled={saving || !hasUnsaved}>
            Save draft
          </button>
          <button className="a-btn a-btn-copper" onClick={handlePublish} disabled={saving}>
            <CheckIcon />
            Publish changes
          </button>
        </div>
      </header>

      <div className="a-editor-shell">
        <div className="a-preview-pane">
          <div className="a-preview-pane-label">Live preview</div>
          <div className="a-preview-frame">
            <iframe
              key={previewKey}
              src={livePath}
              title="Live preview"
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </div>
        </div>

        <div className="a-sections-pane">
          <div className="a-sections-pane-header">
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700 }}>Page blocks</h2>
            <p>Click a block to edit its text and photos. Use the arrows to reorder, or the trash icon to remove it.</p>
          </div>

          <ul className="a-section-list">
            {sections.map((section, i) => {
              const isOpen = openIds.has(section.id);
              return (
                <li className={`a-section-item${isOpen ? " is-open" : ""}`} key={section.id}>
                  <div className="a-section-row" onClick={() => toggleOpen(section.id)}>
                    <span className="a-section-grip">
                      <GripIcon />
                    </span>
                    <div className="a-section-info">
                      <div className="a-section-type">{SECTION_TYPE_LABEL[section.type]}</div>
                      <div className="a-section-name">{sectionDisplayName(section.type, section.content)}</div>
                    </div>
                    <div className="a-section-row-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="a-icon-btn" onClick={() => moveSection(section.id, -1)} disabled={i === 0} title="Move up">
                        <UpIcon />
                      </button>
                      <button
                        className="a-icon-btn"
                        onClick={() => moveSection(section.id, 1)}
                        disabled={i === sections.length - 1}
                        title="Move down"
                      >
                        <DownIcon />
                      </button>
                    </div>
                    <ChevronIcon />
                  </div>
                  {isOpen ? (
                    <div className="a-section-panel">
                      <SectionContentFields
                        type={section.type}
                        content={section.content}
                        onChange={(c) => updateSectionLocal(section.id, { content: c })}
                      />
                      <BackgroundColorField
                        value={section.background_color}
                        onChange={(v) => updateSectionLocal(section.id, { background_color: v })}
                      />
                      <div className="a-panel-footer">
                        <button className="a-btn a-btn-danger a-btn-sm" onClick={() => setDeleteTargetId(section.id)}>
                          <TrashIcon />
                          Delete block
                        </button>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <button className="a-add-section-btn" onClick={() => setAddModalOpen(true)}>
            <PlusIcon />
            Add a new block
          </button>
        </div>
      </div>

      {addModalOpen ? (
        <div className="a-modal-overlay is-open" onClick={() => setAddModalOpen(false)}>
          <div className="a-modal a-modal--scroll" onClick={(e) => e.stopPropagation()}>
            <div className="a-modal-sticky">
              <div className="a-modal-header">
                <h2>Add a block</h2>
                <button className="a-modal-close" onClick={() => setAddModalOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <p className="a-modal-desc">Choose a layout below — you can move it afterward.</p>
            </div>
            <div className="a-modal-scroll-body">
              <div className="a-block-grid">
                {BLOCK_TYPES.map((b) => (
                  <button key={b.type} className="a-block-option" onClick={() => handleAddSection(b.type)}>
                    <PlusIcon />
                    <strong>{b.label}</strong>
                    <span>{b.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {deleteTargetId ? (
        <div className="a-modal-overlay is-open" onClick={() => setDeleteTargetId(null)}>
          <div className="a-modal a-modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="a-warning-icon">
              <WarningIcon />
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              Delete this block?
            </h2>
            <p className="a-modal-desc" style={{ marginBottom: 4 }}>
              This removes it right away. You can&apos;t undo this after publishing.
            </p>
            <div className="a-modal-actions">
              <button className="a-btn a-btn-outline" onClick={() => setDeleteTargetId(null)}>
                Cancel
              </button>
              <button
                className="a-btn a-btn-danger"
                style={{ background: "#B91C1C", borderColor: "#B91C1C", color: "var(--white)" }}
                onClick={handleDeleteConfirmed}
              >
                Delete block
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`a-toast${toast ? " is-visible" : ""}`}>
        <CheckIcon />
        <span>{toast ?? ""}</span>
      </div>
    </>
  );
}
