# Garagem 156A

Aplicação React/Vite para gerenciar uma coleção de miniaturas diecast: catálogo,
wishlist, checklist por tema, calculadora de valorização, pedidos (trocas e
vendas), clientes assinantes e galeria.

## Rodar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

O `.env.example` já traz a URL e a chave anon (publicável, protegida por Row
Level Security) do projeto Supabase em uso. Copie para `.env` e rode.

## Arquitetura de dados

O app usa Supabase (Auth + Postgres + Storage) com um schema relacional — uma
tabela por entidade, todas com Row Level Security:

- `catalogo`, `wishlist`, `checklists` + `checklist_alvos`, `pedidos`,
  `clientes`, `galeria`

Acesso é restrito a admins cadastrados manualmente (hoje, 2 contas) que
**compartilham a mesma coleção** — qualquer admin autenticado vê e edita
todos os registros, não é um modelo de 1 conta isolada por cliente. A coluna
`user_id` de cada tabela só registra quem criou o item (auditoria).

A Galeria guarda fotos reais no bucket `galeria` do Supabase Storage (upload
pela própria tela do app, sem placeholder).

O SQL completo está em `supabase-schema.sql` (e, com o mesmo conteúdo, em
`supabase/migrations/` para quem usa a CLI do Supabase). Para provisionar em
outro projeto Supabase:

1. Crie um projeto em https://supabase.com.
2. Rode o SQL de `supabase-schema.sql` no SQL Editor (já inclui o bucket de
   Storage da Galeria e as políticas de acesso compartilhado).
3. Preencha `.env` com a URL e a chave anon do seu projeto (**Project Settings
   → API**).
4. Crie as contas de admin em **Authentication → Users → Add user** (marque
   **Auto Confirm User**) — não há auto-cadastro na tela de login.

Login, logout, troca de senha e todo o CRUD das sete seções do app conversam
direto com o Supabase (sem fallback local).
