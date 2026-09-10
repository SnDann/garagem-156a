import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LOGO_DATA_URI = '/logo-garagem-156a.png';
const LOGIN_BACKGROUND = '/garagem-156a-login.png';

export default function Login({ onLogin, globalStyle }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Limpa a mensagem de erro ao digitar
  function limparErro() {
    if (erro) setErro('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const emailLimpo = email.trim();

    // Validações
    if (!emailLimpo || !senha) {
      setErro('Informe seu e-mail e sua senha para entrar.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) {
      setErro('Digite um e-mail válido.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setErro('');
    setCarregando(true);

    try {
      await onLogin(emailLimpo, senha);
    } catch (err) {
      setErro(err?.message || 'Não foi possível entrar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center relative overflow-hidden"
      style={{ background: '#050608', color: '#f3f2f5' }}
    >
      <style>{globalStyle}</style>

      {/* Painel esquerdo — formulário */}
      <section
        className="relative z-10 w-full md:w-1/2 min-h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-28 py-12"
        style={{ background: '#050608' }}
      >
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div
              className="flex items-center justify-center w-28 h-14 rounded-xl"
              style={{ background: '#17191e', border: '1px solid #30333c' }}
            >
              <img
                src={LOGO_DATA_URI}
                alt="Garagem 156A"
                className="w-24 h-12 object-contain"
              />
            </div>
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: '#757987' }}
            >
              Coleção
            </span>
          </div>

          {/* Título */}
          <p
            className="text-xs uppercase tracking-[0.3em] mb-3"
            style={{ color: '#a45bb5' }}
          >
            Garagem 156A
          </p>
          <h1
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-12"
            style={{ color: '#f1f0f3' }}
          >
            Faça seu login<span style={{ color: '#c879c8' }}>.</span>
          </h1>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* E-mail */}
            <label className="block">
              <span className="block text-sm mb-3" style={{ color: '#d1d0d5' }}>
                E-mail
              </span>
              <div
                className="p-px rounded-xl"
                style={{
                  background:
                    'linear-gradient(110deg, #385dff, #a244c0 52%, #f4b72f)',
                }}
              >
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    limparErro();
                  }}
                  disabled={carregando}
                  className="w-full rounded-[11px] px-4 py-4 text-sm outline-none disabled:opacity-60"
                  style={{ background: '#111214', color: '#f3f2f5' }}
                />
              </div>
            </label>

            {/* Senha */}
            <label className="block">
              <span className="block text-sm mb-3" style={{ color: '#d1d0d5' }}>
                Senha
              </span>
              <div
                className="relative p-px rounded-xl"
                style={{
                  background:
                    'linear-gradient(110deg, #385dff, #a244c0 52%, #f4b72f)',
                }}
              >
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(event) => {
                    setSenha(event.target.value);
                    limparErro();
                  }}
                  disabled={carregando}
                  className="w-full rounded-[11px] px-4 py-4 pr-12 text-sm outline-none disabled:opacity-60"
                  style={{ background: '#111214', color: '#f3f2f5' }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((value) => !value)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={mostrarSenha}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: '#8b8d98' }}
                >
                  {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            {/* Esqueci minha senha */}
            <button
              type="button"
              className="block text-sm underline underline-offset-2 cursor-pointer"
              style={{ color: '#f0edf2' }}
            >
              Esqueci minha senha
            </button>

            {/* Mensagem de erro */}
            {erro && (
              <p
                role="alert"
                aria-live="polite"
                className="text-xs"
                style={{ color: '#ec7777' }}
              >
                {erro}
              </p>
            )}

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full px-6 py-4 rounded-xl font-semibold text-lg transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background:
                  'linear-gradient(105deg, #4655d6, #a347b4 48%, #d09b61)',
                color: '#f7edf4',
              }}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Criar conta */}
          <button
            type="button"
            className="block mx-auto mt-9 text-sm underline underline-offset-2 cursor-pointer"
            style={{ color: '#f0edf2' }}
          >
            Ainda não tenho uma conta
          </button>
        </div>

        {/* Rodapé */}
        <p
          className="text-xs text-center mt-auto pt-10"
          style={{ color: '#d4d2d7' }}
        >
          156A · colecionar é contar histórias
        </p>
      </section>

      {/* Painel direito — imagem */}
      <section
        className="hidden md:block absolute inset-y-0 right-0 w-1/2 overflow-hidden"
        style={{
          background:
            'linear-gradient(145deg, #eef0ed 0%, #cbd3d4 58%, #8b9aa5 100%)',
        }}
        aria-hidden="true"
      >
        <img
          src={LOGIN_BACKGROUND}
          alt=""
          className="w-full h-full object-contain"
          style={{
            objectPosition: 'center',
            opacity: 1,
            filter: 'drop-shadow(0 18px 22px rgba(5,6,8,.28))',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(5,6,8,.68) 0%, rgba(5,6,8,.18) 25%, rgba(5,6,8,0) 58%)',
          }}
        />
      </section>
    </div>
  );
}