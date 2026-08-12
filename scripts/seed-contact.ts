// One-off seed script for the contact page's dynamic sections.
// Run with: NODE_OPTIONS="--experimental-websocket" npx tsx scripts/seed-contact.ts
//
// Inserts the 4 "text" sections that were promoted to dynamic (Supabase-backed)
// content: the page header, and the intro heading+text preceding each of the
// 3 contact forms (state partners, funders, community) — using the real,
// current copy from app/(site)/contact/page.tsx verbatim, at positions 0-3
// matching DOM order.
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
    .eq("slug", "contact")
    .single();

  if (pageError || !page) {
    console.error("Could not find 'contact' page row:", pageError);
    process.exit(1);
  }

  // Wipe any existing contact sections so this script is safely re-runnable.
  const { error: deleteError } = await supabase.from("sections").delete().eq("page_id", page.id);
  if (deleteError) {
    console.error("Failed to clear existing contact sections:", deleteError);
    process.exit(1);
  }

  const sections: SectionInsert[] = [
    {
      page_id: page.id,
      type: "text",
      position: 0,
      name: "Page header",
      content: {
        heading: "Get in touch",
        text: "Whether you are a state agency, a funder, a community organization, or a fellow practitioner, we would love to hear from you.",
      },
    },
    {
      page_id: page.id,
      type: "text",
      position: 1,
      name: "For State Partners intro",
      content: {
        // Note: the live JSX renders "Verify My Income" in italics via an
        // <i> tag around that phrase within the heading. Stored here as
        // plain text per the task's accepted minor simplification.
        heading: "Request a demo of Verify My Income",
        text: "We work with state health and human services agencies to pilot and implement real-time income verification for Medicaid, SNAP, and other benefit programs. If you're interested in exploring a partnership, we'd love to connect.",
      },
    },
    {
      page_id: page.id,
      type: "text",
      position: 2,
      name: "For Funders intro",
      content: {
        heading: "Support our work",
        text: "Digital Public Works is an independent 501(c)(3) nonprofit. Philanthropic support enables us to keep our fees at cost for state agencies and to invest in research, accessibility, and the communities our work serves.",
      },
    },
    {
      page_id: page.id,
      type: "text",
      position: 3,
      name: "For Community intro",
      content: {
        heading: "Everything else",
        text: "Press inquiries, partnership ideas, and general questions are all welcome. We read everything.",
      },
    },
  ];

  const { data, error } = await supabase.from("sections").insert(sections).select("id, type, position");

  if (error) {
    console.error("Insert failed:", error);
    process.exit(1);
  }

  console.log(`Inserted ${data?.length ?? 0} sections for 'contact':`);
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

  console.log(`\nVerification: ${verify?.length ?? 0} rows now exist for page 'contact'.`);
  console.table(verify);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
