create table public.fde_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null default '{}'::jsonb check (jsonb_typeof(progress) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.fde_progress enable row level security;

revoke all on table public.fde_progress from anon, authenticated;
grant select, insert, update on table public.fde_progress to authenticated;

create policy "Users can read their own progress"
  on public.fde_progress for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own progress"
  on public.fde_progress for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own progress"
  on public.fde_progress for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
