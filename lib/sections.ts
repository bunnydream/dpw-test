import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type Page = Database["public"]["Tables"]["pages"]["Row"];
export type Section = Database["public"]["Tables"]["sections"]["Row"];

export async function getPageSections(
  slug: string
): Promise<{ page: Page; sections: Section[] } | null> {
  const supabase = await createClient();

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (pageError || !page) {
    return null;
  }

  const { data: sections, error: sectionsError } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", page.id)
    .order("position", { ascending: true });

  if (sectionsError || !sections) {
    return { page, sections: [] };
  }

  return { page, sections: sections.filter((s) => !s.hidden) };
}
