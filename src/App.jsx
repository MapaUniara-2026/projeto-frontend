import { useEffect, useMemo, useRef, useState } from 'react'
import BarraFiltrosAtivo from './components/BarraFiltrosAtivo.jsx'
import FiltersPanel from './components/FiltersPanel.jsx'
import FloorPlan from './components/FloorPlan.jsx'
import Header from './components/Header.jsx'
import RoomDetails from './components/RoomDetails.jsx'
import { DIA_LABEL, PERIODO_LABEL, agora, emAndamento, periodoDe } from './data/aulas.js'
import { ANDARES, ANDAR_INICIAL, UNIDADE } from './data/andares/index.js'
import useAulas from './hooks/useAulas.js'
import { api } from './services/api'
import './App.css'

/* global __APP_VERSION__ */
const ambiente = import.meta.env.VITE_APP_ENV ?? 'LOCAL'
const versao = __APP_VERSION__

const SEM_FILTRO = { cursos: [], dia: null, periodo: null }
const norm = (s) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const bateFiltro = (aula, f) =>
  (!f.cursos.length || f.cursos.includes(aula.curso)) &&
  (!f.dia || aula.dia === f.dia) &&
  (!f.periodo || periodoDe(aula.inicio) === f.periodo)

// Busca textual: casa só em nome e código da sala, por prefixo de palavra.
// Ex.: "lab" acha "Lab. Informática 7"; "laboratório" acha "Laboratório";
// "ab" NÃO acha "Laboratório" (não é prefixo). O id também é testado por prefixo
// (ex.: "bl4" acha "BL4-104").
const bateBusca = (sala, q) => {
  if (!q) return true
  const nome = norm(sala.nome)
  const id = norm(sala.id)
  if (nome.startsWith(q) || id.startsWith(q)) return true
  return nome.split(/[\s.\-_/]+/).some((palavra) => palavra.startsWith(q))
}

const horaHHMM = (d) =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

function App() {
  const now = useMemo(() => agora(), [])
  const [rascunho, setRascunho] = useState(SEM_FILTRO)
  const [filtros, setFiltros] = useState(SEM_FILTRO)
  const [busca, setBusca] = useState('')
  const [selecionada, setSelecionada] = useState(null)
  const [andar, setAndar] = useState(ANDAR_INICIAL)
  const [saude, setSaude] = useState({ status: 'carregando' })
  const planRef = useRef(null)

  const { aulas: AULAS, origem, carregando, erro, atualizadoEm, refetch } = useAulas()

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
    const comAula = new Set(AULAS.filter((a) => bateFiltro(a, filtros)).map((a) => a.sala))
    const q = norm(termo)
    return new Set(salas
      .filter((r) => (!filtroAtivo || comAula.has(r.id)) && bateBusca(r, q))
      .map((r) => r.id))
  }, [filtros, filtroAtivo, termo, salas, AULAS])

  const sala = salas.find((r) => r.id === selecionada) ?? null
  const aulasDaSala = AULAS.filter((a) => a.sala === selecionada)
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
            <span className={`aulas-status aulas-${origem}`}>
              Aulas: {carregando ? 'carregando…' : origem === 'api' ? 'API' : 'mock'}
              {atualizadoEm && !carregando && <> · {horaHHMM(atualizadoEm)}</>}
              {erro && <> · erro</>}
            </span>
            <button type="button" className="btn ghost btn-refresh" onClick={refetch} disabled={carregando} aria-label="Atualizar aulas">
              {carregando ? '…' : '↻ atualizar'}
            </button>
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
