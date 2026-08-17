"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createBlock,
  deleteBlock,
  reorderBlocks,
  setPostStatus,
  updateBlock,
  updatePostMeta,
} from "@/lib/admin/blog";
import { softDeletePost } from "@/lib/admin/deleted-blog-posts";
import { uploadMedia } from "@/lib/admin/media";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import type { BlogBlockType, Database, PageStatus } from "@/lib/supabase/types";

type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];
type BlogBlockRow = Database["public"]["Tables"]["blog_blocks"]["Row"];

type EditorBlock = {
  id: string;
  type: BlogBlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>;
};

const NEW_CATEGORY_VALUE = "__new__";
const NEW_AUTHOR_VALUE = "__new__";

const BLOCK_LABELS: Record<BlogBlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  quote: "Pullquote",
  photo: "Photo",
};

function defaultContentFor(type: BlogBlockType) {
  if (type === "photo") return { url: "", alt: "", caption: "" };
  return { text: "" };
}

function summarize(block: EditorBlock) {
  if (block.type === "photo") {
    return block.content.alt || block.content.caption || "No photo selected yet";
  }
  const text = (block.content.text || "").trim();
  if (!text) return `New ${BLOCK_LABELS[block.type].toLowerCase()}`;
  return text.length > 60 ? `${text.slice(0, 60)}...` : text;
}

