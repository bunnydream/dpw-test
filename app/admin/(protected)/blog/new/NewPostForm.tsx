"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/admin/blog";

const NEW_CATEGORY_VALUE = "__new__";

export default function NewPostForm({ categories }: { categories: string[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "");
  const [showNewCategory, setShowNewCategory] = useState(categories.length === 0);
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCategorySelect(value: string) {
    if (value === NEW_CATEGORY_VALUE) {
      setShowNewCategory(true);
    } else {
      setShowNewCategory(false);
      setCategory(value);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalCategory = (showNewCategory ? newCategory : category).trim();
    if (!title.trim() || !finalCategory) {
      setError("Please enter a title and category.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const post = await createPost(title.trim(), finalCategory);
      router.push(`/admin/blog/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="a-field" style={{ marginTop: 0 }}>
        <label>Title</label>
        <input
          className="a-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          autoFocus
        />
      </div>

      <div className="a-field">
        <label>Category</label>
        {categories.length > 0 && (
          <select
            className="a-select"
            value={showNewCategory ? NEW_CATEGORY_VALUE : category}
            onChange={(e) => handleCategorySelect(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value={NEW_CATEGORY_VALUE}>+ Create new category...</option>
          </select>
        )}
        {showNewCategory && (
          <input
            className="a-input"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Type a new category name"
            style={{ marginTop: categories.length > 0 ? "8px" : 0 }}
          />
        )}
        <div className="a-field-hint">Each post has one category. It&apos;s shown as a tag on the post card.</div>
      </div>

      {error && (
        <p style={{ color: "#B91C1C", fontSize: "13px", marginTop: "12px" }}>{error}</p>
      )}

      <div className="a-field" style={{ display: "flex", gap: "8px" }}>
        <button type="submit" className="a-btn a-btn-copper" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create post"}
        </button>
      </div>
    </form>
  );
}
