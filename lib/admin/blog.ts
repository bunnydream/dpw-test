"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogBlockType, PageStatus } from "@/lib/supabase/types";

type AdminClient = ReturnType<typeof createAdminClient>;

function revalidateInsights(slug?: string) {
  revalidatePath("/insights");
  if (slug) revalidatePath(`/insights/${slug}`);
  revalidatePath("/admin/blog");
}

export async function listPosts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Ensures block_drafts rows exist for a post that's already published,
 * lazily seeding them from the current live blocks the first time this is
 * called for that post (subsequent calls just return the existing drafts).
 * Only ever called for a published post — a post that's never been
 * published keeps editing live `blog_blocks` rows directly. */
async function ensureDraftBlocks(supabase: AdminClient, postId: string) {
  const { data: existing, error } = await supabase
    .from("block_drafts")
    .select("*")
    .eq("post_id", postId)
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  if (existing && existing.length > 0) return existing;

  const { data: live, error: liveError } = await supabase
    .from("blog_blocks")
    .select("*")
    .eq("post_id", postId)
    .order("position", { ascending: true });
  if (liveError) throw new Error(liveError.message);
  if (!live || live.length === 0) return [];

  const rows = live.map((b) => ({
    post_id: postId,
    live_block_id: b.id,
    type: b.type,
    position: b.position,
    content: b.content,
  }));
  // Upsert (ignoring conflicts) rather than plain insert: a concurrent call
  // seeding the same post_id/live_block_id pair loses the race silently
  // instead of creating a duplicate shadow row (see 0011_draft_seed_dedup.sql).
  const { error: insertError } = await supabase
    .from("block_drafts")
    .upsert(rows, { onConflict: "post_id,live_block_id", ignoreDuplicates: true });
  if (insertError) throw new Error(insertError.message);

  // Re-select rather than trusting the upsert's own return value: whichever
  // call lost the race gets the authoritative full set either way.
  const { data: seeded, error: seededError } = await supabase
    .from("block_drafts")
    .select("*")
    .eq("post_id", postId)
    .order("position", { ascending: true });
  if (seededError) throw new Error(seededError.message);
  return seeded ?? [];
}

type PostMetaSnapshot = {
  title: string;
  slug: string;
  subtitle: string | null;
  author: string | null;
  category: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  featured_image_caption: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean;
};

/** Reads the pending draft_meta snapshot for a post, seeding it from the
 * current live title/SEO fields if no draft override exists yet. Used by
 * updatePostMeta/updatePostSeo when draftMode is true. */
async function currentPostMeta(supabase: AdminClient, postId: string): Promise<{ slug: string; base: PostMetaSnapshot }> {
  const { data: existing, error } = await supabase
    .from("blog_posts")
    .select(
      "slug, title, subtitle, author, category, featured_image_url, featured_image_alt, featured_image_caption, meta_title, meta_description, og_image_url, canonical_url, noindex, draft_meta"
    )
    .eq("id", postId)
    .single();
  if (error || !existing) throw new Error(error?.message ?? "Post not found");
  const base: PostMetaSnapshot = (existing.draft_meta as PostMetaSnapshot | null) ?? {
    title: existing.title,
    slug: existing.slug,
    subtitle: existing.subtitle,
    author: existing.author,
    category: existing.category,
    featured_image_url: existing.featured_image_url,
    featured_image_alt: existing.featured_image_alt,
    featured_image_caption: existing.featured_image_caption,
    meta_title: existing.meta_title,
    meta_description: existing.meta_description,
    og_image_url: existing.og_image_url,
    canonical_url: existing.canonical_url,
    noindex: existing.noindex,
  };
  return { slug: existing.slug, base };
}

