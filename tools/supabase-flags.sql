-- Potato Quiz: question flags reported by players.
-- Run once in Supabase → SQL Editor. Safe to re-run.
-- The game (publishable key) can only ADD flags. Reading, filing and resolving them needs the secret key,
-- which lives only in the GitHub repo secret SUPABASE_SECRET_KEY (used by .github/workflows/question-flags.yml).

create table if not exists public.question_flags (
  id            uuid primary key,                       -- made by the game, so a retried send can't create a duplicate
  created_at    timestamptz not null default now(),
  question_id   text not null check (char_length(question_id) between 1 and 80),
  reason        text not null check (reason in ('wrong', 'confusing', 'easy', 'hard', 'outdated', 'other')),
  note          text check (char_length(note) <= 300),
  question      text check (char_length(question) <= 1000),
  answer        text check (char_length(answer) <= 400),
  category      text check (char_length(category) <= 150),
  tier          text check (char_length(tier) <= 60),
  source        text not null check (source in ('host', 'phone')),
  app_version   text check (char_length(app_version) <= 20),
  bank_version  int,
  status        text not null default 'new' check (status in ('new', 'filed', 'resolved', 'wontfix')),
  issue_number  int,
  resolved_at   timestamptz
);
create index if not exists question_flags_status on public.question_flags (status);
create index if not exists question_flags_issue on public.question_flags (issue_number);

alter table public.question_flags enable row level security;
revoke all on public.question_flags from anon, authenticated;
grant insert on public.question_flags to anon;

drop policy if exists "players can submit flags" on public.question_flags;
create policy "players can submit flags" on public.question_flags
  for insert to anon
  with check (status = 'new' and issue_number is null and resolved_at is null);
-- No select / update / delete policies for anon: the public site can't read or change flags.
