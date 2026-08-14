-- Adds author + subtitle to blog_posts. Both nullable — existing posts get
-- null (author shows as "Digital Public Works" fallback in the UI; subtitle
-- just doesn't render).
--
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).

alter table blog_posts
  add column if not exists author text,
  add column if not exists subtitle text;
