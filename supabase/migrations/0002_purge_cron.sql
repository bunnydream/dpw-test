-- Scheduled 30-day purge job for deleted_pages.
--
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query),
-- same as supabase/migrations/0001_init.sql — there is no local DB/CLI access
-- to run migrations automatically in this environment.
--
-- pg_cron runs jobs against the database it's installed in, using whatever
-- role owns the job (here, whoever runs this script, typically postgres/
-- the project owner via the SQL Editor), so it bypasses RLS same as the
-- service-role client used elsewhere in the app.

create extension if not exists pg_cron;

-- ─── PURGE FUNCTION ─────────────────────────────────────────────────
-- Mirrors the logic in purgeExpiredDeletedPages() (lib/admin/deleted-pages.ts):
-- hard-delete deleted_pages rows whose 30-day retention window has passed
-- and that were never restored.
create or replace function purge_deleted_pages()
returns void as $$
begin
  delete from deleted_pages
  where purge_at < now()
    and restored = false;
end;
$$ language plpgsql security definer;

-- ─── SCHEDULE (idempotent) ──────────────────────────────────────────
-- Unschedule any existing job with the same name first, then schedule
-- fresh, so this file can be safely re-run without creating duplicate
-- cron jobs.
select cron.unschedule(jobid)
from cron.job
where jobname = 'purge-deleted-pages';

select cron.schedule(
  'purge-deleted-pages',
  '0 3 * * *', -- daily at 3am
  $$ select purge_deleted_pages(); $$
);
