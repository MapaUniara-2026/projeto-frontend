# Andares do mapa

## Situação atual

O mapa tem os quatro níveis da Unidade 4: **térreo, 1º, 2º e 3º andar**. As plantas de origem estão em `tools/plantas/` (`Terreo.png`, `1-andar.png`, `2-andar.png`, `3-andar.png`). Cada área clicável usa como `id` o código da sala no banco (ex.: `BL4-T3`, `BL4-104`, `BL4-LAB-INF-2`), o mesmo do inventário do back-end (`prisma/dados/salas.json`).

Ao alterar uma planta ou um ambiente, atualize **os dois lados**: o `salas.js` do andar aqui e o `prisma/dados/salas.json` no back-end, com o mesmo código.

---

## Como os andares são organizados

```text
src/data/andares/
├─ index.js          ← lista de andares (o que aparece nas abas)
├─ salas-util.js     ← rect() e prepararSalas() (calcula bbox/centro de cada sala)
└─ terreo/
   ├─ planta.js      ← paredes: VIEWBOX + PLANTA_PATH (SVG)
   └─ salas.js       ← salas clicáveis: SALAS = [{ id, nome, tipo, pontos }]
```

Um andar fica habilitado na tela quando tem `planta` diferente de `null` em `index.js`. A troca de abas, o zoom, a busca, os filtros e o painel da sala já funcionam para qualquer andar cadastrado, então **não é preciso mexer em componente nenhum**.

---

## Passo a passo para adicionar um andar (ex.: 1º andar)

### 1. Conseguir a planta

Peça ao responsável pela planta o arquivo do pavimento (DWG ou PDF exportado do AutoCAD). Exporte para **PNG em preto e branco**:

- só paredes, portas e nomes dos ambientes (sem cotas, hachuras, cores ou carimbo);
- fundo branco, linhas pretas;
- recortada justa no prédio, com mais ou menos 600–1600 px de largura.

Salve, por exemplo, em `tools/plantas/1-andar.png`.

### 2. Vetorizar a planta (gera `planta.js`)

```bash
pip install opencv-python-headless pillow numpy scipy
python tools/vetorizar_planta.py tools/plantas/1-andar.png src/data/andares/1-andar/planta.js
```

Se a planta sair falhada ou com manchas, ajuste `LIMIAR` / `AREA_MIN` no topo do script.

### 3. Detectar as salas (gera os polígonos)

```bash
python tools/detectar_salas.py tools/plantas/1-andar.png > salas-1-andar.json
```

Use **a mesma imagem** do passo 2 para os polígonos ficarem alinhados com as paredes. O script devolve uma lista `{ area, pontos }` para cada espaço fechado. Salas com vãos de porta grandes podem não ser detectadas. Para essas, desenhe à mão com `rect(x1, y1, x2, y2)`, usando as coordenadas em pixels da imagem (dá para ver passando o mouse num editor de imagem).

### 4. Criar `src/data/andares/1-andar/salas.js`

```js
import { rect } from '../salas-util.js';

export const SALAS = [
  // pontos copiados do salas-1-andar.json
  { id: 'BL4-201', nome: 'Sala 201', tipo: 'sala', pontos: [[134, 10], [128, 14], [16, 141], [16, 448]] },
  // retângulo manual
  { id: 'BL4-202', nome: 'Lab. informática 3', tipo: 'lab', pontos: rect(40, 300, 150, 350) },
];
```

- `id`: código oficial da sala. É o mesmo usado em `src/data/aulas.js` (campo `sala`) e, no futuro, pela API.
- `tipo`: `'sala'`, `'lab'` ou `'servico'`. Serviço não mostra status "Ocupada/Livre".

### 5. Registrar o andar em `src/data/andares/index.js`

```js
import * as planta1 from './1-andar/planta.js';
import { SALAS as SALAS_1 } from './1-andar/salas.js';

// troque a linha do 1º andar por:
{
  id: '1-andar',
  nome: '1º andar',
  planta: { viewBox: planta1.VIEWBOX, path: planta1.PLANTA_PATH },
  salas: prepararSalas(SALAS_1, '1º andar'),
},
```

### 6. Cadastrar aulas das novas salas

Em `src/data/aulas.js` (dados de exemplo), adicione aulas com `sala: 'BL4-201'` etc. Quando a API existir, ela só precisa devolver o mesmo `id` de sala.

### 7. Conferir

```bash
npm run dev
```

- A aba do andar fica habilitada e mostra a planta.
- Clicar numa sala abre o painel da direita com o andar certo ("BL4-201 · 1º andar").
- "Centralizar no mapa" dá zoom na sala.
- Com filtros aplicados, a barra "Filtros ativos" conta os resultados **do andar aberto**.
- `npm run lint` e `npm run build` passam.

Repita os passos para o 2º andar (`src/data/andares/2-andar/`).

> Este fluxo foi testado de ponta a ponta com a imagem do térreo (`salas.png`) registrada como um andar de teste: a planta foi gerada, as salas foram detectadas e a aba funcionou.
