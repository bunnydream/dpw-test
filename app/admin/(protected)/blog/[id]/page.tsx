import { notFound } from "next/navigation";
import { getPostWithBlocks, listPosts } from "@/lib/admin/blog";
import BlogEditor from "./BlogEditor";

const DEFAULT_CATEGORIES = ["Policy", "Service Design", "Accessibility"];

export default async function BlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, posts] = await Promise.all([getPostWithBlocks(id), listPosts()]);

  if (!result) {
    notFound();
  }

  const existingCategories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  const categories = Array.from(new Set([...existingCategories, ...DEFAULT_CATEGORIES])).sort();

  return <BlogEditor post={result.post} initialBlocks={result.blocks} categories={categories} />;
}
