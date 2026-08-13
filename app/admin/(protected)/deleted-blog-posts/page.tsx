import { listDeletedPosts } from "@/lib/admin/deleted-blog-posts";
import RestoreButton from "./RestoreButton";

function formatPurgeDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function BlogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export default async function DeletedBlogPostsPage() {
  const deletedPosts = await listDeletedPosts();

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>Deleted blogs</h1>
        </div>
        <div className="admin-topbar-actions">
          <a href="/admin/blog" className="a-btn a-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Insights / Blog
          </a>
        </div>
      </header>

      <div className="admin-content">
        <div className="a-section-heading">
          <h2>Deleted blogs</h2>
          <span className="a-link-sm" style={{ color: "var(--steel)", fontWeight: 400 }}>
            Kept for 30 days, then removed for good
          </span>
        </div>

        <div className="a-card" style={{ padding: 0 }}>
          {deletedPosts.length > 0 ? (
            <ul className="a-deleted-list">
              {deletedPosts.map((row) => (
                <li className="a-deleted-row" key={row.id}>
                  <div className="a-deleted-thumb">
                    <BlogIcon />
                  </div>
                  <div className="a-deleted-info">
                    <div className="a-deleted-name">{row.title}</div>
                    <div className="a-deleted-meta">Permanently deletes on {formatPurgeDate(row.purge_at)}</div>
                  </div>
                  <RestoreButton deletedPostId={row.id} />
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ padding: "20px", margin: 0, fontSize: "13.5px", color: "var(--aluminum)" }}>
              No deleted blog posts.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
