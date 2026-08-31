import type { PageStatus } from "@/lib/supabase/types";

/** Resolves a page's currently-displayed title/slug, accounting for a
 * pending draft_meta override on an already-published page — the same merge
 * getPageWithSections() does inline for a single page, pulled out for reuse
 * by callers (the Page Options list, the Navigation items lookup) that only
 * have the raw `pages` row, not that merged shape.
 *
 * Lives outside lib/admin/pages.ts because that file is "use server" — every
 * export from a "use server" file must be an async server action, which
 * these plain, synchronous helpers are not. */
type DraftMeta = { title?: string; slug?: string } | null;

export function effectivePageTitle(page: { title: string; status: PageStatus; draft_meta: unknown }): string {
  const draft = page.status === "published" ? (page.draft_meta as DraftMeta) : null;
  return draft?.title ?? page.title;
}

export function effectivePageSlug(page: { slug: string; status: PageStatus; draft_meta: unknown }): string {
  const draft = page.status === "published" ? (page.draft_meta as DraftMeta) : null;
  return draft?.slug ?? page.slug;
}
