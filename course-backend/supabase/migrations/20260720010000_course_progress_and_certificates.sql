create table public.course_progress (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  course_version text not null,
  lesson_id text not null,
  video_completed_at timestamptz,
  questions_answered integer not null default 0 check (questions_answered >= 0),
  question_score numeric(5,2) check (question_score between 0 and 100),
  question_answers jsonb not null default '{}'::jsonb,
  questions_submitted_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_version, lesson_id),
  check (char_length(course_version) between 1 and 120),
  check (char_length(lesson_id) between 1 and 120),
  check (pg_column_size(question_answers) <= 32768)
);

create index course_progress_user_version_idx
  on public.course_progress (user_id, course_version);

create table public.course_certificate_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  course_version text not null check (char_length(course_version) between 1 and 120),
  display_name text not null check (char_length(display_name) between 2 and 120),
  contact_email text not null check (char_length(contact_email) between 3 and 255),
  profile_url text check (profile_url is null or char_length(profile_url) <= 2048),
  capstone_url text not null check (char_length(capstone_url) between 8 and 2048),
  capstone_commit text not null check (char_length(capstone_commit) between 7 and 64),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  decision_message text check (decision_message is null or char_length(decision_message) <= 4000),
  certificate_id text unique,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  issued_at timestamptz
);

create unique index one_pending_course_certificate_request
  on public.course_certificate_requests (user_id, course_version)
  where status = 'pending';

create or replace function public.set_course_progress_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_course_progress_updated_at
  before update on public.course_progress
  for each row
  execute function public.set_course_progress_updated_at();

alter table public.course_progress enable row level security;
alter table public.course_certificate_requests enable row level security;

revoke all on public.course_progress from anon;
revoke all on public.course_certificate_requests from anon;

grant select, insert, update, delete on public.course_progress to authenticated;
grant select, insert on public.course_certificate_requests to authenticated;

create policy "Learners read own course progress"
on public.course_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Learners insert own course progress"
on public.course_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Learners update own course progress"
on public.course_progress
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Learners reset own course progress"
on public.course_progress
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Learners read own certificate requests"
on public.course_certificate_requests
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Learners submit pending certificate requests"
on public.course_certificate_requests
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
  and decision_message is null
  and certificate_id is null
  and reviewed_at is null
  and issued_at is null
);
