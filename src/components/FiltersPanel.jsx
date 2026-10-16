import { useEffect, useRef } from 'react'
import { CURSOS, DIAS, DIA_LABEL, PERIODOS, PERIODO_LABEL } from '../data/aulas.js'
import Icon from './Icon.jsx'

// Tela "Localizar aula" (tela front/tela.html) convertida para React.
// Os filtros ficam num rascunho e só valem para o mapa ao clicar em "Aplicar filtros".
export default function FiltersPanel({ busca, setBusca, rascunho, setRascunho, aplicar, limpar, rodape }) {
  const buscaRef = useRef(null)

  // Atalho ⌘K / Ctrl+K foca a busca, como indicado no campo.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        buscaRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const alternaCurso = (c) => setRascunho((f) => ({
    ...f, cursos: f.cursos.includes(c) ? f.cursos.filter((x) => x !== c) : [...f.cursos, c],
  }))
  const alterna = (campo, v) => setRascunho((f) => ({ ...f, [campo]: f[campo] === v ? null : v }))

  return (
    <aside className="sidebar">
      <h2>Localizar aula</h2>
      <p className="muted">Encontre salas por curso, dia e período.</p>

      <label className="search">
        <Icon name="search" />
        <input
          ref={buscaRef}
          type="search"
          placeholder="Buscar sala ou código..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar sala ou código"
        />
        <kbd>⌘ K</kbd>
      </label>

      <h3>Curso</h3>
      {CURSOS.map((c) => (
        <label key={c} className="check">
          <input type="checkbox" checked={rascunho.cursos.includes(c)} onChange={() => alternaCurso(c)} />
          {c}
        </label>
      ))}

      <h3>Dia</h3>
      <div className="chips">
        {DIAS.map((d) => (
          <button key={d} type="button" aria-pressed={rascunho.dia === d} className={`chip ${rascunho.dia === d ? 'on' : ''}`} onClick={() => alterna('dia', d)}>
            {DIA_LABEL[d]}
          </button>
        ))}
      </div>

      <h3>Período</h3>
      <div className="chips">
        {PERIODOS.map((p) => (
          <button key={p} type="button" aria-pressed={rascunho.periodo === p} className={`chip ${rascunho.periodo === p ? 'on' : ''}`} onClick={() => alterna('periodo', p)}>
            {PERIODO_LABEL[p]}
          </button>
        ))}
      </div>

      <button type="button" className="btn primary" onClick={aplicar}>
        <Icon name="sliders" /> Aplicar filtros
      </button>
      <button type="button" className="btn ghost" onClick={limpar}>
        <Icon name="reset" size={16} /> Limpar filtros
      </button>

      {rodape && <div className="sidebar-footer">{rodape}</div>}
    </aside>
  )
}
