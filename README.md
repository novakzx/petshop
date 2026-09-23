# 🐾 PataChic — Banho, Tosa & Boutique Pet

Site institucional + agendamento online de tosa/banho + loja de produtos para pets.
Projeto estático (HTML + CSS + JavaScript), sem build e sem dependências de servidor.

## ✨ Funcionalidades

- **Agendamento online de tosa e banho** — escolha de serviço, porte do pet, profissional, data e horário com agenda simulada, estimativa de preço em tempo real e confirmação com protocolo (+ botão de confirmação via WhatsApp).
- **Meus agendamentos** — lista e cancela horários (salvos no navegador via `localStorage`).
- **Boutique pet** — 11 produtos com busca, filtros por categoria, ordenação e avaliações.
- **Carrinho + checkout** — gaveta lateral, cupom `BEMVINDO10` (10% OFF), barra de frete grátis (acima de R$ 149) e finalização com número de pedido.
- **Clube PataChic** — planos de assinatura com CTA direto para o WhatsApp.
- **Depoimentos, FAQ, galeria de clientes, mapa e formulário de contato.**

## 🎨 Identidade da marca

| Elemento | Valor |
|---|---|
| Nome | **PataChic** |
| Slogan | *“O spa boutique do seu pet”* |
| Logotipo | `assets/logo.svg` (patinha + brilho, também usado como favicon) |
| Tipografia | **Baloo 2** (títulos) + **Nunito** (texto) |

### Paleta de cores

| Cor | Hex | Uso |
|---|---|---|
| Caramelo | `#F97316` | Primária, CTAs |
| Verde Petróleo | `#0F766E` | Secundária, confiança |
| Baunilha | `#FFFBF3` | Fundo |
| Cacau | `#292524` | Texto |
| Pétala | `#FB7185` | Destaques, ofertas |
| Sol | `#FBBF24` | Estrelas, selos |

## ▶️ Como rodar

Qualquer servidor estático funciona. Exemplos:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Depois abra `http://localhost:8080`.

> 💡 Dica: para publicar grátis, ative o **GitHub Pages** apontando para a branch principal.

## 🗂️ Estrutura

```
├── index.html          # página única com todas as seções
├── css/styles.css      # estilos + paleta + animações
├── js/app.js           # dados e lógica (serviços, agenda, loja, carrinho)
└── assets/
    ├── logo.svg        # logotipo oficial
    ├── site/           # fotos do salão e da galeria
    └── produtos/       # fotos dos produtos da boutique
```

## 🔧 Personalização rápida

- **WhatsApp/telefone/endereço:** ajuste a constante `WHATSAPP` em `js/app.js` e os textos em `index.html`.
- **Serviços e preços:** edite o array `SERVICOS` em `js/app.js`.
- **Produtos:** edite o array `PRODUTOS` em `js/app.js` (campos `nome`, `preco`, `img`, `cat`…).
- **Frete e cupom:** constantes `FRETE_GRATIS_MINIMO`, `VALOR_FRETE` e `CUPOM_BEMVINDO` em `js/app.js`.

## 📸 Créditos das imagens

Fotos de salão e pets: banco gratuito **Pexels** (+ parceiros). Fotos de produtos de higiene, rações e petiscos: geradas para a marca. Todas otimizadas para web e armazenadas localmente em `assets/`.
