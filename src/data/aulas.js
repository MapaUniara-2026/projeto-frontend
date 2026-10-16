// DADOS DE EXEMPLO — troque por sua API/planilha mantendo este formato.
export const CURSOS = ['Sistemas de Informação', 'Engenharia de Computação', 'Inteligência Artificial'];
export const DIAS = ['segunda', 'terça', 'quarta', 'quinta', 'sexta'];
export const DIA_LABEL = { segunda: 'Segunda-feira', terça: 'Terça-feira', quarta: 'Quarta-feira', quinta: 'Quinta-feira', sexta: 'Sexta-feira' };
export const PERIODOS = ['manhã', 'tarde', 'noite'];
export const PERIODO_LABEL = { manhã: 'Manhã', tarde: 'Tarde', noite: 'Noite' };

export const AULAS = [
  { sala: 'BL4-104', disciplina: 'Engenharia de Software II', curso: 'Sistemas de Informação', semestre: 6, professor: 'Prof. Carlos Almeida', dia: 'segunda', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-101', disciplina: 'Banco de Dados', curso: 'Sistemas de Informação', semestre: 4, professor: 'Profa. Marina Duarte', dia: 'segunda', inicio: '08:00', fim: '09:40' },
  { sala: 'BL4-102', disciplina: 'Palestra de Abertura', curso: 'Sistemas de Informação', semestre: 1, professor: 'Prof. Carlos Almeida', dia: 'segunda', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-103', disciplina: 'Programação Web', curso: 'Sistemas de Informação', semestre: 4, professor: 'Profa. Marina Duarte', dia: 'segunda', inicio: '19:00', fim: '22:40' },
  { sala: 'BL4-103', disciplina: 'Sistemas Operacionais', curso: 'Engenharia de Computação', semestre: 4, professor: 'Prof. André Souza', dia: 'terça', inicio: '14:00', fim: '17:40' },
  { sala: 'BL4-105', disciplina: 'Visão Computacional', curso: 'Inteligência Artificial', semestre: 6, professor: 'Profa. Helena Rocha', dia: 'quinta', inicio: '14:00', fim: '17:40' },
  { sala: 'BL4-105', disciplina: 'Física Experimental', curso: 'Engenharia de Computação', semestre: 2, professor: 'Prof. Renato Lima', dia: 'sexta', inicio: '08:00', fim: '11:40' },
  { sala: 'BL4-109', disciplina: 'Cálculo II', curso: 'Engenharia de Computação', semestre: 3, professor: 'Prof. Renato Lima', dia: 'terça', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-110', disciplina: 'Redes de Computadores', curso: 'Sistemas de Informação', semestre: 5, professor: 'Prof. André Souza', dia: 'terça', inicio: '21:00', fim: '22:40' },
  { sala: 'BL4-111', disciplina: 'Aprendizado de Máquina', curso: 'Inteligência Artificial', semestre: 5, professor: 'Profa. Helena Rocha', dia: 'quarta', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-112', disciplina: 'Estruturas de Dados', curso: 'Sistemas de Informação', semestre: 3, professor: 'Prof. Paulo Mendes', dia: 'quinta', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-113', disciplina: 'Ética e Cidadania', curso: 'Inteligência Artificial', semestre: 2, professor: 'Profa. Lúcia Prado', dia: 'sexta', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-114', disciplina: 'Desenho Técnico', curso: 'Engenharia de Computação', semestre: 2, professor: 'Prof. Tiago Ferraz', dia: 'quarta', inicio: '08:00', fim: '09:40' },
  { sala: 'BL4-114', disciplina: 'Algoritmos', curso: 'Engenharia de Computação', semestre: 1, professor: 'Prof. Paulo Mendes', dia: 'segunda', inicio: '14:00', fim: '15:40' },
];

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
