import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, X, Pencil, Trash2, Check, Camera, ArrowUpRight, ArrowDownRight, Calculator, Package, Users, RotateCcw, LogOut } from 'lucide-react';
import Login from './Login.jsx';

const LOGO_DATA_URI = '/logo-garagem-156a.png';
const ON_PINK = '#2B0F1A';

const LIVERY = ['#D91E36', '#FF8000', '#00A19C', '#1E3D8F', '#2293D1', '#B6BABD', '#7A1FA0', '#F2A900'];
const ESCALAS = ['1:18', '1:24', '1:36', '1:43', '1:64', 'Outra'];
const TEMAS = ['F1', 'Carros Nacionais', 'Filmes', 'GT/Endurance'];

function liveryFor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return LIVERY[Math.abs(hash) % LIVERY.length];
}
function code(id) { return `156A·${String(id).padStart(3, '0')}`; }

const SEED_CATALOGO = [
  { id: 1, marca: 'Ferrari', modelo: 'SF-24 #16 Leclerc', escala: '1:43', ano: 2024, fabricante: 'Bburago', tema: 'F1', valorCompra: 189, valorEstimado: 210 },
  { id: 2, marca: 'McLaren', modelo: 'MCL38 #4 Norris', escala: '1:18', ano: 2024, fabricante: 'Minichamps', tema: 'F1', valorCompra: 890, valorEstimado: 950 },
  { id: 3, marca: 'Red Bull Racing', modelo: 'RB20 #1 Verstappen', escala: '1:43', ano: 2024, fabricante: 'Spark', tema: 'F1', valorCompra: 220, valorEstimado: 260 },
  { id: 4, marca: 'Mercedes-AMG', modelo: 'W15 #63 Russell', escala: '1:43', ano: 2024, fabricante: 'Minichamps', tema: 'F1', valorCompra: 195, valorEstimado: 195 },
  { id: 5, marca: 'Volkswagen', modelo: 'Fusca 1970', escala: '1:24', ano: 1970, fabricante: 'Bburago', tema: 'Carros Nacionais', valorCompra: 120, valorEstimado: 150 },
  { id: 6, marca: 'Chevrolet', modelo: 'Opala SS 1976', escala: '1:43', ano: 1976, fabricante: 'IXO', tema: 'Carros Nacionais', valorCompra: 180, valorEstimado: 240 },
  { id: 7, marca: 'Puma', modelo: 'GTE 1600', escala: '1:43', ano: 1975, fabricante: 'IXO', tema: 'Carros Nacionais', valorCompra: 160, valorEstimado: 175 },
  { id: 8, marca: 'DeLorean', modelo: 'DMC-12', escala: '1:24', ano: 1985, fabricante: 'Welly', tema: 'Filmes', valorCompra: 140, valorEstimado: 210 },
  { id: 9, marca: 'Aston Martin', modelo: 'DB5 007', escala: '1:36', ano: 1964, fabricante: 'Corgi', tema: 'Filmes', valorCompra: 210, valorEstimado: 260 },
  { id: 10, marca: 'Ford', modelo: 'GT40 Mk II', escala: '1:18', ano: 1966, fabricante: 'Autoart', tema: 'GT/Endurance', valorCompra: 750, valorEstimado: 820 },
  { id: 11, marca: 'Porsche', modelo: '917K Gulf', escala: '1:43', ano: 1970, fabricante: 'Spark', tema: 'GT/Endurance', valorCompra: 165, valorEstimado: 200 },
  { id: 12, marca: 'Toyota', modelo: 'GR010 Hybrid', escala: '1:43', ano: 2023, fabricante: 'Spark', tema: 'GT/Endurance', valorCompra: 175, valorEstimado: 175 },
];

const SEED_WISHLIST = [
  { id: 101, marca: 'Lamborghini', modelo: 'Countach LP5000', escala: '1:18', tema: 'GT/Endurance', prioridade: 'Alta', valorEstimado: 680 },
  { id: 102, marca: 'Ferrari', modelo: 'F40', escala: '1:18', tema: 'Filmes', prioridade: 'Média', valorEstimado: 590 },
  { id: 103, marca: 'Williams', modelo: 'FW14B Senna Test', escala: '1:43', tema: 'F1', prioridade: 'Alta', valorEstimado: 240 },
];

const SEED_CHECKLISTS = [
  { tema: 'F1', nome: 'Grid 2024', alvos: [
    { marca: 'Ferrari', chave: 'Leclerc' }, { marca: 'Ferrari', chave: 'Sainz' },
    { marca: 'McLaren', chave: 'Norris' }, { marca: 'McLaren', chave: 'Piastri' },
    { marca: 'Red Bull Racing', chave: 'Verstappen' }, { marca: 'Red Bull Racing', chave: 'Perez' },
    { marca: 'Mercedes-AMG', chave: 'Hamilton' }, { marca: 'Mercedes-AMG', chave: 'Russell' },
    { marca: 'Aston Martin', chave: 'Alonso' }, { marca: 'Williams', chave: 'Albon' },
  ]},
  { tema: 'Carros Nacionais', nome: 'Clássicos BR', alvos: [
    { marca: 'Volkswagen', chave: 'Fusca' }, { marca: 'Chevrolet', chave: 'Opala' },
    { marca: 'Puma', chave: 'GTE' }, { marca: 'Volkswagen', chave: 'Brasília' },
    { marca: 'Ford', chave: 'Maverick' }, { marca: 'Gurgel', chave: 'X12' },
  ]},
  { tema: 'Filmes', nome: 'Ícones de Tela', alvos: [
    { marca: 'DeLorean', chave: 'DMC-12' }, { marca: 'Aston Martin', chave: 'DB5' },
    { marca: 'DC', chave: 'Batmobile' }, { marca: 'Cadillac', chave: 'Ecto-1' },
    { marca: 'Dodge', chave: 'Charger' },
  ]},
  { tema: 'GT/Endurance', nome: 'Lendas de Le Mans', alvos: [
    { marca: 'Ford', chave: 'GT40' }, { marca: 'Porsche', chave: '917K' },
    { marca: 'Toyota', chave: 'GR010' }, { marca: 'Ferrari', chave: '250 GTO' },
    { marca: 'Jaguar', chave: 'XJR-9' },
  ]},
];

