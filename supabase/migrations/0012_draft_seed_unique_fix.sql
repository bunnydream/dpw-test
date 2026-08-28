-- Fixes 0011_draft_seed_dedup.sql: it created *partial* unique indexes
-- (`where live_section_id is not null` / `where live_block_id is not
-- null`), but a plain `insert ... on conflict (columns) do ...` clause
-- (which is what Supabase's `.upsert(rows, { onConflict: "col1,col2" })`
-- produces via PostgREST) can only infer a partial index as its arbiter
-- when the same `where` predicate is repeated in the `on conflict` clause
-- itself. Since the application code has no way to add that predicate, the
-- partial indexes were never usable as upsert targets, causing "there is no
-- unique or exclusion constraint matching the ON CONFLICT specification" on
-- every ensureDraftSections/ensureDraftBlocks seed attempt.
--
-- The partial predicate was never actually necessary: Postgres treats each
-- NULL as distinct under a standard (non-partial) unique constraint (no
-- NULLS NOT DISTINCT used here), so section_drafts/block_drafts rows with
-- live_section_id/live_block_id still NULL — sections/blocks created fresh
-- in a draft session, never yet published — continue to coexist without
-- conflicting each other under a full unique constraint, exactly as under
-- the partial index. Replacing with full unique constraints on the same
-- column pairs fixes the ON CONFLICT matching with no other behavior change.
drop index section_drafts_page_id_live_section_id_key;
drop index block_drafts_post_id_live_block_id_key;

alter table section_drafts
  add constraint section_drafts_page_id_live_section_id_key unique (page_id, live_section_id);

alter table block_drafts
  add constraint block_drafts_post_id_live_block_id_key unique (post_id, live_block_id);
