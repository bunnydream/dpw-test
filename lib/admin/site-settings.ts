"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_FOOTER_SETTINGS,
  DEFAULT_NAV_SETTINGS,
  type FooterSettings,
  type NavSettings,
} from "@/lib/site-settings";
import { pageSlugToPath } from "@/lib/page-path";

export async function getNavSettingsAdmin(): Promise<NavSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "nav").maybeSingle();
  return (data?.value as NavSettings | undefined) ?? DEFAULT_NAV_SETTINGS;
}

export async function updateNavSettings(value: NavSettings) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("site_settings").update({ value }).eq("key", "nav");
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function getFooterSettingsAdmin(): Promise<FooterSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "footer").maybeSingle();
  return (data?.value as FooterSettings | undefined) ?? DEFAULT_FOOTER_SETTINGS;
}

export async function updateFooterSettings(value: FooterSettings) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("site_settings").update({ value }).eq("key", "footer");
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

/** Appends a page to the end of the nav items list (before the fixed CTA
 * button) if it isn't already present, keyed by href. Called from
 * publishPage() so a newly published custom page shows up in the navbar
 * automatically — a no-op for the 6 built-in pages, which are already seeded. */
export async function appendPageToNav(slug: string, title: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "nav").maybeSingle();
  const nav = (data?.value as NavSettings | undefined) ?? DEFAULT_NAV_SETTINGS;
  const href = pageSlugToPath(slug);

  if (nav.items.some((item) => item.href === href)) return;

  const items = [...nav.items, { id: slug, label: title, href, visible: true }];
  const { error } = await supabase.from("site_settings").update({ value: { ...nav, items } }).eq("key", "nav");
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
