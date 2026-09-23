/* PataChic — área do lojista (consome /api/admin) */
"use strict";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const dinheiro = (v) => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const token = () => sessionStorage.getItem("pc_admin_token") || "";

async function apiAdmin(path, options = {}) {
  const r = await fetch("/api/admin" + path, {
    headers: { "Content-Type": "application/json", "X-Admin-Token": token() },
    ...options,
  });
  const dados = await r.json().catch(() => ({}));
  if (r.status === 401) {
    sair();
    throw new Error("não autorizado");
  }
  if (!r.ok) throw new Error(dados.erro || `HTTP ${r.status}`);
  return dados;
}

function toast(msg, tipo = "ok") {
  const wrap = $("#toastWrap");
  const el = document.createElement("div");
  el.className = `toast toast-${tipo}`;
  el.innerHTML = `<span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(() => {
    el.classList.add("saindo");
    setTimeout(() => el.remove(), 320);
  }, 3000);
}

function sair() {
  sessionStorage.removeItem("pc_admin_token");
  $("#painel").classList.add("hidden");
  $("#logoutBtn").classList.add("hidden");
  $("#gate").classList.remove("hidden");
}

const ETQ_STATUS = {
  confirmado: "etq-verde", cancelado: "etq-cinza",
  aguardando_pagamento: "etq-amarela", pago: "etq-azul",
  enviado: "etq-azul", entregue: "etq-verde",
};
const ROTULO_STATUS = {
  confirmado: "confirmado", cancelado: "cancelado",
  aguardando_pagamento: "aguard. pgto", pago: "pago",
  enviado: "enviado", entregue: "entregue",
};

function fmtDataHora(iso) {
  try {
    return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch { return iso; }
}

async function entrar() {
  const t = $("#tokenInput").value.trim();
  if (!t) return;
  sessionStorage.setItem("pc_admin_token", t);
  try {
    const resumo = await apiAdmin("/resumo");
    $("#gate").classList.add("hidden");
    $("#gateErro").classList.add("hidden");
    $("#painel").classList.remove("hidden");
    $("#logoutBtn").classList.remove("hidden");
    $("#sumAg").textContent = resumo.agendamentos_ativos;
    $("#sumPed").textContent = resumo.pedidos;
    $("#sumReceita").textContent = dinheiro(resumo.receita);
    $("#sumNews").textContent = resumo.newsletter;
    carregarAba("agendamentos");
  } catch {
    sessionStorage.removeItem("pc_admin_token");
    $("#gateErro").classList.remove("hidden");
  }
}

async function carregarAba(aba) {
  $$(".aba").forEach((b) => b.classList.toggle("ativa", b.dataset.aba === aba));
  const box = $("#adminContent");
  box.innerHTML = `<p class="font-bold p-4" style="color:#a89e83">Carregando…</p>`;
  try {
    if (aba === "agendamentos") {
      const lista = await apiAdmin("/agendamentos");
      box.innerHTML = lista.length ? `
        <table class="tabela"><thead><tr><th>Protocolo</th><th>Pet / Serviço</th><th>Quando</th><th>Tutor</th><th>Status</th><th></th></tr></thead>
        <tbody>${lista.map((a) => `
          <tr>
            <td class="font-extrabold">${a.protocolo}</td>
            <td><b>${a.pet}</b> (${a.especie} ${a.porte})<br><span style="color:#5F6B5F">${a.servico_nome} · ${dinheiro(a.preco)}</span></td>
            <td>${a.data.split("-").reverse().join("/")} às ${a.hora}<br><span style="color:#5F6B5F">${a.profissional.split("—")[0]}</span></td>
            <td>${a.tutor}<br><span style="color:#5F6B5F">${a.fone}</span></td>
            <td><span class="etiqueta ${ETQ_STATUS[a.status] || "etq-cinza"}">${ROTULO_STATUS[a.status] || a.status}</span></td>
            <td>${a.status === "confirmado" ? `<button class="qtd-btn" data-cancelar="${a.protocolo}" title="Cancelar" style="color:#B91C1C">✕</button>` : ""}</td>
          </tr>`).join("")}</tbody></table>` : `<p class="font-bold p-4" style="color:#a89e83">Nenhum agendamento ainda.</p>`;
      $$("#adminContent [data-cancelar]").forEach((b) =>
        b.addEventListener("click", async () => {
          const r = await fetch(`/api/agendamentos/${b.dataset.cancelar}`, { method: "DELETE" });
          if (r.ok) { toast("Agendamento cancelado.", "info"); carregarAba("agendamentos"); }
          else toast("Não foi possível cancelar.", "erro");
        })
      );
    }
    if (aba === "pedidos") {
      const lista = await apiAdmin("/pedidos");
      const opcoes = ["aguardando_pagamento", "pago", "enviado", "entregue", "cancelado"];
      box.innerHTML = lista.length ? `
        <table class="tabela"><thead><tr><th>Pedido</th><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>${lista.map((p) => `
          <tr>
            <td class="font-extrabold">${p.numero}<br><span style="color:#5F6B5F">${fmtDataHora(p.criado_em)}</span></td>
            <td><b>${p.cliente_nome}</b><br><span style="color:#5F6B5F">${p.email}<br>${p.fone}<br>${p.endereco} — ${p.cep}</span></td>
            <td>${p.itens.map((i) => `${i.qtd}x ${i.nome}`).join("<br>")}${p.cupom ? `<br><b style="color:#1E7A44">Cupom ${p.cupom}</b>` : ""}</td>
            <td class="font-extrabold">${dinheiro(p.total)}<br><span style="color:#5F6B5F">${p.pagamento}</span></td>
            <td><select class="campo !py-1.5 !px-2 text-xs" data-status="${p.numero}">
              ${opcoes.map((o) => `<option value="${o}" ${o === p.status ? "selected" : ""}>${ROTULO_STATUS[o]}</option>`).join("")}
            </select></td>
          </tr>`).join("")}</tbody></table>` : `<p class="font-bold p-4" style="color:#a89e83">Nenhum pedido ainda.</p>`;
      $$("#adminContent [data-status]").forEach((s) =>
        s.addEventListener("change", async () => {
          try {
            await apiAdmin(`/pedidos/${s.dataset.status}`, { method: "PATCH", body: JSON.stringify({ status: s.value }) });
            toast("Status atualizado.");
          } catch { toast("Não foi possível atualizar.", "erro"); }
        })
      );
    }
    if (aba === "contatos") {
      const lista = await apiAdmin("/contatos");
      box.innerHTML = lista.length ? `
        <table class="tabela"><thead><tr><th>Quando</th><th>Nome</th><th>Assunto</th><th>Mensagem</th></tr></thead>
        <tbody>${lista.map((c) => `
          <tr><td style="white-space:nowrap">${fmtDataHora(c.criado_em)}</td><td><b>${c.nome}</b><br><span style="color:#5F6B5F">${c.email}</span></td><td>${c.assunto}</td><td>${c.mensagem}</td></tr>`).join("")}</tbody></table>` : `<p class="font-bold p-4" style="color:#a89e83">Nenhuma mensagem.</p>`;
    }
    if (aba === "newsletter") {
      const lista = await apiAdmin("/newsletter");
      box.innerHTML = lista.length ? `
        <table class="tabela"><thead><tr><th>E-mail</th><th>Desde</th></tr></thead>
        <tbody>${lista.map((n) => `<tr><td class="font-extrabold">${n.email}</td><td>${fmtDataHora(n.criado_em)}</td></tr>`).join("")}</tbody></table>` : `<p class="font-bold p-4" style="color:#a89e83">Nenhum inscrito.</p>`;
    }
  } catch (e) {
    box.innerHTML = `<p class="font-bold p-4" style="color:#B91C1C">Erro: ${e.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("#gateBtn").addEventListener("click", entrar);
  $("#tokenInput").addEventListener("keydown", (e) => { if (e.key === "Enter") entrar(); });
  $("#logoutBtn").addEventListener("click", sair);
  $$(".aba").forEach((b) => b.addEventListener("click", () => carregarAba(b.dataset.aba)));
  if (token()) { $("#tokenInput").value = token(); entrar(); }
});
