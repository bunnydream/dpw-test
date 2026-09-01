import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageSections } from "@/lib/sections";
import SectionRenderer from "@/components/blocks/SectionRenderer";
import { getSeoSettings } from "@/lib/site-settings";
import { resolveMetadata } from "@/lib/seo";
import "../custom-page.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [result, siteSeo] = await Promise.all([getPageSections(slug), getSeoSettings()]);
  if (!result) {
    return { title: "Digital Public Works" };
  }
  return resolveMetadata({ item: result.page, fallbackTitle: result.page.title, path: `/${slug}`, siteSeo });
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPageSections(slug);

  if (!result) {
    notFound();
  }

  return (
    <div className="page-custom">
      <SectionRenderer sections={result.sections.filter((s) => !s.hidden)} />
    </div>
  );
}
