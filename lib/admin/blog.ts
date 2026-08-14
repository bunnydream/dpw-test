"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlogBlockType, PageStatus } from "@/lib/supabase/types";

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

export async function getPostWithBlocks(id: string) {
  const supabase = createAdminClient();
  const { data: post, error: postError } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (postError || !post) return null;

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
  }>
) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase.from("blog_posts").select("slug").eq("id", id).single();
  const { error } = await supabase.from("blog_posts").update(fields).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateInsights(existing?.slug);
}

export async function setPostStatus(id: string, status: PageStatus) {
  const supabase = createAdminClient();
  const { data: existing } = await supabase.from("blog_posts").select("slug").eq("id", id).single();
  const { error } = await supabase
    .from("blog_posts")
    .update({ status, published_at: status === "published" ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateInsights(existing?.slug);
}

export async function createBlock(
  postId: string,
  type: BlogBlockType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>,
  position: number
) {
  const supabase = createAdminClient();
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
  content: Record<string, any>
) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("blog_blocks").update({ content }).eq("id", blockId);
  if (error) throw new Error(error.message);
}

export async function deleteBlock(blockId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("blog_blocks").delete().eq("id", blockId);
  if (error) throw new Error(error.message);
}

export async function reorderBlocks(orderedIds: string[]) {
  const supabase = createAdminClient();
  await Promise.all(
    orderedIds.map((id, position) => supabase.from("blog_blocks").update({ position }).eq("id", id))
  );
}
