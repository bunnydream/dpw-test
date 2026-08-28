-- Fixes a real race condition observed in testing: ensureDraftSections /
-- ensureDraftBlocks (lib/admin/pages.ts / lib/admin/blog.ts) do a
-- check-then-insert to lazily seed section_drafts/block_drafts from live
-- rows the first time an already-published page/post is opened. Two
-- near-simultaneous calls (e.g. a route rendering data twice for the same
-- request) can both see "no drafts yet" and both bulk-insert a full copy,
-- producing duplicate shadow rows for every section/block and doubling
-- everything shown in the editor.
--
-- These partial unique indexes make the seeding upsert (see the paired code
-- change) idempotent: a second concurrent seed attempt for the same
-- page_id/live_section_id (or post_id/live_block_id) pair conflicts and is
-- skipped instead of inserting a duplicate. Only rows that shadow an
-- existing live row are constrained (live_section_id/live_block_id not
-- null) — a section/block created fresh during a draft session (before it
-- has ever been published) has live_*_id null and is never deduplicated
-- against, since there's nothing to accidentally reseed twice for those.
create unique index section_drafts_page_id_live_section_id_key
  on section_drafts (page_id, live_section_id)
  where live_section_id is not null;

create unique index block_drafts_post_id_live_block_id_key
  on block_drafts (post_id, live_block_id)
  where live_block_id is not null;
