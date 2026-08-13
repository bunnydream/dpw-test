"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

/** Soft-deletes a blog post: snapshots it (with all its blocks) into
 * deleted_blog_posts, then removes the live row (blocks cascade via FK).
 * Kept for 30 days before a scheduled purge hard-deletes it — see
 * purgeExpiredDeletedPosts(). */
export async function softDeletePost(postId: string, slug: string, title: string) {
  const supabase = createAdminClient();

  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", postId).single();
  const { data: blocks } = await supabase
    .from("blog_blocks")
    .select("*")
    .eq("post_id", postId)
    .order("position", { ascending: true });

  if (!post) throw new Error("Post not found");

  const { error: insertError } = await supabase.from("deleted_blog_posts").insert({
    slug,
    title,
    snapshot: { post, blocks: blocks ?? [] },
  });
  if (insertError) throw new Error(insertError.message);

  const { error: deleteError } = await supabase.from("blog_posts").delete().eq("id", postId);
  if (deleteError) throw new Error(deleteError.message);

  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);
  revalidatePath("/admin/blog");
  revalidatePath("/admin/deleted-blog-posts");
}

export async function listDeletedPosts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("deleted_blog_posts")
    .select("*")
    .eq("restored", false)
    .order("deleted_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Recreates the post + blocks from the stored snapshot and marks the
 * deleted_blog_posts row as restored (kept for audit history rather than deleted). */
export async function restorePost(deletedPostId: string) {
  const supabase = createAdminClient();

  const { data: record, error: fetchError } = await supabase
    .from("deleted_blog_posts")
    .select("*")
    .eq("id", deletedPostId)
    .single();
  if (fetchError || !record) throw new Error("Deleted post not found");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const snapshot = record.snapshot as { post: any; blocks: any[] };

  const { data: newPost, error: postError } = await supabase
    .from("blog_posts")
    .insert({
      slug: snapshot.post.slug,
      title: snapshot.post.title,
      category: snapshot.post.category,
      featured_image_url: snapshot.post.featured_image_url,
      featured_image_alt: snapshot.post.featured_image_alt,
      featured_image_caption: snapshot.post.featured_image_caption,
      status: snapshot.post.status,
      published_at: snapshot.post.published_at,
    })
    .select()
    .single();
  if (postError || !newPost) throw new Error(postError?.message ?? "Failed to restore post");

  if (snapshot.blocks.length > 0) {
    const { error: blocksError } = await supabase.from("blog_blocks").insert(
      snapshot.blocks.map((b) => ({
        post_id: newPost.id,
        type: b.type,
        position: b.position,
        content: b.content,
      }))
    );
    if (blocksError) throw new Error(blocksError.message);
  }

  await supabase.from("deleted_blog_posts").update({ restored: true }).eq("id", deletedPostId);

  revalidatePath("/insights");
  revalidatePath(`/insights/${snapshot.post.slug}`);
  revalidatePath("/admin/blog");
  revalidatePath("/admin/deleted-blog-posts");
}

/** Hard-deletes any deleted_blog_posts rows whose 30-day retention window has
 * passed. Intended to run on a schedule (see purge_deleted_blog_posts() / pg_cron
 * in supabase/migrations/0003_site_settings_and_deleted_blogs.sql). */
export async function purgeExpiredDeletedPosts() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("deleted_blog_posts")
    .delete()
    .lt("purge_at", new Date().toISOString())
    .eq("restored", false)
    .select("id");
  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}
