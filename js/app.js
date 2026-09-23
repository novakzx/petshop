/* ============================================================
   PataChic — front-end (consome a API Flask em /api)
   ============================================================ */

"use strict";

/* ---------------- Config ---------------- */

const WHATSAPP = "5511987654321";
const FRETE_GRATIS_MINIMO = 149;
const VALOR_FRETE = 14.9;

const PROFISSIONAIS = [
  { id: "qualquer", nome: "Sem preferência (primeiro horário livre)" },
  { id: "camila", nome: "Camila Torres — Tosadora Master" },
  { id: "diego", nome: "Diego Santos — Esteticista Pet" },
  { id: "pri", nome: "Patrícia Lima — Banho & Spa" },
];

const MULT_PORTE = { P: 1, M: 1.25, G: 1.5 };
const CATEGORIAS = ["Todos", "Alimentação", "Brinquedos", "Conforto", "Gatos", "Higiene"];

const ICONES = {
  banho: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2z"/><path d="M6 12V5a2 2 0 0 1 4 0"/><path d="M8 21l-1 1M16 21l1 1M9 8c1.5 0 1.5 1.5 3 1.5S13.5 8 15 8"/></svg>',
  tesoura: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.5 15.5M20 20L8.5 8.5"/></svg>',
  maquina: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="8" width="10" height="12" rx="3"/><path d="M9 8V5h6v3M9 12h6M10 2v2M14 2v2M12 2v1"/></svg>',
  spa: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-5 0-8-3-8-7 3 0 5 1 6 2-1-4 0-8 4-10 5 2.5 6 8 4 12-1 2-3 3-6 3z"/><path d="M12 21c0-6 1-10 4-13"/></svg>',
  pata: '<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><ellipse cx="7.5" cy="10" rx="2.2" ry="2.8"/><ellipse cx="12" cy="7.5" rx="2.2" ry="2.8"/><ellipse cx="16.5" cy="10" rx="2.2" ry="2.8"/><path d="M12 12.5c-3 0-5.5 2.2-5.5 4.5 0 1.5 1.2 2.5 2.6 2.5 1 0 1.5-.6 2.9-.6s1.9.6 2.9.6c1.4 0 2.6-1 2.6-2.5 0-2.3-2.5-4.5-5.5-4.5z"/></svg>',
  dente: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5.5C10 3.5 6.5 3 5 5c-1.7 2.3-.5 5.5.5 8.5.6 1.9 1 4.5 2 4.5 1.3 0 .8-3.2 1.8-5.2.4-.9 1.4-1.3 2.7-1.3s2.3.4 2.7 1.3c1 2 .5 5.2 1.8 5.2 1 0 1.4-2.6 2-4.5 1-3 2.2-6.2.5-8.5-1.5-2-5-1.5-7 .5z"/></svg>',
  sol: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
};

/* Dados de contingência (se a API estiver fora do ar, a vitrine segue visível) */
const FALLBACK_SERVICOS = [
  { id: "banho", nome: "Banho Completo", preco: 59.9, duracao: "60 min", por_porte: 1, icone: "banho", cor: "#0284c7", descricao: "Banho premium com secagem, perfume e acabamento.", destaque: null },
  { id: "tosa-hig", nome: "Tosa Higiênica", preco: 45, duracao: "40 min", por_porte: 0, icone: "tesoura", cor: "#0f766e", descricao: "Aparos em patas, barriga e ouvidos.", destaque: null },
  { id: "tosa-tesoura", nome: "Tosa na Tesoura", preco: 89.9, duracao: "90 min", por_porte: 1, icone: "tesoura", cor: "#ea580c", descricao: "Acabamento artesanal com banho incluso.", destaque: "Mais procurada" },
  { id: "tosa-maquina", nome: "Tosa na Máquina", preco: 79.9, duracao: "75 min", por_porte: 1, icone: "maquina", cor: "#7c3aed", descricao: "Pelagem uniforme com banho incluso.", destaque: null },
  { id: "spa", nome: "Spa & Hidratação", preco: 69.9, duracao: "50 min", por_porte: 1, icone: "spa", cor: "#e11d48", descricao: "Hidratação, massagem e aromaterapia.", destaque: null },
  { id: "unhas", nome: "Corte de Unhas", preco: 25, duracao: "20 min", por_porte: 0, icone: "pata", cor: "#d97706", descricao: "Corte seguro com lixamento.", destaque: null },
  { id: "dentes", nome: "Escovação Dentária", preco: 35, duracao: "25 min", por_porte: 0, icone: "dente", cor: "#059669", descricao: "Higiene bucal veterinária.", destaque: null },
  { id: "daycare", nome: "Day Care (diária)", preco: 49.9, duracao: "o dia todo", por_porte: 0, icone: "sol", cor: "#db2777", descricao: "Dia inteiro de brincadeiras monitoradas.", destaque: null },
];

