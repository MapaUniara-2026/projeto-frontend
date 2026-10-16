import { useCallback, useEffect, useRef, useState } from 'react';

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

// Zoom (roda do mouse / botões) e arrastar para mover, controlando o viewBox do SVG.
export function useViewBox(base) {
  const svgRef = useRef(null);
  const [vb, setVb] = useState(base);
  const drag = useRef(null);
  const moved = useRef(false);

  const zoomAt = useCallback((f, cx, cy) => setVb((v) => {
    const w = clamp(v.w * f, base.w * 0.08, base.w * 1.2);
    const k = w / v.w;
    const px = cx ?? v.x + v.w / 2, py = cy ?? v.y + v.h / 2;
    return { x: px - (px - v.x) * k, y: py - (py - v.y) * k, w, h: v.h * k };
  }), [base.w]);

  useEffect(() => {
    const el = svgRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      setVb((v) => {
        const cx = v.x + ((e.clientX - r.left) / r.width) * v.w;
        const cy = v.y + ((e.clientY - r.top) / r.height) * v.h;
        const w = clamp(v.w * (e.deltaY > 0 ? 1.12 : 1 / 1.12), base.w * 0.08, base.w * 1.2);
        const k = w / v.w;
        return { x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k, w, h: v.h * k };
      });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [base.w]);

  const handlers = {
    onPointerDown: (e) => { drag.current = { x: e.clientX, y: e.clientY }; moved.current = false; },
    onPointerMove: (e) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
      if (!moved.current) return;
      const r = svgRef.current.getBoundingClientRect();
      drag.current = { x: e.clientX, y: e.clientY };
      setVb((v) => ({ ...v, x: v.x - (dx / r.width) * v.w, y: v.y - (dy / r.height) * v.h }));
    },
    onPointerUp: () => { drag.current = null; },
    onPointerLeave: () => { drag.current = null; },
  };

  const reset = () => setVb(base);
  const centerOn = (bbox, margem = 40) => {
    const ratio = vb.h / vb.w;
    const cw = bbox.x2 - bbox.x1, ch = bbox.y2 - bbox.y1;
    const w = Math.max(cw + margem * 2, (ch + margem * 2) / ratio);
    const h = w * ratio;
    setVb({ x: (bbox.x1 + bbox.x2) / 2 - w / 2, y: (bbox.y1 + bbox.y2) / 2 - h / 2, w, h });
  };

  return { vb, svgRef, handlers, moved, zoomIn: () => zoomAt(1 / 1.3), zoomOut: () => zoomAt(1.3), reset, centerOn };
}
