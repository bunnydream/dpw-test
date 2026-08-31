"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSection,
  deleteSection,
  getPageWithSections,
  publishPage,
  reorderSections,
  restoreSection,
  updatePageSeo,
  updateSectionContent,
} from "@/lib/admin/pages";
import type { Database, SectionType } from "@/lib/supabase/types";
import { FIXED_PAGE_SLUGS, pageSlugToPath } from "@/lib/page-path";
import { BLOCK_TYPES, SECTION_TYPE_LABEL, starterContent, starterName } from "./block-types";
import { BackgroundColorField, SectionContentFields, sectionDisplayName } from "./section-fields";
import SeoFieldsCard, { type SeoFieldsValue } from "@/components/admin/SeoFieldsCard";
import {
  CheckIcon,
  ChevronIcon,
  CloseIcon,
  DownIcon,
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
  // Tracks add/delete/reorder actions, which persist immediately (unlike
  // text-field edits, which wait for Save draft/Publish) but weren't
  // reflected in `hasUnsaved` below — so "Save draft" stayed disabled and
  // the status showed "All changes saved" even right after a reorder or
  // delete. Reset once a save/publish click acknowledges the change.
  const [hasStructuralChanges, setHasStructuralChanges] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Tracks whether this page is currently published, so section/title/SEO
  // writes know whether to go straight to the live rows (never-published
  // page — today's behavior, correctly hidden by the `status` filter) or
  // into the draft tables/draft_meta (already-published page — so "Save
  // draft" can no longer change what the public site shows). Local state
  // rather than reading `page.status` directly because the latter would go
  // stale within a session: after this page's first-ever Publish click,
  // `page.status` flips server-side but the `page` prop itself doesn't
  // update until a fresh server fetch.
  const [isPublished, setIsPublished] = useState(page.status === "published");

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

  const livePath = pageSlugToPath(slug);

  // SEO fields: own local state, seeded from the `page` prop, deliberately
  // independent of `sections`/`dirtyIds`/undo-redo above. Persisted by
  // handleSaveDraft/handlePublish alongside section changes (see
  // persistSeo() below) rather than through a separate save action, so one
  // Save draft/Publish click saves everything on the page.
  const [seoValue, setSeoValue] = useState<SeoFieldsValue>({
    meta_title: page.meta_title,
    meta_description: page.meta_description,
    og_image_url: page.og_image_url,
    canonical_url: page.canonical_url,
    noindex: page.noindex,
  });
  const [seoDirty, setSeoDirty] = useState(false);

  function updateSeo(patch: Partial<SeoFieldsValue>) {
    setSeoValue((s) => ({ ...s, ...patch }));
    setSeoDirty(true);
  }

  const hasUnsaved = dirtyIds.size > 0 || seoDirty || hasStructuralChanges;

  /** Persists SEO fields if changed. Shared by handleSaveDraft and
   * handlePublish so both save actions cover the SEO card too. */
  async function persistSeo(): Promise<boolean> {
    if (!seoDirty) return true;
    try {
      await updatePageSeo(page.id, seoValue, isPublished);
      setSeoDirty(false);
      return true;
    } catch (err) {
      console.error(err);
      showToast("Failed to save SEO settings");
      return false;
    }
  }

  function checkpoint() {
    setPast((prev) => [...prev, sections]);
    setFuture([]);
  }

  /** True when both lists contain exactly the same section ids — i.e. the
   * snapshot being restored only reorders sections, rather than reversing
   * an add or a delete. */
  function idsEqual(a: SectionRow[], b: SectionRow[]) {
    if (a.length !== b.length) return false;
    const bIds = new Set(b.map((s) => s.id));
    return a.every((s) => bIds.has(s.id));
  }

  /** Reconciles the server to match a restored snapshot that adds back a
   * deleted section and/or removes an added one — i.e. not a pure reorder
   * (see applySnapshot). Sections only in `current` were added since the
   * snapshot and get removed via the same deleteSection call
   * handleDeleteConfirmed uses; sections only in `snapshot` were deleted
   * since and get restored via restoreSection, which may hand back a
   * different id (see its own comment in lib/admin/pages.ts) — that gets
   * swapped into the returned list so a later edit targets the row that
   * actually exists rather than one that's gone. */
  async function reconcileStructuralUndo(current: SectionRow[], snapshot: SectionRow[]): Promise<SectionRow[]> {
    const currentIds = new Set(current.map((s) => s.id));
    const snapshotIds = new Set(snapshot.map((s) => s.id));

    const toRemove = current.filter((s) => !snapshotIds.has(s.id));
    const toRestore = snapshot.filter((s) => !currentIds.has(s.id));

    await Promise.all(toRemove.map((s) => deleteSection(s.id, isPublished)));

    const idMap = new Map<string, string>();
    await Promise.all(
      toRestore.map(async (s) => {
        const restored = await restoreSection(
          page.id,
          s.id,
          s.type,
          s.name,
          s.content,
          s.background_color,
          s.position,
          s.hidden,
          isPublished
        );
        if (restored.id !== s.id) idMap.set(s.id, restored.id);
      })
    );

    const finalSections = snapshot.map((s) => (idMap.has(s.id) ? { ...s, id: idMap.get(s.id)! } : s));
    await reorderSections(finalSections.map((s) => s.id), isPublished);
    return finalSections;
  }

  /** Undo/redo has never talked to the server — it only rewinds local
   * `sections` state. A pure reorder (same ids, different order) re-syncs
   * optimistically, the same way moveSection/handleDrop do: the screen
   * updates immediately, then the order is pushed to the server. Undoing/
   * redoing an add or a delete instead waits for reconcileStructuralUndo to
   * finish before updating the screen, since it may need to swap in an id
   * the server just generated — showing the restored block before that
   * resolves would let a later edit silently target a row that doesn't
   * exist yet. Either way, "Save draft" is enabled once this settles. */
  async function applySnapshot(current: SectionRow[], snapshot: SectionRow[], label: "undo" | "redo") {
    if (idsEqual(current, snapshot)) {
      setSections(snapshot);
      try {
        await reorderSections(snapshot.map((s) => s.id), isPublished);
        setHasStructuralChanges(true);
      } catch (err) {
        console.error(err);
        showToast("Failed to reorder blocks");
      }
      return;
    }

    try {
      const finalSections = await reconcileStructuralUndo(current, snapshot);
      setSections(finalSections);
      setHasStructuralChanges(true);
    } catch (err) {
      console.error(err);
      showToast(label === "undo" ? "Failed to undo" : "Failed to redo");
    }
  }

  async function handleUndo() {
    if (past.length === 0) return;
    const snapshot = past[past.length - 1];
    const current = sections;
    setFuture((f) => [current, ...f]);
    setPast((prev) => prev.slice(0, -1));
    await applySnapshot(current, snapshot, "undo");
  }

  async function handleRedo() {
    if (future.length === 0) return;
    const snapshot = future[0];
    const current = sections;
    setPast((p) => [...p, current]);
    setFuture((prev) => prev.slice(1));
    await applySnapshot(current, snapshot, "redo");
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
          return updateSectionContent(id, s.content, s.background_color, s.hidden, isPublished);
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
    const sectionsOk = await persistDirty();
    const seoOk = await persistSeo();
    setSaving(false);
    if (sectionsOk && seoOk) {
      setHasStructuralChanges(false);
      showToast("Draft saved");
    }
  }

  async function handlePublish() {
    setSaving(true);
    const sectionsOk = await persistDirty();
    const seoOk = await persistSeo();
    if (sectionsOk) {
      try {
        await publishPage(slug);
        setIsPublished(true);
        setHasStructuralChanges(false);
        // Publishing may have changed which table section ids belong to
        // (section_drafts get reseeded fresh from the live rows this just
        // wrote) — refetch so `sections` state's ids stay consistent with
        // whichever table subsequent edits (now in draft mode) will target.
        const fresh = await getPageWithSections(slug);
        if (fresh) setSections(fresh.sections);
        setPreviewKey((k) => k + 1);
        showToast(seoOk ? "Published to the live site" : "Published, but SEO settings failed to save");
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
      const nextPosition = sections.length ? Math.max(...sections.map((s) => s.position)) + 1 : 0;
      const created = await createSection(page.id, type, starterName(type), starterContent(type), nextPosition, isPublished);
      setSections((prev) => [...prev, created]);
      setOpenId(created.id);
      setHasStructuralChanges(true);
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
      await deleteSection(id, isPublished);
      setSections((prev) => prev.filter((s) => s.id !== id));
      setDirtyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setHasStructuralChanges(true);
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
      await reorderSections(next.map((s) => s.id), isPublished);
      setHasStructuralChanges(true);
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
      await reorderSections(next.map((s) => s.id), isPublished);
      setHasStructuralChanges(true);
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

          <SeoFieldsCard value={seoValue} onChange={updateSeo} />
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
