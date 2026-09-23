/* ============================================================
   PataChic — Banho, Tosa & Boutique Pet
   Lógica do site: serviços, agendamento, loja, carrinho,
   depoimentos, FAQ e animações.
   ============================================================ */

"use strict";

/* ---------------- Dados ---------------- */

const WHATSAPP = "5511987654321";
const FRETE_GRATIS_MINIMO = 149;
const VALOR_FRETE = 14.9;
const CUPOM_BEMVINDO = "BEMVINDO10";

const PROFISSIONAIS = [
  { id: "qualquer", nome: "Sem preferência (primeiro horário livre)" },
  { id: "camila", nome: "Camila Torres — Tosadora Master" },
  { id: "diego", nome: "Diego Santos — Esteticista Pet" },
  { id: "pri", nome: "Patrícia Lima — Banho & Spa" },
];

const SERVICOS = [
  {
    id: "banho", nome: "Banho Completo", preco: 59.9, duracao: "60 min",
    porPorte: true, icone: "banho",
    desc: "Banho com shampoo premium, condicionador, secagem, perfume e laço ou gravata.",
    cor: "linear-gradient(135deg,#38bdf8,#0284c7)",
  },
  {
    id: "tosa-hig", nome: "Tosa Higiênica", preco: 45, duracao: "40 min",
    porPorte: false, icone: "tesoura",
    desc: "Aparos em patas, barriga, bumbum e ouvidos. Ideal entre as tosas completas.",
    cor: "linear-gradient(135deg,#2dd4bf,#0f766e)",
  },
  {
    id: "tosa-tesoura", nome: "Tosa na Tesoura", preco: 89.9, duracao: "90 min",
    porPorte: true, icone: "tesoura", destaque: "Mais procurada",
    desc: "Acabamento artesanal na tesoura, com banho incluso e finalização de boutique.",
    cor: "linear-gradient(135deg,#fb923c,#ea580c)",
  },
  {
    id: "tosa-maquina", nome: "Tosa na Máquina", preco: 79.9, duracao: "75 min",
    porPorte: true, icone: "maquina",
    desc: "Pelagem uniforme e fresquinha, com banho incluso. Perfeita para o verão.",
    cor: "linear-gradient(135deg,#a78bfa,#7c3aed)",
  },
  {
    id: "spa", nome: "Spa & Hidratação", preco: 69.9, duracao: "50 min",
    porPorte: true, icone: "spa",
    desc: "Hidratação profunda, massagem relaxante, banho de brilho e aromaterapia.",
    cor: "linear-gradient(135deg,#fb7185,#e11d48)",
  },
  {
    id: "unhas", nome: "Corte de Unhas", preco: 25, duracao: "20 min",
    porPorte: false, icone: "pata",
    desc: "Corte seguro com lixamento, sem estresse e com petisco de recompensa.",
    cor: "linear-gradient(135deg,#fbbf24,#d97706)",
  },
  {
    id: "dentes", nome: "Escovação Dentária", preco: 35, duracao: "25 min",
    porPorte: false, icone: "dente",
    desc: "Higiene bucal com produtos veterinários e hálito fresquinho na hora.",
    cor: "linear-gradient(135deg,#34d399,#059669)",
  },
  {
    id: "daycare", nome: "Day Care (diária)", preco: 49.9, duracao: "o dia todo",
    porPorte: false, icone: "sol",
    desc: "Um dia inteiro de brincadeiras, socialização e soneca monitorada.",
    cor: "linear-gradient(135deg,#f472b6,#db2777)",
  },
];

const MULT_PORTE = { P: 1, M: 1.25, G: 1.5 };
const ROTULO_PORTE = { P: "Pequeno (até 10 kg)", M: "Médio (10–25 kg)", G: "Grande (25 kg+)" };