export async function getPostWithBlocks(id: string) {
  const supabase = createAdminClient();
  const { data: post, error: postError } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (postError || !post) return null;

  if (post.status === "published") {
    const drafts = await ensureDraftBlocks(supabase, post.id);
    const blocks = drafts
      .filter((d) => !d.deleted)
      .sort((a, b) => a.position - b.position)
      .map(({ live_block_id: _liveBlockId, deleted: _deleted, ...rest }) => rest);
    const effectivePost = { ...post, ...(post.draft_meta ?? {}) };
    return { post: effectivePost, blocks };
  }

  const { data: blocks, error: blocksError } = await supabase
    .from("blog_blocks")
    .select("*")
    .eq("post_id", id)
    .order("position", { ascending: true });
  if (blocksError) return null;

  return { post, blocks: blocks ?? [] };
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function createPost(title: string = "Untitled post", category: string = "Uncategorized") {
  const supabase = createAdminClient();
  const baseSlug = slugify(title) || "untitled-post";
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { data: existing } = await supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ title, category, slug, status: "draft" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  return data;
}

export async function updatePostMeta(
  id: string,
  fields: Partial<{
    title: string;
    subtitle: string | null;
    author: string | null;
    category: string;
    featured_image_url: string | null;
    featured_image_alt: string | null;
    featured_image_caption: string | null;
  }>,
  draftMode: boolean
) {
  const supabase = createAdminClient();
  if (!draftMode) {
    const { data: existing } = await supabase.from("blog_posts").select("slug").eq("id", id).single();
    const { error } = await supabase.from("blog_posts").update(fields).eq("id", id);
    if (error) throw new Error(error.message);
    revalidateInsights(existing?.slug);
    return;
  }

  const { base } = await currentPostMeta(supabase, id);
  const { error } = await supabase.from("blog_posts").update({ draft_meta: { ...base, ...fields } }).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Renames a post's URL slug. Mirrors updatePostMeta's shape: writes live
 * and revalidates immediately for a never-published post (!draftMode), or
 * stashes the pending value into draft_meta for an already-published one,
 * where it only takes effect (live row + revalidation) at the next
 * setPostStatus(id, "published") call. Rejects a slug already used by
 * another post (checked here, with the DB's unique constraint as a fallback
 * in case of a race). */
export async function updatePostSlug(id: string, newSlugRaw: string, draftMode: boolean) {
  const supabase = createAdminClient();
  const newSlug = slugify(newSlugRaw);
  if (!newSlug) throw new Error("URL can't be empty");

  const { data: existingRow, error: fetchError } = await supabase.from("blog_posts").select("slug").eq("id", id).single();
  if (fetchError || !existingRow) throw new Error(fetchError?.message ?? "Post not found");

  const { data: collision } = await supabase.from("blog_posts").select("id").eq("slug", newSlug).neq("id", id).maybeSingle();
  if (collision) throw new Error("That URL is already used by another post");

  if (!draftMode) {
    const oldSlug = existingRow.slug;
    const { error } = await supabase.from("blog_posts").update({ slug: newSlug }).eq("id", id);
    if (error) {
      if (error.code === "23505") throw new Error("That URL is already used by another post");
      throw new Error(error.message);
    }
    revalidateInsights(oldSlug);
    revalidatePath(`/insights/${newSlug}`);
    return newSlug;
  }

  const { base } = await currentPostMeta(supabase, id);
  const { error } = await supabase.from("blog_posts").update({ draft_meta: { ...base, slug: newSlug } }).eq("id", id);
  if (error) {
    if (error.code === "23505") throw new Error("That URL is already used by another post");
    throw new Error(error.message);
  }
  return newSlug;
}

export async function updatePostSeo(
  id: string,
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
    const { data: existing } = await supabase.from("blog_posts").select("slug").eq("id", id).single();
    const { error } = await supabase.from("blog_posts").update(fields).eq("id", id);
    if (error) throw new Error(error.message);
    revalidateInsights(existing?.slug);
    return;
  }

  const { base } = await currentPostMeta(supabase, id);
  const { error } = await supabase.from("blog_posts").update({ draft_meta: { ...base, ...fields } }).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Publish/unpublish. Transitioning TO "published" first applies any pending
 * block_drafts and draft_meta onto the live blog_blocks/blog_posts rows (a
 * no-op if neither exists — the post's first-ever publish), then clears
 * them. Transitioning to "draft" (Unpublish) discards any pending
 * block_drafts/draft_meta rather than applying or preserving them: once
 * unpublished, edits go straight to the live rows again (same as a
 * never-published post), so stale leftover drafts must not survive to be
 * incorrectly resurrected and applied on a later republish, potentially
 * clobbering newer edits made in the meantime. */
export async function setPostStatus(id: string, status: PageStatus) {
  const supabase = createAdminClient();

  if (status !== "published") {
    const { data: existing, error: fetchError } = await supabase.from("blog_posts").select("slug").eq("id", id).single();
    if (fetchError) throw new Error(fetchError.message);
    const { error: clearError } = await supabase.from("block_drafts").delete().eq("post_id", id);
    if (clearError) throw new Error(clearError.message);
    const { error } = await supabase
      .from("blog_posts")
      .update({ status, published_at: null, draft_meta: null })
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidateInsights(existing?.slug);
    return;
  }

  const { data: post, error: postError } = await supabase
    .from("blog_posts")
    .select("slug, status, published_at, draft_meta")
    .eq("id", id)
    .single();
  if (postError || !post) throw new Error(postError?.message ?? "Post not found");

  const oldSlug = post.slug;
  const newSlug = (post.draft_meta as PostMetaSnapshot | null)?.slug ?? oldSlug;

  const { data: drafts, error: draftsError } = await supabase.from("block_drafts").select("*").eq("post_id", id);
  if (draftsError) throw new Error(draftsError.message);

  if (drafts && drafts.length > 0) {
    for (const d of drafts) {
      if (d.deleted && d.live_block_id) {
        const { error } = await supabase.from("blog_blocks").delete().eq("id", d.live_block_id);
        if (error) throw new Error(error.message);
      } else if (!d.deleted && d.live_block_id) {
        const { error } = await supabase
          .from("blog_blocks")
          .update({ type: d.type, position: d.position, content: d.content })
          .eq("id", d.live_block_id);
        if (error) throw new Error(error.message);
      } else if (!d.deleted && !d.live_block_id) {
        const { error } = await supabase.from("blog_blocks").insert({
          post_id: id,
          type: d.type,
          position: d.position,
          content: d.content,
        });
        if (error) throw new Error(error.message);
      }
    }
    const { error: clearError } = await supabase.from("block_drafts").delete().eq("post_id", id);
    if (clearError) throw new Error(clearError.message);
  }

  // Only stamp a fresh published_at on the actual draft→published transition
  // (first-ever publish, or republishing after an Unpublish, which already
  // nulled it out) — republishing further edits to a post that's already
  // published shouldn't bump its published date and reorder it on /insights.
  const publishedAtPatch = post.status === "published" && post.published_at ? {} : { published_at: new Date().toISOString() };

  const { error } = await supabase
    .from("blog_posts")
    .update({
      status: "published",
      ...publishedAtPatch,
      ...(post.draft_meta ?? {}),
      draft_meta: null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateInsights(oldSlug);
  if (newSlug !== oldSlug) revalidatePath(`/insights/${newSlug}`);
}

export async function createBlock(
  postId: string,
  type: BlogBlockType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>,
  position: number,
  draftMode: boolean
) {
  const supabase = createAdminClient();
  if (draftMode) {
    const { data, error } = await supabase
      .from("block_drafts")
      .insert({ post_id: postId, live_block_id: null, type, content, position })
      .select()
      .single();
    if (error) throw new Error(error.message);
    const { live_block_id: _liveBlockId, deleted: _deleted, ...rest } = data;
    return rest;
  }
  const { data, error } = await supabase
    .from("blog_blocks")
    .insert({ post_id: postId, type, content, position })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateBlock(
  blockId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>,
  draftMode: boolean
) {
  const supabase = createAdminClient();
  const { error } = draftMode
    ? await supabase.from("block_drafts").update({ content }).eq("id", blockId)
    : await supabase.from("blog_blocks").update({ content }).eq("id", blockId);
  if (error) throw new Error(error.message);
}

export async function deleteBlock(blockId: string, draftMode: boolean) {
  const supabase = createAdminClient();
  if (!draftMode) {
    const { error } = await supabase.from("blog_blocks").delete().eq("id", blockId);
    if (error) throw new Error(error.message);
    return;
  }

  const { data: draft, error: fetchError } = await supabase
    .from("block_drafts")
    .select("live_block_id")
    .eq("id", blockId)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  if (draft?.live_block_id) {
    const { error } = await supabase.from("block_drafts").update({ deleted: true }).eq("id", blockId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("block_drafts").delete().eq("id", blockId);
    if (error) throw new Error(error.message);
  }
}

export async function reorderBlocks(orderedIds: string[], draftMode: boolean) {
  const supabase = createAdminClient();
  if (draftMode) {
    await Promise.all(orderedIds.map((id, position) => supabase.from("block_drafts").update({ position }).eq("id", id)));
  } else {
    await Promise.all(orderedIds.map((id, position) => supabase.from("blog_blocks").update({ position }).eq("id", id)));
  }
}