let SERVICOS = [];
let PRODUTOS = [];
let API_OK = false;

/* ---------------- API ---------------- */

async function api(path, options = {}) {
  const r = await fetch("/api" + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const dados = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(dados.erro || `HTTP ${r.status}`);
  return dados;
}
const apiGet = (p) => api(p);
const apiPost = (p, corpo) => api(p, { method: "POST", body: JSON.stringify(corpo) });
const apiDel = (p) => api(p, { method: "DELETE" });

/* ---------------- Utilidades ---------------- */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const dinheiro = (v) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function toast(msg, tipo = "ok") {
  const wrap = $("#toastWrap");
  if (!wrap) return;
  const el = document.createElement("div");
  el.className = `toast toast-${tipo}`;
  const cor = tipo === "ok" ? "#4ade80" : tipo === "erro" ? "#f87171" : "#E4C87F";
  const icone =
    tipo === "ok"
      ? '<path d="M20 6L9 17l-5-5"/>'
      : '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>';
  el.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px">${icone}</svg><span>${msg}</span>`;
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
const salvarLS = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

function estrelasHTML(nota) {
  const cheias = Math.round(nota);
  let s = "";
  for (let i = 0; i < 5; i++) s += `<span style="opacity:${i < cheias ? 1 : 0.25}">★</span>`;
  return `<span class="estrelas" aria-label="${nota} de 5 estrelas">${s}</span>`;
}

function formatarDataBR(iso) {
  if (!iso) return "—";
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function mascararTelefone(v) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n.length ? `(${n}` : "";
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

/* ---------------- Cabeçalho / menu / contadores ---------------- */

function initHeader() {
  const btn = $("#menuBtn");
  const menu = $("#mobileMenu");
  btn?.addEventListener("click", () => {
    const escondido = menu.classList.toggle("hidden");
    menu.classList.toggle("flex", escondido === false);
    btn.setAttribute("aria-expanded", String(!escondido));
  });
  $$("#mobileMenu a").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.add("hidden");
      menu.classList.remove("flex");
      btn.setAttribute("aria-expanded", "false");
    })
  );

  const dropBtn = $("#navBoutiqueBtn");
  const drop = $("#navDrop");
  dropBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const aberto = drop.classList.toggle("hidden");
    dropBtn.setAttribute("aria-expanded", String(!aberto));
  });
  document.addEventListener("click", () => {
    drop?.classList.add("hidden");
    dropBtn?.setAttribute("aria-expanded", "false");
  });

  $$("[data-cat-link]").forEach((a) =>
    a.addEventListener("click", () => filtrarCategoria(a.dataset.catLink))
  );

  $("#navSearchBtn")?.addEventListener("click", () => {
    document.querySelector("#loja")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $("#searchInput")?.focus(), 500);
  });
}

function initContadores() {
  const els = $$("[data-contar]");
  if (!els.length) return;
  const animar = (el) => {
    const alvo = Number(el.dataset.contar);
    const t0 = performance.now();
    const passo = (t) => {
      const p = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3))).toLocaleString("pt-BR");
      if (p < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { animar(e.target); io.unobserve(e.target); }
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
    <article class="card card-produto p-5 flex flex-col gap-2.5 w-60 sm:w-64 flex-shrink-0" style="scroll-snap-align:start">
      <div class="flex items-center gap-3">
        <div class="icone-servico !w-12 !h-12" style="background:${s.cor}">${ICONES[s.icone] || ICONES.pata}</div>
        <div>
          <h3 class="font-display font-extrabold leading-tight">${s.nome}</h3>
          <p class="text-xs font-bold" style="color:#a89e83">${s.duracao}</p>
        </div>
      </div>
      ${s.destaque ? `<span class="selo selo-top self-start">${s.destaque}</span>` : ""}
      <div class="flex items-end justify-between gap-2 mt-auto pt-1">
        <div>
          <p class="text-[0.7rem] font-bold uppercase tracking-wide" style="color:#a89e83">${s.por_porte ? "a partir de" : "valor único"}</p>
          <p class="font-display font-black text-xl" style="color:#14532D">${dinheiro(s.preco)}</p>
        </div>
        <button class="btn btn-verde !px-4 !py-2 text-xs" data-agendar="${s.id}">Selecionar</button>
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
      $("#bookingForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
      const s = SERVICOS.find((x) => x.id === btn.dataset.agendar);
      if (s) toast(`Serviço <b>${s.nome}</b> selecionado.`, "info");
    })
  );
}

