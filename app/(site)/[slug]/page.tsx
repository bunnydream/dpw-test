import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageSections } from "@/lib/sections";
import SectionRenderer from "@/components/blocks/SectionRenderer";
import "../custom-page.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPageSections(slug);
  if (!result) {
    return { title: "Digital Public Works" };
  }
  return { title: `${result.page.title} — Digital Public Works` };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPageSections(slug);

  if (!result) {
    notFound();
  }

  return (
    <div className="page-custom">
      <SectionRenderer sections={result.sections} />
    </div>
  );
}
