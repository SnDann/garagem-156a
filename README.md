# Garagem 156A

Aplicacao React/Vite para organizar uma colecao de miniaturas.

## Rodar localmente

```bash
npm install
npm run dev
```

Os dados do catalogo, wishlist, checklist, pedidos e clientes sao persistidos no `localStorage` do navegador. Para limpar os dados locais, use as ferramentas de armazenamento do navegador e remova a chave `garagem-156a-state-v1`.

A imagem opcional da marca deve ficar em `public/logo-garagem-156a.png`.

## Supabase Auth + banco

O app funciona em modo local quando as variáveis abaixo estão vazias. Para usar autenticação e sincronização em nuvem:

1. Crie um projeto no Supabase.
2. Rode o SQL de `supabase-schema.sql` no SQL Editor do Supabase.
3. Preencha `.env.local`:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

Depois reinicie o servidor Vite. Com Supabase configurado, login, cadastro, recuperação de senha e dados da garagem passam a usar Auth + Postgres com RLS.
