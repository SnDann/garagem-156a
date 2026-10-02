// Cliente Supabase — Garagem 156A
//
// Configuração via variáveis de ambiente (Vite):
//   VITE_SUPABASE_URL=https://xxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
//
// Essas chaves são públicas por design (a "anon key" é protegida pelas
// políticas de Row Level Security definidas em schema.sql — nunca use a
// service_role key no frontend).
//
// Crie um arquivo .env na raiz do projeto com as duas variáveis acima.
// Veja SETUP-SUPABASE.md para o passo a passo completo.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env (veja SETUP-SUPABASE.md).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