const GALERIA = [
  { titulo: 'Vitrine Principal', local: 'Sala', tema: 'F1' },
  { titulo: 'Estante F1 2024', local: 'Escritório', tema: 'F1' },
  { titulo: 'Prateleira Nacionais', local: 'Garagem', tema: 'Carros Nacionais' },
  { titulo: 'Coleção Filmes', local: 'Sala', tema: 'Filmes' },
  { titulo: 'Vitrine Endurance', local: 'Garagem', tema: 'GT/Endurance' },
  { titulo: 'Bancada de Trabalho', local: 'Garagem', tema: null },
];

const GALERIA_INICIAL = GALERIA.map((item, index) => ({ ...item, id: index + 1, fotos: [] }));

const SEED_PEDIDOS = [
  { id: 1, tipo: 'Venda', peca: 'Ferrari SF-24 #16 Leclerc (1:43)', contraparte: 'Rafael Martins', valor: 210, status: 'Concluído', data: '2026-08-02' },
  { id: 2, tipo: 'Troca', peca: 'Porsche 917K Gulf (1:43)', contraparte: 'Bruno Torres', valor: 0, status: 'Pendente', data: '2026-08-25' },
  { id: 3, tipo: 'Venda', peca: 'DeLorean DMC-12 (1:24)', contraparte: 'Camila Souza', valor: 195, status: 'Aguardando pagamento', data: '2026-09-01' },
  { id: 4, tipo: 'Compra', peca: 'Toyota GR010 Hybrid (1:43)', contraparte: 'Diego Ferreira', valor: 175, status: 'Concluído', data: '2026-07-14' },
  { id: 5, tipo: 'Venda', peca: 'Chevrolet Opala SS (1:43)', contraparte: 'Marina Lopes', valor: 230, status: 'Cancelado', data: '2026-06-30' },
];

const SEED_CLIENTES = [
  { id: 1, nome: 'Rafael Martins', email: 'rafael.martins@email.com', plano: 'Anual', status: 'Ativo', inicio: '2026-01-12', valorPago: 199.90 },
  { id: 2, nome: 'Camila Souza', email: 'camila.souza@email.com', plano: 'Mensal', status: 'Ativo', inicio: '2026-07-03', valorPago: 19.90 },
  { id: 3, nome: 'Bruno Torres', email: 'bruno.torres@email.com', plano: 'Mensal', status: 'Cancelado', inicio: '2026-03-20', valorPago: 19.90 },
  { id: 4, nome: 'Marina Lopes', email: 'marina.lopes@email.com', plano: 'Anual', status: 'Ativo', inicio: '2025-11-08', valorPago: 199.90 },
  { id: 5, nome: 'Diego Ferreira', email: 'diego.ferreira@email.com', plano: 'Mensal', status: 'Inadimplente', inicio: '2026-05-15', valorPago: 19.90 },
];

const EMPTY_ITEM_FORM = { marca: '', modelo: '', escala: '1:43', ano: '', fabricante: '', tema: 'F1', valorCompra: '', valorEstimado: '', prioridade: 'Média' };
const EMPTY_CLIENTE_FORM = { nome: '', email: '', plano: 'Mensal', status: 'Ativo', inicio: '', valorPago: '' };
const EMPTY_PEDIDO_FORM = { tipo: 'Venda', peca: '', contraparte: '', valor: '', status: 'Pendente', data: '' };
const EMPTY_GALERIA_FORM = { titulo: '', local: '', tema: 'F1' };

const STORAGE_KEY = 'garagem-156a-state-v1';

function loadPersistedState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.version === 1 ? parsed : null;
  } catch {
    return null;
  }
}

function normalizeGaleria(items) {
  return (Array.isArray(items) ? items : GALERIA_INICIAL).map((item, index) => ({
    ...item,
    id: item.id ?? index + 1,
    fotos: Array.isArray(item.fotos) ? item.fotos : [],
  }));
}

const STATUS_COLOR = {
  'Concluído': 'var(--up)', 'Ativo': 'var(--up)',
  'Pendente': 'var(--pink)', 'Aguardando pagamento': 'var(--pink)',
  'Cancelado': 'var(--down)', 'Inadimplente': 'var(--down)',
};

function Slider({ min, max, step, value, onChange, suffix = '%', compact = false }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={compact ? 'relative pt-6 pb-1' : 'relative pt-8 pb-2'}>
      <div className="absolute plate text-xs font-bold px-2 py-0.5 rounded" style={{ left: `calc(${pct}% - 18px)`, top: 0, background: 'var(--pink)', color: ON_PINK }}>
        {value > 0 && suffix === '%' ? `+${value}${suffix}` : `${value}${suffix}`}
      </div>
      <div className="h-1.5 rounded-full relative" style={{ background: 'var(--border)' }}>
        <div className="h-1.5 rounded-full absolute left-0 top-0" style={{ width: `${pct}%`, background: 'var(--pink)' }} />
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="slider-input absolute left-0 right-0 top-5 w-full" />
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="text-xs px-2 py-1 rounded" style={{ background: `${STATUS_COLOR[status] || 'var(--dim)'}22`, color: STATUS_COLOR[status] || 'var(--dim)' }}>
      {status}
    </span>
  );
}

