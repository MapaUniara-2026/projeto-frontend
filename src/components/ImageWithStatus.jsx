
import { useEffect, useState } from 'react'
import './ImageWithStatus.css'

export default function ImageWithStatus({
  src,
  alt = '',
  className = '',
  loadingLabel = 'Carregando imagem...',
  unavailableLabel = 'Imagem indisponível',
  ...props
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'unavailable')

  useEffect(() => {
    setStatus(src ? 'loading' : 'unavailable')
  }, [src])

  if (!src || status === 'unavailable') {
    return (
      <div
        className={`image-status image-status-unavailable ${className}`.trim()}
        role="img"
        aria-label={alt || unavailableLabel}
      >
        <span aria-hidden="true">▧</span>
        <span>{unavailableLabel}</span>
      </div>
    )
  }

  return (
    <div className={`image-status ${className}`.trim()}>
      {status === 'loading' && (
        <div className="image-status-loading" role="status">
          <span className="image-status-spinner" />
          <span>{loadingLabel}</span>
        </div>
      )}

      <img
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