const PRODUTOS = [
  { id: "racao-adulto", nome: "Ração Premium Frango & Vegetais — 10 kg", cat: "Alimentação", preco: 189.9, antigo: 219.9, selo: "oferta", seloTexto: "-14%", rating: 4.9, avaliacoes: 312, img: "assets/produtos/racao-adulto.jpg", desc: "Nutrição completa com frango, arroz e vegetais para cães adultos." },
  { id: "racao-filhote", nome: "Ração Filhotes Frango & Leite — 3 kg", cat: "Alimentação", preco: 89.9, antigo: null, selo: "top", seloTexto: "Mais vendido", rating: 4.8, avaliacoes: 208, img: "assets/produtos/racao-filhote.jpg", desc: "Grãos pequenos e DHA para o crescimento saudável do seu filhote." },
  { id: "biscoitos", nome: "Biscoito Ossinho Sortido — 500 g", cat: "Alimentação", preco: 24.9, antigo: null, selo: null, seloTexto: "", rating: 4.9, avaliacoes: 441, img: "assets/produtos/biscoitos.jpg", desc: "Crocantes assados, perfeitos para adestrar e recompensar." },
  { id: "kit-cordas", nome: "Kit 12 Cordas de Algodão Coloridas", cat: "Brinquedos", preco: 59.9, antigo: 79.9, selo: "oferta", seloTexto: "-25%", rating: 4.7, avaliacoes: 156, img: "assets/produtos/kit-cordas.jpg", desc: "Kit com 12 cordas para morder, puxar e gastar energia." },
  { id: "kit-cabo", nome: "Kit Cabo de Guerra Tons Neutros — 3 peças", cat: "Brinquedos", preco: 49.9, antigo: null, selo: "novo", seloTexto: "Novo", rating: 5.0, avaliacoes: 38, img: "assets/produtos/kit-cabo.jpg", desc: "Design escandinavo em algodão trançado, resistente e lindo." },
  { id: "cama-nuvem", nome: "Cama Nuvem Felpuda — Cinza", cat: "Conforto", preco: 149.9, antigo: null, selo: "top", seloTexto: "Mais vendido", rating: 4.9, avaliacoes: 527, img: "assets/produtos/cama-nuvem.jpg", desc: "Super macia, com borda alta que abraça e acalma o pet." },
  { id: "colchonete", nome: "Colchonete Aconchego — Azul Petróleo", cat: "Conforto", preco: 119.9, antigo: 149.9, selo: "oferta", seloTexto: "-20%", rating: 4.8, avaliacoes: 203, img: "assets/produtos/colchonete.jpg", desc: "Espuma ortopédica com capa removível e lavável." },
  { id: "arranhador-torre", nome: "Arranhador Torre com Plataforma", cat: "Gatos", preco: 179.9, antigo: null, selo: null, seloTexto: "", rating: 4.8, avaliacoes: 167, img: "assets/produtos/arranhador-torre.jpg", desc: "Sisal natural, base estável e mirante estofado para sonecas." },
  { id: "arranhador-familia", nome: "Arranhador Família — 3 Andares", cat: "Gatos", preco: 249.9, antigo: 299.9, selo: "oferta", seloTexto: "-17%", rating: 4.9, avaliacoes: 98, img: "assets/produtos/arranhador-familia.jpg", desc: "Parquinho vertical em madeira para casas com vários gatos." },
  { id: "shampoo", nome: "Shampoo Neutro PataChic — 500 ml", cat: "Higiene", preco: 34.9, antigo: null, selo: "proprio", seloTexto: "Linha própria", rating: 5.0, avaliacoes: 612, img: "assets/produtos/shampoo.jpg", desc: "O mesmo shampoo do nosso banho: pH neutro e cheirinho suave." },
  { id: "perfume", nome: "Colônia Pet Lavanda — 120 ml", cat: "Higiene", preco: 44.9, antigo: null, selo: "novo", seloTexto: "Novo", rating: 4.9, avaliacoes: 84, img: "assets/produtos/perfume.jpg", desc: "Fragrância delicada de lavanda, segura para cães e gatos." },
];

const CATEGORIAS = ["Todos", "Alimentação", "Brinquedos", "Conforto", "Gatos", "Higiene"];

const DEPOIMENTOS = [
  { nome: "Mariana L.", pet: "Thor · Golden Retriever", texto: "O Thor volta do banho cheiroso e feliz toda vez. A equipe manda foto durante a tosa e isso me deixa super tranquila. Virei cliente fiel!", cor: "#f97316" },
  { nome: "Carlos H.", pet: "Mel · Shih-tzu", texto: "Mel é medrosa e mesmo assim ama ir. A Camila tem uma paciência de outro mundo e a tosa fica impecável. Melhor petshop da região, sem dúvida.", cor: "#0f766e" },
  { nome: "Fernanda P.", pet: "Simba & Nala · SRD felinos", texto: "Finalmente um lugar que entende de gatos! Meus dois voltaram calmos, sem estresse. E a lojinha é uma perdição — saí com arranhador novo.", cor: "#7c3aed" },
  { nome: "Rafael T.", pet: "Bolt · Border Collie", texto: "Agendo pelo site em menos de um minuto e recebo tudo no WhatsApp. O day care salvou minha rotina: o Bolt chega em casa cansado e feliz.", cor: "#db2777" },
];

const HORARIOS = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00", "17:30"];

const ICONES = {
  banho: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2z"/><path d="M6 12V5a2 2 0 0 1 4 0"/><path d="M8 21l-1 1M16 21l1 1M9 8c1.5 0 1.5 1.5 3 1.5S13.5 8 15 8"/></svg>',
  tesoura: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.5 15.5M20 20L8.5 8.5"/></svg>',
  maquina: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="10" height="12" rx="3"/><path d="M9 8V5h6v3M9 12h6M10 2v2M14 2v2M12 2v1"/></svg>',
  spa: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-5 0-8-3-8-7 3 0 5 1 6 2-1-4 0-8 4-10 5 2.5 6 8 4 12-1 2-3 3-6 3z"/><path d="M12 21c0-6 1-10 4-13"/></svg>',
  pata: '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><ellipse cx="7.5" cy="10" rx="2.2" ry="2.8"/><ellipse cx="12" cy="7.5" rx="2.2" ry="2.8"/><ellipse cx="16.5" cy="10" rx="2.2" ry="2.8"/><path d="M12 12.5c-3 0-5.5 2.2-5.5 4.5 0 1.5 1.2 2.5 2.6 2.5 1 0 1.5-.6 2.9-.6s1.9.6 2.9.6c1.4 0 2.6-1 2.6-2.5 0-2.3-2.5-4.5-5.5-4.5z"/></svg>',
  dente: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5.5C10 3.5 6.5 3 5 5c-1.7 2.3-.5 5.5.5 8.5.6 1.9 1 4.5 2 4.5 1.3 0 .8-3.2 1.8-5.2.4-.9 1.4-1.3 2.7-1.3s2.3.4 2.7 1.3c1 2 .5 5.2 1.8 5.2 1 0 1.4-2.6 2-4.5 1-3 2.2-6.2.5-8.5-1.5-2-5-1.5-7 .5z"/></svg>',
  sol: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
};