export default function App() {
  const [savedState] = useState(loadPersistedState);
  const [entrou, setEntrou] = useState(() => savedState?.entrou ?? false);
  const [tab, setTab] = useState('catalogo');
  const [catalogo, setCatalogo] = useState(() => savedState?.catalogo ?? SEED_CATALOGO);
  const [wishlist, setWishlist] = useState(() => savedState?.wishlist ?? SEED_WISHLIST);
  const [checklists, setChecklists] = useState(() => savedState?.checklists ?? SEED_CHECKLISTS);
  const [pedidos, setPedidos] = useState(() => savedState?.pedidos ?? SEED_PEDIDOS);
  const [clientes, setClientes] = useState(() => savedState?.clientes ?? SEED_CLIENTES);
  const [galeria, setGaleria] = useState(() => normalizeGaleria(savedState?.galeria));
  const [nextId, setNextId] = useState(() => savedState?.nextId ?? 200);
  const [busca, setBusca] = useState('');
  const [temaFiltro, setTemaFiltro] = useState('Todos');
  const [modal, setModal] = useState(null);
  const [simPct, setSimPct] = useState(20);
  const [simMeses, setSimMeses] = useState(12);
  const [aporteMensal, setAporteMensal] = useState(0);
  const [simPorTema, setSimPorTema] = useState({});
  const [novoAlvo, setNovoAlvo] = useState({});
  const [galeriaErro, setGaleriaErro] = useState('');

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        entrou,
        catalogo,
        wishlist,
        checklists,
        pedidos,
        clientes,
        galeria,
        nextId,
      }));
    } catch {
      // A aplicação continua funcionando mesmo se o navegador bloquear o armazenamento.
    }
  }, [entrou, catalogo, wishlist, checklists, pedidos, clientes, galeria, nextId]);

  const stats = useMemo(() => {
    const totalCompra = catalogo.reduce((s, i) => s + Number(i.valorCompra || 0), 0);
    const totalEstimado = catalogo.reduce((s, i) => s + Number(i.valorEstimado || 0), 0);
    const delta = totalCompra > 0 ? ((totalEstimado - totalCompra) / totalCompra) * 100 : 0;
    return { total: catalogo.length, totalCompra, totalEstimado, delta };
  }, [catalogo]);

  const clientesStats = useMemo(() => {
    const ativos = clientes.filter(c => c.status === 'Ativo');
    const mrr = ativos.reduce((s, c) => s + (c.plano === 'Anual' ? Number(c.valorPago) / 12 : Number(c.valorPago)), 0);
    const churn = clientes.length ? (clientes.filter(c => c.status === 'Cancelado').length / clientes.length) * 100 : 0;
    return { total: clientes.length, ativos: ativos.length, mrr, churn };
  }, [clientes]);

  const porTema = useMemo(() => {
    return TEMAS.map(t => {
      const itens = catalogo.filter(i => i.tema === t);
      const investido = itens.reduce((s, i) => s + Number(i.valorCompra || 0), 0);
      return { tema: t, investido, qtd: itens.length };
    }).filter(t => t.qtd > 0);
  }, [catalogo]);

  const catalogoFiltrado = useMemo(() => {
    return catalogo.filter(i => {
      const matchTema = temaFiltro === 'Todos' || i.tema === temaFiltro;
      const q = busca.trim().toLowerCase();
      const matchBusca = !q || `${i.marca} ${i.modelo} ${i.fabricante}`.toLowerCase().includes(q);
      return matchTema && matchBusca;
    });
  }, [catalogo, busca, temaFiltro]);

  const projecao = useMemo(() => {
    const fator = Math.pow(1 + simPct / 100, simMeses / 12);
    const principalProjetado = stats.totalCompra * fator;
    const taxaMensal = Math.pow(1 + simPct / 100, 1 / 12) - 1;
    const aportesProjetados = taxaMensal !== 0
      ? aporteMensal * ((Math.pow(1 + taxaMensal, simMeses) - 1) / taxaMensal)
      : aporteMensal * simMeses;
    const projetado = Math.round(principalProjetado + aportesProjetados);
    const totalAportado = aporteMensal * simMeses;
    const ganho = Math.round(projetado - stats.totalCompra - totalAportado);
    return { projetado, totalAportado, ganho, principalProjetado };
  }, [stats.totalCompra, simPct, simMeses, aporteMensal]);

  function possui(marca, chave) {
    return catalogo.some(i => i.marca === marca && i.modelo.toLowerCase().includes(chave.toLowerCase()));
  }

  function openAdd(type, prefill = {}) {
    const empty = type === 'cliente' ? EMPTY_CLIENTE_FORM
                : type === 'pedido'  ? EMPTY_PEDIDO_FORM
                : type === 'galeria' ? EMPTY_GALERIA_FORM
                : EMPTY_ITEM_FORM;
    setModal({ type, mode: 'add', data: { ...empty, ...prefill } });
  }
  function openEdit(type, item) { setModal({ type, mode: 'edit', data: { ...item } }); }
  function closeModal() { setModal(null); }

  function saveModal(e) {
    e.preventDefault();
    const d = modal.data;
    if (modal.type === 'galeria') {
      if (!d.titulo || !d.local) return;
      setGaleria(prev => [...prev, { ...d, id: nextId, fotos: [] }]);
      setNextId(n => n + 1);
    } else if (modal.type === 'catalogo') {
      if (!d.marca || !d.modelo) return;
      if (modal.mode === 'add') {
        setCatalogo(prev => [...prev, { ...d, id: nextId, ano: Number(d.ano) || '', valorCompra: Number(d.valorCompra) || 0, valorEstimado: Number(d.valorEstimado) || 0 }]);
        setNextId(n => n + 1);
      } else {
        setCatalogo(prev => prev.map(i => i.id === d.id ? { ...d, ano: Number(d.ano) || '', valorCompra: Number(d.valorCompra) || 0, valorEstimado: Number(d.valorEstimado) || 0 } : i));
      }
    } else if (modal.type === 'wishlist') {
      if (!d.marca || !d.modelo) return;
      if (modal.mode === 'add') {
        setWishlist(prev => [...prev, { ...d, id: nextId, valorEstimado: Number(d.valorEstimado) || 0 }]);
        setNextId(n => n + 1);
      } else {
        setWishlist(prev => prev.map(i => i.id === d.id ? { ...d, valorEstimado: Number(d.valorEstimado) || 0 } : i));
      }
    } else if (modal.type === 'cliente') {
      if (!d.nome || !d.email) return;
      if (modal.mode === 'add') {
        setClientes(prev => [...prev, { ...d, id: nextId, valorPago: Number(d.valorPago) || 0 }]);
        setNextId(n => n + 1);
      } else {
        setClientes(prev => prev.map(c => c.id === d.id ? { ...d, valorPago: Number(d.valorPago) || 0 } : c));
      }
    } else if (modal.type === 'pedido') {
      if (!d.peca || !d.contraparte) return;
      const valor = Number(d.valor) || 0;
      const data = d.data || new Date().toISOString().slice(0, 10);
      if (modal.mode === 'add') {
        setPedidos(prev => [...prev, { ...d, id: nextId, valor, data }]);
        setNextId(n => n + 1);
      } else {
        setPedidos(prev => prev.map(p => p.id === d.id ? { ...d, valor, data } : p));
      }
    }
    closeModal();
  }

  function removeCatalogo(id) { setCatalogo(prev => prev.filter(i => i.id !== id)); }
  function removeWishlist(id) { setWishlist(prev => prev.filter(i => i.id !== id)); }
  function removeCliente(id) { setClientes(prev => prev.filter(c => c.id !== id)); }
  function removePedido(id) { setPedidos(prev => prev.filter(p => p.id !== id)); }
  function removeGaleria(id) { setGaleria(prev => prev.filter(item => item.id !== id)); }

  function removeFotoGaleria(galeriaId, fotoId) {
    setGaleria(prev => prev.map(item => item.id === galeriaId
      ? { ...item, fotos: item.fotos.filter(foto => foto.id !== fotoId) }
      : item));
  }

  function addFotoGaleria(galeriaId, file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setGaleriaErro('Selecione um arquivo de imagem.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setGaleriaErro('A imagem deve ter no máximo 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setGaleria(prev => prev.map(item => item.id === galeriaId
        ? { ...item, fotos: [...item.fotos, { id: `${galeriaId}-${Date.now()}`, nome: file.name, src: reader.result }] }
        : item));
      setGaleriaErro('');
    };
    reader.onerror = () => setGaleriaErro('Não foi possível carregar essa imagem.');
    reader.readAsDataURL(file);
  }

  function marcarAdquirido(item) {
    setCatalogo(prev => [...prev, { id: nextId, marca: item.marca, modelo: item.modelo, escala: item.escala, ano: '', fabricante: '', tema: item.tema, valorCompra: item.valorEstimado, valorEstimado: item.valorEstimado }]);
    setNextId(n => n + 1);
    setWishlist(prev => prev.filter(i => i.id !== item.id));
  }

  function addAlvo(grupoIdx) {
    const entry = novoAlvo[grupoIdx];
    if (!entry || !entry.marca || !entry.chave) return;
    setChecklists(prev => prev.map((g, i) => i === grupoIdx ? { ...g, alvos: [...g.alvos, { marca: entry.marca, chave: entry.chave }] } : g));
    setNovoAlvo(prev => ({ ...prev, [grupoIdx]: { marca: '', chave: '' } }));
  }
  function removeAlvo(grupoIdx, alvoIdx) {
    setChecklists(prev => prev.map((g, i) => i === grupoIdx ? { ...g, alvos: g.alvos.filter((_, j) => j !== alvoIdx) } : g));
  }

  function resetCalculadora() {
    setSimPct(Math.round(stats.delta));
    setSimMeses(12);
    setAporteMensal(0);
    setSimPorTema({});
  }

  function pctDoTema(tema) {
    return simPorTema[tema] !== undefined ? simPorTema[tema] : simPct;
  }
  function setPctTema(tema, val) {
    setSimPorTema(prev => ({ ...prev, [tema]: val }));
  }

  function handleLogout() {
    setTab('catalogo');
    setEntrou(false);
  }

  const globalStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
    :root {
      --bg: #0B0B0C; --panel: #161616; --panel-alt: #1C1C1D; --border: #2A2A2B;
      --text: #F2ECDD; --dim: #8C8578; --pink: #F2A6C4; --pink-dark: #D97FA4; --teal: #2FB8A6; --up: #4CAF6D; --down: #C1443C;
    }
    * { font-family: 'IBM Plex Sans', sans-serif; }
    .plate { font-family: 'Baloo 2', sans-serif; letter-spacing: 0.01em; }
    .hair { border-color: var(--border); }
    .fade-in { animation: fadeIn .28s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    input, select { color: var(--text); }
    input::placeholder { color: var(--dim); }
    .tick { transition: background-color .15s ease; }
    .slider-input { -webkit-appearance: none; appearance: none; height: 20px; background: transparent; cursor: pointer; }
    .slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--pink); border: 3px solid var(--text); margin-top: -9px; box-shadow: 0 1px 4px rgba(0,0,0,.5); }
    .slider-input::-webkit-slider-runnable-track { height: 2px; background: transparent; }
    .slider-input::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: var(--pink); border: 3px solid var(--text); cursor: pointer; }
    .bar-track { background: var(--border); border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; transition: width .3s ease; }
  `;

  if (!entrou) {
    return <Login onLogin={() => setEntrou(true)} globalStyle={globalStyle} />;
  }

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <style>{globalStyle}</style>

      <header className="border-b hair">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <img src={LOGO_DATA_URI} alt="Garagem 156A" className="h-16 max-w-[220px] object-contain" />
          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex gap-6 plate flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--dim)' }}>Peças</div>
              <div className="text-lg">{stats.total}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--dim)' }}>Investido</div>
              <div className="text-lg">R$ {stats.totalCompra.toLocaleString('pt-BR')}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--dim)' }}>Estimado</div>
              <div className="text-lg">R$ {stats.totalEstimado.toLocaleString('pt-BR')}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--dim)' }}>Valorização</div>
              <div className="text-lg flex items-center gap-1" style={{ color: stats.delta >= 0 ? 'var(--up)' : 'var(--down)' }}>
                {stats.delta >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                {Math.abs(stats.delta).toFixed(1)}%
              </div>
            </div>
            </div>
            <button type="button" onClick={handleLogout} aria-label="Sair da garagem" title="Sair da garagem" className="flex items-center gap-2 px-3 py-2 rounded border hair text-sm" style={{ color: 'var(--dim)' }}>
              <LogOut size={15} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 flex gap-5 text-sm plate flex-wrap">
          {[
            ['catalogo', 'Catálogo'], ['checklist', 'Checklist'], ['wishlist', 'Wishlist'],
            ['calculadora', 'Calculadora'], ['pedidos', 'Pedidos'], ['clientes', 'Clientes'], ['galeria', 'Galeria'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} className="pb-3 pt-2 border-b-2 transition-colors" style={{ borderColor: tab === key ? 'var(--pink)' : 'transparent', color: tab === key ? 'var(--text)' : 'var(--dim)' }}>
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 fade-in" key={tab}>

        {tab === 'catalogo' && (
          <div>
            <div className="flex flex-wrap gap-3 mb-5 items-center">
              <div className="flex items-center gap-2 border hair rounded px-3 py-2 flex-1 min-w-[220px]" style={{ background: 'var(--panel)' }}>
                <Search size={16} style={{ color: 'var(--dim)' }} />
                <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por marca, modelo ou fabricante..." className="bg-transparent outline-none text-sm flex-1" />
              </div>
              <select value={temaFiltro} onChange={e => setTemaFiltro(e.target.value)} className="border hair rounded px-3 py-2 text-sm" style={{ background: 'var(--panel)' }}>
                <option>Todos</option>
                {TEMAS.map(t => <option key={t}>{t}</option>)}
              </select>
              <button onClick={() => openAdd('catalogo')} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--pink)', color: ON_PINK }}>
                <Plus size={16} /> Adicionar peça
              </button>
            </div>
            <div className="border hair rounded overflow-hidden" style={{ background: 'var(--panel)' }}>
              {catalogoFiltrado.length === 0 && <div className="p-8 text-center text-sm" style={{ color: 'var(--dim)' }}>Nenhuma peça encontrada com esse filtro.</div>}
              {catalogoFiltrado.map((item, idx) => {
                const delta = item.valorCompra > 0 ? ((item.valorEstimado - item.valorCompra) / item.valorCompra) * 100 : 0;
                return (
                  <div key={item.id} className="flex items-center gap-4 px-4 py-3 border-t hair group" style={{ borderTopWidth: idx === 0 ? 0 : 1, background: idx % 2 ? 'var(--panel-alt)' : 'transparent' }}>
                    <div className="w-9 h-9 rounded-sm shrink-0" style={{ background: liveryFor(item.marca + item.modelo) }} />
                    <div className="w-20 shrink-0 plate text-xs" style={{ color: 'var(--dim)' }}>{code(item.id)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{item.marca} — {item.modelo}</div>
                      <div className="text-xs truncate" style={{ color: 'var(--dim)' }}>{item.escala} · {item.ano} · {item.fabricante} · {item.tema}</div>
                    </div>
                    <div className="text-right shrink-0 hidden sm:block">
                      <div className="text-sm">R$ {Number(item.valorCompra).toLocaleString('pt-BR')} → R$ {Number(item.valorEstimado).toLocaleString('pt-BR')}</div>
                      <div className="text-xs flex items-center justify-end gap-1" style={{ color: delta >= 0 ? 'var(--up)' : 'var(--down)' }}>
                        {delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(delta).toFixed(0)}%
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit('catalogo', item)} className="p-2 rounded hover:bg-white/5"><Pencil size={14} /></button>
                      <button onClick={() => removeCatalogo(item.id)} className="p-2 rounded hover:bg-white/5" style={{ color: 'var(--down)' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'checklist' && (
          <div className="space-y-8">
            {checklists.map((grupo, gIdx) => {
              const donos = grupo.alvos.filter(a => possui(a.marca, a.chave));
              const nv = novoAlvo[gIdx] || { marca: '', chave: '' };
              return (
                <div key={grupo.tema}>
                  <div className="flex items-baseline justify-between mb-3">
                    <h2 className="plate text-base">{grupo.tema} <span style={{ color: 'var(--dim)' }} className="text-sm font-normal">— {grupo.nome}</span></h2>
                    <span className="plate text-sm" style={{ color: 'var(--dim)' }}>{donos.length}/{grupo.alvos.length}</span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {grupo.alvos.map((a, i) => <div key={i} className="tick h-1.5 flex-1 rounded-sm" style={{ background: possui(a.marca, a.chave) ? 'var(--pink)' : 'var(--border)' }} />)}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 mb-2">
                    {grupo.alvos.map((a, i) => {
                      const ok = possui(a.marca, a.chave);
                      return (
                        <div key={i} className="flex items-center justify-between gap-2 px-3 py-2 border hair rounded text-sm group" style={{ background: 'var(--panel)' }}>
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0" style={{ background: ok ? 'var(--pink)' : 'transparent', border: ok ? 'none' : '1px solid var(--border)' }}>
                              {ok && <Check size={11} color={ON_PINK} />}
                            </div>
                            <span style={{ color: ok ? 'var(--text)' : 'var(--dim)' }}>{a.marca} · {a.chave}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {!ok && <button onClick={() => openAdd('catalogo', { marca: a.marca, modelo: a.chave, tema: grupo.tema })} className="text-xs px-2 py-1 rounded" style={{ color: 'var(--pink)' }}>+ adicionar</button>}
                            <button onClick={() => removeAlvo(gIdx, i)} className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--down)' }}><Trash2 size={13} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <input placeholder="Marca" value={nv.marca} onChange={e => setNovoAlvo(prev => ({ ...prev, [gIdx]: { ...nv, marca: e.target.value } }))} className="border hair rounded px-3 py-1.5 text-xs bg-transparent flex-1" />
                    <input placeholder="Referência (ex: nome do piloto/modelo)" value={nv.chave} onChange={e => setNovoAlvo(prev => ({ ...prev, [gIdx]: { ...nv, chave: e.target.value } }))} className="border hair rounded px-3 py-1.5 text-xs bg-transparent flex-1" />
                    <button onClick={() => addAlvo(gIdx)} className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium shrink-0" style={{ background: 'var(--pink)', color: ON_PINK }}>
                      <Plus size={13} /> item
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'wishlist' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => openAdd('wishlist')} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--teal)', color: '#F2ECDD' }}>
                <Plus size={16} /> Adicionar à wishlist
              </button>
            </div>
            <div className="space-y-2">
              {wishlist.length === 0 && <div className="p-8 text-center text-sm border hair rounded" style={{ color: 'var(--dim)', background: 'var(--panel)' }}>Sua wishlist está vazia.</div>}
              {wishlist.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-4 py-3 border-l-4 rounded" style={{ background: 'var(--panel)', borderLeftColor: 'var(--teal)', borderTop: '1px solid var(--border)', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{item.marca} — {item.modelo}</div>
                    <div className="text-xs" style={{ color: 'var(--dim)' }}>{item.escala} · {item.tema} · prioridade {item.prioridade} · ~R$ {Number(item.valorEstimado).toLocaleString('pt-BR')}</div>
                  </div>
                  <button onClick={() => marcarAdquirido(item)} className="text-xs px-3 py-1.5 rounded" style={{ background: 'var(--pink)', color: ON_PINK }}>Marcar como adquirido</button>
                  <button onClick={() => openEdit('wishlist', item)} className="p-2 rounded hover:bg-white/5"><Pencil size={14} /></button>
                  <button onClick={() => removeWishlist(item.id)} className="p-2 rounded hover:bg-white/5" style={{ color: 'var(--down)' }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'calculadora' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Calculator size={18} style={{ color: 'var(--pink)' }} />
                <h2 className="plate text-base">Simulador de valorização</h2>
              </div>
              <button onClick={resetCalculadora} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border hair hover:bg-white/5" style={{ color: 'var(--dim)' }}>
                <RotateCcw size={13} /> Resetar
              </button>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--dim)' }}>Simule cenários de valorização com horizonte temporal e aportes mensais sobre o total investido.</p>

            <div className="border hair rounded p-6 mb-6" style={{ background: 'var(--panel)' }}>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--dim)' }}>Valorização anual</div>
                  <Slider min={-50} max={200} step={5} value={simPct} onChange={setSimPct} />
                  <button onClick={() => setSimPct(Math.round(stats.delta))} className="text-xs mt-3" style={{ color: 'var(--teal)' }}>
                    usar valorização real atual ({stats.delta >= 0 ? '+' : ''}{stats.delta.toFixed(1)}%)
                  </button>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--dim)' }}>Horizonte</div>
                  <div className="flex flex-wrap gap-1.5">
                    {[6, 12, 24, 36, 60].map(m => (
                      <button key={m} onClick={() => setSimMeses(m)} className="text-xs px-2.5 py-1 rounded border hair" style={{ background: simMeses === m ? 'var(--pink)' : 'transparent', color: simMeses === m ? ON_PINK : 'var(--text)', borderColor: simMeses === m ? 'var(--pink)' : 'var(--border)' }}>
                        {m < 12 ? `${m}m` : `${m / 12}a`}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--dim)' }}>Aporte mensal</div>
                    <input type="number" min={0} step={50} value={aporteMensal} onChange={e => setAporteMensal(Number(e.target.value) || 0)} className="w-full border hair rounded px-3 py-1.5 text-sm bg-transparent" placeholder="R$ 0" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t hair">
                <div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--dim)' }}>Investido hoje</div>
                  <div className="plate text-lg mt-1">R$ {stats.totalCompra.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--dim)' }}>Aportes no período</div>
                  <div className="plate text-lg mt-1">R$ {projecao.totalAportado.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--dim)' }}>Projetado em {simMeses}m</div>
                  <div className="plate text-lg mt-1" style={{ color: 'var(--pink)' }}>R$ {projecao.projetado.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--dim)' }}>Ganho/Perda</div>
                  <div className="plate text-lg mt-1" style={{ color: projecao.ganho >= 0 ? 'var(--up)' : 'var(--down)' }}>
                    {projecao.ganho >= 0 ? '+' : ''}R$ {projecao.ganho.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t hair">
                <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--dim)' }}>Comparativo</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--dim)' }}>Base (investido + aportes)</span>
                      <span>R$ {(stats.totalCompra + projecao.totalAportado).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="bar-track h-2">
                      <div className="bar-fill" style={{ width: '100%', background: 'var(--border)' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--pink)' }}>Projetado</span>
                      <span style={{ color: 'var(--pink)' }}>R$ {projecao.projetado.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="bar-track h-2">
                      <div className="bar-fill" style={{ width: `${Math.min(100, (projecao.projetado / Math.max(stats.totalCompra + projecao.totalAportado, 1)) * 100)}%`, background: 'var(--pink)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {porTema.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--dim)' }}>Ajuste fino por tema</h3>
                <div className="border hair rounded overflow-hidden" style={{ background: 'var(--panel)' }}>
                  {porTema.map((t, idx) => {
                    const pct = pctDoTema(t.tema);
                    const projetadoTema = Math.round(t.investido * Math.pow(1 + pct / 100, simMeses / 12));
                    const custom = simPorTema[t.tema] !== undefined;
                    return (
                      <div key={t.tema} className="px-4 py-3 border-t hair" style={{ borderTopWidth: idx === 0 ? 0 : 1, background: idx % 2 ? 'var(--panel-alt)' : 'transparent' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{t.tema} <span style={{ color: 'var(--dim)' }}>({t.qtd})</span></span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm">R$ {t.investido.toLocaleString('pt-BR')} → <span style={{ color: 'var(--pink)' }}>R$ {projetadoTema.toLocaleString('pt-BR')}</span></span>
                            {custom && (
                              <button onClick={() => setSimPorTema(prev => { const n = { ...prev }; delete n[t.tema]; return n; })} className="text-xs" style={{ color: 'var(--dim)' }}>limpar</button>
                            )}
                          </div>
                        </div>
                        <Slider min={-50} max={200} step={5} value={pct} onChange={v => setPctTema(t.tema, v)} compact />
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--dim)' }}>Os sliders por tema não afetam o total — servem para visualizar cenários específicos por categoria.</p>
              </div>
            )}
          </div>
        )}

        {tab === 'pedidos' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package size={18} style={{ color: 'var(--pink)' }} />
                <h2 className="plate text-base">Pedidos — trocas e vendas</h2>
              </div>
              <button onClick={() => openAdd('pedido')} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--pink)', color: ON_PINK }}>
                <Plus size={16} /> Adicionar pedido
              </button>
            </div>
            <div className="border hair rounded overflow-hidden" style={{ background: 'var(--panel)' }}>
              <div className="grid grid-cols-[80px_1fr_140px_90px_150px_100px_60px] gap-3 px-4 py-2 text-xs uppercase tracking-wider" style={{ color: 'var(--dim)', background: 'var(--panel-alt)' }}>
                <span>Tipo</span><span>Peça</span><span>Contraparte</span><span>Valor</span><span>Status</span><span>Data</span><span></span>
              </div>
              {pedidos.length === 0 && <div className="p-8 text-center text-sm" style={{ color: 'var(--dim)' }}>Nenhum pedido registrado.</div>}
              {pedidos.map((p, idx) => (
                <div key={p.id} className="grid grid-cols-[80px_1fr_140px_90px_150px_100px_60px] gap-3 px-4 py-3 text-sm border-t hair items-center group" style={{ borderTopWidth: idx === 0 ? 0 : 1 }}>
                  <span style={{ color: 'var(--dim)' }}>{p.tipo}</span>
                  <span className="truncate">{p.peca}</span>
                  <span className="truncate">{p.contraparte}</span>
                  <span>{p.valor > 0 ? `R$ ${p.valor.toLocaleString('pt-BR')}` : '—'}</span>
                  <span><StatusBadge status={p.status} /></span>
                  <span style={{ color: 'var(--dim)' }}>{p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '—'}</span>
                  <span className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit('pedido', p)} className="p-1 rounded hover:bg-white/5"><Pencil size={13} /></button>
                    <button onClick={() => removePedido(p.id)} className="p-1 rounded hover:bg-white/5" style={{ color: 'var(--down)' }}><Trash2 size={13} /></button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'clientes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users size={18} style={{ color: 'var(--pink)' }} />
                <h2 className="plate text-base">Clientes — assinantes</h2>
              </div>
              <button onClick={() => openAdd('cliente')} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium" style={{ background: 'var(--pink)', color: ON_PINK }}>
                <Plus size={16} /> Adicionar cliente
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-5">
              {[
                ['Total', clientesStats.total],
                ['Ativos', clientesStats.ativos],
                ['MRR estimado', `R$ ${clientesStats.mrr.toFixed(0)}`],
                ['Churn', `${clientesStats.churn.toFixed(0)}%`],
              ].map(([label, val]) => (
                <div key={label} className="border hair rounded p-3" style={{ background: 'var(--panel)' }}>
                  <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--dim)' }}>{label}</div>
                  <div className="plate text-lg mt-1">{val}</div>
                </div>
              ))}
            </div>
            <div className="border hair rounded overflow-hidden" style={{ background: 'var(--panel)' }}>
              <div className="grid grid-cols-[1fr_1fr_90px_130px_110px_90px_70px] gap-3 px-4 py-2 text-xs uppercase tracking-wider" style={{ color: 'var(--dim)', background: 'var(--panel-alt)' }}>
                <span>Nome</span><span>E-mail</span><span>Plano</span><span>Status</span><span>Início</span><span>Valor</span><span></span>
              </div>
              {clientes.map((c, idx) => (
                <div key={c.id} className="grid grid-cols-[1fr_1fr_90px_130px_110px_90px_70px] gap-3 px-4 py-3 text-sm border-t hair items-center group" style={{ borderTopWidth: idx === 0 ? 0 : 1 }}>
                  <span className="truncate font-medium">{c.nome}</span>
                  <span className="truncate" style={{ color: 'var(--dim)' }}>{c.email}</span>
                  <span>{c.plano}</span>
                  <span><StatusBadge status={c.status} /></span>
                  <span style={{ color: 'var(--dim)' }}>{c.inicio ? new Date(c.inicio).toLocaleDateString('pt-BR') : '—'}</span>
                  <span>R$ {Number(c.valorPago).toFixed(2).replace('.', ',')}</span>
                  <span className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit('cliente', c)} className="p-1 rounded hover:bg-white/5"><Pencil size={13} /></button>
                    <button onClick={() => removeCliente(c.id)} className="p-1 rounded hover:bg-white/5" style={{ color: 'var(--down)' }}><Trash2 size={13} /></button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'galeria' && (
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="plate text-base">Galeria da garagem</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--dim)' }}>Adicione fotos de cada vitrine, estante ou espaço.</p>
              </div>
              <button onClick={() => openAdd('galeria')} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium shrink-0" style={{ background: 'var(--pink)', color: ON_PINK }}>
                <Plus size={16} /> Adicionar espaço
              </button>
            </div>
            {galeriaErro && <div className="border hair rounded px-3 py-2 mb-4 text-sm" style={{ color: 'var(--down)', background: 'var(--panel)' }}>{galeriaErro}</div>}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galeria.map(g => (
                <div key={g.id} className="border hair rounded overflow-hidden" style={{ background: 'var(--panel)' }}>
                  <div className="h-40 grid grid-cols-2 gap-1" style={{ background: `linear-gradient(135deg, ${liveryFor(g.titulo)}33, ${liveryFor(g.local)}22)` }}>
                    {g.fotos.length > 0 ? g.fotos.slice(0, 4).map(foto => (
                      <div key={foto.id} className="relative min-h-0 overflow-hidden">
                        <img src={foto.src} alt={foto.nome} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeFotoGaleria(g.id, foto.id)} aria-label={`Excluir foto ${foto.nome}`} className="absolute top-1 right-1 p-1 rounded" style={{ background: 'rgba(0,0,0,.7)', color: 'var(--text)' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )) : (
                      <div className="col-span-2 flex items-center justify-center"><Camera size={28} style={{ color: 'var(--dim)' }} /></div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{g.titulo}</div>
                        <div className="text-xs" style={{ color: 'var(--dim)' }}>{g.local}{g.tema ? ` · ${g.tema}` : ''} · {g.fotos.length} {g.fotos.length === 1 ? 'foto' : 'fotos'}</div>
                      </div>
                      <button type="button" onClick={() => removeGaleria(g.id)} aria-label={`Excluir ${g.titulo}`} className="p-1 rounded shrink-0" style={{ color: 'var(--down)' }}><Trash2 size={14} /></button>
                    </div>
                    <label className="flex items-center justify-center gap-2 mt-3 px-3 py-2 rounded text-xs cursor-pointer" style={{ background: 'var(--panel-alt)', color: 'var(--pink)' }}>
                      <Camera size={14} /> Adicionar foto
                      <input type="file" accept="image/*" className="hidden" onChange={e => { addFotoGaleria(g.id, e.target.files?.[0]); e.target.value = ''; }} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <form onSubmit={saveModal} className="w-full max-w-lg border hair rounded p-6" style={{ background: 'var(--panel)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="plate text-base">
                {modal.mode === 'add' ? 'Adicionar' : 'Editar'} — {modal.type === 'catalogo' ? 'Catálogo' : modal.type === 'wishlist' ? 'Wishlist' : modal.type === 'pedido' ? 'Pedido' : modal.type === 'galeria' ? 'Espaço da galeria' : 'Cliente'}
              </h3>
              <button type="button" onClick={closeModal}><X size={18} /></button>
            </div>

            {modal.type === 'galeria' ? (
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Nome do espaço (ex: Vitrine principal)" value={modal.data.titulo} onChange={e => setModal(m => ({ ...m, data: { ...m.data, titulo: e.target.value } }))} className="col-span-2 border hair rounded px-3 py-2 text-sm bg-transparent" />
                <input required placeholder="Local (ex: Sala, garagem)" value={modal.data.local} onChange={e => setModal(m => ({ ...m, data: { ...m.data, local: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
                <select value={modal.data.tema || ''} onChange={e => setModal(m => ({ ...m, data: { ...m.data, tema: e.target.value || null } }))} className="border hair rounded px-3 py-2 text-sm" style={{ background: 'var(--panel-alt)' }}>
                  <option value="">Sem tema</option>
                  {TEMAS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            ) : modal.type === 'cliente' ? (
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Nome" value={modal.data.nome} onChange={e => setModal(m => ({ ...m, data: { ...m.data, nome: e.target.value } }))} className="col-span-2 border hair rounded px-3 py-2 text-sm bg-transparent" />
                <input required type="email" placeholder="E-mail" value={modal.data.email} onChange={e => setModal(m => ({ ...m, data: { ...m.data, email: e.target.value } }))} className="col-span-2 border hair rounded px-3 py-2 text-sm bg-transparent" />
                <select value={modal.data.plano} onChange={e => setModal(m => ({ ...m, data: { ...m.data, plano: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm" style={{ background: 'var(--panel-alt)' }}>
                  <option>Mensal</option><option>Anual</option>
                </select>
                <select value={modal.data.status} onChange={e => setModal(m => ({ ...m, data: { ...m.data, status: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm" style={{ background: 'var(--panel-alt)' }}>
                  <option>Ativo</option><option>Cancelado</option><option>Inadimplente</option>
                </select>
                <input type="date" placeholder="Início" value={modal.data.inicio} onChange={e => setModal(m => ({ ...m, data: { ...m.data, inicio: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
                <input placeholder="Valor pago (R$)" type="number" value={modal.data.valorPago} onChange={e => setModal(m => ({ ...m, data: { ...m.data, valorPago: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
              </div>
            ) : modal.type === 'pedido' ? (
              <div className="grid grid-cols-2 gap-3">
                <select value={modal.data.tipo} onChange={e => setModal(m => ({ ...m, data: { ...m.data, tipo: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm" style={{ background: 'var(--panel-alt)' }}>
                  <option>Venda</option><option>Troca</option><option>Compra</option>
                </select>
                <select value={modal.data.status} onChange={e => setModal(m => ({ ...m, data: { ...m.data, status: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm" style={{ background: 'var(--panel-alt)' }}>
                  <option>Pendente</option><option>Concluído</option><option>Aguardando pagamento</option><option>Cancelado</option>
                </select>
                <input required placeholder="Peça" value={modal.data.peca} onChange={e => setModal(m => ({ ...m, data: { ...m.data, peca: e.target.value } }))} className="col-span-2 border hair rounded px-3 py-2 text-sm bg-transparent" />
                <input required placeholder="Contraparte (cliente/fornecedor)" value={modal.data.contraparte} onChange={e => setModal(m => ({ ...m, data: { ...m.data, contraparte: e.target.value } }))} className="col-span-2 border hair rounded px-3 py-2 text-sm bg-transparent" />
                <input placeholder="Valor (R$)" type="number" value={modal.data.valor} onChange={e => setModal(m => ({ ...m, data: { ...m.data, valor: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
                <input type="date" placeholder="Data" value={modal.data.data} onChange={e => setModal(m => ({ ...m, data: { ...m.data, data: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Marca" value={modal.data.marca} onChange={e => setModal(m => ({ ...m, data: { ...m.data, marca: e.target.value } }))} className="col-span-2 border hair rounded px-3 py-2 text-sm bg-transparent" />
                <input required placeholder="Modelo" value={modal.data.modelo} onChange={e => setModal(m => ({ ...m, data: { ...m.data, modelo: e.target.value } }))} className="col-span-2 border hair rounded px-3 py-2 text-sm bg-transparent" />
                <select value={modal.data.escala} onChange={e => setModal(m => ({ ...m, data: { ...m.data, escala: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm" style={{ background: 'var(--panel-alt)' }}>
                  {ESCALAS.map(e => <option key={e}>{e}</option>)}
                </select>
                <select value={modal.data.tema} onChange={e => setModal(m => ({ ...m, data: { ...m.data, tema: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm" style={{ background: 'var(--panel-alt)' }}>
                  {TEMAS.map(t => <option key={t}>{t}</option>)}
                </select>
                {modal.type === 'catalogo' && (
                  <>
                    <input placeholder="Ano" type="number" value={modal.data.ano} onChange={e => setModal(m => ({ ...m, data: { ...m.data, ano: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
                    <input placeholder="Fabricante" value={modal.data.fabricante} onChange={e => setModal(m => ({ ...m, data: { ...m.data, fabricante: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
                    <input placeholder="Valor de compra (R$)" type="number" value={modal.data.valorCompra} onChange={e => setModal(m => ({ ...m, data: { ...m.data, valorCompra: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
                    <input placeholder="Valor estimado (R$)" type="number" value={modal.data.valorEstimado} onChange={e => setModal(m => ({ ...m, data: { ...m.data, valorEstimado: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
                  </>
                )}
                {modal.type === 'wishlist' && (
                  <>
                    <select value={modal.data.prioridade} onChange={e => setModal(m => ({ ...m, data: { ...m.data, prioridade: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm" style={{ background: 'var(--panel-alt)' }}>
                      <option>Alta</option><option>Média</option><option>Baixa</option>
                    </select>
                    <input placeholder="Valor estimado (R$)" type="number" value={modal.data.valorEstimado} onChange={e => setModal(m => ({ ...m, data: { ...m.data, valorEstimado: e.target.value } }))} className="border hair rounded px-3 py-2 text-sm bg-transparent" />
                  </>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-sm rounded" style={{ color: 'var(--dim)' }}>Cancelar</button>
              <button type="submit" className="px-4 py-2 text-sm rounded font-medium" style={{ background: 'var(--pink)', color: ON_PINK }}>Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}