/* ---------------- Agendamento ---------------- */

const agendamento = { slot: null };

function servicoSelecionado() {
  return SERVICOS.find((s) => s.id === $("#bkService")?.value);
}
function porteSelecionado() {
  return document.querySelector('input[name="porte"]:checked')?.value || "P";
}

function initAgendamento() {
  const selServico = $("#bkService");
  const selPro = $("#bkPro");
  const inputData = $("#bkDate");
  if (!selServico || !inputData) return;

  selPro.innerHTML = PROFISSIONAIS.map((p) => `<option value="${p.nome}">${p.nome}</option>`).join("");

  const hoje = new Date();
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const max = new Date();
  max.setDate(max.getDate() + 60);
  inputData.min = iso(hoje);
  inputData.max = iso(max);

  inputData.addEventListener("change", renderSlots);
  selServico.addEventListener("change", atualizarEstimativa);
  $$('input[name="porte"]').forEach((r) => r.addEventListener("change", atualizarEstimativa));
  $("#bkPhone")?.addEventListener("input", (e) => { e.target.value = mascararTelefone(e.target.value); });
  $("#bookingForm")?.addEventListener("submit", confirmarAgendamento);

  if (API_OK) carregarMeusAgendamentos();
  else {
    $("#myBookings").innerHTML = `<p class="text-sm font-bold py-2" style="color:#a89e83">Conecte o backend para ver seus agendamentos.</p>`;
    $("#slotsWrap").innerHTML = `<p class="text-sm font-bold col-span-full py-2" style="color:#a89e83">Backend offline — inicie a API para ver horários.</p>`;
  }
  atualizarEstimativa();
}

function popularServicosSelect() {
  const sel = $("#bkService");
  if (!sel) return;
  sel.innerHTML =
    `<option value="" disabled selected>Selecione um serviço…</option>` +
    SERVICOS.map((s) => `<option value="${s.id}">${s.nome} — ${dinheiro(s.preco)}${s.por_porte ? "+" : ""}</option>`).join("");
}

async function renderSlots() {
  const inputData = $("#bkDate");
  const wrap = $("#slotsWrap");
  const aviso = $("#slotsAviso");
  agendamento.slot = null;

  if (!inputData.value) {
    wrap.innerHTML = `<p class="text-sm font-bold col-span-full py-2" style="color:#a89e83">Escolha uma data para ver os horários disponíveis.</p>`;
    if (aviso) aviso.textContent = "";
    atualizarEstimativa();
    return;
  }
  if (!API_OK) {
    wrap.innerHTML = `<p class="text-sm font-bold col-span-full py-2" style="color:#a89e83">Backend offline — inicie a API para ver horários.</p>`;
    return;
  }

  wrap.innerHTML = `<p class="text-sm font-bold col-span-full py-2" style="color:#a89e83">Buscando horários…</p>`;
  try {
    const disp = await apiGet(`/disponibilidade?data=${inputData.value}`);
    if (!disp.aberto) {
      wrap.innerHTML = "";
      if (aviso) aviso.textContent = disp.motivo || "Fechado neste dia.";
      atualizarEstimativa();
      return;
    }
    if (aviso) aviso.textContent = new Date(inputData.value + "T12:00").getDay() === 6 ? "Aos sábados atendemos das 8h às 14h." : "";
    wrap.innerHTML = disp.slots
      .map((s) => `<button type="button" class="slot" data-slot="${s.hora}" ${s.livre ? "" : "disabled"}>${s.hora}</button>`)
      .join("");
    $$("#slotsWrap .slot").forEach((b) =>
      b.addEventListener("click", () => {
        $$("#slotsWrap .slot").forEach((x) => x.classList.remove("selecionado"));
        b.classList.add("selecionado");
        agendamento.slot = b.dataset.slot;
        atualizarEstimativa();
      })
    );
  } catch (e) {
    wrap.innerHTML = `<p class="text-sm font-bold col-span-full py-2" style="color:#B91C1C">Erro ao buscar horários: ${e.message}</p>`;
  }
  atualizarEstimativa();
}

function calcularEstimativa() {
  const s = servicoSelecionado();
  if (!s) return null;
  const porte = porteSelecionado();
  return { servico: s, porte, total: s.preco * (s.por_porte ? MULT_PORTE[porte] : 1) };
}

