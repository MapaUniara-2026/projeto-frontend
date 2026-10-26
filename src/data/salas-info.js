// Metadata opcional das salas — descrição humana, recursos, capacidade e fotos.
// Separado da parte vetorial (src/data/andares/<andar>/salas.js) de propósito:
// a parte vetorial é o que o backend/API vai bater; isto aqui é conteúdo editorial.
// Pode vir da API no futuro — basta trocar este arquivo por um fetch.

export const INFO_SALAS = {
  'BL4-101': {
    descricao: 'Sala de aula regular, usada por disciplinas teóricas dos cursos de computação.',
    capacidade: 40,
    recursos: ['Projetor', 'Ar-condicionado', 'Quadro branco'],
    fotos: [],
  },
  'BL4-102': {
    descricao: 'Auditório principal da Unidade 4 — palestras, defesas e cerimônias.',
    capacidade: 120,
    recursos: ['Projetor', 'Sistema de som', 'Palco', 'Ar-condicionado'],
    fotos: [],
  },
  'BL4-103': {
    descricao: 'Laboratório de informática equipado para disciplinas de programação e redes.',
    capacidade: 32,
    recursos: ['30 computadores', 'Projetor', 'Ar-condicionado', 'Switch de rede'],
    fotos: [],
  },
  'BL4-104': {
    descricao: 'Sala de aula regular.',
    capacidade: 40,
    recursos: ['Projetor', 'Ar-condicionado'],
    fotos: [],
  },
  'BL4-105': {
    descricao: 'Laboratório de informática usado para disciplinas práticas introdutórias.',
    capacidade: 28,
    recursos: ['26 computadores', 'Projetor', 'Ar-condicionado'],
    fotos: [],
  },
  'BL4-106': {
    descricao: 'Biblioteca da Unidade 4 — acervo físico, salas de estudo e computadores para pesquisa.',
    capacidade: 60,
    recursos: ['Acervo físico', 'Salas de estudo', 'Computadores', 'Wi-Fi'],
    fotos: [],
  },
  'BL4-107': {
    descricao: 'Área de alimentação da Unidade 4.',
    capacidade: 80,
    recursos: ['Lanchonete', 'Mesas', 'Wi-Fi'],
    fotos: [],
  },
  'BL4-108': {
    descricao: 'Atendimento acadêmico e administrativo.',
    recursos: ['Atendimento presencial'],
    fotos: [],
  },
  'BL4-109': { descricao: 'Sala de aula regular.', capacidade: 40, recursos: ['Projetor'], fotos: [] },
  'BL4-110': { descricao: 'Sala de aula regular.', capacidade: 40, recursos: ['Projetor'], fotos: [] },
  'BL4-111': { descricao: 'Sala de aula regular.', capacidade: 50, recursos: ['Projetor', 'Ar-condicionado'], fotos: [] },
  'BL4-112': { descricao: 'Sala de aula regular.', capacidade: 50, recursos: ['Projetor', 'Ar-condicionado'], fotos: [] },
  'BL4-113': { descricao: 'Sala de aula ampla, usada para disciplinas com turmas maiores.', capacidade: 80, recursos: ['Projetor', 'Ar-condicionado', 'Microfone'], fotos: [] },
  'BL4-114': { descricao: 'Sala de aula regular.', capacidade: 40, recursos: ['Projetor'], fotos: [] },
}

const VAZIO = { descricao: '', capacidade: null, recursos: [], fotos: [] }

export const getInfoSala = (id) => ({ ...VAZIO, ...(INFO_SALAS[id] ?? {}) })
