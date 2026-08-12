import Link from "next/link";
import { listPosts } from "@/lib/admin/blog";
import NewPostForm from "./NewPostForm";

const DEFAULT_CATEGORIES = ["Policy", "Service Design", "Accessibility"];

export default async function NewBlogPostPage() {
  const posts = await listPosts();
  const existingCategories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  const categories = Array.from(new Set([...existingCategories, ...DEFAULT_CATEGORIES])).sort();

  return (
    <>
      <header className="admin-topbar">
        <Link href="/admin/blog" className="a-btn a-btn-outline a-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to all posts
        </Link>
      </header>

      <div className="admin-content">
        <div className="a-card" style={{ maxWidth: "480px" }}>
          <div className="a-card-title">New post</div>
          <NewPostForm categories={categories} />
        </div>
      </div>
    </>
  );
}
