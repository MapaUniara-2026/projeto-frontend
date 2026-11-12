import { useState } from 'react'
import './ImageWithStatus.css'

// Imagem com estados de carregamento, sucesso e indisponibilidade (PR #4).
// Ocupa 100% da largura disponível e mantém a proporção (padrão 16:9), então se adapta a qualquer tela.
// Para outra proporção, passe `ratio` (ex.: ratio="4 / 3").
export default function ImageWithStatus({
  src,
  alt = '',
  className = '',
  ratio,
  loadingLabel = 'Carregando imagem...',
  unavailableLabel = 'Imagem indisponível',
  ...props
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'unavailable')
  const [srcAnterior, setSrcAnterior] = useState(src)

  // Quando a imagem muda, volta para "carregando" já neste render (sem setState dentro de efeito).
  if (src !== srcAnterior) {
    setSrcAnterior(src)
    setStatus(src ? 'loading' : 'unavailable')
  }

  const estilo = ratio ? { '--image-status-ratio': ratio } : undefined

  if (!src || status === 'unavailable') {
    return (
      <div
        className={`image-status image-status-unavailable ${className}`.trim()}
        style={estilo}
        role="img"
        aria-label={alt || unavailableLabel}
      >
        <span className="image-status-symbol" aria-hidden="true">▧</span>
        <span>{unavailableLabel}</span>
      </div>
    )
  }

  return (
    <div className={`image-status ${className}`.trim()} style={estilo} aria-busy={status === 'loading'}>
      {status === 'loading' && (
        <div className="image-status-loading" role="status">
          <span className="image-status-spinner" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </div>
      )}

      <img
        loading="lazy"
        decoding="async"
        {...props}
        src={src}
        alt={alt}
        className={`image-status-img ${status === 'loading' ? 'image-status-img-loading' : ''}`.trim()}
        onLoad={(event) => {
          setStatus('loaded')
          props.onLoad?.(event)
        }}
        onError={(event) => {
          setStatus('unavailable')
          props.onError?.(event)
        }}
      />
    </div>
  )
}
