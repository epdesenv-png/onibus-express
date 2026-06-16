import { create } from 'zustand'
import type { Reserva, Viagem, ViagemDetalhe } from '../types'

type BookingState = {
  viagens: Viagem[]
  viagemSelecionada: ViagemDetalhe | null
  assentoSelecionado: number | null
  reservaAtual: Reserva | null
  setViagens: (viagens: Viagem[]) => void
  setViagemSelecionada: (viagem: ViagemDetalhe | null) => void
  setAssentoSelecionado: (assento: number | null) => void
  setReservaAtual: (reserva: Reserva | null) => void
  resetCompra: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  viagens: [],
  viagemSelecionada: null,
  assentoSelecionado: null,
  reservaAtual: null,
  setViagens: (viagens) => set({ viagens }),
  setViagemSelecionada: (viagemSelecionada) =>
    set({ viagemSelecionada, assentoSelecionado: null }),
  setAssentoSelecionado: (assentoSelecionado) => set({ assentoSelecionado }),
  setReservaAtual: (reservaAtual) => set({ reservaAtual }),
  resetCompra: () =>
    set({
      viagemSelecionada: null,
      assentoSelecionado: null,
      reservaAtual: null,
    }),
}))
