#!/usr/bin/env python3
"""PataChic — backend (Flask + SQLite).

Serve o site estático e expõe a API REST usada pelo agendamento,
pela boutique e pela área do lojista (/admin).

Como rodar:
    pip install -r backend/requirements.txt
    python3 backend/app.py
    # abre em http://localhost:8080 (defina PORT p/ mudar)
"""

import os
import random
import sqlite3
import string
import zlib
from datetime import date, datetime
from pathlib import Path

from flask import Flask, g, jsonify, request, send_from_directory

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "patachic.db"
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "patachic-admin-123")

HORARIOS = ["08:00", "09:30", "11:00", "13:00", "14:30", "16:00", "17:30"]
MULT_PORTE = {"P": 1.0, "M": 1.25, "G": 1.5}
FRETE_GRATIS_MINIMO = 149.0
VALOR_FRETE = 14.90
CUPONS = {"BEMVINDO10": 0.10, "PATACHIC30": 0.30}

SERVICOS_SEED = [
    ("banho", "Banho Completo", 59.90, "60 min", 1, "banho", "#0284c7",
     "Banho com shampoo premium, condicionador, secagem, perfume e laço ou gravata.", None),
    ("tosa-hig", "Tosa Higiênica", 45.00, "40 min", 0, "tesoura", "#0f766e",
     "Aparos em patas, barriga, bumbum e ouvidos. Ideal entre as tosas completas.", None),
    ("tosa-tesoura", "Tosa na Tesoura", 89.90, "90 min", 1, "tesoura", "#ea580c",
     "Acabamento artesanal na tesoura, com banho incluso e finalização de boutique.", "Mais procurada"),
    ("tosa-maquina", "Tosa na Máquina", 79.90, "75 min", 1, "maquina", "#7c3aed",
     "Pelagem uniforme e fresquinha, com banho incluso. Perfeita para o verão.", None),
    ("spa", "Spa & Hidratação", 69.90, "50 min", 1, "spa", "#e11d48",
     "Hidratação profunda, massagem relaxante, banho de brilho e aromaterapia.", None),
    ("unhas", "Corte de Unhas", 25.00, "20 min", 0, "pata", "#d97706",
     "Corte seguro com lixamento, sem estresse e com petisco de recompensa.", None),
    ("dentes", "Escovação Dentária", 35.00, "25 min", 0, "dente", "#059669",
     "Higiene bucal com produtos veterinários e hálito fresquinho na hora.", None),
    ("daycare", "Day Care (diária)", 49.90, "o dia todo", 0, "sol", "#db2777",
     "Um dia inteiro de brincadeiras, socialização e soneca monitorada.", None),
]

