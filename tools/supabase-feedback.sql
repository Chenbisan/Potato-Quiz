-- Potato Quiz: player feedback, plus spam limits for feedback and question flags.
-- Run once in Supabase → SQL Editor, after supabase-flags.sql. Safe to re-run.
-- Like flags, the game (publishable key) can only ADD feedback. The GitHub Action (secret key) files it as issues.

create table if not exists public.player_feedback (
  id            uuid primary key,                       -- made by the game, so a retried send can't create a duplicate
  created_at    timestamptz not null default now(),
  kind          text not null check (kind in ('suggestion', 'bug', 'other')),
  message       text not null check (char_length(message) between 3 and 1000),
  source        text not null check (source in ('menu', 'game', 'phone')),
  app_version   text check (char_length(app_version) <= 20),
  status        text not null default 'new' check (status in ('new', 'filed', 'resolved', 'wontfix')),
  issue_number  int,
  resolved_at   timestamptz
);
create index if not exists player_feedback_status on public.player_feedback (status);
create index if not exists player_feedback_issue on public.player_feedback (issue_number);
create index if not exists player_feedback_created on public.player_feedback (created_at);
create index if not exists question_flags_created on public.question_flags (created_at);

alter table public.player_feedback enable row level security;
revoke all on public.player_feedback from anon, authenticated;
grant insert on public.player_feedback to anon;

drop policy if exists "players can submit feedback" on public.player_feedback;
create policy "players can submit feedback" on public.player_feedback
  for insert to anon
  with check (status = 'new' and issue_number is null and resolved_at is null);
-- No select / update / delete policies for anon: the public site can't read or change feedback.

-- Spam guard for anything sent from the public site:
--  • the server sets the time and status, so a sender can't backdate rows or mark them handled
--  • each table takes at most 30 new rows per 10 minutes from the public site, which is far more than real players
--    send, but stops a script from flooding the table (and the GitHub issues made from it)
-- (The GitHub Action only updates rows, so these insert checks never get in its way.)
create or replace function public.pq_guard_insert() returns trigger
language plpgsql security definer set search_path = public as $$
declare recent int;
begin
  new.created_at := now(); new.status := 'new'; new.issue_number := null; new.resolved_at := null;
  execute format('select count(*) from %I.%I where created_at > now() - interval ''10 minutes''', tg_table_schema, tg_table_name) into recent;
  if recent >= 30 then raise exception 'Too many reports right now. Please try again later.' using errcode = 'P0001'; end if;
  return new;
end $$;
revoke all on function public.pq_guard_insert() from public, anon, authenticated;

drop trigger if exists pq_guard on public.player_feedback;
create trigger pq_guard before insert on public.player_feedback for each row execute function public.pq_guard_insert();
drop trigger if exists pq_guard on public.question_flags;
create trigger pq_guard before insert on public.question_flags for each row execute function public.pq_guard_insert();
