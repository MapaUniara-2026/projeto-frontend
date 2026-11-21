// Dados do mapa. CURSOS/DIAS/PERIODOS seguem o contrato da API (tarefa 4.2):
// - cursos armazenam { sigla, nome }: o front manda sigla, exibe nome.
// - dias em MAIÚSCULAS sem acento: SEGUNDA, TERCA, QUARTA, QUINTA, SEXTA.
// - períodos em MAIÚSCULAS: MATUTINO, VESPERTINO, NOTURNO.
// O mock abaixo já está no formato normalizado — serve de fallback quando a API cai.

export const CURSOS = [
  { sigla: 'SI', nome: 'Sistemas de Informação' },
  { sigla: 'EC', nome: 'Engenharia de Computação' },
  { sigla: 'IA', nome: 'Inteligência Artificial' },
];

export const CURSO_NOME = Object.fromEntries(CURSOS.map((c) => [c.sigla, c.nome]));

export const DIAS = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'];
export const DIA_LABEL = {
  SEGUNDA: 'Segunda-feira',
  TERCA: 'Terça-feira',
  QUARTA: 'Quarta-feira',
  QUINTA: 'Quinta-feira',
  SEXTA: 'Sexta-feira',
};

export const PERIODOS = ['MATUTINO', 'VESPERTINO', 'NOTURNO'];
export const PERIODO_LABEL = { MATUTINO: 'Manhã', VESPERTINO: 'Tarde', NOTURNO: 'Noite' };

// Mock no contrato normalizado (igual ao que o useAulas devolve após `normalizar`).
export const AULAS = [
  { sala: 'BL4-104', disciplina: 'Engenharia de Software II', curso: 'Sistemas de Informação', cursoSigla: 'SI', semestre: 6, turma: 'SI-6A', professor: 'Prof. Carlos Almeida', dia: 'SEGUNDA', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-101', disciplina: 'Banco de Dados', curso: 'Sistemas de Informação', cursoSigla: 'SI', semestre: 4, turma: 'SI-4A', professor: 'Profa. Marina Duarte', dia: 'SEGUNDA', inicio: '08:00', fim: '09:40' },
  { sala: 'BL4-102', disciplina: 'Palestra de Abertura', curso: 'Sistemas de Informação', cursoSigla: 'SI', semestre: 1, turma: 'SI-1A', professor: 'Prof. Carlos Almeida', dia: 'SEGUNDA', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-103', disciplina: 'Programação Web', curso: 'Sistemas de Informação', cursoSigla: 'SI', semestre: 4, turma: 'SI-4A', professor: 'Profa. Marina Duarte', dia: 'SEGUNDA', inicio: '19:00', fim: '22:40' },
  { sala: 'BL4-103', disciplina: 'Sistemas Operacionais', curso: 'Engenharia de Computação', cursoSigla: 'EC', semestre: 4, turma: 'EC-4A', professor: 'Prof. André Souza', dia: 'TERCA', inicio: '14:00', fim: '17:40' },
  { sala: 'BL4-105', disciplina: 'Visão Computacional', curso: 'Inteligência Artificial', cursoSigla: 'IA', semestre: 6, turma: 'IA-6A', professor: 'Profa. Helena Rocha', dia: 'QUINTA', inicio: '14:00', fim: '17:40' },
  { sala: 'BL4-105', disciplina: 'Física Experimental', curso: 'Engenharia de Computação', cursoSigla: 'EC', semestre: 2, turma: 'EC-2A', professor: 'Prof. Renato Lima', dia: 'SEXTA', inicio: '08:00', fim: '11:40' },
  { sala: 'BL4-109', disciplina: 'Cálculo II', curso: 'Engenharia de Computação', cursoSigla: 'EC', semestre: 3, turma: 'EC-3A', professor: 'Prof. Renato Lima', dia: 'TERCA', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-110', disciplina: 'Redes de Computadores', curso: 'Sistemas de Informação', cursoSigla: 'SI', semestre: 5, turma: 'SI-5A', professor: 'Prof. André Souza', dia: 'TERCA', inicio: '21:00', fim: '22:40' },
  { sala: 'BL4-111', disciplina: 'Aprendizado de Máquina', curso: 'Inteligência Artificial', cursoSigla: 'IA', semestre: 5, turma: 'IA-5A', professor: 'Profa. Helena Rocha', dia: 'QUARTA', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-112', disciplina: 'Estruturas de Dados', curso: 'Sistemas de Informação', cursoSigla: 'SI', semestre: 3, turma: 'SI-3A', professor: 'Prof. Paulo Mendes', dia: 'QUINTA', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-113', disciplina: 'Ética e Cidadania', curso: 'Inteligência Artificial', cursoSigla: 'IA', semestre: 2, turma: 'IA-2A', professor: 'Profa. Lúcia Prado', dia: 'SEXTA', inicio: '19:00', fim: '20:40' },
  { sala: 'BL4-114', disciplina: 'Desenho Técnico', curso: 'Engenharia de Computação', cursoSigla: 'EC', semestre: 2, turma: 'EC-2A', professor: 'Prof. Tiago Ferraz', dia: 'QUARTA', inicio: '08:00', fim: '09:40' },
  { sala: 'BL4-114', disciplina: 'Algoritmos', curso: 'Engenharia de Computação', cursoSigla: 'EC', semestre: 1, turma: 'EC-1A', professor: 'Prof. Paulo Mendes', dia: 'SEGUNDA', inicio: '14:00', fim: '15:40' },
];

// Dia da semana do Date → chave do contrato (SEGUNDA, TERCA...).
const DIAS_JS = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];
const minutos = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

export const periodoDe = (inicio) =>
  (minutos(inicio) < 12 * 60 ? 'MATUTINO' : minutos(inicio) < 18 * 60 ? 'VESPERTINO' : 'NOTURNO');

// Normaliza qualquer string de dia (do query string, da API ou de um teste) para a chave do contrato.
// Aceita "segunda", "Segunda-feira", "TERÇA", "TERCA"... e devolve SEGUNDA, TERCA, etc.
const DIA_ALIASES = {
  SEGUNDA: 'SEGUNDA', TERCA: 'TERCA', 'TERÇA': 'TERCA', QUARTA: 'QUARTA', QUINTA: 'QUINTA',
  SEXTA: 'SEXTA', SABADO: 'SABADO', 'SÁBADO': 'SABADO', DOMINGO: 'DOMINGO',
};
export const normalizarDia = (d) => {
  if (!d) return '';
  const chave = String(d).normalize('NFD').replace(/[̀-ͯ]/g, '').split('-')[0].toUpperCase();
  return DIA_ALIASES[chave] ?? chave;
};

// Para testar um horário específico: ?dia=SEGUNDA&hora=19:30
export function agora() {
  const q = new URLSearchParams(window.location.search);
  const d = new Date();
  return {
    dia: normalizarDia(q.get('dia')) || DIAS_JS[d.getDay()],
    min: q.get('hora') ? minutos(q.get('hora')) : d.getHours() * 60 + d.getMinutes(),
  };
}

export const emAndamento = (aula, now) =>
  normalizarDia(aula.dia) === now.dia && minutos(aula.inicio) <= now.min && now.min < minutos(aula.fim);
