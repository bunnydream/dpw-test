import type { Metadata } from "next";
import type { SeoSettings } from "@/lib/site-settings";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** Per-item SEO override fields shared by `pages` and `blog_posts` rows. */
export type SeoOverridable = {
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
  canonical_url?: string | null;
  noindex?: boolean | null;
};

/**
 * Resolves a Next.js Metadata object using a 3-tier fallback chain:
 * per-item field -> sitewide 'seo' setting -> hardcoded fallback title.
 * Never throws; an item with no SEO fields set degrades to fallbackTitle +
 * the sitewide defaults, matching today's hardcoded-only behavior exactly.
 */
export function resolveMetadata({
  item,
  fallbackTitle,
  rawFallbackTitle = false,
  path,
  siteSeo,
}: {
  item?: SeoOverridable | null;
  fallbackTitle: string;
  /** When true, `fallbackTitle` is used as-is (no titleSuffix appended) —
   * for routes like the home page whose hardcoded title already reads as a
   * complete sentence rather than "Page name — Suffix". */
  rawFallbackTitle?: boolean;
  path: string;
  siteSeo: SeoSettings;
}): Metadata {
  const title =
    item?.meta_title?.trim() || (rawFallbackTitle ? fallbackTitle : `${fallbackTitle} ${siteSeo.titleSuffix}`.trim());
  const description = item?.meta_description?.trim() || siteSeo.defaultMetaDescription;
  const ogImage = item?.og_image_url?.trim() || siteSeo.defaultOgImageUrl || undefined;
  const canonical = item?.canonical_url?.trim() || `${SITE_URL}${path}`;
  const noindex = item?.noindex ?? false;

  return {
    title,
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Digital Public Works",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