/* ---------------- Utilidades ---------------- */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const dinheiro = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const gerarProtocolo = (prefixo) =>
  prefixo + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();

function toast(msg, tipo = "ok") {
  const wrap = $("#toastWrap");
  if (!wrap) return;
  const el = document.createElement("div");
  el.className = `toast toast-${tipo}`;
  const icone =
    tipo === "ok"
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
      : tipo === "erro"
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb7185" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';
  el.innerHTML = `<span style="flex-shrink:0;margin-top:1px">${icone}</span><span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add("saindo");
    setTimeout(() => el.remove(), 320);
  }, 3400);
}

const lerLS = (chave, padrao) => {
  try {
    const v = JSON.parse(localStorage.getItem(chave));
    return v ?? padrao;
  } catch {
    return padrao;
  }
};
const salvarLS = (chave, valor) =>
  localStorage.setItem(chave, JSON.stringify(valor));

function estrelasHTML(nota) {
  const cheias = Math.round(nota);
  let s = "";
  for (let i = 0; i < 5; i++)
    s += `<span style="opacity:${i < cheias ? 1 : 0.25}">★</span>`;
  return `<span class="estrelas" aria-label="${nota} de 5 estrelas">${s}</span>`;
}

/* ---------------- Cabeçalho / menu / reveal ---------------- */

function initHeader() {
  const header = $("#siteHeader");
  const onScroll = () =>
    header.classList.toggle("com-sombra", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const btn = $("#menuBtn");
  const menu = $("#mobileMenu");
  btn?.addEventListener("click", () => {
    const aberto = menu.classList.toggle("hidden");
    btn.setAttribute("aria-expanded", String(!aberto));
  });
  $$("#mobileMenu a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    })
  );
}

function initReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  els.forEach((e) => io.observe(e));
}

function initContadores() {
  const els = $$("[data-contar]");
  if (!els.length) return;
  const animar = (el) => {
    const alvo = Number(el.dataset.contar);
    const dur = 1400;
    const t0 = performance.now();
    const passo = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(alvo * eased).toLocaleString("pt-BR");
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animar(e.target);
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.4 }
  );
  els.forEach((e) => io.observe(e));
}

/* ---------------- Serviços ---------------- */

function renderServicos() {
  const grid = $("#servicesGrid");
  if (!grid) return;
  grid.innerHTML = SERVICOS.map(
    (s) => `
    <article class="card card-servico p-6 flex flex-col gap-3 reveal in">
      <div class="flex items-start justify-between gap-3">
        <div class="icone-servico" style="background:${s.cor}">${ICONES[s.icone]}</div>
        ${s.destaque ? `<span class="selo selo-top">${s.destaque}</span>` : ""}
      </div>
      <h3 class="font-display font-bold text-xl leading-tight">${s.nome}</h3>
      <p class="text-sm font-semibold" style="color:#78716c">${s.desc}</p>
      <div class="mt-auto pt-2 flex items-end justify-between gap-2">
        <div>
          <p class="text-xs font-bold uppercase tracking-wide" style="color:#a8a29e">${s.porPorte ? "a partir de" : "valor único"}</p>
          <p class="font-display font-extrabold text-2xl" style="color:#0f766e">${dinheiro(s.preco)}</p>
          <p class="text-xs font-bold" style="color:#a8a29e">Duração: ${s.duracao}</p>
        </div>
        <button class="btn btn-caramelo !px-5 !py-2.5 text-sm" data-agendar="${s.id}">Agendar</button>
      </div>
    </article>`
  ).join("");

  $$("#servicesGrid [data-agendar]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const select = $("#bkService");
      if (select) {
        select.value = btn.dataset.agendar;
        select.dispatchEvent(new Event("change"));
      }
      document.querySelector("#agendar")?.scrollIntoView({ behavior: "smooth" });
      const s = SERVICOS.find((x) => x.id === btn.dataset.agendar);
      toast(`Serviço <b>${s.nome}</b> selecionado. Complete o agendamento!`, "info");
    })
  );
}

/* ---------------- Agendamento ---------------- */

const agendamento = { slot: null };

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function formatarDataBR(iso) {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-").map(Number);
  const dt = new Date(a, m - 1, d);
  return dt.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function initAgendamento() {
  const selServico = $("#bkService");
  const selPro = $("#bkPro");
  const inputData = $("#bkDate");
  const slotsWrap = $("#slotsWrap");
  if (!selServico || !inputData || !slotsWrap) return;

  selServico.innerHTML =
    `<option value="" disabled selected>Selecione um serviço…</option>` +
    SERVICOS.map((s) => `<option value="${s.id}">${s.nome} — ${dinheiro(s.preco)}${s.porPorte ? "+" : ""}</option>`).join("");

  selPro.innerHTML = PROFISSIONAIS.map((p) => `<option value="${p.id}">${p.nome}</option>`).join("");

  const hoje = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const max = new Date();
  max.setDate(max.getDate() + 60);
  inputData.min = iso(hoje);
  inputData.max = iso(max);

  inputData.addEventListener("change", renderSlots);
  selServico.addEventListener("change", atualizarEstimativa);
  $$('input[name="porte"]').forEach((r) => r.addEventListener("change", atualizarEstimativa));

  $("#bkPhone")?.addEventListener("input", (e) => {
    e.target.value = mascararTelefone(e.target.value);
  });

  $("#bookingForm")?.addEventListener("submit", confirmarAgendamento);

  renderSlots();
  atualizarEstimativa();
  renderMeusAgendamentos();
}

function renderSlots() {
  const inputData = $("#bkDate");
  const wrap = $("#slotsWrap");
  const aviso = $("#slotsAviso");
  agendamento.slot = null;

  if (!inputData.value) {
    wrap.innerHTML = `<p class="text-sm font-bold col-span-full py-2" style="color:#a8a29e">Escolha uma data para ver os horários disponíveis.</p>`;
    if (aviso) aviso.textContent = "";
    atualizarEstimativa();
    return;
  }

  const [a, m, d] = inputData.value.split("-").map(Number);
  const dia = new Date(a, m - 1, d).getDay();

  if (dia === 0) {
    wrap.innerHTML = "";
    if (aviso) aviso.textContent = "Fechamos aos domingos. Escolha outro dia para mimar seu pet!";
    atualizarEstimativa();
    return;
  }
  if (aviso) aviso.textContent = dia === 6 ? "Aos sábados atendemos das 8h às 14h." : "";

  let lista = HORARIOS.filter((h) => (dia === 6 ? h <= "13:00" : true));

  // Simula horários já ocupados de forma estável por data
  const h = hashStr(inputData.value);
  const ocupados = new Set([lista[h % lista.length], lista[(h >> 3) % lista.length]]);

  // Bloqueia horários que já passaram (se for hoje)
  const agora = new Date();
  const ehHoje = inputData.value === agora.toISOString().slice(0, 10);

  wrap.innerHTML = lista
    .map((t) => {
      const passado =
        ehHoje &&
        Number(t.slice(0, 2)) * 60 + Number(t.slice(3)) <= agora.getHours() * 60 + agora.getMinutes() + 60;
      const off = ocupados.has(t) || passado;
      return `<button type="button" class="slot" data-slot="${t}" ${off ? "disabled" : ""}>${t}</button>`;
    })
    .join("");

  $$("#slotsWrap .slot").forEach((b) =>
    b.addEventListener("click", () => {
      $$("#slotsWrap .slot").forEach((x) => x.classList.remove("selecionado"));
      b.classList.add("selecionado");
      agendamento.slot = b.dataset.slot;
      atualizarEstimativa();
    })
  );
  atualizarEstimativa();
}

function servicoSelecionado() {
  return SERVICOS.find((s) => s.id === $("#bkService")?.value);
}
function porteSelecionado() {
  return document.querySelector('input[name="porte"]:checked')?.value || "P";
}

function calcularEstimativa() {
  const s = servicoSelecionado();
  if (!s) return null;
  const porte = porteSelecionado();
  const total = s.porPorte ? s.preco * MULT_PORTE[porte] : s.preco;
  return { servico: s, porte, total };
}

function atualizarEstimativa() {
  const box = $("#bkEstimate");
  if (!box) return;
  const est = calcularEstimativa();
  if (!est) {
    box.innerHTML = `<p class="text-sm font-bold" style="color:#a8a29e">Selecione um serviço para ver a estimativa de valor.</p>`;
    return;
  }
  const data = $("#bkDate")?.value;
  box.innerHTML = `
    <div class="flex items-center justify-between text-sm font-bold" style="color:#78716c">
      <span>${est.servico.nome}</span><span>${dinheiro(est.servico.preco)}${est.servico.porPorte ? " base" : ""}</span>
    </div>
    ${
      est.servico.porPorte
        ? `<div class="flex items-center justify-between text-sm font-bold mt-1" style="color:#78716c">
             <span>Porte ${est.porte} (${ROTULO_PORTE[est.porte].split(" ")[0]}${est.porte === "P" ? "" : " ×" + MULT_PORTE[est.porte].toLocaleString("pt-BR")})</span>
             <span>${dinheiro(est.total)}</span>
           </div>`
        : ""
    }
    <div class="flex items-center justify-between mt-2 pt-2" style="border-top:2px dashed #f3e7d7">
      <span class="font-display font-bold">Estimativa</span>
      <span class="font-display font-extrabold text-2xl" style="color:#ea580c">${dinheiro(est.total)}</span>
    </div>
    <p class="text-xs font-bold mt-1" style="color:#a8a29e">
      ${data ? formatarDataBR(data) : "Data a escolher"}${agendamento.slot ? " às " + agendamento.slot : ""} · ${est.servico.duracao}
    </p>`;
}

function confirmarAgendamento(e) {
  e.preventDefault();
  const pet = $("#bkPet").value.trim();
  const tutor = $("#bkTutor").value.trim();
  const fone = $("#bkPhone").value.trim();
  const data = $("#bkDate").value;
  const est = calcularEstimativa();

  if (!est) return toast("Escolha um serviço para continuar.", "erro");
  if (!pet) return toast("Conte pra gente o nome do pet!", "erro");
  if (!data) return toast("Escolha a data do atendimento.", "erro");
  if (!agendamento.slot) return toast("Selecione um horário disponível.", "erro");
  if (!tutor) return toast("Informe o nome do tutor.", "erro");
  if (fone.replace(/\D/g, "").length < 10) return toast("Informe um telefone válido com DDD.", "erro");

  const especie = document.querySelector('input[name="especie"]:checked')?.value || "Cão";
  const pro = PROFISSIONAIS.find((p) => p.id === $("#bkPro").value)?.nome || "";

  const ag = {
    protocolo: gerarProtocolo("PC"),
    pet, especie, porte: porteSelecionado(),
    servico: est.servico.nome, preco: est.total,
    pro, data, hora: agendamento.slot, tutor, fone,
    obs: $("#bkNotes").value.trim(),
    criadoEm: new Date().toISOString(),
  };

  const lista = lerLS("patachic_bookings", []);
  lista.unshift(ag);
  salvarLS("patachic_bookings", lista);

  abrirModalAgendamento(ag);
  e.target.reset();
  agendamento.slot = null;
  renderSlots();
  atualizarEstimativa();
  renderMeusAgendamentos();
}

function renderMeusAgendamentos() {
  const wrap = $("#myBookings");
  if (!wrap) return;
  const lista = lerLS("patachic_bookings", []);
  if (!lista.length) {
    wrap.innerHTML = `<p class="text-sm font-bold py-2" style="color:#a8a29e">Você ainda não tem agendamentos. Que tal mimar seu pet hoje?</p>`;
    return;
  }
  wrap.innerHTML = lista
    .map(
      (b) => `
      <div class="card p-4 flex items-center gap-3">
        <div class="icone-servico !w-11 !h-11 !rounded-xl" style="background:linear-gradient(135deg,#2dd4bf,#0f766e)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-display font-bold leading-tight truncate">${b.servico}</p>
          <p class="text-xs font-bold" style="color:#78716c">${b.pet} · ${formatarDataBR(b.data)} às ${b.hora}</p>
          <p class="text-xs font-extrabold" style="color:#0f766e">${b.protocolo} · ${dinheiro(b.preco)}</p>
        </div>
        <button class="qtd-btn !w-8 !h-8" data-cancelar="${b.protocolo}" title="Cancelar agendamento" aria-label="Cancelar agendamento" style="color:#e11d48">✕</button>
      </div>`
    )
    .join("");

  $$("#myBookings [data-cancelar]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const prot = btn.dataset.cancelar;
      salvarLS(
        "patachic_bookings",
        lerLS("patachic_bookings", []).filter((b) => b.protocolo !== prot)
      );
      renderMeusAgendamentos();
      toast(`Agendamento <b>${prot}</b> cancelado.`, "info");
    })
  );
}

function abrirModalAgendamento(ag) {
  const modal = $("#bookingModal");
  $("#bmDetails").innerHTML = `
    <div class="card !bg-white p-5 text-left space-y-1.5 text-sm font-bold" style="color:#57534e">
      <p><span style="color:#a8a29e">Pet:</span> ${ag.pet} (${ag.especie} · porte ${ag.porte})</p>
      <p><span style="color:#a8a29e">Serviço:</span> ${ag.servico}</p>
      <p><span style="color:#a8a29e">Quando:</span> ${formatarDataBR(ag.data)} às ${ag.hora}</p>
      <p><span style="color:#a8a29e">Profissional:</span> ${ag.pro}</p>
      <p><span style="color:#a8a29e">Tutor:</span> ${ag.tutor} · ${ag.fone}</p>
      <p class="text-base pt-1"><span style="color:#a8a29e">Estimativa:</span> <span class="font-display font-extrabold text-xl" style="color:#ea580c">${dinheiro(ag.preco)}</span></p>
    </div>`;
  const msg = encodeURIComponent(
    `Olá! Sou ${ag.tutor} e agendei pelo site: ${ag.servico} para ${ag.pet} em ${formatarDataBR(ag.data)} às ${ag.hora}. Protocolo ${ag.protocolo}.`
  );
  $("#bmWhatsapp").href = `https://wa.me/${WHATSAPP}?text=${msg}`;
  modal.classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function mascararTelefone(v) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n.length ? `(${n}` : "";
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

/* ---------------- Loja ---------------- */

const loja = { busca: "", categoria: "Todos", ordem: "rel" };

function initLoja() {
  const pills = $("#pillsWrap");
  if (pills) {
    pills.innerHTML = CATEGORIAS.map((c) => {
      const n = c === "Todos" ? PRODUTOS.length : PRODUTOS.filter((p) => p.cat === c).length;
      return `<button class="pilula ${c === "Todos" ? "ativa" : ""}" data-cat="${c}">${c} <span style="opacity:.55">(${n})</span></button>`;
    }).join("");
    $$("#pillsWrap .pilula").forEach((b) =>
      b.addEventListener("click", () => {
        $$("#pillsWrap .pilula").forEach((x) => x.classList.remove("ativa"));
        b.classList.add("ativa");
        loja.categoria = b.dataset.cat;
        renderProdutos();
      })
    );
  }

  $("#searchInput")?.addEventListener("input", (e) => {
    loja.busca = e.target.value.trim().toLowerCase();
    renderProdutos();
  });

  $("#sortSelect")?.addEventListener("change", (e) => {
    loja.ordem = e.target.value;
    renderProdutos();
  });

  renderProdutos();
}

function produtosFiltrados() {
  let lista = PRODUTOS.filter(
    (p) =>
      (loja.categoria === "Todos" || p.cat === loja.categoria) &&
      (!loja.busca || `${p.nome} ${p.cat} ${p.desc}`.toLowerCase().includes(loja.busca))
  );
  if (loja.ordem === "asc") lista = [...lista].sort((a, b) => a.preco - b.preco);
  if (loja.ordem === "desc") lista = [...lista].sort((a, b) => b.preco - a.preco);
  if (loja.ordem === "rating") lista = [...lista].sort((a, b) => b.rating - a.rating);
  return lista;
}

function renderProdutos() {
  const grid = $("#productsGrid");
  if (!grid) return;
  const lista = produtosFiltrados();
  $("#resultCount").textContent = lista.length === 1 ? "1 produto" : `${lista.length} produtos`;

  if (!lista.length) {
    grid.innerHTML = `
      <div class="col-span-full card p-10 text-center">
        <p class="font-display font-bold text-xl">Nenhum produto encontrado</p>
        <p class="font-bold text-sm mt-1" style="color:#a8a29e">Tente buscar por outro termo ou categoria.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista
    .map(
      (p) => `
      <article class="card card-produto flex flex-col">
        <div class="relative overflow-hidden" style="aspect-ratio:1/1;background:#fff7ed">
          <img class="foto w-full h-full" style="object-fit:cover" src="${p.img}" alt="${p.nome}" loading="lazy">
          ${p.selo ? `<span class="selo selo-${p.selo} absolute top-3 left-3">${p.seloTexto}</span>` : ""}
        </div>
        <div class="p-5 flex flex-col gap-1.5 flex-1">
          <p class="text-xs font-extrabold uppercase tracking-wider" style="color:#0f766e">${p.cat}</p>
          <h3 class="font-display font-bold text-lg leading-snug">${p.nome}</h3>
          <div class="flex items-center gap-2 text-sm">
            ${estrelasHTML(p.rating)}
            <span class="font-bold text-xs" style="color:#a8a29e">${p.rating.toLocaleString("pt-BR")} (${p.avaliacoes})</span>
          </div>
          <div class="mt-auto pt-2">
            ${p.antigo ? `<p class="text-sm font-bold line-through" style="color:#b8aca0">${dinheiro(p.antigo)}</p>` : ""}
            <p class="font-display font-extrabold text-2xl" style="color:#292524">${dinheiro(p.preco)}</p>
            <p class="text-xs font-bold" style="color:#a8a29e">em até 3x de ${dinheiro(p.preco / 3)} sem juros</p>
            <button class="btn btn-caramelo w-full mt-3 !py-2.5 text-sm" data-add="${p.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2 3h3l2.6 12.5a1 1 0 0 0 1 .5h8.7a1 1 0 0 0 1-.8L21 7H6"/></svg>
              Adicionar
            </button>
          </div>
        </div>
      </article>`
    )
    .join("");

  $$('#productsGrid [data-add]').forEach((b) =>
    b.addEventListener("click", () => adicionarCarrinho(b.dataset.add))
  );
}

/* ---------------- Carrinho ---------------- */

let cupomAtivo = null;

const getCarrinho = () => lerLS("patachic_cart", []);
const setCarrinho = (c) => {
  salvarLS("patachic_cart", c);
  renderCarrinho();
};

function adicionarCarrinho(id) {
  const c = getCarrinho();
  const item = c.find((i) => i.id === id);
  if (item) item.qtd++;
  else c.push({ id, qtd: 1 });
  setCarrinho(c);
  const p = PRODUTOS.find((x) => x.id === id);
  toast(`<b>${p.nome}</b> adicionado ao carrinho!`);
  abrirCarrinho();
}

function totaisCarrinho() {
  const c = getCarrinho();
  const subtotal = c.reduce((s, i) => {
    const p = PRODUTOS.find((x) => x.id === i.id);
    return s + (p ? p.preco * i.qtd : 0);
  }, 0);
  const desconto = cupomAtivo ? subtotal * 0.1 : 0;
  const base = subtotal - desconto;
  const frete = c.length === 0 || base >= FRETE_GRATIS_MINIMO ? 0 : VALOR_FRETE;
  return { subtotal, desconto, frete, total: base + frete, qtd: c.reduce((s, i) => s + i.qtd, 0) };
}

function renderCarrinho() {
  const c = getCarrinho();
  const t = totaisCarrinho();

  const badge = $("#cartCount");
  if (badge) {
    badge.textContent = t.qtd;
    badge.classList.toggle("hidden", t.qtd === 0);
  }

  const wrap = $("#cartItems");
  if (wrap) {
    if (!c.length) {
      wrap.innerHTML = `
        <div class="text-center py-10">
          <div class="mx-auto mb-4 flex items-center justify-center" style="width:5rem;height:5rem;border-radius:999px;background:#fff7ed">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#d6c3ae" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2 3h3l2.6 12.5a1 1 0 0 0 1 .5h8.7a1 1 0 0 0 1-.8L21 7H6"/></svg>
          </div>
          <p class="font-display font-bold text-lg">Seu carrinho está vazio</p>
          <p class="text-sm font-bold" style="color:#a8a29e">Que tal um agrado para o seu pet?</p>
        </div>`;
    } else {
      wrap.innerHTML = c
        .map((i) => {
          const p = PRODUTOS.find((x) => x.id === i.id);
          if (!p) return "";
          return `
          <div class="item-carrinho card !rounded-2xl p-3 flex gap-3 items-center">
            <img src="${p.img}" alt="${p.nome}">
            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm leading-snug truncate">${p.nome}</p>
              <p class="font-display font-extrabold" style="color:#0f766e">${dinheiro(p.preco)}</p>
              <div class="flex items-center gap-2 mt-1">
                <button class="qtd-btn" data-dec="${p.id}" aria-label="Diminuir quantidade">−</button>
                <span class="font-extrabold text-sm w-5 text-center">${i.qtd}</span>
                <button class="qtd-btn" data-inc="${p.id}" aria-label="Aumentar quantidade">+</button>
              </div>
            </div>
            <button class="qtd-btn" data-del="${p.id}" title="Remover" aria-label="Remover item" style="color:#e11d48">✕</button>
          </div>`;
        })
        .join("");
    }
  }

  // Totais
  $("#subtotalVal").textContent = dinheiro(t.subtotal);
  $("#discountRow").style.display = cupomAtivo ? "flex" : "none";
  $("#discountVal").textContent = "−" + dinheiro(t.desconto);
  $("#shippingVal").textContent = t.frete === 0 ? "Grátis" : dinheiro(t.frete);
  $("#totalVal").textContent = dinheiro(t.total);

  const pct = Math.min(((t.subtotal - t.desconto) / FRETE_GRATIS_MINIMO) * 100, 100);
  $("#shipBar").style.width = pct + "%";
  $("#shipMsg").innerHTML =
    t.subtotal - t.desconto >= FRETE_GRATIS_MINIMO
      ? "Você ganhou <b style='color:#0f766e'>frete grátis</b>!"
      : `Faltam <b>${dinheiro(FRETE_GRATIS_MINIMO - (t.subtotal - t.desconto))}</b> para o frete grátis`;

  $("#checkoutBtn").disabled = c.length === 0;
  $("#checkoutBtn").style.opacity = c.length === 0 ? 0.5 : 1;

  // Listeners dos botões de quantidade
  $$("#cartItems [data-inc]").forEach((b) =>
    b.addEventListener("click", () => alterarQtd(b.dataset.inc, 1))
  );
  $$("#cartItems [data-dec]").forEach((b) =>
    b.addEventListener("click", () => alterarQtd(b.dataset.dec, -1))
  );
  $$("#cartItems [data-del]").forEach((b) =>
    b.addEventListener("click", () => {
      setCarrinho(getCarrinho().filter((i) => i.id !== b.dataset.del));
      toast("Item removido do carrinho.", "info");
    })
  );
}

function alterarQtd(id, delta) {
  let c = getCarrinho();
  const item = c.find((i) => i.id === id);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) c = c.filter((i) => i.id !== id);
  setCarrinho(c);
}

function abrirCarrinho() {
  $("#cartDrawer").classList.add("aberta");
  $("#cartOverlay").classList.add("aberto");
  document.body.style.overflow = "hidden";
}
function fecharCarrinho() {
  $("#cartDrawer").classList.remove("aberta");
  $("#cartOverlay").classList.remove("aberto");
  document.body.style.overflow = "";
}

function initCarrinho() {
  renderCarrinho();
  $("#cartBtn")?.addEventListener("click", abrirCarrinho);
  $("#closeCart")?.addEventListener("click", fecharCarrinho);
  $("#cartOverlay")?.addEventListener("click", fecharCarrinho);
  $("#continueBtn")?.addEventListener("click", fecharCarrinho);

  $("#couponBtn")?.addEventListener("click", () => {
    const v = $("#couponInput").value.trim().toUpperCase();
    const msg = $("#couponMsg");
    if (v === CUPOM_BEMVINDO) {
      cupomAtivo = v;
      msg.textContent = "Cupom aplicado: 10% de desconto!";
      msg.style.color = "#0f766e";
      toast("Cupom <b>BEMVINDO10</b> aplicado!");
    } else {
      cupomAtivo = null;
      msg.textContent = v ? "Cupom inválido. Tente BEMVINDO10." : "";
      msg.style.color = "#e11d48";
    }
    renderCarrinho();
  });

  $("#checkoutBtn")?.addEventListener("click", () => {
    if (!getCarrinho().length) return;
    fecharCarrinho();
    abrirCheckout();
  });

  $("#closeCheckout")?.addEventListener("click", fecharCheckout);
  $("#checkoutModal")?.addEventListener("click", (e) => {
    if (e.target.id === "checkoutModal") fecharCheckout();
  });
  $("#coCep")?.addEventListener("input", (e) => {
    const n = e.target.value.replace(/\D/g, "").slice(0, 8);
    e.target.value = n.length > 5 ? n.slice(0, 5) + "-" + n.slice(5) : n;
  });
  $("#coPhone")?.addEventListener("input", (e) => {
    e.target.value = mascararTelefone(e.target.value);
  });
  $("#checkoutForm")?.addEventListener("submit", finalizarPedido);
  $("#successClose")?.addEventListener("click", fecharCheckout);
}

/* ---------------- Checkout ---------------- */

function abrirCheckout() {
  const t = totaisCarrinho();
  $("#coSummary").innerHTML =
    getCarrinho()
      .map((i) => {
        const p = PRODUTOS.find((x) => x.id === i.id);
        return `<div class="flex justify-between gap-3 text-sm font-bold" style="color:#57534e">
          <span class="truncate">${i.qtd}x ${p.nome}</span><span class="whitespace-nowrap">${dinheiro(p.preco * i.qtd)}</span></div>`;
      })
      .join("") +
    `<div class="pt-2 mt-2 space-y-1" style="border-top:2px dashed #f3e7d7">
      <div class="flex justify-between text-sm font-bold" style="color:#78716c"><span>Subtotal</span><span>${dinheiro(t.subtotal)}</span></div>
      ${cupomAtivo ? `<div class="flex justify-between text-sm font-bold" style="color:#0f766e"><span>Cupom ${cupomAtivo}</span><span>−${dinheiro(t.desconto)}</span></div>` : ""}
      <div class="flex justify-between text-sm font-bold" style="color:#78716c"><span>Frete</span><span>${t.frete === 0 ? "Grátis" : dinheiro(t.frete)}</span></div>
      <div class="flex justify-between items-center"><span class="font-display font-bold text-lg">Total</span><span class="font-display font-extrabold text-2xl" style="color:#ea580c">${dinheiro(t.total)}</span></div>
    </div>`;

  $("#coStepForm").classList.remove("hidden");
  $("#coStepSuccess").classList.add("hidden");
  $("#checkoutModal").classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function fecharCheckout() {
  $("#checkoutModal").classList.remove("aberto");
  document.body.style.overflow = "";
}

function finalizarPedido(e) {
  e.preventDefault();
  const nome = $("#coName").value.trim();
  const email = $("#coEmail").value.trim();
  const fone = $("#coPhone").value.trim();
  if (!nome) return toast("Informe seu nome para concluir.", "erro");
  if (!email || !email.includes("@")) return toast("Informe um e-mail válido.", "erro");
  if (fone.replace(/\D/g, "").length < 10) return toast("Informe um telefone válido com DDD.", "erro");

  const pedido = gerarProtocolo("PED");
  $("#osNumber").textContent = pedido;
  $("#osName").textContent = nome.split(" ")[0];
  const t = totaisCarrinho();
  $("#osTotal").textContent = dinheiro(t.total);

  $("#coStepForm").classList.add("hidden");
  $("#coStepSuccess").classList.remove("hidden");

  salvarLS("patachic_cart", []);
  cupomAtivo = null;
  $("#couponInput").value = "";
  $("#couponMsg").textContent = "";
  renderCarrinho();
  e.target.reset();
}

/* ---------------- Depoimentos ---------------- */

function initDepoimentos() {
  const track = $("#testiTrack");
  const dots = $("#testiDots");
  if (!track || !dots) return;

  track.innerHTML = DEPOIMENTOS.map(
    (d) => `
    <div class="w-full flex-shrink-0 px-1">
      <div class="card p-8 text-center max-w-2xl mx-auto">
        ${estrelasHTML(5)}
        <p class="font-display font-bold text-xl leading-relaxed mt-3">“${d.texto}”</p>
        <div class="flex items-center justify-center gap-3 mt-5">
          <div class="flex items-center justify-center font-display font-extrabold text-white text-lg" style="width:3rem;height:3rem;border-radius:999px;background:${d.cor}">${d.nome.charAt(0)}</div>
          <div class="text-left">
            <p class="font-extrabold">${d.nome}</p>
            <p class="text-sm font-bold" style="color:#a8a29e">${d.pet}</p>
          </div>
        </div>
      </div>
    </div>`
  ).join("");

  dots.innerHTML = DEPOIMENTOS.map((_, i) => `<button class="testi-dot ${i === 0 ? "ativo" : ""}" data-dot="${i}" aria-label="Ver depoimento ${i + 1}"></button>`).join("");

  let idx = 0;
  let timer = null;
  const irPara = (i) => {
    idx = (i + DEPOIMENTOS.length) % DEPOIMENTOS.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    $$("#testiDots .testi-dot").forEach((dt, j) => dt.classList.toggle("ativo", j === idx));
  };
  const auto = () => {
    clearInterval(timer);
    timer = setInterval(() => irPara(idx + 1), 6000);
  };

  $$("#testiDots .testi-dot").forEach((dt) =>
    dt.addEventListener("click", () => {
      irPara(Number(dt.dataset.dot));
      auto();
    })
  );
  $("#testiPrev")?.addEventListener("click", () => {
    irPara(idx - 1);
    auto();
  });
  $("#testiNext")?.addEventListener("click", () => {
    irPara(idx + 1);
    auto();
  });
  $("#depoimentos")?.addEventListener("mouseenter", () => clearInterval(timer));
  $("#depoimentos")?.addEventListener("mouseleave", auto);
  auto();
}

/* ---------------- FAQ / modais genéricos / diversos ---------------- */

function initFaq() {
  $$(".faq-item").forEach((item) => {
    $(".faq-q", item)?.addEventListener("click", () => {
      const estavaAberto = item.classList.contains("aberto");
      $$(".faq-item").forEach((x) => x.classList.remove("aberto"));
      if (!estavaAberto) item.classList.add("aberto");
    });
  });
}

function initModaisGenericos() {
  const bm = $("#bookingModal");
  $("#bmClose")?.addEventListener("click", () => {
    bm.classList.remove("aberto");
    document.body.style.overflow = "";
  });
  bm?.addEventListener("click", (e) => {
    if (e.target.id === "bookingModal") {
      bm.classList.remove("aberto");
      document.body.style.overflow = "";
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      fecharCarrinho();
      fecharCheckout();
      bm?.classList.remove("aberto");
      document.body.style.overflow = "";
    }
  });
}

function initDiversos() {
  const ano = $("#yearNow");
  if (ano) ano.textContent = new Date().getFullYear();

  $("#contactForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Mensagem enviada! Retornamos em até 1 dia útil.");
    e.target.reset();
  });

  $("#newsForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Inscrição confirmada! Use o cupom <b>BEMVINDO10</b>.");
    e.target.reset();
  });

  $$("[data-plano]").forEach((b) =>
    b.addEventListener("click", () => {
      const msg = encodeURIComponent(`Olá! Quero assinar o ${b.dataset.plano} do Clube PataChic. Pode me passar os detalhes?`);
      window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
    })
  );
}

/* ---------------- Boot ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initReveal();
  initContadores();
  renderServicos();
  initAgendamento();
  initLoja();
  initCarrinho();
  initDepoimentos();
  initFaq();
  initModaisGenericos();
  initDiversos();
});
