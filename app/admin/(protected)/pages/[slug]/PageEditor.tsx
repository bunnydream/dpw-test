"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSection,
  deleteSection,
  publishPage,
  reorderSections,
  updatePageTitle,
  updateSectionContent,
} from "@/lib/admin/pages";
import type { Database, SectionType } from "@/lib/supabase/types";
import { FIXED_PAGE_SLUGS, pageSlugToPath } from "@/lib/page-path";
import { BLOCK_TYPES, SECTION_TYPE_LABEL, starterContent, starterName } from "./block-types";
import { BackgroundColorField, SectionContentFields, sectionDisplayName } from "./section-fields";
import {
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  DownIcon,
  EditIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  GripIcon,
  PlusIcon,
  RedoIcon,
  RefreshIcon,
  TrashIcon,
  UndoIcon,
  UpIcon,
  WarningIcon,
} from "./icons";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];
type SectionRow = Database["public"]["Tables"]["sections"]["Row"];

// Block types whose individual cards have their own background color,
// separate from the section's own background_color — rendered directly
// above it so the two color pickers sit next to each other.
const CARD_BACKGROUND_TYPES: SectionType[] = ["steps", "voices", "content-cards", "case-study", "icon-cards", "team-member"];

// Types with no background_color control: "cta" sets its own via a required
// background photo; the other two are nested widgets inside another
// section's own chrome (no independent section background of their own).
const NO_BACKGROUND_TYPES: SectionType[] = ["cta", "product-problem-accordion", "impact-manual-table"];

const FIXED_PAGE_LABELS: Record<string, string> = {
  home: "Home page",
  about: "About page",
  product: "Product page",
  impact: "Impact page",
  careers: "Careers page",
  contact: "Contact page",
};

/** Builds the page-switcher dropdown: the 6 built-ins first (in their fixed
 * order), then any custom pages sorted alphabetically. */
function buildPageOptions(pages: PageRow[]): { slug: string; label: string }[] {
  const fixed = FIXED_PAGE_SLUGS.map((s) => pages.find((p) => p.slug === s))
    .filter((p): p is PageRow => !!p)
    .map((p) => ({ slug: p.slug, label: FIXED_PAGE_LABELS[p.slug] ?? p.title }));

  const custom = pages
    .filter((p) => !FIXED_PAGE_SLUGS.includes(p.slug))
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((p) => ({ slug: p.slug, label: p.title }));

  return [...fixed, ...custom];
}

