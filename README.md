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

O app usa Supabase (Auth + Postgres) com um schema relacional — uma tabela por
entidade, todas com Row Level Security restringindo cada usuário aos próprios
registros:

- `catalogo`, `wishlist`, `checklists` + `checklist_alvos`, `pedidos`,
  `clientes`, `galeria`

O SQL completo está em `supabase-schema.sql` (e, com o mesmo conteúdo, em
`supabase/migrations/` para quem usa a CLI do Supabase). Para provisionar em
outro projeto Supabase:

1. Crie um projeto em https://supabase.com.
2. Rode o SQL de `supabase-schema.sql` no SQL Editor.
3. Preencha `.env` com a URL e a chave anon do seu projeto (**Project Settings
   → API**).
4. Crie o primeiro usuário em **Authentication → Users → Add user** (marque
   **Auto Confirm User**) — não há auto-cadastro na tela de login.

Login, logout, troca de senha e todo o CRUD das sete seções do app conversam
direto com o Supabase (sem fallback local).
