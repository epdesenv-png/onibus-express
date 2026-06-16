import type { CriarReservaPayload, Reserva, Rota, Viagem, ViagemDetalhe } from '../types'

// Em dev o proxy Vite repassa /rotas, /viagens, /reservas para a API.
// Em produção (Docker) VITE_API_BASE_URL deve apontar para a URL pública da API.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const message = errorBody?.mensagem ?? 'Erro ao processar requisicao.'
    throw new Error(message)
  }

  return (await response.json()) as T
}

export const api = {
  listarRotas: () => request<Rota[]>('/rotas'),
  buscarViagens: (origem: string, destino: string, data: string) =>
    request<Viagem[]>(`/viagens?origem=${encodeURIComponent(origem)}&destino=${encodeURIComponent(destino)}&data=${encodeURIComponent(data)}`),
  detalheViagem: (id: number) => request<ViagemDetalhe>(`/viagens/${id}`),
  criarReserva: (payload: CriarReservaPayload) =>
    request<Reserva>('/reservas', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  consultarReserva: (codigo: string) => request<Reserva>(`/reservas/${codigo}`),
  cancelarReserva: (codigo: string) =>
    request<Reserva>(`/reservas/${codigo}`, { method: 'DELETE' }),
}
