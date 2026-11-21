import { useEffect } from 'react';

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

// Zoom com dois dedos (pinça) em telas de toque, controlando o mesmo viewBox de useViewBox.
// O ponto da planta que está entre os dedos acompanha os dedos (zoom + mover ao mesmo tempo).
// Durante a pinça o arrastar de um dedo é suspenso, e o toque não conta como clique em sala.
export function usePinchZoom({ svgRef, setVb, drag, moved, base }) {
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return undefined;
    let inicio = null;

    const meio = (t) => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });
    const distancia = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

    const onStart = (e) => {
      if (e.touches.length !== 2) return;
      const matriz = el.getScreenCTM();
      if (!matriz) return;
      e.preventDefault();
      drag.current = null;
      moved.current = true;
      const inversa = matriz.inverse();
      const paraPlanta = ({ x, y }) => {
        const p = el.createSVGPoint();
        p.x = x;
        p.y = y;
        return p.matrixTransform(inversa);
      };
      const vb0 = el.viewBox.baseVal;
      inicio = {
        paraPlanta,
        vb: { x: vb0.x, y: vb0.y, w: vb0.width, h: vb0.height },
        ancora: paraPlanta(meio(e.touches)),
        dist: distancia(e.touches) || 1,
      };
    };

    const onMove = (e) => {
      if (!inicio || e.touches.length !== 2) return;
      e.preventDefault();
      const { vb, ancora, dist, paraPlanta } = inicio;
      const w = clamp(vb.w * (dist / (distancia(e.touches) || 1)), base.w * 0.08, base.w * 1.2);
      const k = w / vb.w;
      const m = paraPlanta(meio(e.touches));
      setVb({ x: ancora.x - (m.x - vb.x) * k, y: ancora.y - (m.y - vb.y) * k, w, h: vb.h * k });
    };

    const onEnd = (e) => {
      if (e.touches.length < 2) inicio = null;
    };

    el.addEventListener('touchstart', onStart, { passive: false });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('touchcancel', onEnd);
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, [svgRef, setVb, drag, moved, base.w]);
}
