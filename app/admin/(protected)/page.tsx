import Link from "next/link";
import { listPagesWithMeta } from "@/lib/admin/pages";
import { listPosts } from "@/lib/admin/blog";
import DeletePageButton from "@/components/admin/DeletePageButton";

const PAGE_ORDER = ["home", "about", "product", "impact", "careers", "contact"];

const PAGE_VIEW_PATHS: Record<string, string> = {
  home: "/",
  about: "/about",
  product: "/product",
  impact: "/impact",
  careers: "/careers",
  contact: "/contact",
};

const PAGE_ICON_PATHS: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  product: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 21h8M12 18v3" />
    </>
  ),
  impact: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-6 3 3 4-7" />
    </>
  ),
  careers: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  contact: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
};

const DEFAULT_PAGE_ICON = (
  <>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </>
);

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function categoryBadgeClass(category: string) {
  const c = category.toLowerCase();
  if (c.includes("service")) return "a-badge-service";
  if (c.includes("access")) return "a-badge-access";
  return "a-badge-policy";
}

export default async function AdminDashboardPage() {
  const [pages, posts] = await Promise.all([listPagesWithMeta(), listPosts()]);

  const sortedPages = [...pages].sort(
    (a, b) => PAGE_ORDER.indexOf(a.slug) - PAGE_ORDER.indexOf(b.slug)
  );
  const recentPosts = posts.slice(0, 5);

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>Welcome back</h1>
        </div>
        <div className="admin-topbar-actions">
          <a href="/" target="_blank" rel="noopener noreferrer" className="a-btn a-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View live site
          </a>
        </div>
      </header>

      <div className="admin-content">
        {/* Pages */}
        <div className="a-section-heading">
          <h2>Website pages</h2>
          <span className="a-link-sm" style={{ color: "var(--steel)", fontWeight: 400 }}>
            {sortedPages.length} {sortedPages.length === 1 ? "page" : "pages"}
          </span>
        </div>

        <div className="a-page-grid" style={{ marginBottom: 40 }}>
          {sortedPages.map((page) => (
            <div className="a-page-card" key={page.id}>
              <div className="a-page-thumb">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  {PAGE_ICON_PATHS[page.slug] ?? DEFAULT_PAGE_ICON}
                </svg>
              </div>
              <div className="a-page-body">
                <h3>{page.title}</h3>
                <div className="a-page-meta">Edited {formatDate(page.updated_at)}</div>
                <div className="a-page-actions">
                  <Link href={`/admin/pages/${page.slug}`} className="a-btn a-btn-primary a-btn-sm">
                    Edit
                  </Link>
                  <a
                    href={PAGE_VIEW_PATHS[page.slug] ?? "/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="a-btn a-btn-outline a-btn-sm"
                  >
                    View
                  </a>
                  <DeletePageButton pageId={page.id} slug={page.slug} title={page.title} />
                </div>
              </div>
            </div>
          ))}

          <div
            className="a-page-add-card"
            style={{ cursor: "default", opacity: 0.55 }}
            title="Pages map to fixed site routes and can't be added from here — ask an engineer to add a new route first."
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add a new page
          </div>
        </div>

        {/* Recent blog posts */}
        <div className="a-section-heading">
          <h2>Recent blog posts</h2>
          <Link href="/admin/blog">View all posts →</Link>
        </div>

        <div className="a-card" style={{ padding: 0, borderRadius: 0 }}>
          <table className="a-table" style={{ border: "none", borderRadius: 0 }}>
            <thead>
              <tr>
                <th>Post</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last edited</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "24px", color: "var(--steel)" }}>
                    No blog posts yet.
                  </td>
                </tr>
              ) : (
                recentPosts.map((post) => (
                  <tr className="a-post-row" key={post.id}>
                    <td>
                      <div className="a-post-cell">
                        <div className="a-post-title">{post.title}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`a-badge ${categoryBadgeClass(post.category)}`}>{post.category}</span>
                    </td>
                    <td>
                      <span className={`a-status a-status-${post.status}`}>
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>{formatDate(post.published_at ?? post.created_at)}</td>
                    <td>
                      <div className="a-row-actions">
                        <Link className="a-icon-btn" href={`/admin/blog/${post.id}`} title="Edit">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
