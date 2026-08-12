import { notFound } from "next/navigation";
import { getPageWithSections } from "@/lib/admin/pages";
import PageEditor from "./PageEditor";

const VALID_SLUGS = ["home", "about", "product", "impact", "careers", "contact"];

export default async function AdminPageEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  const result = await getPageWithSections(slug);
  if (!result) {
    notFound();
  }

  const { page, sections } = result;

  return <PageEditor slug={slug} page={page} initialSections={sections} />;
}