function atualizarEstimativa() {
  const box = $("#bkEstimate");
  if (!box) return;
  const est = calcularEstimativa();
  if (!est) {
    box.innerHTML = `<p class="text-sm font-bold" style="color:#a89e83">Selecione um serviço para ver a estimativa de valor.</p>`;
    return;
  }
  const data = $("#bkDate")?.value;
  box.innerHTML = `
    <div class="flex items-center justify-between text-sm font-bold" style="color:#5F6B5F">
      <span>${est.servico.nome}</span><span>${dinheiro(est.servico.preco)}${est.servico.por_porte ? " base" : ""}</span>
    </div>
    ${est.servico.por_porte ? `<div class="flex items-center justify-between text-sm font-bold mt-1" style="color:#5F6B5F"><span>Porte ${est.porte}</span><span>${dinheiro(est.total)}</span></div>` : ""}
    <div class="flex items-center justify-between mt-2 pt-2" style="border-top:2px dashed #e7ddbd">
      <span class="font-display font-extrabold">Estimativa</span>
      <span class="font-display font-black text-2xl" style="color:#14532D">${dinheiro(est.total)}</span>
    </div>
    <p class="text-xs font-bold mt-1" style="color:#a89e83">
      ${data ? formatarDataBR(data) : "Data a escolher"}${agendamento.slot ? " às " + agendamento.slot : ""} · ${est.servico.duracao}
    </p>`;
}

async function confirmarAgendamento(e) {
  e.preventDefault();
  if (!API_OK) return toast("Backend offline — inicie a API para agendar.", "erro");

  const pet = $("#bkPet").value.trim();
  const tutor = $("#bkTutor").value.trim();
  const fone = $("#bkPhone").value.trim();
  const data = $("#bkDate").value;
  const serv = servicoSelecionado();

  if (!serv) return toast("Escolha um serviço para continuar.", "erro");
  if (!pet) return toast("Conte pra gente o nome do pet!", "erro");
  if (!data) return toast("Escolha a data do atendimento.", "erro");
  if (!agendamento.slot) return toast("Selecione um horário disponível.", "erro");
  if (!tutor) return toast("Informe o nome do tutor.", "erro");
  if (fone.replace(/\D/g, "").length < 10) return toast("Informe um telefone válido com DDD.", "erro");

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const ag = await apiPost("/agendamentos", {
      pet,
      especie: document.querySelector('input[name="especie"]:checked')?.value || "Cão",
      porte: porteSelecionado(),
      servico_id: serv.id,
      profissional: $("#bkPro").value,
      data,
      hora: agendamento.slot,
      tutor,
      fone,
      obs: $("#bkNotes").value.trim(),
    });
    salvarLS("patachic_fone", fone);
    abrirModalAgendamento(ag);
    e.target.reset();
    agendamento.slot = null;
    renderSlots();
    atualizarEstimativa();
    carregarMeusAgendamentos();
  } catch (err) {
    toast(err.message, "erro");
    renderSlots();
  } finally {
    btn.disabled = false;
  }
}

async function carregarMeusAgendamentos() {
  const wrap = $("#myBookings");
  if (!wrap) return;
  const fone = lerLS("patachic_fone", "");
  if (!fone) {
    wrap.innerHTML = `<p class="text-sm font-bold py-2" style="color:#a89e83">Você ainda não tem agendamentos. Que tal mimar seu pet hoje?</p>`;
    return;
  }
  try {
    const lista = await apiGet(`/agendamentos?telefone=${encodeURIComponent(fone)}`);
    if (!lista.length) {
      wrap.innerHTML = `<p class="text-sm font-bold py-2" style="color:#a89e83">Nenhum agendamento ativo para este WhatsApp.</p>`;
      return;
    }
    wrap.innerHTML = lista.map((b) => `
      <div class="card !rounded-2xl p-4 flex items-center gap-3">
        <div class="flex items-center justify-center flex-shrink-0" style="width:2.75rem;height:2.75rem;border-radius:0.9rem;background:#14532D;color:#fff">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-display font-extrabold leading-tight truncate">${b.servico}</p>
          <p class="text-xs font-bold" style="color:#5F6B5F">${b.pet} · ${formatarDataBR(b.data)} às ${b.hora}</p>
          <p class="text-xs font-extrabold" style="color:#1E7A44">${b.protocolo} · ${dinheiro(b.preco)}</p>
        </div>
        <button class="qtd-btn !w-8 !h-8" data-cancelar="${b.protocolo}" title="Cancelar agendamento" aria-label="Cancelar agendamento" style="color:#B91C1C">✕</button>
      </div>`).join("");
    $$("#myBookings [data-cancelar]").forEach((btn) =>
      btn.addEventListener("click", async () => {
        try {
          await apiDel(`/agendamentos/${btn.dataset.cancelar}`);
          toast(`Agendamento <b>${btn.dataset.cancelar}</b> cancelado.`, "info");
          carregarMeusAgendamentos();
          renderSlots();
        } catch (err) {
          toast(err.message, "erro");
        }
      })
    );
  } catch {
    wrap.innerHTML = `<p class="text-sm font-bold py-2" style="color:#a89e83">Não foi possível carregar seus agendamentos.</p>`;
  }
}

