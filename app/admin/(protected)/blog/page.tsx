import { redirect } from "next/navigation";
import { createPost, listPosts } from "@/lib/admin/blog";
import BlogList from "./BlogList";

async function createAndRedirect() {
  "use server";
  const post = await createPost();
  redirect(`/admin/blog/${post.id}`);
}

export default async function AdminBlogListPage() {
  const posts = await listPosts();

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>Insights / Blog</h1>
          <div className="admin-topbar-sub">Manage the articles shown on your Insights page.</div>
        </div>
        <div className="admin-topbar-actions">
          <a href="/insights" target="_blank" rel="noreferrer" className="a-btn a-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View Insights page
          </a>
          <form action={createAndRedirect}>
            <button type="submit" className="a-btn a-btn-copper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New post
            </button>
          </form>
        </div>
      </header>

      <div className="admin-content" style={{ maxWidth: "none" }}>
        <BlogList posts={posts} />
      </div>
    </>
  );
}
