import { forwardRef, useImperativeHandle, useState } from 'react'
import { PLANTA_PATH, VIEWBOX } from '../data/planta.js'
import { useViewBox } from '../hooks/useViewBox.js'
import Icon from './Icon.jsx'

// Planta vetorial (SVG) com salas clicáveis, zoom pela roda do mouse e arrastar para mover.
const FloorPlan = forwardRef(function FloorPlan({ rooms, destaque, selecionada, onSelect, andar }, ref) {
  const { vb, svgRef, handlers, moved, zoomIn, zoomOut, reset, centerOn } = useViewBox(VIEWBOX)
  useImperativeHandle(ref, () => ({ centerOn }))
  // Legenda: liga/desliga o preenchimento de cada tipo de ambiente na planta.
  const [mostrar, setMostrar] = useState({ salas: false, servicos: false })
  const temDestaque = destaque !== null
  const nomeSelecionada = rooms.find((r) => r.id === selecionada)?.nome

  return (
    <section className="plan-card" aria-label={`Planta do ${andar}`}>
      <div className="plan-toolbar">
        <label className="legend legend-salas">
          <input type="checkbox" checked={mostrar.salas} onChange={(e) => setMostrar((m) => ({ ...m, salas: e.target.checked }))} />
          Salas e laboratórios
        </label>
        <label className="legend legend-servicos">
          <input type="checkbox" checked={mostrar.servicos} onChange={(e) => setMostrar((m) => ({ ...m, servicos: e.target.checked }))} />
          Serviços
        </label>
        <span className="legend legend-selecionada"><i aria-hidden="true" /> Sala selecionada</span>
        <span className="plan-hint">
          <Icon name="cursor" size={14} />
          {nomeSelecionada ? nomeSelecionada : 'Selecione um ambiente'}
        </span>
      </div>

      <div className="plan-wrap">
        <svg
          ref={svgRef}
          className={`plan ${mostrar.salas ? 'show-salas' : ''} ${mostrar.servicos ? 'show-servicos' : ''}`}
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          role="img"
          aria-label={`Planta do ${andar}`}
          {...handlers}
        >
          <path d={PLANTA_PATH} className="planta" />
          {rooms.map((r) => {
            const estado = r.id === selecionada ? 'selected' : temDestaque ? (destaque.has(r.id) ? 'match' : 'dim') : ''
            return (
              <polygon
                key={r.id}
                className={`room tipo-${r.tipo} ${estado}`}
                points={r.pontos.map((p) => p.join(',')).join(' ')}
                tabIndex={0}
                role="button"
                aria-label={`${r.nome}, ${r.id}`}
                aria-pressed={r.id === selecionada}
                onClick={() => { if (!moved.current) onSelect(r.id) }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(r.id) } }}
              >
                <title>{r.nome}</title>
              </polygon>
            )
          })}
        </svg>

        <div className="zoom" role="toolbar" aria-label="Controles de zoom">
          <div className="zoom-group">
            <button type="button" onClick={zoomIn} aria-label="Aproximar"><Icon name="plus" /></button>
            <button type="button" onClick={zoomOut} aria-label="Afastar"><Icon name="minus" /></button>
          </div>
          <button type="button" className="zoom-fit" onClick={reset} aria-label="Ver planta inteira"><Icon name="expand" size={16} /></button>
        </div>
      </div>
    </section>
  )
})

export default FloorPlan
