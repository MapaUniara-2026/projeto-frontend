import { useEffect, useState } from 'react'
import { api } from './services/api'
import './App.css'

/* global __APP_VERSION__ */
const ambiente = import.meta.env.VITE_APP_ENV ?? 'LOCAL'
const versao = __APP_VERSION__

function App() {
  const [saude, setSaude] = useState({ status: 'carregando' })

  useEffect(() => {
    api('/api/health')
      .then(setSaude)
      .catch(() => setSaude({ status: 'erro' }))
  }, [])

  return (
    <main className="app">
      <span className={`badge badge-${ambiente.toLowerCase()}`}>
        {ambiente} · v{versao}
      </span>
      <h1>Projeto da Faculdade</h1>
      <p>Edite <code>src/App.jsx</code> e salve para ver as mudanças.</p>

      <section className="status">
        <h2>Status do sistema</h2>
        <p>
          API: <strong>{saude.status}</strong>
          {saude.banco && <> · Banco: <strong>{saude.banco}</strong></>}
        </p>
      </section>
    </main>
  )
}

export default App
