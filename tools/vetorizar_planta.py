"""Converte a imagem de uma planta (PNG/JPG em preto e branco) no planta.js usado pelo mapa.

Uso:  pip install opencv-python-headless pillow numpy
      python tools/vetorizar_planta.py caminho/da/planta.png src/data/andares/1-andar/planta.js

Como funciona:
 1. pixels escuros = paredes/textos (ajuste LIMIAR se a imagem for clara ou cinza);
 2. cada contorno das paredes vira um trecho de caminho SVG (com furos, fill-rule evenodd);
 3. grava um módulo JS com VIEWBOX (tamanho da imagem) e PLANTA_PATH, no mesmo formato do térreo.
As coordenadas ficam em pixels da imagem: use a MESMA imagem no tools/detectar_salas.py
para que os polígonos das salas caiam no lugar certo.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

LIMIAR = 150      # 0-255: abaixo disso o pixel é considerado parede
AREA_MIN = 3      # ignora sujeiras menores que isto (em pixels)
SIMPLIFICAR = 0.6 # tolerância (px) para simplificar os contornos

if len(sys.argv) != 3:
    sys.exit(__doc__)
entrada, saida = Path(sys.argv[1]), Path(sys.argv[2])

img = Image.open(entrada).convert("RGBA")
fundo = Image.new("RGBA", img.size, (255, 255, 255, 255))
fundo.alpha_composite(img)
parede = (np.array(fundo.convert("L")) < LIMIAR).astype(np.uint8)
h, w = parede.shape

contornos, _ = cv2.findContours(parede, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
trechos = []
for c in contornos:
    if cv2.contourArea(c) < AREA_MIN:
        continue
    pts = cv2.approxPolyDP(c, SIMPLIFICAR, True)[:, 0, :]
    if len(pts) < 3:
        continue
    trechos.append("M" + " L".join(f"{x} {y}" for x, y in pts) + "Z")

saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(
    f"// Planta gerada de {entrada.name} por tools/vetorizar_planta.py. Não edite à mão.\n"
    f"// Coordenadas em pixels da imagem ({w} x {h}).\n"
    f"export const VIEWBOX = {{ x: 0, y: 0, w: {w}, h: {h} }};\n"
    f"export const PLANTA_PATH = '{' '.join(trechos)}';\n",
    encoding="utf-8",
)
print(f"{saida}: {len(trechos)} contornos, {w} x {h} px")
