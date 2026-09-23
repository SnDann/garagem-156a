create table if not exists public.garagem_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.garagem_states enable row level security;

create policy "Users can read their own garagem state"
  on public.garagem_states
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own garagem state"
  on public.garagem_states
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own garagem state"
  on public.garagem_states
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
