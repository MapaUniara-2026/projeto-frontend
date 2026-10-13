// Cliente HTTP único para falar com o back-end.
// A URL vem de VITE_API_URL (definida em .env.development localmente e na Vercel por ambiente).
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function api(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    headers: { 'Content-Type': 'application/json', ...opcoes.headers },
    ...opcoes,
  })
  if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status} em ${caminho}`)
  }
  return resposta.status === 204 ? null : resposta.json()
}
