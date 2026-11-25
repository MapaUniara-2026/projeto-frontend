// Andares da Unidade 4. Cada andar tem a sua pasta com planta.js (paredes) e salas.js (áreas clicáveis).
// As plantas de origem ficam em tools/plantas/; o processo está em docs/INTEGRAR-ANDARES.md.
// O `id` de cada área é o código da sala no banco, o mesmo devolvido pela API.
import { prepararSalas } from './salas-util.js';
import * as plantaTerreo from './terreo/planta.js';
import { SALAS as SALAS_TERREO } from './terreo/salas.js';
import * as planta1 from './1-andar/planta.js';
import { SALAS as SALAS_1 } from './1-andar/salas.js';
import * as planta2 from './2-andar/planta.js';
import { SALAS as SALAS_2 } from './2-andar/salas.js';
import * as planta3 from './3-andar/planta.js';
import { SALAS as SALAS_3 } from './3-andar/salas.js';

export const UNIDADE = 'Unidade 4';

const andar = (id, nome, planta, salas) => ({
  id,
  nome,
  planta: { viewBox: planta.VIEWBOX, path: planta.PLANTA_PATH },
  salas: prepararSalas(salas, nome),
});

export const ANDARES = [
  andar('terreo', 'Térreo', plantaTerreo, SALAS_TERREO),
  andar('1-andar', '1º andar', planta1, SALAS_1),
  andar('2-andar', '2º andar', planta2, SALAS_2),
  andar('3-andar', '3º andar', planta3, SALAS_3),
];

export const ANDAR_INICIAL = ANDARES[0];
