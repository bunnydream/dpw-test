// One-off data fix for the `nav` site_settings row.
// Run with: NODE_OPTIONS="--experimental-websocket" npx tsx scripts/fix-nav-duplicate-ids.ts
//
// Root cause (see paired code fix in lib/admin/site-settings.ts's
// appendPageToNav): a new nav item's `id` was minted from the page's slug at
// creation time. Slugs are mutable — a later slug rename updates the item's
// `href` (via renameNavItemHref) but never touched `id`, so an item's id can
// go stale, still equal to a slug the page no longer has. If a *different*
// page was later created/published at that now-abandoned slug,
// appendPageToNav's href-based dedup found no match (the old item had
// already moved to a different href) and inserted a brand-new item — with
// `id` set to that slug again. Result: two distinct, both-still-live items
// sharing the same `id`, which React renders with `key={item.id}`,
// producing "Encountered two children with the same key" warnings/errors.
//
// This fix touches ONLY `id` values that collide with another item in the
// same array. It does not remove any item and does not change any item's
// `href`, `label`, `visible`, or its position in the array, and it does not
// touch any other key in the `nav` row's value (ctaLink/ctaText/logoUrl/
// logoAlt). It's generic (not hardcoded to any specific id/slug), so it's
// safe to run again later if this ever needs to be reapplied — a row with
// no duplicate ids is left completely unchanged.
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import type { Database } from "../lib/supabase/types";

process.loadEnvFile(".env.local");

function createAdminClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

type NavItem = { id: string; label: string; href: string; visible: boolean };

async function main() {
  const supabase = createAdminClient();

  const { data: row, error } = await supabase.from("site_settings").select("*").eq("key", "nav").single();
  if (error || !row) {
    console.error("Failed to read nav row:", error);
    process.exit(1);
  }

  const value = row.value as { items: NavItem[]; [key: string]: unknown };
  const items = value.items;

  console.log("=== BEFORE ===");
  items.forEach((it, i) => console.log(`${i}: id=${JSON.stringify(it.id)} href=${JSON.stringify(it.href)} label=${JSON.stringify(it.label)} visible=${it.visible}`));

  const idCounts = new Map<string, number>();
  for (const it of items) idCounts.set(it.id, (idCounts.get(it.id) ?? 0) + 1);
  const duplicateIds = new Set([...idCounts.entries()].filter(([, c]) => c > 1).map(([id]) => id));

  if (duplicateIds.size === 0) {
    console.log("\nNo duplicate ids found — nothing to do.");
    return;
  }

  const fixedItems = items.map((it) => (duplicateIds.has(it.id) ? { ...it, id: randomUUID() } : it));

  console.log("\n=== AFTER (about to write) ===");
  fixedItems.forEach((it, i) => console.log(`${i}: id=${JSON.stringify(it.id)} href=${JSON.stringify(it.href)} label=${JSON.stringify(it.label)} visible=${it.visible}`));

  const { error: updateError } = await supabase
    .from("site_settings")
    .update({ value: { ...value, items: fixedItems } })
    .eq("key", "nav");
  if (updateError) {
    console.error("Failed to write fixed nav row:", updateError);
    process.exit(1);
  }

  const { data: after, error: afterError } = await supabase.from("site_settings").select("*").eq("key", "nav").single();
  if (afterError || !after) {
    console.error("Write succeeded but re-read failed:", afterError);
    process.exit(1);
  }
  console.log("\n=== CONFIRMED WRITTEN ===");
  console.log(JSON.stringify(after.value, null, 2));
}

main();
