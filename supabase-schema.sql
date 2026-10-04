-- Garagem 156A — Schema Supabase
-- Execute este arquivo inteiro no SQL Editor do seu projeto Supabase
-- (Dashboard → SQL Editor → New query → cole tudo → Run).
--
-- Acesso compartilhado entre admins: qualquer usuário autenticado (os
-- admins cadastrados manualmente em Authentication → Users) vê e edita
-- todos os registros — não é um modelo de 1 conta por cliente. A coluna
-- user_id é mantida em cada tabela apenas como registro de quem criou
-- o item (auditoria) e tem default auth.uid(), mas não filtra o acesso.

-- ============================================================
-- CATÁLOGO
-- ============================================================
create table if not exists public.catalogo (
  id            bigint generated always as identity primary key,
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  marca         text not null,
  modelo        text not null,
  escala        text not null default '1:43',
  ano           integer,
  fabricante    text,
  tema          text not null,
  valor_compra  numeric(12,2) not null default 0,
  valor_estimado numeric(12,2) not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.catalogo enable row level security;

create policy "catalogo_select_shared" on public.catalogo
  for select using (auth.role() = 'authenticated');
create policy "catalogo_insert_shared" on public.catalogo
  for insert with check (auth.role() = 'authenticated');
create policy "catalogo_update_shared" on public.catalogo
  for update using (auth.role() = 'authenticated');
create policy "catalogo_delete_shared" on public.catalogo
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- WISHLIST
-- ============================================================
create table if not exists public.wishlist (
  id             bigint generated always as identity primary key,
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  marca          text not null,
  modelo         text not null,
  escala         text not null default '1:43',
  tema           text not null,
  prioridade     text not null default 'Média',
  valor_estimado numeric(12,2) not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.wishlist enable row level security;

create policy "wishlist_select_shared" on public.wishlist
  for select using (auth.role() = 'authenticated');
create policy "wishlist_insert_shared" on public.wishlist
  for insert with check (auth.role() = 'authenticated');
create policy "wishlist_update_shared" on public.wishlist
  for update using (auth.role() = 'authenticated');
create policy "wishlist_delete_shared" on public.wishlist
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- CHECKLISTS (grupos) + CHECKLIST_ALVOS (itens de cada grupo)
-- ============================================================
create table if not exists public.checklists (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tema       text not null,
  nome       text not null,
  created_at timestamptz not null default now()
);

alter table public.checklists enable row level security;

create policy "checklists_select_shared" on public.checklists
  for select using (auth.role() = 'authenticated');
create policy "checklists_insert_shared" on public.checklists
  for insert with check (auth.role() = 'authenticated');
create policy "checklists_update_shared" on public.checklists
  for update using (auth.role() = 'authenticated');
create policy "checklists_delete_shared" on public.checklists
  for delete using (auth.role() = 'authenticated');

create table if not exists public.checklist_alvos (
  id           bigint generated always as identity primary key,
  checklist_id bigint not null references public.checklists (id) on delete cascade,
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  marca        text not null,
  chave        text not null,
  created_at   timestamptz not null default now()
);

alter table public.checklist_alvos enable row level security;

create policy "checklist_alvos_select_shared" on public.checklist_alvos
  for select using (auth.role() = 'authenticated');
create policy "checklist_alvos_insert_shared" on public.checklist_alvos
  for insert with check (auth.role() = 'authenticated');
create policy "checklist_alvos_update_shared" on public.checklist_alvos
  for update using (auth.role() = 'authenticated');
create policy "checklist_alvos_delete_shared" on public.checklist_alvos
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- PEDIDOS (trocas e vendas)
-- ============================================================
create table if not exists public.pedidos (
  id           bigint generated always as identity primary key,
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tipo         text not null default 'Venda',
  peca         text not null,
  contraparte  text not null,
  valor        numeric(12,2) not null default 0,
  status       text not null default 'Pendente',
  data         date,
  created_at   timestamptz not null default now()
);

alter table public.pedidos enable row level security;

create policy "pedidos_select_shared" on public.pedidos
  for select using (auth.role() = 'authenticated');
create policy "pedidos_insert_shared" on public.pedidos
  for insert with check (auth.role() = 'authenticated');
create policy "pedidos_update_shared" on public.pedidos
  for update using (auth.role() = 'authenticated');
create policy "pedidos_delete_shared" on public.pedidos
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- CLIENTES (assinantes)
-- ============================================================
create table if not exists public.clientes (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome       text not null,
  email      text not null,
  plano      text not null default 'Mensal',
  status     text not null default 'Ativo',
  inicio     date,
  valor_pago numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.clientes enable row level security;

create policy "clientes_select_shared" on public.clientes
  for select using (auth.role() = 'authenticated');
create policy "clientes_insert_shared" on public.clientes
  for insert with check (auth.role() = 'authenticated');
create policy "clientes_update_shared" on public.clientes
  for update using (auth.role() = 'authenticated');
create policy "clientes_delete_shared" on public.clientes
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- GALERIA
-- ============================================================
create table if not exists public.galeria (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo     text not null,
  local      text,
  tema       text,
  foto_url   text,
  created_at timestamptz not null default now()
);

alter table public.galeria enable row level security;

create policy "galeria_select_shared" on public.galeria
  for select using (auth.role() = 'authenticated');
create policy "galeria_insert_shared" on public.galeria
  for insert with check (auth.role() = 'authenticated');
create policy "galeria_update_shared" on public.galeria
  for update using (auth.role() = 'authenticated');
create policy "galeria_delete_shared" on public.galeria
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- Índices úteis
-- ============================================================
create index if not exists idx_catalogo_user      on public.catalogo (user_id);
create index if not exists idx_wishlist_user       on public.wishlist (user_id);
create index if not exists idx_checklists_user     on public.checklists (user_id);
create index if not exists idx_checklist_alvos_chk on public.checklist_alvos (checklist_id);
create index if not exists idx_pedidos_user        on public.pedidos (user_id);
create index if not exists idx_clientes_user       on public.clientes (user_id);
create index if not exists idx_galeria_user        on public.galeria (user_id);

-- ============================================================
-- Storage bucket para a Galeria (fotos reais) — compartilhado entre admins
-- ============================================================
insert into storage.buckets (id, name, public) values ('galeria', 'galeria', true)
on conflict (id) do nothing;

create policy "galeria_storage_read_shared" on storage.objects
  for select using (bucket_id = 'galeria' and auth.role() = 'authenticated');
create policy "galeria_storage_insert_shared" on storage.objects
  for insert with check (bucket_id = 'galeria' and auth.role() = 'authenticated');
create policy "galeria_storage_update_shared" on storage.objects
  for update using (bucket_id = 'galeria' and auth.role() = 'authenticated');
create policy "galeria_storage_delete_shared" on storage.objects
  for delete using (bucket_id = 'galeria' and auth.role() = 'authenticated');
