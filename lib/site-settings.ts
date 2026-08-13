import { createClient } from "@/lib/supabase/server";

export type NavItem = { id: string; label: string; href: string; visible: boolean };

export type NavSettings = {
  logoUrl: string | null;
  logoAlt: string;
  ctaText: string;
  ctaLink: string;
  items: NavItem[];
};

export type FooterLink = { id: string; label: string; href: string };

export type FooterSettings = {
  logoUrl: string | null;
  logoAlt: string;
  ctaLabel: string;
  ctaText: string;
  ctaLink: string;
  tagline: string;
  email: string;
  address: string;
  links: FooterLink[];
};

// Mirrors the seed rows in supabase/migrations/0003_site_settings_and_deleted_blogs.sql —
// used as a fallback if the site_settings table is ever unreachable or a row is missing,
// so the public site degrades to its original hardcoded content rather than breaking.
export const DEFAULT_NAV_SETTINGS: NavSettings = {
  logoUrl: null,
  logoAlt: "Digital Public Works",
  ctaText: "Request a demo",
  ctaLink: "/contact",
  items: [
    { id: "home", label: "Home", href: "/", visible: true },
    { id: "product", label: "Product", href: "/product", visible: true },
    { id: "impact", label: "Impact", href: "/impact", visible: true },
    { id: "insights", label: "Insights", href: "/insights", visible: true },
    { id: "about", label: "About", href: "/about", visible: true },
    { id: "careers", label: "Careers", href: "/careers", visible: true },
    { id: "contact", label: "Contact", href: "/contact", visible: true },
  ],
};

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  logoUrl: null,
  logoAlt: "Digital Public Works",
  ctaLabel: "Ready to pilot?",
  ctaText: "Request a demo today",
  ctaLink: "/contact",
  tagline: "Digital Public Works is an independent 501(c)(3) nonprofit.",
  email: "info@digitalpublicworks.org",
  address: "2261 Market Street, Suite 32572, San Francisco, CA 94114",
  links: [
    { id: "privacy", label: "Privacy Policy", href: "/privacy" },
    { id: "accessibility", label: "Accessibility", href: "/accessibility" },
  ],
};

export async function getNavSettings(): Promise<NavSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "nav").maybeSingle();
  return (data?.value as NavSettings | undefined) ?? DEFAULT_NAV_SETTINGS;
}

export async function getFooterSettings(): Promise<FooterSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "footer").maybeSingle();
  return (data?.value as FooterSettings | undefined) ?? DEFAULT_FOOTER_SETTINGS;
}