function abrirModalAgendamento(ag) {
  $("#bmDetails").innerHTML = `
    <div class="card p-5 text-left space-y-1.5 text-sm font-bold" style="color:#5F6B5F">
      <p><span style="color:#a89e83">Pet:</span> ${ag.pet} (${ag.especie} · porte ${ag.porte})</p>
      <p><span style="color:#a89e83">Serviço:</span> ${ag.servico}</p>
      <p><span style="color:#a89e83">Quando:</span> ${formatarDataBR(ag.data)} às ${ag.hora}</p>
      <p><span style="color:#a89e83">Profissional:</span> ${ag.profissional}</p>
      <p><span style="color:#a89e83">Protocolo:</span> <b style="color:#14532D">${ag.protocolo}</b></p>
      <p class="text-base pt-1"><span style="color:#a89e83">Estimativa:</span> <span class="font-display font-black text-xl" style="color:#14532D">${dinheiro(ag.preco)}</span></p>
    </div>`;
  const msg = encodeURIComponent(`Olá! Sou ${ag.tutor} e agendei pelo site: ${ag.servico} para ${ag.pet} em ${formatarDataBR(ag.data)} às ${ag.hora}. Protocolo ${ag.protocolo}.`);
  $("#bmWhatsapp").href = `https://wa.me/${WHATSAPP}?text=${msg}`;
  $("#bookingModal").classList.add("aberto");
  document.body.style.overflow = "hidden";
}

/* ---------------- Loja ---------------- */

const loja = { busca: "", categoria: "Todos", ordem: "rel" };

function filtrarCategoria(cat) {
  loja.categoria = cat;
  $$("#pillsWrap .pilula").forEach((x) => x.classList.toggle("ativa", x.dataset.cat === cat));
  renderProdutos();
}

