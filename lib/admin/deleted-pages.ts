"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

const SLUG_TO_PATH: Record<string, string> = {
  home: "/",
  about: "/about",
  product: "/product",
  impact: "/impact",
  careers: "/careers",
  contact: "/contact",
};

/** Soft-deletes a page: snapshots it (with all its sections) into deleted_pages,
 * then removes the live row (sections cascade via FK). Kept for 30 days before
 * a scheduled purge hard-deletes it — see purgeExpiredDeletedPages(). */
export async function softDeletePage(pageId: string, slug: string, name: string) {
  const supabase = createAdminClient();

  const { data: page } = await supabase.from("pages").select("*").eq("id", pageId).single();
  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", pageId)
    .order("position", { ascending: true });

  if (!page) throw new Error("Page not found");

  const { error: insertError } = await supabase.from("deleted_pages").insert({
    slug,
    name,
    snapshot: { page, sections: sections ?? [] },
  });
  if (insertError) throw new Error(insertError.message);

  const { error: deleteError } = await supabase.from("pages").delete().eq("id", pageId);
  if (deleteError) throw new Error(deleteError.message);

  const path = SLUG_TO_PATH[slug];
  if (path) revalidatePath(path);
  revalidatePath("/admin");
  revalidatePath("/admin/deleted-pages");
}

export async function listDeletedPages() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("deleted_pages")
    .select("*")
    .eq("restored", false)
    .order("deleted_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Recreates the page + sections from the stored snapshot and marks the
 * deleted_pages row as restored (kept for audit history rather than deleted). */
export async function restorePage(deletedPageId: string) {
  const supabase = createAdminClient();

  const { data: record, error: fetchError } = await supabase
    .from("deleted_pages")
    .select("*")
    .eq("id", deletedPageId)
    .single();
  if (fetchError || !record) throw new Error("Deleted page not found");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const snapshot = record.snapshot as { page: any; sections: any[] };

  const { data: newPage, error: pageError } = await supabase
    .from("pages")
    .insert({
      slug: snapshot.page.slug,
      title: snapshot.page.title,
      status: snapshot.page.status,
    })
    .select()
    .single();
  if (pageError || !newPage) throw new Error(pageError?.message ?? "Failed to restore page");

  if (snapshot.sections.length > 0) {
    const { error: sectionsError } = await supabase.from("sections").insert(
      snapshot.sections.map((s) => ({
        page_id: newPage.id,
        type: s.type,
        position: s.position,
        name: s.name,
        background_color: s.background_color,
        content: s.content,
      }))
    );
    if (sectionsError) throw new Error(sectionsError.message);
  }

  await supabase.from("deleted_pages").update({ restored: true }).eq("id", deletedPageId);

  const path = SLUG_TO_PATH[snapshot.page.slug];
  if (path) revalidatePath(path);
  revalidatePath("/admin");
  revalidatePath("/admin/deleted-pages");
}

/** Hard-deletes any deleted_pages rows whose 30-day retention window has
 * passed. Intended to run on a schedule (see supabase/functions/purge-deleted-pages). */
export async function purgeExpiredDeletedPages() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("deleted_pages")
    .delete()
    .lt("purge_at", new Date().toISOString())
    .eq("restored", false)
    .select("id");
  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}
