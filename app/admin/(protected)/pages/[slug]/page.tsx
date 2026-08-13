import { notFound } from "next/navigation";
import { getPageWithSections, listPagesWithMeta } from "@/lib/admin/pages";
import PageEditor from "./PageEditor";

export default async function AdminPageEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [result, pages] = await Promise.all([getPageWithSections(slug), listPagesWithMeta()]);
  if (!result) {
    notFound();
  }

  const { page, sections } = result;

  return <PageEditor slug={slug} page={page} initialSections={sections} pages={pages} />;
}
