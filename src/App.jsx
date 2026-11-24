import { useEffect, useMemo, useRef, useState } from 'react'
import BarraFiltrosAtivo from './components/BarraFiltrosAtivo.jsx'
import FiltersPanel from './components/FiltersPanel.jsx'
import FloorPlan from './components/FloorPlan.jsx'
import Header from './components/Header.jsx'
import RoomDetails from './components/RoomDetails.jsx'
import { DIA_LABEL, PERIODO_LABEL, agora, emAndamento, periodoDe } from './data/aulas.js'
import { ANDARES, ANDAR_INICIAL, UNIDADE } from './data/andares/index.js'
import { api } from './services/api'
import './App.css'

/* global __APP_VERSION__ */
const ambiente = import.meta.env.VITE_APP_ENV ?? 'LOCAL'
const versao = __APP_VERSION__

const SEM_FILTRO = { cursos: [], dia: null, periodo: null }
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const bateFiltro = (aula, f) =>
  (!f.cursos.length || f.cursos.includes(aula.curso)) &&
  (!f.dia || aula.dia === f.dia) &&
  (!f.periodo || periodoDe(aula.inicio) === f.periodo)

function App() {
  const now = useMemo(() => agora(), [])
  const [rascunho, setRascunho] = useState(SEM_FILTRO)
  const [filtros, setFiltros] = useState(SEM_FILTRO)
  const [busca, setBusca] = useState('')
  const [selecionada, setSelecionada] = useState(null)
  const [andar, setAndar] = useState(ANDAR_INICIAL)
  const [saude, setSaude] = useState({ status: 'carregando' })
  const [aulas, setAulas] = useState([])
  const [estadoAulas, setEstadoAulas] = useState('carregando')
  const [tentativa, setTentativa] = useState(0)
  const planRef = useRef(null)

  useEffect(() => {
    let ativo = true
    setEstadoAulas('carregando')
    api('/api/aulas')
      .then((resposta) => {
        const registros = Array.isArray(resposta) ? resposta : resposta?.aulas
        if (!Array.isArray(registros)) throw new Error('Formato de resposta inválido em /api/aulas')
        const normalizadas = registros.map((a) => ({
          sala: a.sala?.codigo,
          disciplina: a.turma?.nome ?? a.turma?.codigo ?? 'Aula',
          curso: a.curso?.nome ?? a.turma?.curso?.nome ?? '',
          semestre: a.turma?.semestre,
          professor: a.professor?.nome ?? a.turma?.professor?.nome ?? null,
          dia: ({ SEGUNDA: 'segunda', TERCA: 'terça', QUARTA: 'quarta', QUINTA: 'quinta', SEXTA: 'sexta' })[a.diaSemana],
          inicio: a.horaInicio,
          fim: a.horaTermino,
        })).filter((a) => a.sala && a.dia && a.inicio && a.fim)
        if (ativo) {
          setAulas(normalizadas)
          setEstadoAulas('ok')
        }
      })
      .catch(() => {
        if (ativo) {
          setAulas([])
          setEstadoAulas('erro')
        }
      })
    return () => { ativo = false }
  }, [tentativa])

  useEffect(() => {
    api('/api/health')
      .then(setSaude)
      .catch(() => setSaude({ status: 'offline' }))
  }, [])

  const filtroAtivo = filtros.cursos.length > 0 || Boolean(filtros.dia) || Boolean(filtros.periodo)
  const termo = busca.trim()

  const salas = andar.salas

  // Salas do andar atual destacadas na planta: as que têm aula nos filtros aplicados E batem com a busca.
  // null = nenhum filtro/busca (todas as salas aparecem normais).
  const destaque = useMemo(() => {
    if (!filtroAtivo && !termo) return null
    const comAula = new Set(aulas.filter((a) => bateFiltro(a, filtros)).map((a) => a.sala))
    const q = norm(termo)
    return new Set(salas
      .filter((r) => (!filtroAtivo || comAula.has(r.id)) && (!termo || norm(r.nome).includes(q) || norm(r.id).includes(q)))
      .map((r) => r.id))
  }, [aulas, filtros, filtroAtivo, termo, salas])

  const sala = salas.find((r) => r.id === selecionada) ?? null
  const aulasDaSala = aulas.filter((a) => a.sala === selecionada)
  const aulaAtual = aulasDaSala.find((a) => emAndamento(a, now)) ?? null
  const aulaFiltrada = filtroAtivo ? aulasDaSala.find((a) => bateFiltro(a, filtros)) ?? null : null
  const aula = aulaAtual ?? aulaFiltrada
  const dia = filtros.dia || aula?.dia || now.dia
  const aulasDoDia = aulasDaSala.filter((a) => a.dia === dia).sort((a, b) => a.inicio.localeCompare(b.inicio))

  const limpar = () => {
    setRascunho(SEM_FILTRO)
    setFiltros(SEM_FILTRO)
    setBusca('')
  }

  return (
    <div className="app">
      <Header unidade={UNIDADE} />

      <FiltersPanel
        cursos={[...new Set(aulas.map((a) => a.curso).filter(Boolean))].sort()}
        busca={busca}
        setBusca={setBusca}
        rascunho={rascunho}
        setRascunho={setRascunho}
        aplicar={() => setFiltros(rascunho)}
        limpar={limpar}
        rodape={
          <>
            <span className={`badge badge-${ambiente.toLowerCase()}`}>{ambiente} · v{versao}</span>
            <span className={`api-status api-${saude.status}`}>
              API: {saude.status}
              {saude.banco && <> · Banco: {saude.banco}</>}
            </span>
          </>
        }
      />

      <main className="main">
        <div className="main-head">
          <div>
            <h1>Planta interna</h1>
            <p className="muted">{UNIDADE} • atualizado agora</p>
          </div>
          <div className="tabs" role="tablist" aria-label="Andar">
            {ANDARES.map((a) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                className={a.id === andar.id ? 'on' : ''}
                aria-selected={a.id === andar.id}
                disabled={!a.planta}
                title={!a.planta ? 'Planta ainda não importada' : undefined}
                onClick={() => { setAndar(a); setSelecionada(null) }}
              >
                {a.nome}
              </button>
            ))}
          </div>
        </div>

        <BarraFiltrosAtivo
          courses={filtros.cursos}
          day={DIA_LABEL[filtros.dia]}
          period={PERIODO_LABEL[filtros.periodo]}
          search={termo}
          resultCount={destaque?.size ?? 0}
          floor={andar.id === 'terreo' ? 'térreo' : andar.nome}
        />

        {estadoAulas === 'erro' && (
          <div className="api-error" role="alert">
            <div>
              <strong>Não foi possível carregar as aulas</strong>
              <p>Verifique sua conexão e tente novamente.</p>
            </div>
            <button type="button" className="btn primary" onClick={() => setTentativa((n) => n + 1)}>Tentar novamente</button>
          </div>
        )}
        {estadoAulas === 'carregando' && (
          <p className="api-loading" role="status">Carregando aulas...</p>
        )}

        <div className="content">
          <FloorPlan
            key={andar.id}
            ref={planRef}
            planta={andar.planta}
            rooms={salas}
            destaque={destaque}
            selecionada={selecionada}
            onSelect={setSelecionada}
            andar={andar.nome}
          />
          <RoomDetails
            sala={sala}
            aula={aula}
            emAndamento={Boolean(aulaAtual)}
            aulasDoDia={aulasDoDia}
            dia={dia}
            onClose={() => setSelecionada(null)}
            onCenter={() => sala && planRef.current?.centerOn(sala.bbox)}
          />
        </div>
      </main>
    </div>
  )
}

export default App
