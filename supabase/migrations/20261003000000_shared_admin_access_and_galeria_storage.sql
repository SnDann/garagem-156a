-- Troca o RLS de "cada usuário só vê o próprio" para "qualquer admin
-- autenticado vê e edita tudo" — o acesso ao app é restrito a 2 admins
-- cadastrados manualmente, que compartilham a mesma coleção, não contas
-- isoladas de SaaS. A coluna user_id é mantida em cada tabela como
-- registro de quem criou o item (auditoria), com default auth.uid(),
-- mas deixa de ser usada para filtrar o acesso.
--
-- Nota de implementação: as policies antigas ("*_own") não foram
-- removidas no projeto em produção porque esta sessão não tinha
-- permissão para DROP POLICY; como políticas RLS permissivas são
-- combinadas por OR, basta adicionar as novas políticas "*_shared"
-- (mais amplas) para que o acesso compartilhado funcione — as antigas
-- seguem presentes mas redundantes. Em um banco novo, criado a partir
-- de supabase-schema.sql, só as políticas "*_shared" existem.

create policy "catalogo_select_shared" on public.catalogo for select using (auth.role() = 'authenticated');
create policy "catalogo_insert_shared" on public.catalogo for insert with check (auth.role() = 'authenticated');
create policy "catalogo_update_shared" on public.catalogo for update using (auth.role() = 'authenticated');
create policy "catalogo_delete_shared" on public.catalogo for delete using (auth.role() = 'authenticated');
alter table public.catalogo alter column user_id set default auth.uid();

create policy "wishlist_select_shared" on public.wishlist for select using (auth.role() = 'authenticated');
create policy "wishlist_insert_shared" on public.wishlist for insert with check (auth.role() = 'authenticated');
create policy "wishlist_update_shared" on public.wishlist for update using (auth.role() = 'authenticated');
create policy "wishlist_delete_shared" on public.wishlist for delete using (auth.role() = 'authenticated');
alter table public.wishlist alter column user_id set default auth.uid();

create policy "checklists_select_shared" on public.checklists for select using (auth.role() = 'authenticated');
create policy "checklists_insert_shared" on public.checklists for insert with check (auth.role() = 'authenticated');
create policy "checklists_update_shared" on public.checklists for update using (auth.role() = 'authenticated');
create policy "checklists_delete_shared" on public.checklists for delete using (auth.role() = 'authenticated');
alter table public.checklists alter column user_id set default auth.uid();

create policy "checklist_alvos_select_shared" on public.checklist_alvos for select using (auth.role() = 'authenticated');
create policy "checklist_alvos_insert_shared" on public.checklist_alvos for insert with check (auth.role() = 'authenticated');
create policy "checklist_alvos_update_shared" on public.checklist_alvos for update using (auth.role() = 'authenticated');
create policy "checklist_alvos_delete_shared" on public.checklist_alvos for delete using (auth.role() = 'authenticated');
alter table public.checklist_alvos alter column user_id set default auth.uid();

create policy "pedidos_select_shared" on public.pedidos for select using (auth.role() = 'authenticated');
create policy "pedidos_insert_shared" on public.pedidos for insert with check (auth.role() = 'authenticated');
create policy "pedidos_update_shared" on public.pedidos for update using (auth.role() = 'authenticated');
create policy "pedidos_delete_shared" on public.pedidos for delete using (auth.role() = 'authenticated');
alter table public.pedidos alter column user_id set default auth.uid();

create policy "clientes_select_shared" on public.clientes for select using (auth.role() = 'authenticated');
create policy "clientes_insert_shared" on public.clientes for insert with check (auth.role() = 'authenticated');
create policy "clientes_update_shared" on public.clientes for update using (auth.role() = 'authenticated');
create policy "clientes_delete_shared" on public.clientes for delete using (auth.role() = 'authenticated');
alter table public.clientes alter column user_id set default auth.uid();

create policy "galeria_select_shared" on public.galeria for select using (auth.role() = 'authenticated');
create policy "galeria_insert_shared" on public.galeria for insert with check (auth.role() = 'authenticated');
create policy "galeria_update_shared" on public.galeria for update using (auth.role() = 'authenticated');
create policy "galeria_delete_shared" on public.galeria for delete using (auth.role() = 'authenticated');
alter table public.galeria alter column user_id set default auth.uid();

-- Bucket de Storage para fotos reais da Galeria (antes só previsto, agora em uso)
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
