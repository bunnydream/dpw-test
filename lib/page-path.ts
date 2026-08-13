// The 6 original static routes live at bespoke paths (home is "/", not
// "/home"); every other page slug (custom, admin-created pages) maps
// directly to "/{slug}" via the app/(site)/[slug] dynamic route.
const FIXED_SLUG_TO_PATH: Record<string, string> = {
  home: "/",
  about: "/about",
  product: "/product",
  impact: "/impact",
  careers: "/careers",
  contact: "/contact",
};

export const FIXED_PAGE_SLUGS = Object.keys(FIXED_SLUG_TO_PATH);

export function pageSlugToPath(slug: string): string {
  return FIXED_SLUG_TO_PATH[slug] ?? `/${slug}`;
}