PRODUTOS_SEED = [
    ("racao-adulto", "Ração Premium Frango & Vegetais — 10 kg", "Alimentação", 189.90, 219.90,
     "oferta", "-14%", 4.9, 312, "assets/produtos/racao-adulto.jpg",
     "Nutrição completa com frango, arroz e vegetais para cães adultos."),
    ("racao-filhote", "Ração Filhotes Frango & Leite — 3 kg", "Alimentação", 89.90, None,
     "top", "Mais vendido", 4.8, 208, "assets/produtos/racao-filhote.jpg",
     "Grãos pequenos e DHA para o crescimento saudável do seu filhote."),
    ("biscoitos", "Biscoito Ossinho Sortido — 500 g", "Alimentação", 24.90, None,
     None, None, 4.9, 441, "assets/produtos/biscoitos.jpg",
     "Crocantes assados, perfeitos para adestrar e recompensar."),
    ("kit-cordas", "Kit 12 Cordas de Algodão Coloridas", "Brinquedos", 59.90, 79.90,
     "oferta", "-25%", 4.7, 156, "assets/produtos/kit-cordas.jpg",
     "Kit com 12 cordas para morder, puxar e gastar energia."),
    ("kit-cabo", "Kit Cabo de Guerra Tons Neutros — 3 peças", "Brinquedos", 49.90, None,
     "novo", "Novo", 5.0, 38, "assets/produtos/kit-cabo.jpg",
     "Design escandinavo em algodão trançado, resistente e lindo."),
    ("cama-nuvem", "Cama Nuvem Felpuda — Cinza", "Conforto", 149.90, None,
     "top", "Mais vendido", 4.9, 527, "assets/produtos/cama-nuvem.jpg",
     "Super macia, com borda alta que abraça e acalma o pet."),
    ("colchonete", "Colchonete Aconchego — Azul Petróleo", "Conforto", 119.90, 149.90,
     "oferta", "-20%", 4.8, 203, "assets/produtos/colchonete.jpg",
     "Espuma ortopédica com capa removível e lavável."),
    ("arranhador-torre", "Arranhador Torre com Plataforma", "Gatos", 179.90, None,
     None, None, 4.8, 167, "assets/produtos/arranhador-torre.jpg",
     "Sisal natural, base estável e mirante estofado para sonecas."),
    ("arranhador-familia", "Arranhador Família — 3 Andares", "Gatos", 249.90, 299.90,
     "oferta", "-17%", 4.9, 98, "assets/produtos/arranhador-familia.jpg",
     "Parquinho vertical em madeira para casas com vários gatos."),
    ("shampoo", "Shampoo Neutro PataChic — 500 ml", "Higiene", 34.90, None,
     "proprio", "Linha própria", 5.0, 612, "assets/produtos/shampoo.jpg",
     "O mesmo shampoo do nosso banho: pH neutro e cheirinho suave."),
    ("perfume", "Colônia Pet Lavanda — 120 ml", "Higiene", 44.90, None,
     "novo", "Novo", 4.9, 84, "assets/produtos/perfume.jpg",
     "Fragrância delicada de lavanda, segura para cães e gatos."),
]

app = Flask(__name__)


# ---------------- Banco de dados ----------------

def get_db():
    if "db" not in g:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        con = sqlite3.connect(DB_PATH)
        con.row_factory = sqlite3.Row
        g.db = con
    return g.db


