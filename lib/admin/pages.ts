"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PageStatus, SectionType } from "@/lib/supabase/types";
import { pageSlugToPath } from "@/lib/page-path";
import { appendPageToNav, renameNavItem } from "@/lib/admin/site-settings";

type AdminClient = ReturnType<typeof createAdminClient>;

function revalidateForSlug(slug: string) {
  revalidatePath(pageSlugToPath(slug));
}

/** Ensures section_drafts rows exist for a page that's already published,
 * lazily seeding them from the current live sections the first time this is
 * called for that page (subsequent calls just return the existing drafts).
 * Only ever called for a published page — a page that's never been
 * published keeps editing live `sections` rows directly. */
async function ensureDraftSections(supabase: AdminClient, pageId: string) {
  const { data: existing, error } = await supabase
    .from("section_drafts")
    .select("*")
    .eq("page_id", pageId)
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  if (existing && existing.length > 0) return existing;

  const { data: live, error: liveError } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", pageId)
    .order("position", { ascending: true });
  if (liveError) throw new Error(liveError.message);
  if (!live || live.length === 0) return [];

  const rows = live.map((s) => ({
    page_id: pageId,
    live_section_id: s.id,
    type: s.type,
    position: s.position,
    name: s.name,
    background_color: s.background_color,
    content: s.content,
    hidden: s.hidden,
  }));
  // Upsert (ignoring conflicts) rather than plain insert: a concurrent call
  // seeding the same page_id/live_section_id pair loses the race silently
  // instead of creating a duplicate shadow row (see 0011_draft_seed_dedup.sql).
  const { error: insertError } = await supabase
    .from("section_drafts")
    .upsert(rows, { onConflict: "page_id,live_section_id", ignoreDuplicates: true });
  if (insertError) throw new Error(insertError.message);

  // Re-select rather than trusting the upsert's own return value: whichever
  // call lost the race gets the authoritative full set either way.
  const { data: seeded, error: seededError } = await supabase
    .from("section_drafts")
    .select("*")
    .eq("page_id", pageId)
    .order("position", { ascending: true });
  if (seededError) throw new Error(seededError.message);
  return seeded ?? [];
}

type PageMetaSnapshot = {
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
};

/** Reads the pending draft_meta snapshot for a page, seeding it from the
 * current live title/SEO fields if no draft override exists yet. Used by
 * updatePageTitle/updatePageSeo when draftMode is true, so a page's first
 * draft edit to any one of these fields starts from a full, consistent
 * snapshot rather than a partial patch. */
async function currentPageMeta(supabase: AdminClient, pageId: string): Promise<{ slug: string; base: PageMetaSnapshot }> {
  const { data: existing, error } = await supabase
    .from("pages")
    .select("slug, title, meta_title, meta_description, og_image_url, canonical_url, noindex, draft_meta")
    .eq("id", pageId)
    .single();
  if (error || !existing) throw new Error(error?.message ?? "Page not found");
  const base: PageMetaSnapshot = (existing.draft_meta as PageMetaSnapshot | null) ?? {
    title: existing.title,
    meta_title: existing.meta_title,
    meta_description: existing.meta_description,
    og_image_url: existing.og_image_url,
    canonical_url: existing.canonical_url,
    noindex: existing.noindex,
  };
  return { slug: existing.slug, base };
}

