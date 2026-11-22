// Aulas vêm da API (GET /api/aulas), que lê a grade de horários do banco.
import { api } from '../services/api';

export const CURSOS = ['Sistemas de Informação', 'Engenharia de Computação', 'Inteligência Artificial'];
export const DIAS = ['segunda', 'terça', 'quarta', 'quinta', 'sexta'];
export const DIA_LABEL = { segunda: 'Segunda-feira', terça: 'Terça-feira', quarta: 'Quarta-feira', quinta: 'Quinta-feira', sexta: 'Sexta-feira' };
export const PERIODOS = ['manhã', 'tarde', 'noite'];
export const PERIODO_LABEL = { manhã: 'Manhã', tarde: 'Tarde', noite: 'Noite' };

// A API manda o dia como no banco (SEGUNDA, TERCA...); o front usa as chaves de DIAS.
const DIA_DA_API = { SEGUNDA: 'segunda', TERCA: 'terça', QUARTA: 'quarta', QUINTA: 'quinta', SEXTA: 'sexta' };

// Converte o formato da API para o usado pelas telas:
// { id, sala: 'BL4-109', disciplina, curso, semestre, professor, dia: 'segunda', inicio: '19:00', fim: '20:20' }
export async function carregarAulas() {
  const aulas = await api('/api/aulas');
  return aulas.map((a) => ({
    id: a.id,
    sala: a.sala.codigo,
    disciplina: a.disciplina.nome,
    curso: a.curso.nome,
    semestre: a.turma.semestre,
    professor: a.professor.nome,
    dia: DIA_DA_API[a.diaSemana] ?? a.diaSemana,
    inicio: a.horaInicio,
    fim: a.horaTermino,
  }));
}

// Semestres que existem nas aulas carregadas, para o filtro.
export const semestresDe = (aulas) => [...new Set(aulas.map((a) => a.semestre))].sort((a, b) => a - b);

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
