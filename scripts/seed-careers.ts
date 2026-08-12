// One-off seed script for the careers page's dynamic sections.
// Run with: NODE_OPTIONS="--experimental-websocket" npx tsx scripts/seed-careers.ts
//
// Inserts the 3 careers sections — hero, text (intro), content-cards (open
// positions) — using the real, current copy from app/(site)/careers/page.tsx
// verbatim, at positions 0-2 matching DOM order.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

// Load .env.local (this is a plain node/tsx script, not a Next.js request,
// so Next's automatic env loading doesn't apply here).
process.loadEnvFile(".env.local");

// lib/supabase/admin.ts's createAdminClient() can't be imported directly
// here: it starts with `import "server-only"`, whose default export
// unconditionally throws outside of Next's bundler (the "react-server"
// export condition that makes it a no-op is only applied by Next's
// webpack/turbopack build, not by plain tsx/node execution). This inlines
// the same client construction for this standalone script.
function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

type SectionInsert = Database["public"]["Tables"]["sections"]["Insert"];

async function main() {
  const supabase = createAdminClient();

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id, slug")
    .eq("slug", "careers")
    .single();

  if (pageError || !page) {
    console.error("Could not find 'careers' page row:", pageError);
    process.exit(1);
  }

  // Wipe any existing careers sections so this script is safely re-runnable.
  const { error: deleteError } = await supabase.from("sections").delete().eq("page_id", page.id);
  if (deleteError) {
    console.error("Failed to clear existing careers sections:", deleteError);
    process.exit(1);
  }

  const sections: SectionInsert[] = [
    {
      page_id: page.id,
      type: "hero",
      position: 0,
      name: "Join Digital Public Works",
      content: {
        headline: "Join Digital Public Works",
        subtitle:
          "Join us in making government digital services better for everyone (and doing it at cost).",
        photo_url: "/images/careers/johannes-kopf-h0pHxbb6a78-unsplash.jpg",
        photo_alt: "Three hikers on a mountainous trail at dusk",
      },
    },
    {
      page_id: page.id,
      type: "text",
      position: 1,
      name: "Careers intro",
      content: {
        text: "Digital Public Works is a small team doing work that matters. We build the tools and infrastructure that states need to verify income for public benefits, and we are growing. Our team is mostly U.S. Digital Service veterans and civic tech practitioners who have built and shipped technology at scale in government. We put humans at the center of everything we do, we ship real products into real systems, and we hold ourselves to a high standard while assuming the best in each other. If that sounds like your kind of environment, we'd love to hear from you.",
      },
    },
    {
      page_id: page.id,
      type: "content-cards",
      position: 2,
      name: "Open Positions",
      content: {
        cards: [],
      },
    },
  ];

  const { data, error } = await supabase.from("sections").insert(sections).select("id, type, position");

  if (error) {
    console.error("Insert failed:", error);
    process.exit(1);
  }

  console.log(`Inserted ${data?.length ?? 0} sections for 'careers':`);
  console.table(data);

  const { data: verify, error: verifyError } = await supabase
    .from("sections")
    .select("id, type, position, name")
    .eq("page_id", page.id)
    .order("position", { ascending: true });

  if (verifyError) {
    console.error("Verification query failed:", verifyError);
    process.exit(1);
  }

  console.log(`\nVerification: ${verify?.length ?? 0} rows now exist for page 'careers'.`);
  console.table(verify);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
