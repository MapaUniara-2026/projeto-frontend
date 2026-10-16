# Projeto da Faculdade — Front-end

Interface do sistema de alocação acadêmica, em **React (JavaScript) + Vite**, hospedada na **Vercel**.

> 🔗 Back-end (API): [MapaUniara-2026/projeto-backend](https://github.com/MapaUniara-2026/projeto-backend)
> 📁 Modelagem (UML, DER, requisitos): **[link da pasta do Drive]**

---

## 1. Fluxo de branches e ambientes

```
feature/minha-tarefa ──PR──▶ dev ──PR──▶ qa ──PR──▶ main
                             (DEV)      (QA)       (PRD)
```

| Branch | Ambiente | Aceita PR de | Ao mergear |
|---|---|---|---|
| `dev` | DEV | `feature/*`, `fix/*`, `hotfix/*`, `chore/*`, `docs/*`, `refactor/*`, `test/*` | Vercel publica DEV |
| `qa` | QA | somente `dev` | Vercel publica QA + tag `vX.Y.Z-rc.N` |
| `main` | PRD | somente `qa` | Vercel publica PRD + tag `vX.Y.Z` + Release |

- Push direto em `dev`, `qa` ou `main` é bloqueado (inclusive para administradores).
- Todo PR precisa passar nos checks **Validar branch de origem** e **Front-end** (e **Validar versão** quando for para `main`).

---

## 2. Rodando na sua máquina

Requisitos: Node.js 22+ e Git.

```bash
git clone https://github.com/MapaUniara-2026/projeto-frontend.git
cd projeto-frontend
npm install
npm run dev          # http://localhost:5173
```

O front chama a API definida em `.env.development` (`http://localhost:3000`). Rode o back-end junto para ver, no rodapé do painel de filtros, API e Banco **ok**.

Toda chamada à API passa por `src/services/api.js`. Use sempre ela, nunca `fetch` direto com URL fixa.

### Mapa interativo (tela principal)

| Arquivo | O que faz | Origem |
|---|---|---|
| `src/components/Header.jsx` | Cabeçalho Uniara + unidade | uniara-mapa-front |
| `src/components/FiltersPanel.jsx` | Painel "Localizar aula" (busca com ⌘K/Ctrl+K, curso, dia, período) | tela front + mapa-interativo |
| `src/components/BarraFiltrosAtivo.jsx` | Barra "Filtros ativos" com contagem de resultados | barradefiltro |
| `src/components/FloorPlan.jsx` | Planta vetorial com salas clicáveis, legenda, zoom e arrastar | mapa-interativo |
| `src/components/RoomDetails.jsx` | Painel da sala selecionada (status, disciplina, curso, professor, horário) | mapa-interativo + uniara-mapa-front |
| `src/data/planta.js` | Paredes da planta (SVG gerado do DWG) | mapa-interativo |
| `src/data/rooms.js` | Polígonos das salas, unidade e andares | mapa-interativo |
| `src/data/aulas.js` | Aulas — **dados de exemplo**, trocar pela API mantendo o formato | mapa-interativo |
| `tools/detectar_salas.py` | Detecta automaticamente os contornos das salas numa planta PNG | mapa-interativo |

Para simular um horário (ex.: ver salas "Ocupada agora"): `http://localhost:5173/?dia=segunda&hora=19:30`.

---

## 3. Dia a dia

```bash
git checkout dev && git pull
git checkout -b feature/tela-salas
# ... código ...
git add . && git commit -m "feat: tela de salas"
git push -u origin feature/tela-salas
gh pr create --base dev             # ou pelo site do GitHub
```

Depois de validado em DEV, abra o PR `dev → qa`. Aprovado em QA, abra `qa → main`.

Padrão de commits: [Conventional Commits](https://www.conventionalcommits.org/pt-br/) — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.

---

## 4. Versionamento (SemVer)

A versão fica no `package.json` e aparece na tela, junto com o ambiente.

| Mudança | Comando | Exemplo |
|---|---|---|
| Correção | `npm run release:patch` | 1.0.0 → 1.0.1 |
| Funcionalidade nova | `npm run release:minor` | 1.0.0 → 1.1.0 |
| Quebra de compatibilidade | `npm run release:major` | 1.0.0 → 2.0.0 |

Rode o comando numa branch (ex.: `chore/release-1.1.0`) e mande pelo fluxo normal. O PR para `main` falha se a versão já tiver sido publicada.

---

## 5. Configuração inicial (uma vez)

### GitHub

Com o [GitHub CLI](https://cli.github.com/) logado (`gh auth login`):

**Windows (PowerShell):**

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-github.ps1 MapaUniara-2026/projeto-frontend 0
```

**Linux / Mac / Git Bash:**

```bash
./scripts/setup-github.sh MapaUniara-2026/projeto-frontend 0
```

Use `0` aprovações enquanto estiver sozinho na organização (o GitHub não deixa aprovar o próprio PR). Depois que o time entrar, mude para 1 em **Settings → Branches**.

Cria o repositório público, as branches `dev` e `qa`, define `dev` como padrão e aplica as proteções. O último número é quantas aprovações cada PR exige.

### Vercel

1. **Add New → Project**, importe este repositório. Production Branch: `main`.
2. **Settings → Domains**: adicione `projeto-front-dev.vercel.app` (Git Branch `dev`) e `projeto-front-qa.vercel.app` (Git Branch `qa`).
3. **Settings → Environment Variables**:

| Variável | Production (PRD) | Preview — branch `qa` | Preview — demais branches (DEV) |
|---|---|---|---|
| `VITE_APP_ENV` | `PRD` | `QA` | `DEV` |
| `VITE_API_URL` | URL da API PRD | `https://projeto-api-qa.vercel.app` | `https://projeto-api-dev.vercel.app` |

Ao criar uma variável de Preview dá para escolher uma branch específica (`qa`); a que fica sem branch vale para todas as outras. Depois de mudar variáveis, faça um novo deploy.

> As variáveis `VITE_*` vão para o navegador. **Nunca** coloque senhas ou chaves secretas nelas.
