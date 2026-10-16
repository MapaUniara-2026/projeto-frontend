// Salas clicáveis, em pixels da planta (636 x 576, ver planta.js).
// Para ajustar uma sala, mude os números de `pontos`. Salas "Sala 1xx" são nomes provisórios.
const rect = (x1, y1, x2, y2) => [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];

// Os números abaixo foram medidos numa imagem reduzida; K corrige para a escala real da planta.
const K = 1.108;

// Formatos exatos detectados automaticamente no desenho (ver tools/detectar_salas.py).
// Onde não há formato automático (paredes abertas), vale o retângulo manual abaixo.
const AUTO = {
  'BL4-114': [[94,111],[91,112],[64,152],[63,156],[105,186],[109,192],[112,193],[118,191],[144,151],[145,147],[133,137]],
  'BL4-101': [[146,245],[142,242],[127,242],[123,239],[119,242],[37,243],[36,292],[40,295],[146,294]],
  'BL4-102': [[36,301],[37,348],[127,349],[131,351],[135,349],[144,349],[148,346],[148,313],[146,299],[40,298]],
  'BL4-103': [[37,353],[37,404],[111,404],[113,381],[111,353]],
  'BL4-104': [[129,351],[116,353],[114,377],[116,404],[125,405],[129,408],[133,407],[134,405],[148,404],[149,360],[147,353]],
  'BL4-111': [[331,280],[330,363],[334,366],[370,365],[371,282],[367,279]],
  'BL4-112': [[421,371],[420,453],[424,456],[461,455],[462,373],[458,370]],
  'BL4-113': [[262,488],[262,523],[266,526],[455,526],[459,523],[460,488],[456,485],[266,485]],
};

export const UNIDADE = 'Unidade 4';
export const ANDARES = ['Térreo', '1º andar', '2º andar'];
// Andar cuja planta está em planta.js. Os demais aparecem desabilitados até serem importados.
export const ANDAR = 'Térreo';

export const ROOMS = [
  { id: 'BL4-101', nome: 'Sala 101', tipo: 'sala', pontos: rect(32.5, 216.5, 135, 268.5) },
  { id: 'BL4-102', nome: 'Auditório', tipo: 'sala', pontos: rect(32.5, 268.5, 135, 317) },
  { id: 'BL4-103', nome: 'Lab. informática 7', tipo: 'lab', pontos: rect(32.5, 317, 102.5, 369) },
  { id: 'BL4-104', nome: 'Sala 104', tipo: 'sala', pontos: rect(102.5, 317, 135, 369) },
  { id: 'BL4-105', nome: 'Lab. informática 2', tipo: 'lab', pontos: rect(10, 415, 67.5, 476.5) },
  { id: 'BL4-106', nome: 'Biblioteca', tipo: 'servico', pontos: rect(67.5, 415, 157.5, 476.5) },
  { id: 'BL4-107', nome: 'Cantina', tipo: 'servico', pontos: [[233.5, 247.5], [260, 206], [277.5, 206], [277.5, 250]] },
  { id: 'BL4-108', nome: 'Secretaria', tipo: 'servico', pontos: rect(233.5, 312.5, 277.5, 374) },
  { id: 'BL4-109', nome: 'Sala 109', tipo: 'sala', pontos: rect(233.5, 250, 277.5, 292.5) },
  { id: 'BL4-110', nome: 'Sala 110', tipo: 'sala', pontos: rect(233.5, 374, 277.5, 414) },
  { id: 'BL4-111', nome: 'Sala 111', tipo: 'sala', pontos: rect(296, 231, 336, 332.5) },
  { id: 'BL4-112', nome: 'Sala 112', tipo: 'sala', pontos: rect(377.5, 332.5, 417.5, 414) },
  { id: 'BL4-113', nome: 'Sala 113', tipo: 'sala', pontos: rect(235, 436.5, 416, 476) },
  { id: 'BL4-114', nome: 'Sala 114', tipo: 'sala', pontos: [[80, 98.5], [135, 132.5], [111, 170], [60, 150]] },
].map((r0) => {
  const r = { ...r0, pontos: AUTO[r0.id] ?? r0.pontos.map(([x, y]) => [+(x * K).toFixed(1), +(y * K).toFixed(1)]) };
  const xs = r.pontos.map((p) => p[0]), ys = r.pontos.map((p) => p[1]);
  const bbox = { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
  return { ...r, andar: ANDAR, bbox, centro: [(bbox.x1 + bbox.x2) / 2, (bbox.y1 + bbox.y2) / 2] };
});
