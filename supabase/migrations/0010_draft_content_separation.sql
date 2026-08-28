-- Fixes "Save draft" doing nothing different from "Publish" on a page/post
-- that's already published: both wrote straight to the live sections/
-- blog_blocks rows the public site reads, so any edit went live immediately
-- regardless of which button was clicked. This adds a genuine draft/live
-- separation for already-published content:
--   - section_drafts / block_drafts shadow sections/blog_blocks 1:1 while a
--     page/post is being edited post-publish. live_section_id/live_block_id
--     is null for a section/block created (and not yet published) during the
--     current draft session, and set for a row that shadows an existing live
--     row. `deleted` tombstones a live row pending removal on publish.
--   - pages.draft_meta / blog_posts.draft_meta hold a pending snapshot of
--     title/SEO-style fields for the same reason, as a jsonb blob rather than
--     several nullable scalar columns (avoids ambiguous null-vs-unset
--     semantics across five-plus fields). null = no pending override.
-- Both are populated lazily (only once a page/post that's already published
-- is opened/edited in admin) and cleared after a successful publish, so a
-- page/post that has never been published, or never re-edited since this
-- shipped, is completely unaffected. Additive-only: two new tables, two new
-- nullable columns. No drops, no rewrites of existing columns/constraints.

alter table pages add column draft_meta jsonb;
alter table blog_posts add column draft_meta jsonb;

create table section_drafts (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references pages(id) on delete cascade,
  live_section_id uuid references sections(id) on delete set null,
  type text not null check (type in (
    'hero', 'stats', 'photo-text', 'steps', 'voices', 'partners',
    'cta', 'team-member', 'text', 'content-cards', 'comparison', 'case-study',
    'icon-cards', 'home-compare-table', 'product-problem-accordion',
    'product-talk-cta', 'product-compare-table', 'product-vendor-questions',
    'impact-manual-table', 'impact-year-in-review', 'contact-form-section',
    'accordion', 'image', 'careers-intro', 'careers-openings'
  )),
  position integer not null default 0,
  name text not null default '',
  background_color text,
  content jsonb not null default '{}'::jsonb,
  hidden boolean not null default false,
  deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index section_drafts_page_id_position_idx on section_drafts (page_id, position);

create trigger section_drafts_set_updated_at
  before update on section_drafts
  for each row execute function set_updated_at();

create table block_drafts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references blog_posts(id) on delete cascade,
  live_block_id uuid references blog_blocks(id) on delete set null,
  type text not null check (type in ('heading', 'paragraph', 'quote', 'photo')),
  position integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index block_drafts_post_id_position_idx on block_drafts (post_id, position);

create trigger block_drafts_set_updated_at
  before update on block_drafts
  for each row execute function set_updated_at();

-- RLS: admin (service-role, used by lib/admin/pages.ts and lib/admin/blog.ts)
-- always bypasses RLS, so this is defense-in-depth, not the actual gate —
-- the real guarantee is that no public route ever queries these tables.
-- No anon policy at all: unlike every other table, nothing here should ever
-- be readable by an unauthenticated request.
alter table section_drafts enable row level security;
alter table block_drafts enable row level security;

create policy "admin full access section_drafts"
  on section_drafts for all
  to authenticated
  using (true) with check (true);

create policy "admin full access block_drafts"
  on block_drafts for all
  to authenticated
  using (true) with check (true);
