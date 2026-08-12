"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PageStatus, SectionType } from "@/lib/supabase/types";

const SLUG_TO_PATH: Record<string, string> = {
  home: "/",
  about: "/about",
  product: "/product",
  impact: "/impact",
  careers: "/careers",
  contact: "/contact",
};

function revalidateForSlug(slug: string) {
  const path = SLUG_TO_PATH[slug];
  if (path) revalidatePath(path);
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

/** Revalidates the public route for a page so its current DB content goes
 * live — this is what the editor's "Publish changes" button calls. */
export async function publishPage(slug: string) {
  revalidateForSlug(slug);
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
