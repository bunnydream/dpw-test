"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PageStatus, SectionType } from "@/lib/supabase/types";
import { pageSlugToPath } from "@/lib/page-path";
import { appendPageToNav } from "@/lib/admin/site-settings";

function revalidateForSlug(slug: string) {
  revalidatePath(pageSlugToPath(slug));
}

export async function getPageWithSections(slug: string) {
  const supabase = createAdminClient();
  const { data: page, error: pageError } = await supabase.from("pages").select("*").eq("slug", slug).single();
  if (pageError || !page) return null;

  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", page.id)
    .order("position", { ascending: true });
  if (sectionsError) return null;

  return { page, sections: sections ?? [] };
}

// Section writes are split into "save" (persist only) and "publish" (revalidate
// the live route). The public site is served from Next's cache, so edits saved
// here are already live in the database but won't appear on the public page
// until publishPage() revalidates it — this is the "Publish changes" button;
// "Save draft" just calls the *WithoutRevalidate variants below.

export async function updateSectionContent(
  sectionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>,
  backgroundColor: string | null
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("sections")
    .update({ content, background_color: backgroundColor })
    .eq("id", sectionId);
  if (error) throw new Error(error.message);
}

export async function createSection(
  pageId: string,
  type: SectionType,
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>,
  position: number
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("sections")
    .insert({ page_id: pageId, type, name, content, position })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSection(sectionId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("sections").delete().eq("id", sectionId);
  if (error) throw new Error(error.message);
}

export async function reorderSections(orderedIds: string[]) {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, position) => supabase.from("sections").update({ position }).eq("id", id))
  );
}

/** Marks the page published, revalidates its public route, and — for a page
 * not yet in the navbar (i.e. a custom page's first publish) — appends it to
 * the end of the nav items. This is what the editor's "Publish changes"
 * button calls. Setting status:'published' here is a no-op for the 6
 * built-in pages, which are already published. */
export async function publishPage(slug: string) {
  const supabase = createAdminClient();
  const { data: page, error } = await supabase
    .from("pages")
    .update({ status: "published" })
    .eq("slug", slug)
    .select("title")
    .single();
  if (error) throw new Error(error.message);

  revalidateForSlug(slug);
  revalidatePath("/admin");

  if (page) {
    await appendPageToNav(slug, page.title);
  }
}

export async function setPageStatus(slug: string, status: PageStatus) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("pages").update({ status }).eq("slug", slug);
  if (error) throw new Error(error.message);
  revalidateForSlug(slug);
  revalidatePath("/admin");
}

export async function listPagesWithMeta() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("pages").select("*").order("slug");
  if (error) throw new Error(error.message);
  return data ?? [];
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

/** Creates a new draft page with no sections yet. Slug is derived from the
 * title with a numeric suffix on collision (checked against real page rows,
 * so it can never collide with a built-in slug like "about"). */
export async function createPage(title: string) {
  const supabase = createAdminClient();
  const baseSlug = slugify(title) || "untitled-page";
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { data: existing } = await supabase.from("pages").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const { data, error } = await supabase.from("pages").insert({ title, slug, status: "draft" }).select().single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  return data;
}

export async function updatePageTitle(pageId: string, title: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("pages").update({ title }).eq("id", pageId).select("slug").single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  if (data) revalidateForSlug(data.slug);
}
