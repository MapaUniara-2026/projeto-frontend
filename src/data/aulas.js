export const DIAS = ['segunda', 'terça', 'quarta', 'quinta', 'sexta'];
export const DIA_LABEL = { segunda: 'Segunda-feira', terça: 'Terça-feira', quarta: 'Quarta-feira', quinta: 'Quinta-feira', sexta: 'Sexta-feira' };
export const PERIODOS = ['manhã', 'tarde', 'noite'];
export const PERIODO_LABEL = { manhã: 'Manhã', tarde: 'Tarde', noite: 'Noite' };

const DIAS_JS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const minutos = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

export const periodoDe = (inicio) => (minutos(inicio) < 12 * 60 ? 'manhã' : minutos(inicio) < 18 * 60 ? 'tarde' : 'noite');

// Para testar um horário específico: ?dia=segunda&hora=19:30
export function agora() {
  const q = new URLSearchParams(window.location.search);
  const d = new Date();
  return {
    dia: q.get('dia') || DIAS_JS[d.getDay()],
    min: q.get('hora') ? minutos(q.get('hora')) : d.getHours() * 60 + d.getMinutes(),
  };
}

export const emAndamento = (aula, now) => aula.dia === now.dia && minutos(aula.inicio) <= now.min && now.min < minutos(aula.fim);
