export type Rota = {
  id: number
  origem: string
  destino: string
  duracaoMinutos: number
}

export type Viagem = {
  id: number
  origem: string
  destino: string
  dataHoraPartidaUtc: string
  preco: number
  totalAssentos: number
  assentosDisponiveis: number
}

export type ViagemDetalhe = {
  id: number
  origem: string
  destino: string
  dataHoraPartidaUtc: string
  preco: number
  totalAssentos: number
  assentosOcupados: number[]
}

export type CriarReservaPayload = {
  viagemId: number
  numeroAssento: number
  nome: string
  cpf: string
  email: string
  dataNascimento: string
}

export type Reserva = {
  codigo: string
  viagemId: number
  numeroAssento: number
  status: 'Ativa' | 'Cancelada' | string
  nomePassageiro: string
  cpf: string
  email: string
  criadaEmUtc: string
}
