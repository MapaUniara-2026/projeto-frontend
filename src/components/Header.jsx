import Icon from './Icon.jsx'

export default function Header({ unidade }) {
  return (
    <header className="topbar">
      <div className="brand" aria-label="Uniara — Centro Universitário">
        <div className="brand-mark" aria-hidden="true">U</div>
        <div className="brand-text">
          <b>Uniara</b>
          <small>Centro Universitário</small>
        </div>
      </div>
      <span className="topbar-title">Mapa Interativo — {unidade}</span>

      <div className="topbar-actions">
        <span className="unit-pill">
          <Icon name="pin" size={16} />
          {unidade}
        </span>
        <button
          type="button"
          className="icon-button round"
          aria-label="Ajuda"
          title="Clique em uma sala da planta para ver os detalhes. Use a roda do mouse para zoom e arraste para mover."
        >
          <Icon name="help" />
        </button>
      </div>
    </header>
  )
}