function initLoja() {
  const pills = $("#pillsWrap");
  if (pills) {
    pills.innerHTML = CATEGORIAS.map((c) => {
      const n = c === "Todos" ? PRODUTOS.length : PRODUTOS.filter((p) => p.categoria === c).length;
      return `<button class="pilula ${c === "Todos" ? "ativa" : ""}" data-cat="${c}">${c} <span style="opacity:.55">(${n})</span></button>`;
    }).join("");
    $$("#pillsWrap .pilula").forEach((b) =>
      b.addEventListener("click", () => filtrarCategoria(b.dataset.cat))
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
  $("#heroSearchForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = $("#heroSearch").value.trim();
    $("#searchInput").value = q;
    loja.busca = q.toLowerCase();
    renderProdutos();
    document.querySelector("#loja")?.scrollIntoView({ behavior: "smooth" });
  });

  $("#bestPrev")?.addEventListener("click", () => $("#bestTrack")?.scrollBy({ left: -300, behavior: "smooth" }));
  $("#bestNext")?.addEventListener("click", () => $("#bestTrack")?.scrollBy({ left: 300, behavior: "smooth" }));

  renderProdutos();
  renderBestSellers();
}

function produtosFiltrados() {
  let lista = PRODUTOS.filter(
    (p) =>
      (loja.categoria === "Todos" || p.categoria === loja.categoria) &&
      (!loja.busca || `${p.nome} ${p.categoria} ${p.descricao}`.toLowerCase().includes(loja.busca))
  );
  if (loja.ordem === "asc") lista = [...lista].sort((a, b) => a.preco - b.preco);
  if (loja.ordem === "desc") lista = [...lista].sort((a, b) => b.preco - a.preco);
  if (loja.ordem === "rating") lista = [...lista].sort((a, b) => b.rating - a.rating);
  return lista;
}

const iconeCarrinho = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2 3h3l2.6 12.5a1 1 0 0 0 1 .5h8.7a1 1 0 0 0 1-.8L21 7H6"/></svg>';

function cardProdutoHTML(p, extra = "") {
  return `
  <article class="card card-produto flex flex-col ${extra}">
    <div class="relative overflow-hidden m-2.5 mb-0 rounded-2xl" style="aspect-ratio:1/1;background:#F4EDD8">
      <img class="foto w-full h-full" style="object-fit:cover" src="${p.img}" alt="${p.nome}" loading="lazy">
      ${p.selo ? `<span class="selo selo-${p.selo} absolute top-3 left-3">${p.selo_texto}</span>` : ""}
    </div>
    <div class="p-4 sm:p-5 flex flex-col gap-1.5 flex-1">
      <h3 class="font-display font-extrabold text-[0.95rem] leading-snug linhas-2" style="min-height:2.7em">${p.nome}</h3>
      <div class="flex items-center justify-between gap-2 mt-auto pt-1">
        <div>
          ${p.preco_antigo ? `<p class="text-xs font-bold line-through" style="color:#b3a888">${dinheiro(p.preco_antigo)}</p>` : ""}
          <p class="font-display font-black text-lg leading-tight">${dinheiro(p.preco)}</p>
        </div>
        <button class="btn-carrinho" data-add="${p.id}" aria-label="Adicionar ${p.nome} ao carrinho">${iconeCarrinho}</button>
      </div>
      <div class="flex items-center gap-1.5 text-xs">
        ${estrelasHTML(p.rating)}
        <span class="font-bold" style="color:#a89e83">(${p.avaliacoes})</span>
      </div>
    </div>
  </article>`;
}

function ligarBotoesAdd(ctx) {
  $$("[data-add]", ctx).forEach((b) =>
    b.addEventListener("click", () => adicionarCarrinho(b.dataset.add))
  );
}

function renderProdutos() {
  const grid = $("#productsGrid");
  if (!grid) return;
  const lista = produtosFiltrados();
  $("#resultCount").textContent = lista.length === 1 ? "1 produto" : `${lista.length} produtos`;
  if (!lista.length) {
    grid.innerHTML = `<div class="col-span-full card p-10 text-center"><p class="font-display font-extrabold text-xl">Nenhum produto encontrado</p><p class="font-bold text-sm mt-1" style="color:#a89e83">Tente buscar por outro termo ou categoria.</p></div>`;
    return;
  }
  grid.innerHTML = lista.map((p) => cardProdutoHTML(p)).join("");
  ligarBotoesAdd(grid);
}

function renderBestSellers() {
  const track = $("#bestTrack");
  if (!track) return;
  const top = [...PRODUTOS].sort((a, b) => b.avaliacoes - a.avaliacoes).slice(0, 8);
  track.innerHTML = top.map((p) => cardProdutoHTML(p, "w-52 sm:w-60 flex-shrink-0")).join("");
  track.querySelectorAll("article").forEach((a) => (a.style.scrollSnapAlign = "start"));
  ligarBotoesAdd(track);
}

/* ---------------- Carrinho ---------------- */

let cupomAtivo = null; // {codigo, percentual}

const getCarrinho = () => lerLS("patachic_cart", []);
const setCarrinho = (c) => { salvarLS("patachic_cart", c); renderCarrinho(); };

function adicionarCarrinho(id) {
  const c = getCarrinho();
  const item = c.find((i) => i.id === id);
  if (item) item.qtd++;
  else c.push({ id, qtd: 1 });
  setCarrinho(c);
  const p = PRODUTOS.find((x) => x.id === id);
  if (p) toast(`<b>${p.nome}</b> adicionado ao carrinho!`);
  abrirCarrinho();
}

function totaisCarrinho() {
  const c = getCarrinho();
  const subtotal = c.reduce((s, i) => {
    const p = PRODUTOS.find((x) => x.id === i.id);
    return s + (p ? p.preco * i.qtd : 0);
  }, 0);
  const desconto = cupomAtivo ? subtotal * cupomAtivo.percentual : 0;
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
          <div class="mx-auto mb-4 flex items-center justify-center" style="width:5rem;height:5rem;border-radius:999px;background:#FFFDF6;border:1.5px solid #e7ddbd">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#c9bd97" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2 3h3l2.6 12.5a1 1 0 0 0 1 .5h8.7a1 1 0 0 0 1-.8L21 7H6"/></svg>
          </div>
          <p class="font-display font-extrabold text-lg">Seu carrinho está vazio</p>
          <p class="text-sm font-bold" style="color:#a89e83">Que tal um agrado para o seu pet?</p>
        </div>`;
    } else {
      wrap.innerHTML = c.map((i) => {
        const p = PRODUTOS.find((x) => x.id === i.id);
        if (!p) return "";
        return `
        <div class="item-carrinho card !rounded-2xl p-3 flex gap-3 items-center">
          <img src="${p.img}" alt="${p.nome}">
          <div class="flex-1 min-w-0">
            <p class="font-bold text-sm leading-snug linhas-2">${p.nome}</p>
            <p class="font-display font-black" style="color:#14532D">${dinheiro(p.preco)}</p>
            <div class="flex items-center gap-2 mt-1">
              <button class="qtd-btn" data-dec="${p.id}" aria-label="Diminuir quantidade">−</button>
              <span class="font-extrabold text-sm w-5 text-center">${i.qtd}</span>
              <button class="qtd-btn" data-inc="${p.id}" aria-label="Aumentar quantidade">+</button>
            </div>
          </div>
          <button class="qtd-btn" data-del="${p.id}" title="Remover" aria-label="Remover item" style="color:#B91C1C">✕</button>
        </div>`;
      }).join("");
    }
  }

  $("#subtotalVal").textContent = dinheiro(t.subtotal);
  $("#discountRow").style.display = cupomAtivo ? "flex" : "none";
  if (cupomAtivo) $("#discountLabel").textContent = `Desconto (${cupomAtivo.codigo})`;
  $("#discountVal").textContent = "−" + dinheiro(t.desconto);
  $("#shippingVal").textContent = t.frete === 0 ? "Grátis" : dinheiro(t.frete);
  $("#totalVal").textContent = dinheiro(t.total);

  const pct = Math.min(((t.subtotal - t.desconto) / FRETE_GRATIS_MINIMO) * 100, 100);
  $("#shipBar").style.width = pct + "%";
  $("#shipMsg").innerHTML =
    t.subtotal - t.desconto >= FRETE_GRATIS_MINIMO
      ? "Você ganhou <b style='color:#1E7A44'>frete grátis</b>!"
      : `Faltam <b>${dinheiro(FRETE_GRATIS_MINIMO - (t.subtotal - t.desconto))}</b> para o frete grátis`;

  $("#checkoutBtn").disabled = c.length === 0;
  $("#checkoutBtn").style.opacity = c.length === 0 ? 0.5 : 1;

  $$("#cartItems [data-inc]").forEach((b) => b.addEventListener("click", () => alterarQtd(b.dataset.inc, 1)));
  $$("#cartItems [data-dec]").forEach((b) => b.addEventListener("click", () => alterarQtd(b.dataset.dec, -1)));
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

  $("#couponBtn")?.addEventListener("click", async () => {
    const codigo = $("#couponInput").value.trim().toUpperCase();
    const msg = $("#couponMsg");
    if (!codigo) {
      cupomAtivo = null;
      msg.textContent = "";
      renderCarrinho();
      return;
    }
    if (!API_OK) {
      msg.textContent = "Backend offline — cupom indisponível.";
      msg.style.color = "#B91C1C";
      return;
    }
    try {
      const r = await apiPost("/cupons/validar", { codigo, subtotal: totaisCarrinho().subtotal });
      if (r.valido) {
        cupomAtivo = { codigo: r.codigo, percentual: r.percentual };
        msg.textContent = `Cupom aplicado: ${Math.round(r.percentual * 100)}% de desconto!`;
        msg.style.color = "#1E7A44";
        toast(`Cupom <b>${r.codigo}</b> aplicado!`);
      } else {
        cupomAtivo = null;
        msg.textContent = "Cupom inválido. Tente PATACHIC30.";
        msg.style.color = "#B91C1C";
      }
    } catch {
      cupomAtivo = null;
      msg.textContent = "Não foi possível validar o cupom.";
      msg.style.color = "#B91C1C";
    }
    renderCarrinho();
  });

  $("#checkoutBtn")?.addEventListener("click", () => {
    if (!getCarrinho().length) return;
    if (!API_OK) return toast("Backend offline — inicie a API para finalizar.", "erro");
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
  $("#coPhone")?.addEventListener("input", (e) => { e.target.value = mascararTelefone(e.target.value); });
  $("#checkoutForm")?.addEventListener("submit", finalizarPedido);
  $("#successClose")?.addEventListener("click", fecharCheckout);
}

/* ---------------- Checkout ---------------- */

function abrirCheckout() {
  const t = totaisCarrinho();
  $("#coSummary").innerHTML =
    getCarrinho().map((i) => {
      const p = PRODUTOS.find((x) => x.id === i.id);
      return `<div class="flex justify-between gap-3 text-sm font-bold" style="color:#5F6B5F">
        <span class="truncate">${i.qtd}x ${p.nome}</span><span class="whitespace-nowrap">${dinheiro(p.preco * i.qtd)}</span></div>`;
    }).join("") +
    `<div class="pt-2 mt-2 space-y-1" style="border-top:2px dashed #e7ddbd">
      <div class="flex justify-between text-sm font-bold" style="color:#5F6B5F"><span>Subtotal</span><span>${dinheiro(t.subtotal)}</span></div>
      ${cupomAtivo ? `<div class="flex justify-between text-sm font-bold" style="color:#1E7A44"><span>Cupom ${cupomAtivo.codigo}</span><span>−${dinheiro(t.desconto)}</span></div>` : ""}
      <div class="flex justify-between text-sm font-bold" style="color:#5F6B5F"><span>Frete</span><span>${t.frete === 0 ? "Grátis" : dinheiro(t.frete)}</span></div>
      <div class="flex justify-between items-center"><span class="font-display font-extrabold text-lg">Total</span><span class="font-display font-black text-2xl" style="color:#14532D">${dinheiro(t.total)}</span></div>
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

async function finalizarPedido(e) {
  e.preventDefault();
  const nome = $("#coName").value.trim();
  const email = $("#coEmail").value.trim();
  const fone = $("#coPhone").value.trim();
  if (!nome) return toast("Informe seu nome para concluir.", "erro");
  if (!email || !email.includes("@")) return toast("Informe um e-mail válido.", "erro");
  if (fone.replace(/\D/g, "").length < 10) return toast("Informe um telefone válido com DDD.", "erro");

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  try {
    const ped = await apiPost("/pedidos", {
      nome, email, fone,
      cep: $("#coCep").value.trim(),
      endereco: $("#coAddress").value.trim(),
      pagamento: document.querySelector('input[name="pay"]:checked')?.value || "pix",
      itens: getCarrinho().map((i) => ({ id: i.id, qtd: i.qtd })),
      cupom: cupomAtivo?.codigo || null,
    });
    $("#osNumber").textContent = ped.numero;
    $("#osName").textContent = nome.split(" ")[0];
    $("#osTotal").textContent = dinheiro(ped.total);
    $("#coStepForm").classList.add("hidden");
    $("#coStepSuccess").classList.remove("hidden");
    salvarLS("patachic_cart", []);
    cupomAtivo = null;
    $("#couponInput").value = "";
    $("#couponMsg").textContent = "";
    renderCarrinho();
    e.target.reset();
  } catch (err) {
    toast(err.message, "erro");
  } finally {
    btn.disabled = false;
  }
}

/* ---------------- FAQ / modais / diversos ---------------- */

function initFaq() {
  $$(".faq-item").forEach((item) => {
    $(".faq-q", item)?.addEventListener("click", () => {
      const estavaAberto = item.classList.contains("aberto");
      $$(".faq-item").forEach((x) => x.classList.remove("aberto"));
      if (!estavaAberto) item.classList.add("aberto");
    });
  });
}

function initModais() {
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

  $("#newsForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value.trim();
    if (!API_OK) return toast("Backend offline — tente novamente em instantes.", "erro");
    try {
      await apiPost("/newsletter", { email });
      toast("Inscrição confirmada! Use o cupom <b>PATACHIC30</b>.");
      e.target.reset();
    } catch (err) {
      toast(err.message, "erro");
    }
  });

  $("#offerCouponBtn")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("PATACHIC30");
      toast("Cupom <b>PATACHIC30</b> copiado! Aplique no carrinho.");
    } catch {
      toast("Seu cupom é <b>PATACHIC30</b>. Aplique no carrinho.", "info");
    }
    document.querySelector("#loja")?.scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------------- Boot ---------------- */

document.addEventListener("DOMContentLoaded", async () => {
  initHeader();
  initContadores();
  initFaq();
  initModais();
  initDiversos();

  try {
    const status = await apiGet("/status");
    API_OK = !!status.ok;
  } catch {
    API_OK = false;
  }
  $("#apiWarn")?.classList.toggle("hidden", API_OK);

  if (API_OK) {
    try {
      [SERVICOS, PRODUTOS] = await Promise.all([apiGet("/servicos"), apiGet("/produtos")]);
    } catch {
      API_OK = false;
      $("#apiWarn")?.classList.remove("hidden");
    }
  }
  if (!SERVICOS.length) SERVICOS = FALLBACK_SERVICOS;
  if (!PRODUTOS.length) {
    // sem backend e sem fallback de produtos: mostra aviso na vitrine
    $("#productsGrid").innerHTML = `<div class="col-span-full card p-10 text-center"><p class="font-display font-extrabold text-xl">Vitrine indisponível</p><p class="font-bold text-sm mt-1" style="color:#a89e83">Inicie o backend para carregar os produtos.</p></div>`;
    $("#bestTrack").innerHTML = "";
  }

  if (SERVICOS.length && !$("#bkService").options.length) popularServicosSelect();
  else popularServicosSelect();
  renderServicos();
  initAgendamento();
  initLoja();
  initCarrinho();
});