@app.teardown_appcontext
def fechar_db(exc=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def linha_para_dict(linha):
    return {k: linha[k] for k in linha.keys()}


def init_db():
    db = get_db()
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS servicos (
            id TEXT PRIMARY KEY, nome TEXT NOT NULL, preco REAL NOT NULL,
            duracao TEXT NOT NULL, por_porte INTEGER NOT NULL, icone TEXT NOT NULL,
            cor TEXT NOT NULL, descricao TEXT NOT NULL, destaque TEXT
        );
        CREATE TABLE IF NOT EXISTS produtos (
            id TEXT PRIMARY KEY, nome TEXT NOT NULL, categoria TEXT NOT NULL,
            preco REAL NOT NULL, preco_antigo REAL, selo TEXT, selo_texto TEXT,
            rating REAL NOT NULL, avaliacoes INTEGER NOT NULL,
            img TEXT NOT NULL, descricao TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS agendamentos (
            protocolo TEXT PRIMARY KEY, pet TEXT NOT NULL, especie TEXT NOT NULL,
            porte TEXT NOT NULL, servico_id TEXT NOT NULL, servico_nome TEXT NOT NULL,
            preco REAL NOT NULL, profissional TEXT NOT NULL, data TEXT NOT NULL,
            hora TEXT NOT NULL, tutor TEXT NOT NULL, fone TEXT NOT NULL,
            fone_digitos TEXT NOT NULL, obs TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT 'confirmado', criado_em TEXT NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_slot_unico
            ON agendamentos (data, hora) WHERE status = 'confirmado';
        CREATE TABLE IF NOT EXISTS pedidos (
            numero TEXT PRIMARY KEY, cliente_nome TEXT NOT NULL, email TEXT NOT NULL,
            fone TEXT NOT NULL, cep TEXT NOT NULL, endereco TEXT NOT NULL,
            pagamento TEXT NOT NULL, itens TEXT NOT NULL, cupom TEXT,
            subtotal REAL NOT NULL, desconto REAL NOT NULL, frete REAL NOT NULL,
            total REAL NOT NULL, status TEXT NOT NULL DEFAULT 'aguardando_pagamento',
            criado_em TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS contatos (
            id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL,
            email TEXT NOT NULL, assunto TEXT NOT NULL, mensagem TEXT NOT NULL,
            criado_em TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS newsletter (
            email TEXT PRIMARY KEY, criado_em TEXT NOT NULL
        );
        """
    )
    if db.execute("SELECT COUNT(*) AS n FROM servicos").fetchone()["n"] == 0:
        db.executemany(
            "INSERT INTO servicos VALUES (?,?,?,?,?,?,?,?,?)", SERVICOS_SEED
        )
    if db.execute("SELECT COUNT(*) AS n FROM produtos").fetchone()["n"] == 0:
        db.executemany(
            "INSERT INTO produtos VALUES (?,?,?,?,?,?,?,?,?,?,?)", PRODUTOS_SEED
        )
    db.commit()


# ---------------- Utilidades ----------------

def erro(msg, status=400):
    return jsonify({"erro": msg}), status


def gerar_codigo(prefixo, n=5):
    alfabeto = string.ascii_uppercase + string.digits
    return f"{prefixo}-" + "".join(random.choice(alfabeto) for _ in range(n))


def so_digitos(s):
    return "".join(c for c in str(s or "") if c.isdigit())


def exigir_admin():
    return request.headers.get("X-Admin-Token") == ADMIN_TOKEN


def slots_ocupados_simulados(data_iso):
    """Horários 'já reservados' estáveis por data (demonstração)."""
    h = zlib.crc32(data_iso.encode())
    return {HORARIOS[h % len(HORARIOS)], HORARIOS[(h >> 3) % len(HORARIOS)]}


# ---------------- Páginas + arquivos estáticos ----------------

@app.get("/")
def index():
    return send_from_directory(ROOT, "index.html")


@app.get("/admin")
def admin():
    return send_from_directory(ROOT, "admin.html")


@app.get("/<path:nome>")
def arquivos(nome):
    if nome.split("/")[0] in {"assets", "css", "js"}:
        return send_from_directory(ROOT, nome)
    return erro("não encontrado", 404)


# ---------------- API pública ----------------

@app.get("/api/status")
def api_status():
    db = get_db()
    n_prod = db.execute("SELECT COUNT(*) AS n FROM produtos").fetchone()["n"]
    n_serv = db.execute("SELECT COUNT(*) AS n FROM servicos").fetchone()["n"]
    return jsonify({
        "ok": True, "loja": "PataChic",
        "agora": datetime.now().isoformat(timespec="minutes"),
        "produtos": n_prod, "servicos": n_serv,
    })


@app.get("/api/servicos")
def api_servicos():
    db = get_db()
    rows = db.execute("SELECT * FROM servicos").fetchall()
    return jsonify([linha_para_dict(r) for r in rows])


@app.get("/api/produtos")
def api_produtos():
    db = get_db()
    rows = db.execute("SELECT * FROM produtos").fetchall()
    return jsonify([linha_para_dict(r) for r in rows])


@app.get("/api/disponibilidade")
def api_disponibilidade():
    data_iso = request.args.get("data", "")
    try:
        dia = date.fromisoformat(data_iso)
    except ValueError:
        return erro("data inválida (use AAAA-MM-DD)")
    if dia < date.today():
        return erro("data no passado")
    if (dia - date.today()).days > 60:
        return erro("agenda aberta apenas para os próximos 60 dias")

    if dia.weekday() == 6:  # domingo
        return jsonify({"data": data_iso, "aberto": False,
                        "motivo": "Fechamos aos domingos.", "slots": []})

    db = get_db()
    reservados = {
        r["hora"] for r in db.execute(
            "SELECT hora FROM agendamentos WHERE data = ? AND status = 'confirmado'",
            (data_iso,))
    }
    simulados = slots_ocupados_simulados(data_iso)
    agora_min = datetime.now().hour * 60 + datetime.now().minute
    eh_hoje = dia == date.today()

    slots = []
    for h in HORARIOS:
        if dia.weekday() == 5 and h > "13:00":  # sábado até 13h
            continue
        hh, mm = int(h[:2]), int(h[3:])
        passado = eh_hoje and (hh * 60 + mm) <= agora_min + 60
        livre = h not in reservados and h not in simulados and not passado
        slots.append({"hora": h, "livre": livre})

    return jsonify({"data": data_iso, "aberto": True, "motivo": None, "slots": slots})


@app.post("/api/agendamentos")
def api_criar_agendamento():
    d = request.get_json(force=True, silent=True) or {}
    pet = str(d.get("pet", "")).strip()
    tutor = str(d.get("tutor", "")).strip()
    fone = str(d.get("fone", "")).strip()
    especie = str(d.get("especie", "Cão")).strip() or "Cão"
    porte = str(d.get("porte", "P")).upper()
    servico_id = str(d.get("servico_id", "")).strip()
    profissional = str(d.get("profissional", "Sem preferência")).strip()
    data_iso = str(d.get("data", "")).strip()
    hora = str(d.get("hora", "")).strip()
    obs = str(d.get("obs", "")).strip()[:200]

    if not pet:
        return erro("informe o nome do pet")
    if porte not in MULT_PORTE:
        return erro("porte inválido (P, M ou G)")
    if not tutor:
        return erro("informe o nome do tutor")
    if len(so_digitos(fone)) < 10:
        return erro("informe um telefone válido com DDD")
    try:
        dia = date.fromisoformat(data_iso)
    except ValueError:
        return erro("data inválida")
    if dia < date.today() or (dia - date.today()).days > 60:
        return erro("data fora da agenda (hoje até +60 dias)")
    if dia.weekday() == 6:
        return erro("fechamos aos domingos")
    if hora not in HORARIOS or (dia.weekday() == 5 and hora > "13:00"):
        return erro("horário inválido")

    db = get_db()
    serv = db.execute("SELECT * FROM servicos WHERE id = ?", (servico_id,)).fetchone()
    if not serv:
        return erro("serviço inválido")

    preco = round(serv["preco"] * (MULT_PORTE[porte] if serv["por_porte"] else 1.0), 2)

    for _ in range(5):
        protocolo = gerar_codigo("PC")
        try:
            db.execute(
                """INSERT INTO agendamentos
                   (protocolo, pet, especie, porte, servico_id, servico_nome, preco,
                    profissional, data, hora, tutor, fone, fone_digitos, obs, criado_em)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (protocolo, pet, especie, porte, servico_id, serv["nome"], preco,
                 profissional, data_iso, hora, tutor, fone, so_digitos(fone), obs,
                 datetime.now().isoformat(timespec="seconds")),
            )
            db.commit()
            break
        except sqlite3.IntegrityError:
            db.rollback()
            existe = db.execute(
                "SELECT 1 FROM agendamentos WHERE protocolo = ?", (protocolo,)
            ).fetchone()
            if existe:
                continue  # colisão de protocolo, tenta outro
            return erro("este horário acabou de ser ocupado, escolha outro", 409)
    else:
        return erro("não foi possível concluir, tente novamente", 500)

    return jsonify({
        "protocolo": protocolo, "pet": pet, "especie": especie, "porte": porte,
        "servico": serv["nome"], "preco": preco, "profissional": profissional,
        "data": data_iso, "hora": hora, "tutor": tutor, "fone": fone,
    }), 201


@app.get("/api/agendamentos")
def api_meus_agendamentos():
    digitos = so_digitos(request.args.get("telefone", ""))
    if len(digitos) < 10:
        return erro("informe ?telefone= com DDD")
    db = get_db()
    rows = db.execute(
        """SELECT protocolo, pet, especie, porte, servico_nome AS servico, preco,
                  profissional, data, hora, tutor, fone, status
           FROM agendamentos
           WHERE fone_digitos LIKE '%' || ? AND status = 'confirmado'
           ORDER BY data, hora""",
        (digitos[-11:],),
    ).fetchall()
    return jsonify([linha_para_dict(r) for r in rows])


@app.delete("/api/agendamentos/<protocolo>")
def api_cancelar_agendamento(protocolo):
    db = get_db()
    cur = db.execute(
        "UPDATE agendamentos SET status = 'cancelado' "
        "WHERE protocolo = ? AND status = 'confirmado'",
        (protocolo.upper(),),
    )
    db.commit()
    if cur.rowcount == 0:
        return erro("agendamento não encontrado", 404)
    return jsonify({"ok": True, "protocolo": protocolo.upper()})


@app.post("/api/cupons/validar")
def api_validar_cupom():
    d = request.get_json(force=True, silent=True) or {}
    codigo = str(d.get("codigo", "")).strip().upper()
    try:
        subtotal = float(d.get("subtotal", 0))
    except (TypeError, ValueError):
        subtotal = 0
    if codigo in CUPONS:
        pct = CUPONS[codigo]
        return jsonify({"valido": True, "codigo": codigo,
                        "percentual": pct, "desconto": round(subtotal * pct, 2)})
    return jsonify({"valido": False, "codigo": codigo})


@app.post("/api/pedidos")
def api_criar_pedido():
    d = request.get_json(force=True, silent=True) or {}
    nome = str(d.get("nome", "")).strip()
    email = str(d.get("email", "")).strip()
    fone = str(d.get("fone", "")).strip()
    cep = str(d.get("cep", "")).strip()
    endereco = str(d.get("endereco", "")).strip()
    pagamento = str(d.get("pagamento", "pix")).strip().lower()
    itens = d.get("itens", [])
    cupom = str(d.get("cupom", "")).strip().upper() or None

    if not nome:
        return erro("informe seu nome")
    if "@" not in email:
        return erro("informe um e-mail válido")
    if len(so_digitos(fone)) < 10:
        return erro("informe um telefone válido com DDD")
    if len(so_digitos(cep)) != 8:
        return erro("informe um CEP válido")
    if not endereco:
        return erro("informe o endereço de entrega")
    if pagamento not in {"pix", "credito", "debito"}:
        return erro("pagamento inválido")
    if not itens:
        return erro("carrinho vazio")
    if cupom and cupom not in CUPONS:
        cupom = None

    db = get_db()
    linhas, subtotal = [], 0.0
    for item in itens:
        try:
            qtd = max(1, min(99, int(item.get("qtd", 1))))
        except (TypeError, ValueError):
            return erro("quantidade inválida")
        prod = db.execute("SELECT * FROM produtos WHERE id = ?",
                          (str(item.get("id", "")),)).fetchone()
        if not prod:
            return erro(f"produto inválido: {item.get('id')}")
        subtotal += prod["preco"] * qtd
        linhas.append({"id": prod["id"], "nome": prod["nome"],
                       "preco": prod["preco"], "qtd": qtd})

    subtotal = round(subtotal, 2)
    desconto = round(subtotal * CUPONS[cupom], 2) if cupom else 0.0
    base = subtotal - desconto
    frete = 0.0 if base >= FRETE_GRATIS_MINIMO else VALOR_FRETE
    total = round(base + frete, 2)

    for _ in range(5):
        numero = gerar_codigo("PED")
        try:
            db.execute(
                """INSERT INTO pedidos
                   (numero, cliente_nome, email, fone, cep, endereco, pagamento,
                    itens, cupom, subtotal, desconto, frete, total, criado_em)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                (numero, nome, email, fone, cep, endereco, pagamento,
                 __import__("json").dumps(linhas, ensure_ascii=False), cupom,
                 subtotal, desconto, frete, total,
                 datetime.now().isoformat(timespec="seconds")),
            )
            db.commit()
            break
        except sqlite3.IntegrityError:
            db.rollback()
            continue
    else:
        return erro("não foi possível concluir, tente novamente", 500)

    return jsonify({"numero": numero, "total": total, "subtotal": subtotal,
                    "desconto": desconto, "frete": frete, "cupom": cupom}), 201


@app.get("/api/pedidos/<numero>")
def api_ver_pedido(numero):
    db = get_db()
    ped = db.execute("SELECT * FROM pedidos WHERE numero = ?",
                     (numero.upper(),)).fetchone()
    if not ped:
        return erro("pedido não encontrado", 404)
    d = linha_para_dict(ped)
    d["itens"] = __import__("json").loads(d["itens"])
    return jsonify(d)


@app.post("/api/contato")
def api_contato():
    d = request.get_json(force=True, silent=True) or {}
    nome = str(d.get("nome", "")).strip()
    email = str(d.get("email", "")).strip()
    assunto = str(d.get("assunto", "")).strip() or "Outro"
    mensagem = str(d.get("mensagem", "")).strip()
    if not nome or "@" not in email or not mensagem:
        return erro("preencha nome, e-mail válido e mensagem")
    db = get_db()
    db.execute(
        "INSERT INTO contatos (nome, email, assunto, mensagem, criado_em) VALUES (?,?,?,?,?)",
        (nome, email, assunto, mensagem[:2000],
         datetime.now().isoformat(timespec="seconds")),
    )
    db.commit()
    return jsonify({"ok": True}), 201


@app.post("/api/newsletter")
def api_newsletter():
    d = request.get_json(force=True, silent=True) or {}
    email = str(d.get("email", "")).strip().lower()
    if "@" not in email:
        return erro("informe um e-mail válido")
    db = get_db()
    try:
        db.execute("INSERT INTO newsletter VALUES (?, ?)",
                   (email, datetime.now().isoformat(timespec="seconds")))
        db.commit()
    except sqlite3.IntegrityError:
        pass
    return jsonify({"ok": True}), 201


# ---------------- API do lojista ----------------

@app.get("/api/admin/resumo")
def admin_resumo():
    if not exigir_admin():
        return erro("não autorizado", 401)
    db = get_db()
    receita = db.execute(
        "SELECT COALESCE(SUM(total),0) AS t FROM pedidos").fetchone()["t"]
    return jsonify({
        "agendamentos_ativos": db.execute(
            "SELECT COUNT(*) AS n FROM agendamentos WHERE status='confirmado'").fetchone()["n"],
        "agendamentos_total": db.execute(
            "SELECT COUNT(*) AS n FROM agendamentos").fetchone()["n"],
        "pedidos": db.execute(
            "SELECT COUNT(*) AS n FROM pedidos").fetchone()["n"],
        "receita": round(receita, 2),
        "contatos": db.execute(
            "SELECT COUNT(*) AS n FROM contatos").fetchone()["n"],
        "newsletter": db.execute(
            "SELECT COUNT(*) AS n FROM newsletter").fetchone()["n"],
    })


@app.get("/api/admin/agendamentos")
def admin_agendamentos():
    if not exigir_admin():
        return erro("não autorizado", 401)
    db = get_db()
    rows = db.execute(
        "SELECT * FROM agendamentos ORDER BY status, data, hora LIMIT 200").fetchall()
    return jsonify([linha_para_dict(r) for r in rows])


@app.get("/api/admin/pedidos")
def admin_pedidos():
    if not exigir_admin():
        return erro("não autorizado", 401)
    db = get_db()
    rows = db.execute(
        "SELECT * FROM pedidos ORDER BY criado_em DESC LIMIT 200").fetchall()
    out = []
    for r in rows:
        d = linha_para_dict(r)
        d["itens"] = __import__("json").loads(d["itens"])
        out.append(d)
    return jsonify(out)


@app.patch("/api/admin/pedidos/<numero>")
def admin_pedido_status(numero):
    if not exigir_admin():
        return erro("não autorizado", 401)
    status = str((request.get_json(silent=True) or {}).get("status", ""))
    if status not in {"aguardando_pagamento", "pago", "enviado", "entregue", "cancelado"}:
        return erro("status inválido")
    db = get_db()
    cur = db.execute("UPDATE pedidos SET status = ? WHERE numero = ?",
                     (status, numero.upper()))
    db.commit()
    if cur.rowcount == 0:
        return erro("pedido não encontrado", 404)
    return jsonify({"ok": True})


@app.get("/api/admin/contatos")
def admin_contatos():
    if not exigir_admin():
        return erro("não autorizado", 401)
    db = get_db()
    rows = db.execute(
        "SELECT * FROM contatos ORDER BY criado_em DESC LIMIT 200").fetchall()
    return jsonify([linha_para_dict(r) for r in rows])


@app.get("/api/admin/newsletter")
def admin_newsletter():
    if not exigir_admin():
        return erro("não autorizado", 401)
    db = get_db()
    rows = db.execute(
        "SELECT * FROM newsletter ORDER BY criado_em DESC LIMIT 500").fetchall()
    return jsonify([linha_para_dict(r) for r in rows])


@app.errorhandler(404)
def nao_encontrado(_e):
    if request.path.startswith("/api/"):
        return erro("não encontrado", 404)
    return send_from_directory(ROOT, "index.html")


if __name__ == "__main__":
    with app.app_context():
        init_db()
        print(f"[patachic] banco pronto em {DB_PATH}")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
