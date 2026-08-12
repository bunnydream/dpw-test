"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/admin/auth";

const PAGE_LINKS = [
  {
    href: "/admin/pages/home",
    label: "Home",
    icon: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  {
    href: "/admin/pages/about",
    label: "About",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </>
    ),
  },
  {
    href: "/admin/pages/product",
    label: "Product",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </>
    ),
  },
  {
    href: "/admin/pages/impact",
    label: "Impact",
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-6 3 3 4-7" />
      </>
    ),
  },
  {
    href: "/admin/pages/careers",
    label: "Careers",
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    ),
  },
  {
    href: "/admin/pages/contact",
    label: "Contact",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </>
    ),
  },
];

function DashboardIcon() {
  return (
    <>
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </>
  );
}

function DeletedIcon() {
  return (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  );
}

function BlogIcon() {
  return (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  );
}

function MediaIcon() {
  return (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </>
  );
}

function SettingsIcon() {
  return (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  );
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const initials = email.slice(0, 2).toUpperCase();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img src="/logo/stacked-dark-mono.svg" alt="Digital Public Works" />
      </div>

      <ul className="admin-nav">
        <li>
          <Link href="/admin" className={isActive("/admin") && pathname === "/admin" ? "active" : ""}>
            <NavIcon>
              <DashboardIcon />
            </NavIcon>
            Dashboard
          </Link>
        </li>

        <li className="admin-nav-label">Website pages</li>
        {PAGE_LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={isActive(link.href) ? "active" : ""}>
              <NavIcon>{link.icon}</NavIcon>
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/admin/deleted-pages" className={isActive("/admin/deleted-pages") ? "active" : ""}>
            <NavIcon>
              <DeletedIcon />
            </NavIcon>
            Deleted pages
          </Link>
        </li>

        <li className="admin-nav-label">Content</li>
        <li>
          <Link href="/admin/blog" className={isActive("/admin/blog") ? "active" : ""}>
            <NavIcon>
              <BlogIcon />
            </NavIcon>
            Insights / Blog
          </Link>
        </li>
        <li>
          <Link href="/admin/media" className={isActive("/admin/media") ? "active" : ""}>
            <NavIcon>
              <MediaIcon />
            </NavIcon>
            Media library
          </Link>
        </li>

        <li className="admin-nav-label">Account</li>
        <li>
          <Link href="/admin/settings" className={isActive("/admin/settings") ? "active" : ""}>
            <NavIcon>
              <SettingsIcon />
            </NavIcon>
            Settings
          </Link>
        </li>
      </ul>

      <div className="admin-sidebar-footer">
        <div className="admin-user-chip">
          <div className="admin-avatar">{initials}</div>
          <div className="admin-user-meta">
            <div className="admin-user-name">{email}</div>
            <div className="admin-user-role">Editor</div>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="admin-logout"
            style={{ background: "none", border: "none", width: "100%", cursor: "pointer", font: "inherit" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
