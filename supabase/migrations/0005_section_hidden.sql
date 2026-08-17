-- Adds a per-section visibility toggle. Hidden sections stay in the DB (and
-- editable in admin) but are filtered out of public page rendering by
-- lib/sections.ts's getPageSections().
alter table sections
  add column if not exists hidden boolean not null default false;
