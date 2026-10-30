import { DIA_LABEL, PERIODO_LABEL, periodoDe } from '../data/aulas.js'
import Icon from './Icon.jsx'

const SEM_INFO = 'Informação não disponível'
const ICONE_PERIODO = { manhã: 'sunrise', tarde: 'sun', noite: 'moon' }

// Painel lateral direito com os dados da sala selecionada.
// `aula` é a aula em andamento agora; se não houver, a aula que bate com os filtros aplicados.
export default function RoomDetails({ sala, aula, emAndamento, aulasDoDia, dia, onClose, onCenter }) {
  if (!sala) {
    return (
      <aside className="details empty" aria-live="polite">
        <div className="empty-icon" aria-hidden="true"><Icon name="cursor" size={22} /></div>
        <h2>Selecione uma sala</h2>
        <p className="muted">Clique em um ambiente da planta para ver status, professor e aula.</p>
      </aside>
    )
  }

  const servico = sala.tipo === 'servico'
  const periodo = aula ? periodoDe(aula.inicio) : null
  const outras = aulasDoDia.filter((a) => a !== aula)
  // A fotografia deve pertencer à sala selecionada, identificada por seu registro.
  const imagemUrl = sala.imagem_url

  return (
    <aside className="details" aria-live="polite">
      <header className="details-head">
        <div className="row">
          <span className="tag">Sala selecionada</span>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close" size={16} /></button>
        </div>
        <h2>{sala.nome}</h2>
        <p className="details-sub"><Icon name="building" size={15} /> {sala.id} · {sala.andar}</p>
        {!servico && (
          <div className={`status ${emAndamento ? 'ocupada' : 'livre'}`}>
            <strong><i aria-hidden="true" /> {emAndamento ? 'Ocupada agora' : 'Livre agora'}</strong>
            {emAndamento && <small>Aula até {aula.fim}</small>}
          </div>
        )}
      </header>

      <div className="details-body">
        {imagemUrl && (
          <figure className="room-photo">
            <img key={sala.id} src={imagemUrl} alt={`Fotografia de ${sala.nome} (${sala.id})`} />
            <figcaption>Fotografia · {sala.nome}</figcaption>
          </figure>
        )}
        {servico && <p className="muted">Ambiente de serviço, sem aulas programadas.</p>}

        {aula && (
          <>
            <h4>{emAndamento ? 'Aula em andamento' : 'Aula no horário filtrado'}</h4>
            <Info icone="book" rotulo="Disciplina" valor={aula.disciplina} />
            <Info icone="cap" rotulo="Curso" valor={aula.curso} extra={aula.semestre && `${aula.semestre}º semestre`} />
            <Info icone="user" rotulo="Professor" valor={aula.professor} />
            <div className="info-grid">
              <div>
                <small>Dia</small>
                <div>{DIA_LABEL[aula.dia] ?? aula.dia}</div>
              </div>
              <div>
                <small>Horário</small>
                <div>{aula.inicio && aula.fim ? `${aula.inicio}–${aula.fim}` : SEM_INFO}</div>
              </div>
            </div>
            <Info icone={ICONE_PERIODO[periodo]} rotulo="Período" valor={PERIODO_LABEL[periodo]} />
          </>
        )}

        {!servico && !aula && (
          <p className="muted">Nenhuma aula em andamento nesta sala agora.</p>
        )}

        <button type="button" className="btn primary" onClick={onCenter}>
          <Icon name="target" /> Centralizar no mapa
        </button>

        {!servico && (
          <>
            <h4>{aula ? 'Outras aulas de' : 'Aulas de'} {DIA_LABEL[dia] ?? dia}</h4>
            {outras.length === 0 && <p className="muted">Nenhuma {aula ? 'outra ' : ''}aula nesta sala neste dia.</p>}
            <ul className="lista">
              {outras.map((a) => (
                <li key={a.inicio + a.disciplina}>
                  <span className="hora">{a.inicio}–{a.fim}</span>
                  <span><b>{a.disciplina}</b><br /><small>{a.professor || SEM_INFO} · {a.curso}</small></span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  )
}

function Info({ icone, rotulo, valor, extra }) {
  return (
    <div className="info">
      <span className="info-icon"><Icon name={icone} size={16} /></span>
      <div>
        <small>{rotulo}</small>
        <div>{valor || SEM_INFO}</div>
        {extra && <small>{extra}</small>}
      </div>
    </div>
  )
}
