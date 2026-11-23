import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AULAS as MOCK_AULAS } from '../data/aulas.js'
import { api } from '../services/api.js'

// Hook central para a lista de aulas usada no mapa.
// - GET /api/aulas no backend, com os filtros como query string no formato do contrato
//   (curso = sigla; dia = SEGUNDA...; periodo = MATUTINO...).
// - Em caso de erro/offline, cai no mock de src/data/aulas.js (mesmo contrato normalizado).
// - Expõe loading, erro, origem ("api" | "mock"), lastUpdate e refetch().
//
// A função `normalizar` mapeia os campos da API para o contrato esperado pelo resto do app.
// Se o backend mudar nomes de campos, este é o único ponto a tocar.
export default function useAulas({ filtros, pollMs = 0 } = {}) {
  const [aulas, setAulas] = useState(MOCK_AULAS)
  const [origem, setOrigem] = useState('mock')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [atualizadoEm, setAtualizadoEm] = useState(null)
  const abortRef = useRef(null)

  // Estabiliza a query entre renders: o useEffect só refaz a busca quando a string muda.
  const query = useMemo(() => montarQuery(filtros), [filtros])

  const buscar = useCallback(async () => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setCarregando(true)
    setErro(null)
    try {
      const caminho = query ? `/api/aulas?${query}` : '/api/aulas'
      const dados = await api(caminho, { signal: ctrl.signal })
      if (!Array.isArray(dados)) throw new Error('Resposta inesperada da API de aulas')
      // Lista vazia é resposta válida (nenhuma aula para o filtro, RF15): não cai no mock.
      setAulas(dados.map(normalizar))
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
  }, [query])

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

// Monta a query string no formato do contrato da API.
// Aceita cursos como array de siglas; dia/período já em MAIÚSCULAS (SEGUNDA, MATUTINO...).
// A API aceita um curso por consulta (?curso=SI&curso=EC responde 400). Com dois ou mais,
// a busca vai sem curso e o App filtra localmente (bateFiltro, em App.jsx).
function montarQuery(filtros) {
  if (!filtros) return ''
  const qs = new URLSearchParams()
  const cursos = Array.isArray(filtros.cursos) ? filtros.cursos.filter(Boolean) : []
  if (cursos.length === 1) qs.set('curso', cursos[0])
  if (filtros.dia) qs.set('dia', filtros.dia)
  if (filtros.periodo) qs.set('periodo', filtros.periodo)
  return qs.toString()
}

// Mapeia a resposta da API para o contrato esperado pelo app.
// Campos esperados: sala, disciplina, curso, cursoSigla, semestre, turma, professor, dia, inicio, fim.
function normalizar(a) {
  return {
    sala: a.sala?.codigo ?? a.sala ?? '',
    disciplina: a.disciplina?.nome ?? a.disciplina ?? '',
    curso: a.curso?.nome ?? '',
    cursoSigla: a.curso?.sigla ?? null,
    semestre: a.turma?.semestre ?? null,
    turma: a.turma?.nome ?? null,
    professor: a.professor?.nome ?? null,
    dia: a.diaSemana ?? '',
    inicio: a.horaInicio ?? '',
    fim: a.horaTermino ?? '',
  }
}
