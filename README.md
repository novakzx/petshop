# 🐾 PataChic — Banho, Tosa & Boutique Pet

Site + **backend de verdade**: agendamento online de tosa/banho e loja de produtos para pets,
com API REST em Flask e banco SQLite. Visual creme + verde-escuro + dourado.

## ✨ Funcionalidades

**Loja (`/`)**
- **Agendamento online** — serviços, porte, profissional, data e horários vindos da API, com trava real de horário duplicado e protocolo.
- **Meus agendamentos** — consulta e cancela pelo WhatsApp (dados no banco).
- **Boutique** — busca, filtros por categoria, ordenação, carrossel de mais vendidos.
- **Carrinho + checkout** — cupons validados no servidor (`PATACHIC30` = 30% OFF, `BEMVINDO10` = 10% OFF), frete grátis acima de R$ 149, pedido gravado no banco.
- Banner de oferta com copiar-cupom, FAQ, newsletter e avisos (toasts).

**Área do lojista (`/admin`)**
- Resumo (agendamentos ativos, pedidos, receita, inscritos), listas de agendamentos/pedidos/contatos/newsletter, cancela horários e atualiza status do pedido. Acesso com token (`ADMIN_TOKEN`, padrão `patachic-admin-123`).

## 🧩 API REST

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/status` | Saúde da API + contagens |
| GET | `/api/servicos` · `/api/produtos` | Catálogos |
| GET | `/api/disponibilidade?data=AAAA-MM-DD` | Horários livres do dia |
| POST | `/api/agendamentos` | Cria agendamento (409 se o horário ocupar) |
| GET | `/api/agendamentos?telefone=` | Meus agendamentos ativos |
| DELETE | `/api/agendamentos/:protocolo` | Cancela agendamento |
| POST | `/api/cupons/validar` | Valida cupom |
| POST | `/api/pedidos` | Cria pedido (preços recalculados no servidor) |
| GET | `/api/pedidos/:numero` | Detalhe do pedido |
| POST | `/api/contato` · `/api/newsletter` | Mensagens e inscrições |
| GET/PATCH | `/api/admin/*` | Resumo, listas e status (header `X-Admin-Token`) |

## 🎨 Identidade

| Elemento | Valor |
|---|---|
| Nome | **PataChic** — *“O spa boutique do seu pet”* |
| Logotipo | `assets/logo.svg` (patinha + dourado, também favicon) |
| Tipografia | **Archivo** (títulos) + **Fraunces itálico** (destaques) + **Nunito** (texto) |
| Paleta | Creme `#F4EDD8` · Verde `#14532D` · Verde-escuro `#0B3A1F` · Dourado `#C99B3F` · Tinta `#243024` |

## ▶️ Como rodar

```bash
pip install -r backend/requirements.txt
python3 backend/app.py
# abra http://localhost:8080  (loja)  e  http://localhost:8080/admin  (lojista)
```

O banco SQLite é criado em `data/patachic.db` no primeiro avvio, já com serviços e produtos.
Sem o backend, a vitrine mostra um aviso e as compras/agendamentos ficam indisponíveis.

## 🗂️ Estrutura

```
├── index.html · admin.html   # loja + área do lojista
├── css/styles.css            # tema creme/verde/dourado
├── js/app.js · js/admin.js   # front-end (fetch na API)
├── backend/
│   ├── app.py                # Flask + SQLite (páginas + API REST)
│   └── requirements.txt
├── assets/                   # logo.svg, fotos do site e dos produtos
└── data/                     # banco SQLite (criado em runtime, fora do git)
```

## 🔧 Personalização rápida

- **WhatsApp/telefone/endereço:** constante `WHATSAPP` em `js/app.js` + textos em `index.html`.
- **Serviços/produtos:** seed em `backend/app.py` (`SERVICOS_SEED`, `PRODUTOS_SEED`) — apague `data/patachic.db` para recriar.
- **Cupons/frete:** `CUPONS`, `FRETE_GRATIS_MINIMO`, `VALOR_FRETE` em `backend/app.py`.
- **Token do lojista:** variável de ambiente `ADMIN_TOKEN`.

## 📸 Imagens

Fotos de produtos reais + fotos geradas para a marca (herói, corgis, oferta), todas locais em `assets/`.
