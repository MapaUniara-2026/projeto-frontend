// Andares da Unidade 4. Cada andar tem a sua pasta com planta.js (paredes) e salas.js (polígonos clicáveis).
// Andar com `planta: null` aparece desabilitado na tela ("Planta ainda não importada").
//
// HOJE SÓ O TÉRREO FUNCIONA. Para integrar o 1º e o 2º andar, siga docs/INTEGRAR-ANDARES.md.
import { prepararSalas } from './salas-util.js';
import * as plantaTerreo from './terreo/planta.js';
import { SALAS as SALAS_TERREO } from './terreo/salas.js';

export const UNIDADE = 'Unidade 4';

export const ANDARES = [
  {
    id: 'terreo',
    nome: 'Térreo',
    planta: { viewBox: plantaTerreo.VIEWBOX, path: plantaTerreo.PLANTA_PATH },
    salas: prepararSalas(SALAS_TERREO, 'Térreo'),
  },
  // TODO: importar a planta do 1º andar (docs/INTEGRAR-ANDARES.md)
  { id: '1-andar', nome: '1º andar', planta: null, salas: [] },
  // TODO: importar a planta do 2º andar (docs/INTEGRAR-ANDARES.md)
  { id: '2-andar', nome: '2º andar', planta: null, salas: [] },
];

export const ANDAR_INICIAL = ANDARES.find((a) => a.planta) ?? ANDARES[0];
