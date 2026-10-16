import Icon from './Icon.jsx'
import './BarraFiltroStyle.css'

// Barra "Filtros ativos" (bloco barradefiltro). Recebe os filtros já aplicados no mapa.
// O primeiro grupo (cursos) aparece destacado, como no protótipo.
export default function BarraFiltrosAtivo({ courses = [], day, period, search, resultCount = 0, floor }) {
  const filters = [
    ...courses.map((c) => ({ key: `course-${c}`, value: c, highlighted: true })),
    { key: 'day', value: day },
    { key: 'period', value: period },
    { key: 'search', value: search && `“${search}”` },
  ].filter((filter) => filter.value)

  return (
    <section className="active-filters" aria-label="Filtros ativos">
      <div className="active-filters__label">
        <Icon name="filter" size={18} className="active-filters__icon" />
        <span>Filtros ativos:</span>
      </div>

      {filters.length === 0 ? (
        <span className="active-filters__results">Nenhum filtro aplicado — clique em uma sala da planta</span>
      ) : (
        <>
          <ul className="active-filters__list" aria-label="Filtros aplicados">
            {filters.map(({ key, value, highlighted }) => (
              <li
                key={key}
                className={`active-filters__chip${highlighted ? ' active-filters__chip--highlighted' : ''}`}
              >
                {value}
              </li>
            ))}
          </ul>

          <span className="active-filters__results" role="status" aria-live="polite" aria-atomic="true">
            {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
            {floor ? ` no ${floor}` : ''}
          </span>
        </>
      )}
    </section>
  )
}
