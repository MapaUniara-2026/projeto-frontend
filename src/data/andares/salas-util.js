// Funções comuns aos arquivos de salas de cada andar.

// Retângulo (x1, y1) → (x2, y2) no formato de pontos de polígono.
export const rect = (x1, y1, x2, y2) => [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];

// Completa cada sala com o nome do andar, a caixa envolvente (usada por "Centralizar no mapa") e o centro.
export function prepararSalas(salas, andar) {
  return salas.map((r) => {
    const xs = r.pontos.map((p) => p[0]), ys = r.pontos.map((p) => p[1]);
    const bbox = { x1: Math.min(...xs), y1: Math.min(...ys), x2: Math.max(...xs), y2: Math.max(...ys) };
    return { ...r, andar, bbox, centro: [(bbox.x1 + bbox.x2) / 2, (bbox.y1 + bbox.y2) / 2] };
  });
}