function tempId() {
  return `temp-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;
}

export default function BlogEditor({
  post,
  initialBlocks,
  categories,
  authors,
}: {
  post: BlogPostRow;
  initialBlocks: BlogBlockRow[];
  categories: string[];
  authors: string[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle ?? "");
  const [category, setCategory] = useState(post.category);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [author, setAuthor] = useState(post.author ?? "");
  const [showNewAuthor, setShowNewAuthor] = useState(() => !!post.author && !authors.includes(post.author));
  const [newAuthor, setNewAuthor] = useState(() => (post.author && !authors.includes(post.author) ? post.author : ""));

  const [featuredUrl, setFeaturedUrl] = useState(post.featured_image_url ?? "");
  const [featuredAlt, setFeaturedAlt] = useState(post.featured_image_alt ?? "");
  const [featuredCaption, setFeaturedCaption] = useState(post.featured_image_caption ?? "");
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [featuredPickerOpen, setFeaturedPickerOpen] = useState(false);
  const [blockPickerOpenId, setBlockPickerOpenId] = useState<string | null>(null);

  const [status, setStatus] = useState<PageStatus>(post.status);
  const [publishedAt, setPublishedAt] = useState(post.published_at);

  const [blocks, setBlocks] = useState<EditorBlock[]>(
    initialBlocks.map((b) => ({ id: b.id, type: b.type, content: b.content }))
  );
  const [deletedBlockIds, setDeletedBlockIds] = useState<string[]>([]);
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  const [pendingDeleteBlockId, setPendingDeleteBlockId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(post.status === "published" ? "Published" : "Draft");

  const [toast, setToast] = useState<string | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | null = null;
  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => setToast(null), 2400);
  }

  function handleCategorySelect(value: string) {
    if (value === NEW_CATEGORY_VALUE) {
      setShowNewCategory(true);
    } else {
      setShowNewCategory(false);
      setCategory(value);
    }
  }

  function handleAuthorSelect(value: string) {
    if (value === NEW_AUTHOR_VALUE) {
      setShowNewAuthor(true);
    } else {
      setShowNewAuthor(false);
      setAuthor(value);
    }
  }

  async function handleFeaturedFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadMedia(fd);
      if (res.ok && res.url) {
        setFeaturedUrl(res.url);
        showToast("Photo updated");
      } else {
        showToast(res.error || "Upload failed");
      }
    } finally {
      setUploadingFeatured(false);
      e.target.value = "";
    }
  }

  function handleFeaturedPicked(url: string) {
    setFeaturedPickerOpen(false);
    setFeaturedUrl(url);
    showToast("Photo updated");
  }

  async function handleBlockFile(blockId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBlockId(blockId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadMedia(fd);
      if (res.ok && res.url) {
        setBlocks((prev) =>
          prev.map((b) => (b.id === blockId ? { ...b, content: { ...b.content, url: res.url } } : b))
        );
        showToast("Photo updated");
      } else {
        showToast(res.error || "Upload failed");
      }
    } finally {
      setUploadingBlockId(null);
      e.target.value = "";
    }
  }

  function updateBlockContent(blockId: string, patch: Record<string, unknown>) {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, content: { ...b.content, ...patch } } : b)));
  }

  function handleBlockPicked(blockId: string, url: string) {
    setBlockPickerOpenId(null);
    updateBlockContent(blockId, { url });
    showToast("Photo updated");
  }

  function toggleBlockOpen(id: string) {
    setOpenBlockId((prev) => (prev === id ? null : id));
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const targetIdx = idx + dir;
      if (idx < 0 || targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return next;
    });
  }

  function addBlock(type: BlogBlockType) {
    const id = tempId();
    setBlocks((prev) => [...prev, { id, type, content: defaultContentFor(type) }]);
    setOpenBlockId(id);
    setShowAddModal(false);
    showToast(`${BLOCK_LABELS[type]} block added`);
  }

  function confirmDeleteBlock(id: string) {
    setPendingDeleteBlockId(id);
  }

  function performDeleteBlock() {
    if (!pendingDeleteBlockId) return;
    if (!pendingDeleteBlockId.startsWith("temp-")) {
      setDeletedBlockIds((prev) => [...prev, pendingDeleteBlockId]);
    }
    setBlocks((prev) => prev.filter((b) => b.id !== pendingDeleteBlockId));
    if (openBlockId === pendingDeleteBlockId) setOpenBlockId(null);
    setPendingDeleteBlockId(null);
    showToast("Block deleted");
  }

  async function saveAll(nextStatus?: PageStatus) {
    setIsSaving(true);
    try {
      const finalCategory = (showNewCategory ? newCategory.trim() : category) || post.category;
      const finalAuthor = showNewAuthor ? newAuthor.trim() : author;

      await updatePostMeta(post.id, {
        title: title.trim() || "Untitled post",
        subtitle: subtitle.trim() || null,
        author: finalAuthor || null,
        category: finalCategory,
        featured_image_url: featuredUrl || null,
        featured_image_alt: featuredAlt || null,
        featured_image_caption: featuredCaption || null,
      });

      if (showNewCategory && finalCategory) {
        setCategory(finalCategory);
        setShowNewCategory(false);
        setNewCategory("");
      }

      if (showNewAuthor && finalAuthor) {
        setAuthor(finalAuthor);
        setShowNewAuthor(false);
        setNewAuthor("");
      }

      const updatedBlocks: EditorBlock[] = [];
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.id.startsWith("temp-")) {
          const created = await createBlock(post.id, b.type, b.content, i);
          updatedBlocks.push({ id: created.id, type: b.type, content: b.content });
        } else {
          await updateBlock(b.id, b.content);
          updatedBlocks.push(b);
        }
      }

      for (const delId of deletedBlockIds) {
        await deleteBlock(delId);
      }
      setDeletedBlockIds([]);

      await reorderBlocks(updatedBlocks.map((b) => b.id));
      setBlocks(updatedBlocks);

      if (nextStatus) {
        await setPostStatus(post.id, nextStatus);
        setStatus(nextStatus);
        setPublishedAt(nextStatus === "published" ? new Date().toISOString() : null);
      }

      const message = nextStatus === "published" ? "Post published" : nextStatus === "draft" ? "Post unpublished" : "Draft saved";
      setSaveMessage(nextStatus === "published" ? "Published" : nextStatus === "draft" ? "Draft" : saveMessage);
      showToast(message);
      router.refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeletePost() {
    setIsDeletingPost(true);
    try {
      await softDeletePost(post.id, post.slug, title);
      router.push("/admin/blog");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Something went wrong");
      setIsDeletingPost(false);
    }
  }

  const categoryOptions = Array.from(new Set([post.category, ...categories])).sort();

  return (
    <>
      <header className="admin-topbar">
        <a href="/admin/blog" className="a-btn a-btn-outline a-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to all posts
        </a>
        <div className="admin-topbar-actions">
          <span className="a-save-status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {isSaving ? "Saving..." : saveMessage}
          </span>
        </div>
      </header>

      <div className="admin-content" style={{ maxWidth: "none" }}>
        <div className="a-blog-editor-shell">
          {/* LEFT: block-based content editor */}
          <div>
            <div className="a-field" style={{ marginTop: 0 }}>
              <label>Category</label>
              <select
                className="a-select"
                value={showNewCategory ? NEW_CATEGORY_VALUE : category}
                onChange={(e) => handleCategorySelect(e.target.value)}
                style={{ maxWidth: "320px" }}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value={NEW_CATEGORY_VALUE}>+ Create new category...</option>
              </select>
              {showNewCategory && (
                <input
                  className="a-input"
                  type="text"
                  placeholder="Type a new category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ marginTop: "8px", maxWidth: "320px" }}
                />
              )}
              <div className="a-field-hint">Each post has one category. It&apos;s shown as a tag on the post card.</div>
            </div>

            <div className="a-field">
              <label>Author</label>
              <select
                className="a-select"
                value={showNewAuthor ? NEW_AUTHOR_VALUE : author}
                onChange={(e) => handleAuthorSelect(e.target.value)}
                style={{ maxWidth: "320px" }}
              >
                {!author && !showNewAuthor ? (
                  <option value="" disabled>
                    Select an author...
                  </option>
                ) : null}
                {authors.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
                <option value={NEW_AUTHOR_VALUE}>+ Add new author...</option>
              </select>
              {showNewAuthor && (
                <input
                  className="a-input"
                  type="text"
                  placeholder="Type the author's name"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  style={{ marginTop: "8px", maxWidth: "320px" }}
                />
              )}
            </div>

            {/* Featured photo */}
            <div className="a-card" style={{ marginTop: "20px" }}>
              <div className="a-card-title">Featured photo</div>
              <div className="a-field" style={{ marginTop: 0 }}>
                <div className="a-upload-block">
                  {featuredUrl ? (
                    <img src={featuredUrl} alt={featuredAlt} />
                  ) : (
                    <div
                      style={{
                        height: "120px",
                        borderRadius: "6px",
                        background: "var(--light-al)",
                        marginBottom: "10px",
                      }}
                    />
                  )}
                  <div className="a-upload-actions">
                    <label className="a-btn a-btn-outline a-btn-sm" style={{ cursor: "pointer" }}>
                      {uploadingFeatured ? "Uploading..." : "Upload photo"}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFeaturedFile}
                        disabled={uploadingFeatured}
                      />
                    </label>
                    <button
                      type="button"
                      className="a-btn a-btn-outline a-btn-sm"
                      onClick={() => setFeaturedPickerOpen(true)}
                      disabled={uploadingFeatured}
                    >
                      Media library
                    </button>
                    {featuredUrl ? (
                      <button
                        type="button"
                        className="a-btn a-btn-outline a-btn-sm"
                        onClick={() => setFeaturedUrl("")}
                        disabled={uploadingFeatured}
                      >
                        Remove photo
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="a-field-hint">Used at the top of the post and as the thumbnail on the Insights page.</div>
              </div>
              <div className="a-field">
                <label>Alt text (optional)</label>
                <input
                  className="a-input"
                  type="text"
                  placeholder="Describe the photo for screen readers"
                  value={featuredAlt}
                  onChange={(e) => setFeaturedAlt(e.target.value)}
                />
              </div>
              <div className="a-field">
                <label>Caption (optional)</label>
                <input
                  className="a-input"
                  type="text"
                  placeholder="Photo credit or caption"
                  value={featuredCaption}
                  onChange={(e) => setFeaturedCaption(e.target.value)}
                />
              </div>
              {featuredPickerOpen ? (
                <MediaLibraryModal onSelect={handleFeaturedPicked} onClose={() => setFeaturedPickerOpen(false)} />
              ) : null}
            </div>

            {/* Title */}
            <div className="a-card" style={{ marginTop: "16px" }}>
              <div className="a-card-title">Title</div>
              <div className="a-field" style={{ marginTop: 0 }}>
                <input
                  className="a-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  style={{ fontSize: "17px", fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}
                />
                <div className="a-field-hint">This is the large headline on the post and on its card.</div>
              </div>
              <div className="a-field">
                <label>Subtitle (optional)</label>
                <input
                  className="a-input"
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A short line shown below the title"
                />
              </div>
            </div>

            <div className="a-sections-pane-header" style={{ marginTop: "28px", marginBottom: "12px" }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "16px", fontWeight: 700 }}>Post content</h2>
              <p style={{ fontSize: "13px", color: "var(--steel)", marginTop: "4px" }}>
                Click a block to edit it. Use the arrows to reorder, or the trash icon to remove a block.
              </p>
            </div>

            <ul className="a-section-list">
              {blocks.map((block, idx) => (
                <li key={block.id} className={`a-section-item${openBlockId === block.id ? " is-open" : ""}`}>
                  <div className="a-section-row" onClick={() => toggleBlockOpen(block.id)}>
                    <span className="a-section-grip">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="8" cy="6" r="1.6" />
                        <circle cx="16" cy="6" r="1.6" />
                        <circle cx="8" cy="12" r="1.6" />
                        <circle cx="16" cy="12" r="1.6" />
                        <circle cx="8" cy="18" r="1.6" />
                        <circle cx="16" cy="18" r="1.6" />
                      </svg>
                    </span>
                    <div className="a-section-info">
                      <div className="a-section-type">{BLOCK_LABELS[block.type]}</div>
                      <div className="a-section-name">{summarize(block)}</div>
                    </div>
                    <div className="a-section-row-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="a-icon-btn"
                        disabled={idx === 0}
                        title="Move up"
                        onClick={() => moveBlock(block.id, -1)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      </button>
                      <button
                        className="a-icon-btn"
                        disabled={idx === blocks.length - 1}
                        title="Move down"
                        onClick={() => moveBlock(block.id, 1)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>
                    <svg className="a-section-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  <div className="a-section-panel">
                    {block.type === "heading" && (
                      <div className="a-field">
                        <label>Heading text</label>
                        <input
                          className="a-input"
                          type="text"
                          placeholder="Write a heading..."
                          value={block.content.text ?? ""}
                          onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                        />
                      </div>
                    )}
                    {block.type === "paragraph" && (
                      <div className="a-field">
                        <label>Paragraph text</label>
                        <textarea
                          className="a-textarea"
                          rows={4}
                          placeholder="Write your paragraph..."
                          value={block.content.text ?? ""}
                          onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                        />
                      </div>
                    )}
                    {block.type === "quote" && (
                      <div className="a-field">
                        <label>Pullquote text</label>
                        <textarea
                          className="a-textarea"
                          rows={3}
                          placeholder="Write the quote..."
                          value={block.content.text ?? ""}
                          onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                        />
                      </div>
                    )}
                    {block.type === "photo" && (
                      <>
                        <div className="a-field">
                          <label>Photo</label>
                          {block.content.url ? (
                            <div className="a-upload-block">
                              <img src={block.content.url} alt={block.content.alt || ""} />
                              <div className="a-upload-actions">
                                <label className="a-btn a-btn-outline a-btn-sm" style={{ cursor: "pointer" }}>
                                  {uploadingBlockId === block.id ? "Uploading..." : "Upload photo"}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => handleBlockFile(block.id, e)}
                                    disabled={uploadingBlockId === block.id}
                                  />
                                </label>
                                <button
                                  type="button"
                                  className="a-btn a-btn-outline a-btn-sm"
                                  onClick={() => setBlockPickerOpenId(block.id)}
                                  disabled={uploadingBlockId === block.id}
                                >
                                  Media library
                                </button>
                                <button
                                  type="button"
                                  className="a-btn a-btn-outline a-btn-sm"
                                  onClick={() => updateBlockContent(block.id, { url: "" })}
                                  disabled={uploadingBlockId === block.id}
                                >
                                  Remove photo
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="a-upload-empty">
                              <div className="a-upload">
                                <div className="a-upload-cta">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="m21 15-5-5L5 21" />
                                  </svg>
                                  <span>
                                    <strong>{uploadingBlockId === block.id ? "Uploading..." : "Click to upload"}</strong>{" "}
                                    {uploadingBlockId === block.id ? "" : "a photo"}
                                  </span>
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleBlockFile(block.id, e)}
                                  disabled={uploadingBlockId === block.id}
                                />
                              </div>
                              <button
                                type="button"
                                className="a-btn a-btn-outline a-btn-sm"
                                onClick={() => setBlockPickerOpenId(block.id)}
                                disabled={uploadingBlockId === block.id}
                              >
                                Media library
                              </button>
                            </div>
                          )}
                          {blockPickerOpenId === block.id ? (
                            <MediaLibraryModal
                              onSelect={(url) => handleBlockPicked(block.id, url)}
                              onClose={() => setBlockPickerOpenId(null)}
                            />
                          ) : null}
                        </div>
                        <div className="a-field">
                          <label>Alt text</label>
                          <input
                            className="a-input"
                            type="text"
                            placeholder="Describe the photo for screen readers"
                            value={block.content.alt ?? ""}
                            onChange={(e) => updateBlockContent(block.id, { alt: e.target.value })}
                          />
                        </div>
                        <div className="a-field">
                          <label>Caption (optional)</label>
                          <input
                            className="a-input"
                            type="text"
                            placeholder="Photo credit or caption"
                            value={block.content.caption ?? ""}
                            onChange={(e) => updateBlockContent(block.id, { caption: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                    <div className="a-panel-footer">
                      <button className="a-btn a-btn-danger a-btn-sm" onClick={() => confirmDeleteBlock(block.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Delete block
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <button className="a-add-section-btn" onClick={() => setShowAddModal(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add a block
            </button>
          </div>

          {/* RIGHT: sidebar */}
          <div className="a-sidebar-stack">
            <div className="a-card">
              <div className="a-card-title">Status</div>
              <span className={`a-status ${status === "published" ? "a-status-published" : "a-status-draft"}`}>
                {status === "published" ? "Published" : "Draft"}
              </span>
              {status === "published" && publishedAt && (
                <div className="a-field-hint" style={{ marginTop: "8px" }}>
                  Published {new Date(publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              )}
            </div>

            <div className="a-editor-actions">
              {status === "published" ? (
                <>
                  <button className="a-btn a-btn-copper" onClick={() => saveAll()} disabled={isSaving}>
                    Save changes
                  </button>
                  <button className="a-btn a-btn-outline" onClick={() => saveAll("draft")} disabled={isSaving}>
                    Unpublish
                  </button>
                </>
              ) : (
                <>
                  <button className="a-btn a-btn-copper" onClick={() => saveAll("published")} disabled={isSaving}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    Publish post
                  </button>
                  <button className="a-btn a-btn-outline" onClick={() => saveAll()} disabled={isSaving}>
                    Save as draft
                  </button>
                </>
              )}
              {status === "published" && (
                <a
                  className="a-btn a-btn-ghost"
                  style={{ justifyContent: "center" }}
                  href={`/insights/${post.slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View blog post
                </a>
              )}
            </div>

            <div className="a-card">
              <div className="a-card-title">Danger zone</div>
              <button
                className="a-btn a-btn-danger a-btn-sm"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setShowDeletePostModal(true)}
              >
                Delete post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADD BLOCK MODAL */}
      <div className={`a-modal-overlay${showAddModal ? " is-open" : ""}`}>
        <div className="a-modal">
          <div className="a-modal-header">
            <h2>Add a block</h2>
            <button className="a-modal-close" onClick={() => setShowAddModal(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p className="a-modal-desc">Choose a block type. It&apos;ll be added to the bottom of the post — you can move it afterward.</p>
          <div className="a-block-grid">
            <button className="a-block-option" onClick={() => addBlock("heading")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 4v16M18 4v16M6 12h12" />
              </svg>
              <strong>Heading</strong>
              <span>A subheading to break up the post.</span>
            </button>
            <button className="a-block-option" onClick={() => addBlock("paragraph")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="16" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              <strong>Paragraph</strong>
              <span>A block of body text.</span>
            </button>
            <button className="a-block-option" onClick={() => addBlock("quote")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 21c3-1 5-3 5-6V9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1" />
                <path d="M14 21c3-1 5-3 5-6V9a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1" />
              </svg>
              <strong>Pullquote</strong>
              <span>A pulled quote, set apart from body text.</span>
            </button>
            <button className="a-block-option" onClick={() => addBlock("photo")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <strong>Photo</strong>
              <span>An image inserted into the body of the post.</span>
            </button>
          </div>
        </div>
      </div>

      {/* DELETE BLOCK MODAL */}
      <div className={`a-modal-overlay${pendingDeleteBlockId ? " is-open" : ""}`}>
        <div className="a-modal a-modal-sm">
          <div className="a-warning-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
            Delete this block?
          </h2>
          <p className="a-modal-desc" style={{ marginBottom: "4px" }}>This will remove it from the post once you save or publish.</p>
          <div className="a-modal-actions">
            <button className="a-btn a-btn-outline" onClick={() => setPendingDeleteBlockId(null)}>
              Cancel
            </button>
            <button
              className="a-btn a-btn-danger"
              style={{ background: "#B91C1C", borderColor: "#B91C1C", color: "var(--white)" }}
              onClick={performDeleteBlock}
            >
              Delete block
            </button>
          </div>
        </div>
      </div>

      {/* DELETE POST MODAL */}
      <div className={`a-modal-overlay${showDeletePostModal ? " is-open" : ""}`}>
        <div className="a-modal a-modal-sm">
          <div className="a-warning-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
            Delete this post?
          </h2>
          <p className="a-modal-desc" style={{ marginBottom: "4px" }}>
            &ldquo;{title}&rdquo; will move to Deleted blogs, where it&apos;s kept for 30 days before it&apos;s removed for good.
          </p>
          <div className="a-modal-actions">
            <button className="a-btn a-btn-outline" onClick={() => setShowDeletePostModal(false)} disabled={isDeletingPost}>
              Cancel
            </button>
            <button
              className="a-btn a-btn-danger"
              style={{ background: "#B91C1C", borderColor: "#B91C1C", color: "var(--white)" }}
              onClick={handleDeletePost}
              disabled={isDeletingPost}
            >
              {isDeletingPost ? "Deleting..." : "Delete post"}
            </button>
          </div>
        </div>
      </div>

      <div className={`a-toast${toast ? " is-visible" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{toast}</span>
      </div>
    </>
  );
}
