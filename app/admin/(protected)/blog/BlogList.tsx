"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/admin/blog";
import type { Database } from "@/lib/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSearch = !q || post.title.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, search, activeCategory]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deletePost(pendingDelete.id);
      setPendingDelete(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="a-toolbar">
        <div className="a-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="a-filter-pills">
          <button
            type="button"
            className={`a-pill${activeCategory === "All" ? " is-active" : ""}`}
            onClick={() => setActiveCategory("All")}
          >
            All ({posts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`a-pill${activeCategory === cat ? " is-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ fontSize: "13.5px", color: "var(--steel)", padding: "24px", textAlign: "center" }}>
          {posts.length === 0 ? "No posts yet. Create your first post to get started." : "No posts match your search or filter."}
        </p>
      ) : (
        <table className="a-table">
          <thead>
            <tr>
              <th style={{ width: "42%" }}>Post</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr
                key={post.id}
                className="a-post-row"
                onClick={() => router.push(`/admin/blog/${post.id}`)}
              >
                <td>
                  <div className="a-post-cell">
                    {post.featured_image_url ? (
                      <img className="a-post-thumb" src={post.featured_image_url} alt="" />
                    ) : (
                      <div className="a-post-thumb" />
                    )}
                    <div className="a-post-title">{post.title || "Untitled post"}</div>
                  </div>
                </td>
                <td>
                  <span className="a-badge a-badge-policy">{post.category}</span>
                </td>
                <td>
                  <span className={`a-status ${post.status === "published" ? "a-status-published" : "a-status-draft"}`}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td>{formatDate(post.published_at ?? post.created_at)}</td>
                <td>
                  <div className="a-row-actions" onClick={(e) => e.stopPropagation()}>
                    <Link className="a-icon-btn" href={`/admin/blog/${post.id}`} title="Edit">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                    <button className="a-icon-btn" title="Delete" onClick={() => setPendingDelete(post)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={`a-modal-overlay${pendingDelete ? " is-open" : ""}`}>
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
            {pendingDelete ? `"${pendingDelete.title}" will be permanently deleted, including all of its content blocks.` : ""}
          </p>
          <div className="a-modal-actions">
            <button className="a-btn a-btn-outline" onClick={() => setPendingDelete(null)} disabled={isDeleting}>
              Cancel
            </button>
            <button
              className="a-btn a-btn-danger"
              style={{ background: "#B91C1C", borderColor: "#B91C1C", color: "var(--white)" }}
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
