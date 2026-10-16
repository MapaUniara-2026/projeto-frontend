"""Detecta automaticamente os espaços fechados (salas) de uma planta em preto e branco.

Uso:  pip install opencv-python-headless scipy pillow
      python tools/detectar_salas.py caminho/da/planta.png

Como funciona:
 1. paredes = pixels escuros; "engorda" as paredes alguns pixels para fechar vãos de porta;
 2. cada região branca isolada vira uma sala (as 2 maiores - fora do prédio e área aberta - são ignoradas);
 3. devolve o contorno de cada sala em pixels. Cole os pontos em src/data/rooms.js.
Limite: salas com paredes abertas demais (vãos grandes) não são isoladas - marque-as à mão.
"""
import sys, json
import cv2, numpy as np
from PIL import Image
from scipy import ndimage as ndi

RAIO = 4          # aumente para fechar vãos maiores (mas salas pequenas podem sumir)
AREA_MIN = 700    # ignora regiões menores que isto (em pixels)

img = Image.open(sys.argv[1]).convert("RGBA")
fundo = Image.new("RGBA", img.size, (255, 255, 255, 255)); fundo.alpha_composite(img)
parede = (np.array(fundo.convert("L")) < 150).astype(np.uint8)
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * RAIO + 1, 2 * RAIO + 1))
rotulos, n = ndi.label(cv2.dilate(parede, k) == 0)
areas = ndi.sum(np.ones_like(rotulos), rotulos, range(1, n + 1))
ignorar = {i + 1 for i in np.argsort(areas)[::-1][:2]}
salas = []
for i, a in enumerate(areas):
    if i + 1 in ignorar or a < AREA_MIN:
        continue
    m = cv2.dilate((rotulos == i + 1).astype(np.uint8), k) & (parede == 0).astype(np.uint8)
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    c = max(cs, key=cv2.contourArea)
    salas.append({"area": int(a), "pontos": cv2.approxPolyDP(c, 1.2, True)[:, 0, :].tolist()})
print(json.dumps(salas))