export async function getPageWithSections(slug: string) {
  const supabase = createAdminClient();
  const { data: page, error: pageError } = await supabase.from("pages").select("*").eq("slug", slug).single();
  if (pageError || !page) return null;

  if (page.status === "published") {
    const drafts = await ensureDraftSections(supabase, page.id);
    const sections = drafts
      .filter((d) => !d.deleted)
      .sort((a, b) => a.position - b.position)
      .map(({ live_section_id: _liveSectionId, deleted: _deleted, ...rest }) => rest);
    const effectivePage = { ...page, ...(page.draft_meta ?? {}) };
    return { page: effectivePage, sections };
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", page.id)
    .order("position", { ascending: true });
  if (sectionsError) return null;

  return { page, sections: sections ?? [] };
}

// Section writes go straight to the live `sections` table for a page that's
// never been published — the `status` filter in lib/sections.ts already
// keeps those correctly hidden from the public site. Once a page has been
// published, `draftMode` routes every write to `section_drafts` instead, so
// "Save draft" can no longer change what the public site shows; only
// publishPage() copies drafted changes onto the live rows.

export async function updateSectionContent(
  sectionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>,
  backgroundColor: string | null,
  hidden: boolean | undefined,
  draftMode: boolean
) {
  const supabase = createAdminClient();
  const patch = { content, background_color: backgroundColor, ...(hidden !== undefined ? { hidden } : {}) };
  const { error } = draftMode
    ? await supabase.from("section_drafts").update(patch).eq("id", sectionId)
    : await supabase.from("sections").update(patch).eq("id", sectionId);
  if (error) throw new Error(error.message);
}

export async function createSection(
  pageId: string,
  type: SectionType,
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>,
  position: number,
  draftMode: boolean
) {
  const supabase = createAdminClient();
  if (draftMode) {
    const { data, error } = await supabase
      .from("section_drafts")
      .insert({ page_id: pageId, live_section_id: null, type, name, content, position })
      .select()
      .single();
    if (error) throw new Error(error.message);
    const { live_section_id: _liveSectionId, deleted: _deleted, ...rest } = data;
    return rest;
  }
  const { data, error } = await supabase
    .from("sections")
    .insert({ page_id: pageId, type, name, content, position })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSection(sectionId: string, draftMode: boolean) {
  const supabase = createAdminClient();
  if (!draftMode) {
    const { error } = await supabase.from("sections").delete().eq("id", sectionId);
    if (error) throw new Error(error.message);
    return;
  }

  const { data: draft, error: fetchError } = await supabase
    .from("section_drafts")
    .select("live_section_id")
    .eq("id", sectionId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  if (draft?.live_section_id) {
    const { error } = await supabase.from("section_drafts").update({ deleted: true }).eq("id", sectionId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("section_drafts").delete().eq("id", sectionId);
    if (error) throw new Error(error.message);
  }
}

/** Restores a section previously removed by deleteSection — used to make
 * undo of a delete actually persist. If the section's draft row still
 * exists as a tombstone (it shadowed a live row, so deleteSection only set
 * deleted:true on it), un-tombstones that same row with the given
 * (possibly-since-edited) content — same id as before, no caller-visible
 * change. Otherwise (it was hard-deleted — a never-published section
 * created and deleted within the same draft session — or draftMode is
 * false, where delete is always a hard delete) inserts a fresh row instead,
 * same as createSection. Callers must use the returned row's id, which may
 * differ from the id passed in when this fallback path is taken. */
export async function restoreSection(
  pageId: string,
  sectionId: string,
  type: SectionType,
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>,
  backgroundColor: string | null,
  position: number,
  hidden: boolean,
  draftMode: boolean
) {
  const supabase = createAdminClient();

  if (draftMode) {
    const { data: existing, error: fetchError } = await supabase
      .from("section_drafts")
      .select("id")
      .eq("id", sectionId)
      .eq("deleted", true)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);

    if (existing) {
      const { data, error } = await supabase
        .from("section_drafts")
        .update({ deleted: false, type, name, content, background_color: backgroundColor, position, hidden })
        .eq("id", sectionId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      const { live_section_id: _liveSectionId, deleted: _deleted, ...rest } = data;
      return rest;
    }

    const { data, error } = await supabase
      .from("section_drafts")
      .insert({ page_id: pageId, live_section_id: null, type, name, content, background_color: backgroundColor, position, hidden })
      .select()
      .single();
    if (error) throw new Error(error.message);
    const { live_section_id: _liveSectionId, deleted: _deleted, ...rest } = data;
    return rest;
  }

  const { data, error } = await supabase
    .from("sections")
    .insert({ page_id: pageId, type, name, content, background_color: backgroundColor, position, hidden })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function reorderSections(orderedIds: string[], draftMode: boolean) {
  const supabase = createAdminClient();
  if (draftMode) {
    await Promise.all(orderedIds.map((id, position) => supabase.from("section_drafts").update({ position }).eq("id", id)));
  } else {
    await Promise.all(orderedIds.map((id, position) => supabase.from("sections").update({ position }).eq("id", id)));
  }
}

/** Marks the page published, revalidates its public route, and — for a page
 * not yet in the navbar (i.e. a custom page's first publish) — appends it to
 * the end of the nav items. This is what the editor's "Publish changes"
 * button calls. Setting status:'published' here is a no-op for the 6
 * built-in pages, which are already published.
 *
 * If the page has pending section_drafts and/or a draft_meta snapshot (i.e.
 * it was already published and has been edited since), those are applied to
 * the live `sections`/`pages` rows first, then cleared. If neither exists
 * (the page's first-ever publish), this is exactly the original behavior. */
export async function publishPage(slug: string) {
  const supabase = createAdminClient();
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id, draft_meta")
    .eq("slug", slug)
    .single();
  if (pageError || !page) throw new Error(pageError?.message ?? "Page not found");

  const { data: drafts, error: draftsError } = await supabase
    .from("section_drafts")
    .select("*")
    .eq("page_id", page.id);
  if (draftsError) throw new Error(draftsError.message);

  if (drafts && drafts.length > 0) {
    for (const d of drafts) {
      if (d.deleted && d.live_section_id) {
        const { error } = await supabase.from("sections").delete().eq("id", d.live_section_id);
        if (error) throw new Error(error.message);
      } else if (!d.deleted && d.live_section_id) {
        const { error } = await supabase
          .from("sections")
          .update({
            type: d.type,
            position: d.position,
            name: d.name,
            background_color: d.background_color,
            content: d.content,
            hidden: d.hidden,
          })
          .eq("id", d.live_section_id);
        if (error) throw new Error(error.message);
      } else if (!d.deleted && !d.live_section_id) {
        const { error } = await supabase.from("sections").insert({
          page_id: page.id,
          type: d.type,
          position: d.position,
          name: d.name,
          background_color: d.background_color,
          content: d.content,
          hidden: d.hidden,
        });
        if (error) throw new Error(error.message);
      }
    }
    const { error: clearError } = await supabase.from("section_drafts").delete().eq("page_id", page.id);
    if (clearError) throw new Error(clearError.message);
  }

  const { data: updatedPage, error } = await supabase
    .from("pages")
    .update({ status: "published", ...(page.draft_meta ?? {}), draft_meta: null })
    .eq("slug", slug)
    .select("title")
    .single();
  if (error) throw new Error(error.message);

  revalidateForSlug(slug);
  revalidatePath("/admin");

  if (updatedPage) {
    await appendPageToNav(slug, updatedPage.title);
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

export async function updatePageTitle(pageId: string, title: string, draftMode: boolean) {
  const supabase = createAdminClient();
  if (!draftMode) {
    const { data, error } = await supabase.from("pages").update({ title }).eq("id", pageId).select("slug").single();
    if (error) throw new Error(error.message);
    revalidatePath("/admin");
    if (data) {
      revalidateForSlug(data.slug);
      await renameNavItem(data.slug, title);
    }
    return;
  }

  const { base } = await currentPageMeta(supabase, pageId);
  const { error } = await supabase.from("pages").update({ draft_meta: { ...base, title } }).eq("id", pageId);
  if (error) throw new Error(error.message);
}

export async function updatePageSeo(
  pageId: string,
  fields: Partial<{
    meta_title: string | null;
    meta_description: string | null;
    og_image_url: string | null;
    canonical_url: string | null;
    noindex: boolean;
  }>,
  draftMode: boolean
) {
  const supabase = createAdminClient();
  if (!draftMode) {
    const { data: existing, error: fetchError } = await supabase.from("pages").select("slug").eq("id", pageId).single();
    if (fetchError || !existing) throw new Error(fetchError?.message ?? "Page not found");
    const { error } = await supabase.from("pages").update(fields).eq("id", pageId);
    if (error) throw new Error(error.message);
    revalidateForSlug(existing.slug);
    return;
  }

  const { base } = await currentPageMeta(supabase, pageId);
  const { error } = await supabase.from("pages").update({ draft_meta: { ...base, ...fields } }).eq("id", pageId);
  if (error) throw new Error(error.message);
}
