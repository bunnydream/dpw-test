import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/seo";
import { pageSlugToPath } from "@/lib/page-path";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const { data: pages } = await supabase
    .from("pages")
    .select("slug, updated_at, noindex")
    .eq("status", "published");

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, noindex")
    .eq("status", "published");

  const pageEntries: MetadataRoute.Sitemap = (pages ?? [])
    .filter((p) => !p.noindex)
    .map((p) => ({
      url: `${SITE_URL}${pageSlugToPath(p.slug)}`,
      lastModified: p.updated_at,
    }));

  const postEntries: MetadataRoute.Sitemap = (posts ?? [])
    .filter((p) => !p.noindex)
    .map((p) => ({
      url: `${SITE_URL}/insights/${p.slug}`,
      lastModified: p.updated_at,
    }));

  // The "home" page's own row (slug "home", pageSlugToPath("home") === "/")
  // already produces the site-root entry above, so noindex on it is
  // respected here rather than needing a separate hardcoded "/" entry.
  return [...pageEntries, ...postEntries];
}
