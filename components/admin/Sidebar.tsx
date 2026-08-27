"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/admin/auth";
import type { Database } from "@/lib/supabase/types";
import type { NavItem } from "@/lib/site-settings";
import { pageSlugToPath } from "@/lib/page-path";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];

const FIXED_PAGE_META: { slug: string; label: string; icon: React.ReactNode }[] = [
  {
    slug: "home",
    label: "Home",
    icon: (
      <>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </>
    ),
  },
  {
    slug: "about",
    label: "About",
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
      </>
    ),
  },
  {
    slug: "product",
    label: "Product",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
      </>
    ),
  },
  {
    slug: "impact",
    label: "Impact",
    icon: (
      <>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-6 3 3 4-7" />
      </>
    ),
  },
  {
    slug: "careers",
    label: "Careers",
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </>
    ),
  },
  {
    slug: "contact",
    label: "Contact",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </>
    ),
  },
];

const FIXED_PAGE_SLUGS = FIXED_PAGE_META.map((p) => p.slug);

// Mirrors DEFAULT_PAGE_ICON in app/admin/(protected)/page.tsx — generic
// document icon used for any custom (non-fixed) page row.
const CUSTOM_PAGE_ICON = (
  <>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <line x1="8" y1="8" x2="16" y2="8" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </>
);

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

function NavbarLinkIcon() {
  return (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
    </>
  );
}

function FooterLinkIcon() {
  return (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </>
  );
}

function SeoIcon() {
  return (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

export default function Sidebar({
  email,
  pages = [],
  navItems = [],
}: {
  email: string;
  pages?: PageRow[];
  /** Live navbar order — page rows are sorted to match so the sidebar
   * reflects however the admin has arranged the public nav. Pages not in
   * the nav (e.g. an unpublished draft) sort after everything that is. */
  navItems?: NavItem[];
}) {
  const pathname = usePathname();
  const initials = email.slice(0, 2).toUpperCase();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  function navOrder(slug: string) {
    const href = pageSlugToPath(slug);
    const index = navItems.findIndex((item) => item.href === href);
    return index === -1 ? navItems.length : index;
  }

  const fixedPages = [...FIXED_PAGE_META].sort((a, b) => navOrder(a.slug) - navOrder(b.slug));

  // Custom (non-fixed) pages: nav order first, then alphabetically for any
  // not yet in the nav (e.g. unpublished drafts).
  const customPages = pages
    .filter((p) => !FIXED_PAGE_SLUGS.includes(p.slug))
    .sort((a, b) => navOrder(a.slug) - navOrder(b.slug) || a.title.localeCompare(b.title));

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
        {fixedPages.map((link) => {
          const href = `/admin/pages/${link.slug}`;
          return (
            <li key={link.slug}>
              <Link href={href} className={isActive(href) ? "active" : ""}>
                <NavIcon>{link.icon}</NavIcon>
                {link.label}
              </Link>
            </li>
          );
        })}
        {customPages.map((page) => {
          const href = `/admin/pages/${page.slug}`;
          return (
            <li key={page.slug}>
              <Link href={href} className={isActive(href) ? "active" : ""}>
                <NavIcon>{CUSTOM_PAGE_ICON}</NavIcon>
                {page.status === "draft" ? `${page.title} (Draft)` : page.title}
              </Link>
            </li>
          );
        })}
        <li>
          <Link href="/admin/deleted-pages" className={isActive("/admin/deleted-pages") ? "active" : ""}>
            <NavIcon>
              <DeletedIcon />
            </NavIcon>
            Deleted pages
          </Link>
        </li>

        <li className="admin-nav-label">Site</li>
        <li>
          <Link href="/admin/navbar" className={isActive("/admin/navbar") ? "active" : ""}>
            <NavIcon>
              <NavbarLinkIcon />
            </NavIcon>
            Navbar
          </Link>
        </li>
        <li>
          <Link href="/admin/footer" className={isActive("/admin/footer") ? "active" : ""}>
            <NavIcon>
              <FooterLinkIcon />
            </NavIcon>
            Footer
          </Link>
        </li>
        <li>
          <Link href="/admin/seo" className={isActive("/admin/seo") ? "active" : ""}>
            <NavIcon>
              <SeoIcon />
            </NavIcon>
            SEO
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
          <Link href="/admin/deleted-blog-posts" className={isActive("/admin/deleted-blog-posts") ? "active" : ""}>
            <NavIcon>
              <DeletedIcon />
            </NavIcon>
            Deleted blogs
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
