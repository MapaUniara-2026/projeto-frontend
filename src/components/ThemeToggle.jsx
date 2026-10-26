import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'
import './ThemeToggle.css'

// Alterna entre tema claro e escuro. O tema fica em <html data-theme> e é lembrado no navegador.
function temaSalvo() {
  try {
    return localStorage.getItem('tema') === 'escuro'
  } catch {
    return false
  }
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(temaSalvo)

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    try {
      localStorage.setItem('tema', isDark ? 'escuro' : 'claro')
    } catch {
      // Sem acesso ao armazenamento: o tema só não fica salvo.
    }
  }, [isDark])

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'dark' : ''}`}
      onClick={() => setIsDark(!isDark)}
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
