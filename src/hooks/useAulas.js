import { useCallback, useEffect, useRef, useState } from 'react'
import { AULAS as MOCK_AULAS } from '../data/aulas.js'
import { api } from '../services/api.js'

// Hook central para a lista de aulas usada no mapa.
// - Tenta GET /api/aulas no backend
// - Em caso de erro/offline, cai no mock de src/data/aulas.js (mesmo contrato)
// - Expõe loading, erro, origem ("api" | "mock"), lastUpdate e refetch()
//
// Para o Felipe: toda a UI (busca, filtros, destaque no mapa) consome DAQUI.
// Se o backend adicionar/retirar campos, o único ponto a ajustar é a função
// `normalizar` abaixo — mantém o contrato esperado pelo resto do app.
export default function useAulas({ pollMs = 0 } = {}) {
  const [aulas, setAulas] = useState(MOCK_AULAS)
  const [origem, setOrigem] = useState('mock')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [atualizadoEm, setAtualizadoEm] = useState(null)
  const abortRef = useRef(null)

  const buscar = useCallback(async () => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setCarregando(true)
    setErro(null)
    try {
      const dados = await api('/api/aulas', { signal: ctrl.signal })
      const lista = Array.isArray(dados) ? dados.map(normalizar) : []
      if (!lista.length) throw new Error('API retornou lista vazia de aulas')
      setAulas(lista)
      setOrigem('api')
      setAtualizadoEm(new Date())
    } catch (e) {
      if (e.name === 'AbortError') return
      setErro(e.message || 'Falha ao buscar aulas')
      setAulas(MOCK_AULAS)
      setOrigem('mock')
      setAtualizadoEm(new Date())
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscar()
    return () => abortRef.current?.abort()
  }, [buscar])

  useEffect(() => {
    if (!pollMs) return
    const id = setInterval(buscar, pollMs)
    return () => clearInterval(id)
  }, [pollMs, buscar])

  return { aulas, origem, carregando, erro, atualizadoEm, refetch: buscar }
}

// Garante o contrato esperado pelo app, independente de pequenas variações do backend.
// Campos obrigatórios: sala, disciplina, curso, professor, dia, inicio, fim
function normalizar(a) {
  return {
    sala: a.sala ?? a.room ?? '',
    disciplina: a.disciplina ?? a.subject ?? '',
    curso: a.curso ?? a.course ?? '',
    semestre: a.semestre ?? a.semester ?? null,
    professor: a.professor ?? a.teacher ?? '',
    dia: a.dia ?? a.day ?? '',
    inicio: a.inicio ?? a.start ?? '',
    fim: a.fim ?? a.end ?? '',
  }
}
