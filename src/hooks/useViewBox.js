import { useCallback, useEffect, useRef, useState } from 'react';

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

function pontoNaPlanta(svg, clientX, clientY) {
  const matriz = svg?.getScreenCTM();
  if (!matriz) return null;
  const ponto = svg.createSVGPoint();
  ponto.x = clientX;
  ponto.y = clientY;
  return ponto.matrixTransform(matriz.inverse());
}

// Zoom (roda do mouse / botões) e arrastar para mover, controlando o viewBox do SVG.
export function useViewBox(base) {
  const svgRef = useRef(null);
  const [vb, setVb] = useState(base);
  const drag = useRef(null);
  const moved = useRef(false);

  const zoomAt = useCallback((f, ponto) => setVb((v) => {
    const w = clamp(v.w * f, base.w * 0.08, base.w * 1.2);
    const k = w / v.w;
    const px = ponto?.x ?? v.x + v.w / 2;
    const py = ponto?.y ?? v.y + v.h / 2;
    return { x: px - (px - v.x) * k, y: py - (py - v.y) * k, w, h: v.h * k };
  }), [base.w]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      if (e.deltaY === 0) return;
      const ponto = pontoNaPlanta(el, e.clientX, e.clientY);
      zoomAt(e.deltaY > 0 ? 1.12 : 1 / 1.12, ponto);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const handlers = {
    onPointerDown: (e) => {
      if (!e.isPrimary || e.button !== 0) return;
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
      moved.current = false;
    },
    onPointerMove: (e) => {
      const anterior = drag.current;
      if (!anterior || anterior.id !== e.pointerId) return;
      const dx = e.clientX - anterior.x;
      const dy = e.clientY - anterior.y;
      if (!moved.current && Math.hypot(dx, dy) <= 4) return;
      if (!moved.current) {
        moved.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      const el = svgRef.current;
      const antes = pontoNaPlanta(el, anterior.x, anterior.y);
      const depois = pontoNaPlanta(el, e.clientX, e.clientY);
      if (antes && depois) {
        setVb((v) => ({ ...v, x: v.x + antes.x - depois.x, y: v.y + antes.y - depois.y }));
      }
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    },
    onPointerUp: () => { drag.current = null; },
    onPointerCancel: () => { drag.current = null; },
    onLostPointerCapture: () => { drag.current = null; },
    onPointerLeave: () => { if (!moved.current) drag.current = null; },
  };

  const reset = () => setVb(base);
  const centerOn = (bbox, margem = 40) => {
    const ratio = base.h / base.w;
    const cw = bbox.x2 - bbox.x1, ch = bbox.y2 - bbox.y1;
    const w = clamp(Math.max(cw + margem * 2, (ch + margem * 2) / ratio), base.w * 0.08, base.w * 1.2);
    const h = w * ratio;
    setVb({ x: (bbox.x1 + bbox.x2) / 2 - w / 2, y: (bbox.y1 + bbox.y2) / 2 - h / 2, w, h });
  };

  return { vb, svgRef, handlers, moved, zoomIn: () => zoomAt(1 / 1.3), zoomOut: () => zoomAt(1.3), reset, centerOn };
}
