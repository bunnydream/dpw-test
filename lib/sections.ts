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

/**
 * Lets a fixed page interleave "extra" sections (ones not claimed by any of
 * its hardcoded slots — e.g. a new block added via "Add a block") among its
 * known sections by position, instead of always dropping them at the very
 * end. Call the returned `slot(beforePosition)` right before each known
 * section's JSX, passing that known section's own `position`; it returns
 * (and consumes) every remaining extra whose position is lower. A final
 * `slot(Infinity)` call after the last known section picks up anything left
 * with a higher position than all of them.
 */
export function makeExtrasSlotter(extraSections: Section[]) {
  const remaining = [...extraSections].sort((a, b) => a.position - b.position);
  return function slot(beforePosition: number): Section[] {
    const taken: Section[] = [];
    while (remaining.length && remaining[0].position < beforePosition) {
      taken.push(remaining.shift()!);
    }
    return taken;
  };
}
