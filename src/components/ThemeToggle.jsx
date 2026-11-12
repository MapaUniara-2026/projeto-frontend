import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import './ThemeToggle.css'

// Alterna entre tema claro e escuro. O tema fica em <html data-theme> e é lembrado no navegador.
// Sem escolha salva, segue o tema do sistema operacional.
// O index.html aplica o tema salvo antes de a página aparecer, para não piscar branco ao abrir no escuro.
function temaInicialEscuro() {
  try {
    const salvo = localStorage.getItem('tema')
    if (salvo) return salvo === 'escuro'
  } catch {
    // Sem acesso ao armazenamento: segue o sistema.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(temaInicialEscuro)

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  }, [isDark])

  const alternar = () => {
    const proximo = !isDark
    setIsDark(proximo)
    try {
      localStorage.setItem('tema', proximo ? 'escuro' : 'claro')
    } catch {
      // Sem acesso ao armazenamento: o tema só não fica salvo.
    }
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'dark' : ''}`}
      onClick={alternar}
      aria-pressed={isDark}
      aria-label="Modo escuro"
      title={isDark ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
    >
      <span className="theme-toggle-knob">
        <Icon name={isDark ? 'moon' : 'sun'} size={16} />
      </span>
      <span className="theme-toggle-other">
        <Icon name={isDark ? 'sun' : 'moon'} size={16} />
      </span>
    </button>
  )
}