export default function PageEditor({
  slug,
  page,
  initialSections,
  pages,
}: {
  slug: string;
  page: PageRow;
  initialSections: SectionRow[];
  pages: PageRow[];
}) {
  const router = useRouter();
  const [sections, setSections] = useState<SectionRow[]>(initialSections);
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Scroll the newly-opened section into view so it's visible without the
  // user having to hunt for it, e.g. after adding a block at the bottom of
  // a long list.
  useEffect(() => {
    if (!openId) return;
    document.getElementById(`section-${openId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [openId]);

  // Linear undo/redo history over `sections`. A snapshot of the *current*
  // sections is pushed onto `past` right before a structural mutation is
  // applied (add/delete/move), and once inside persistDirty() right before
  // a save request fires (so pending text-field edits get one checkpoint
  // per save, not one per keystroke). Purely client-side editor state —
  // Save/Publish operate on whatever `sections` state undo/redo leaves.
  const [past, setPast] = useState<SectionRow[][]>([]);
  const [future, setFuture] = useState<SectionRow[][]>([]);

  const pageOptions = buildPageOptions(pages);

  // Page title editing
  const [titleValue, setTitleValue] = useState(page.title);
  const [titleSaving, setTitleSaving] = useState(false);
  const titleDirty = titleValue.trim() !== page.title && titleValue.trim().length > 0;

  const livePath = pageSlugToPath(slug);
  const hasUnsaved = dirtyIds.size > 0;

  function checkpoint() {
    setPast((prev) => [...prev, sections]);
    setFuture([]);
  }

  function handleUndo() {
    setPast((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.slice(0, -1);
      const snapshot = prev[prev.length - 1];
      setFuture((f) => [sections, ...f]);
      setSections(snapshot);
      return next;
    });
  }

  function handleRedo() {
    setFuture((prev) => {
      if (prev.length === 0) return prev;
      const [snapshot, ...rest] = prev;
      setPast((p) => [...p, sections]);
      setSections(snapshot);
      return rest;
    });
  }

  async function handleTitleSave() {
    const trimmed = titleValue.trim();
    if (!trimmed || trimmed === page.title) {
      setTitleValue(page.title);
      return;
    }
    setTitleSaving(true);
    try {
      await updatePageTitle(page.id, trimmed);
      showToast("Page name updated");
      // page.title (a server-fetched prop) won't reflect the new value until
      // the route's server data is re-fetched — refresh so titleDirty (and
      // the page-switcher dropdown / sidebar labels) settle immediately.
      router.refresh();
    } catch (err) {
      console.error(err);
      showToast("Failed to update page name");
      setTitleValue(page.title);
    } finally {
      setTitleSaving(false);
    }
  }

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }

  function toggleOpen(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function updateSectionLocal(id: string, patch: Partial<SectionRow>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    setDirtyIds((prev) => new Set(prev).add(id));
  }

  function toggleHidden(id: string) {
    checkpoint();
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    updateSectionLocal(id, { hidden: !section.hidden });
  }

  /** Persists every section with pending edits via updateSectionContent — this
   * only writes to the DB, it never revalidates the public route on its own
   * (see lib/admin/pages.ts). Shared by both "Save draft" and the first half
   * of "Publish changes". */
  async function persistDirty(): Promise<boolean> {
    const ids = Array.from(dirtyIds);
    if (ids.length === 0) return true;
    checkpoint();
    try {
      await Promise.all(
        ids.map((id) => {
          const s = sections.find((sec) => sec.id === id);
          if (!s) return Promise.resolve();
          return updateSectionContent(id, s.content, s.background_color, s.hidden);
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
    checkpoint();
    try {
      const created = await createSection(page.id, type, starterName(type), starterContent(type), sections.length);
      setSections((prev) => [...prev, created]);
      setOpenId(created.id);
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
    checkpoint();
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
    checkpoint();
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

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    // Firefox requires setData to be called for the drag to initiate at all.
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== draggingId) setDragOverId(id);
  }

  async function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    const sourceId = draggingId;
    setDraggingId(null);
    setDragOverId(null);
    if (!sourceId || sourceId === targetId) return;

    const sourceIdx = sections.findIndex((s) => s.id === sourceId);
    const targetIdx = sections.findIndex((s) => s.id === targetId);
    if (sourceIdx < 0 || targetIdx < 0) return;

    checkpoint();
    const next = [...sections];
    const [moved] = next.splice(sourceIdx, 1);
    next.splice(targetIdx, 0, moved);
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
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <select
            className="a-select"
            style={{ width: 180, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}
            value={slug}
            onChange={(e) => router.push(`/admin/pages/${e.target.value}`)}
          >
            {pageOptions.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.label}
              </option>
            ))}
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <EditIcon />
            <input
              type="text"
              className="a-input"
              style={{ width: 200 }}
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              disabled={titleSaving}
              title="Page name"
              aria-label="Page name"
            />
            {titleDirty ? (
              <button
                type="button"
                className="a-icon-btn"
                title="Save page name"
                onClick={handleTitleSave}
                disabled={titleSaving}
              >
                <CheckIcon />
              </button>
            ) : null}
          </div>

          <div className="a-undo-redo-group">
            <button className="a-icon-btn" onClick={handleUndo} disabled={past.length === 0} title="Undo">
              <UndoIcon />
            </button>
            <button className="a-icon-btn" onClick={handleRedo} disabled={future.length === 0} title="Redo">
              <RedoIcon />
            </button>
          </div>
          <button className="a-icon-btn" onClick={() => setPreviewKey((k) => k + 1)} title="Refresh preview">
            <RefreshIcon />
          </button>
          <button className="a-icon-btn" onClick={() => setAddModalOpen(true)} title="Add a new block">
            <PlusIcon />
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
          <div className="a-preview-pane-label">Live preview. Click Save draft then refresh button to view changes.</div>
          <div className="a-preview-frame">
            <iframe
              key={previewKey}
              src={previewKey === 0 ? livePath : `${livePath}${livePath.includes("?") ? "&" : "?"}_preview=${previewKey}`}
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
              const isOpen = openId === section.id;
              return (
                <li
                  className={`a-section-item${isOpen ? " is-open" : ""}${draggingId === section.id ? " is-dragging" : ""}${
                    dragOverId === section.id ? " is-drag-over" : ""
                  }${section.hidden ? " is-section-hidden" : ""}`}
                  key={section.id}
                  id={`section-${section.id}`}
                  onDragOver={(e) => handleDragOver(e, section.id)}
                  onDragLeave={() => setDragOverId((prev) => (prev === section.id ? null : prev))}
                  onDrop={(e) => handleDrop(e, section.id)}
                >
                  <div className="a-section-row" onClick={() => toggleOpen(section.id)}>
                    <span
                      className="a-section-grip"
                      draggable
                      onDragStart={(e) => handleDragStart(e, section.id)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => e.stopPropagation()}
                      title="Drag to reorder"
                    >
                      <GripIcon />
                    </span>
                    <div className="a-section-info">
                      <div className="a-section-type">{SECTION_TYPE_LABEL[section.type]}</div>
                      <div className="a-section-name">{sectionDisplayName(section.type, section.content)}</div>
                    </div>
                    <div className="a-section-row-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="a-icon-btn"
                        onClick={() => toggleHidden(section.id)}
                        title={section.hidden ? "Hidden — click to show on live site" : "Visible — click to hide from live site"}
                      >
                        {section.hidden ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
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
                      {CARD_BACKGROUND_TYPES.includes(section.type) ? (
                        <BackgroundColorField
                          label="Card background color"
                          value={section.content.card_background_color ?? null}
                          onChange={(v) =>
                            updateSectionLocal(section.id, { content: { ...section.content, card_background_color: v } })
                          }
                        />
                      ) : null}
                      {!NO_BACKGROUND_TYPES.includes(section.type) ? (
                        <BackgroundColorField
                          value={section.background_color}
                          onChange={(v) => updateSectionLocal(section.id, { background_color: v })}
                        />
                      ) : null}
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
                    {b.icon}
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
