import { listDeletedPages } from "@/lib/admin/deleted-pages";
import RestoreButton from "./RestoreButton";

function formatPurgeDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function PageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export default async function DeletedPagesPage() {
  const deletedPages = await listDeletedPages();

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>Deleted pages</h1>
        </div>
        <div className="admin-topbar-actions">
          <a href="/admin" className="a-btn a-btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to dashboard
          </a>
        </div>
      </header>

      <div className="admin-content">
        <div className="a-section-heading">
          <h2>Deleted pages</h2>
          <span className="a-link-sm" style={{ color: "var(--steel)", fontWeight: 400 }}>
            Kept for 30 days, then removed for good
          </span>
        </div>

        <div className="a-card" style={{ padding: 0 }}>
          {deletedPages.length > 0 ? (
            <ul className="a-deleted-list">
              {deletedPages.map((row) => (
                <li className="a-deleted-row" key={row.id}>
                  <div className="a-deleted-thumb">
                    <PageIcon />
                  </div>
                  <div className="a-deleted-info">
                    <div className="a-deleted-name">{row.name}</div>
                    <div className="a-deleted-meta">Permanently deletes on {formatPurgeDate(row.purge_at)}</div>
                  </div>
                  <RestoreButton deletedPageId={row.id} />
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ padding: "20px", margin: 0, fontSize: "13.5px", color: "var(--aluminum)" }}>
              No deleted pages.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
