-- Adds: site_settings (singleton key/value rows for the navbar + footer editors),
-- and deleted_blog_posts (soft-delete + 30-day purge for blog posts, mirroring
-- deleted_pages from 0001_init.sql / the purge job pattern from 0002_purge_cron.sql).
--
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).

-- ─── SITE SETTINGS (navbar + footer content, editable from admin) ──
create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

create policy "public read site_settings"
  on site_settings for select
  to anon
  using (true);

create policy "admin full access site_settings"
  on site_settings for all
  to authenticated
  using (true) with check (true);

-- Seed defaults matching the current hardcoded Nav.tsx / Footer.tsx content.
-- logoUrl is null so both components fall back to the bundled inline SVG mark
-- until an admin uploads a custom logo image.
insert into site_settings (key, value) values
  ('nav', '{
    "logoUrl": null,
    "logoAlt": "Digital Public Works",
    "ctaText": "Request a demo",
    "ctaLink": "/contact",
    "items": [
      {"id": "home", "label": "Home", "href": "/", "visible": true},
      {"id": "product", "label": "Product", "href": "/product", "visible": true},
      {"id": "impact", "label": "Impact", "href": "/impact", "visible": true},
      {"id": "insights", "label": "Insights", "href": "/insights", "visible": true},
      {"id": "about", "label": "About", "href": "/about", "visible": true},
      {"id": "careers", "label": "Careers", "href": "/careers", "visible": true},
      {"id": "contact", "label": "Contact", "href": "/contact", "visible": true}
    ]
  }'::jsonb),
  ('footer', '{
    "logoUrl": null,
    "logoAlt": "Digital Public Works",
    "ctaLabel": "Ready to pilot?",
    "ctaText": "Request a demo today",
    "ctaLink": "/contact",
    "tagline": "Digital Public Works is an independent 501(c)(3) nonprofit.",
    "email": "info@digitalpublicworks.org",
    "address": "2261 Market Street, Suite 32572, San Francisco, CA 94114",
    "links": [
      {"id": "privacy", "label": "Privacy Policy", "href": "/privacy"},
      {"id": "accessibility", "label": "Accessibility", "href": "/accessibility"}
    ]
  }'::jsonb)
on conflict (key) do nothing;

-- ─── DELETED BLOG POSTS (soft-delete + 30-day purge) ───────────────
create table deleted_blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  title text not null,
  snapshot jsonb not null,
  deleted_at timestamptz not null default now(),
  purge_at timestamptz not null default (now() + interval '30 days'),
  restored boolean not null default false
);

create index deleted_blog_posts_purge_at_idx on deleted_blog_posts (purge_at) where not restored;

alter table deleted_blog_posts enable row level security;

create policy "admin full access deleted_blog_posts"
  on deleted_blog_posts for all
  to authenticated
  using (true) with check (true);

-- ─── PURGE FUNCTION (blog posts) ───────────────────────────────────
create or replace function purge_deleted_blog_posts()
returns void as $$
begin
  delete from deleted_blog_posts
  where purge_at < now() and restored = false;
end;
$$ language plpgsql security definer;

-- Idempotent scheduling: unschedule any existing job of the same name first,
-- then schedule fresh (same pattern as 0002_purge_cron.sql's page purge job).
do $$
begin
  if exists (select 1 from cron.job where jobname = 'purge-deleted-blog-posts') then
    perform cron.unschedule('purge-deleted-blog-posts');
  end if;
end $$;

select cron.schedule('purge-deleted-blog-posts', '0 3 * * *', 'select purge_deleted_blog_posts();');
