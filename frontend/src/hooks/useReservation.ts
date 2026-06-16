import { useState } from 'react'
import type { Reserva, ViagemDetalhe } from '../types'
import type { PassengerData } from '../components/PassengerForm'
import { api } from '../services/api'
import {
  extrairMensagemErro,
  ERROR_MESSAGES,
} from '../utils/constants'

/**
 * Hook para gerenciar estado de reservas
 * Encapsula: seleção de assento, criação de reserva, cancelamento
 */
export function useReservation() {
  const [assentoSelecionado, setAssentoSelecionado] = useState<number | null>(null)
  const [reservaAtual, setReservaAtual] = useState<Reserva | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * Cria uma nova reserva com dados do passageiro
   */
  const criarReserva = async (
    viagem: ViagemDetalhe,
    passageiro: PassengerData,
    numeroAssento: number
  ): Promise<void> => {
    if (!viagem || !numeroAssento) {
      setErro(ERROR_MESSAGES.SELECIONE_VIAGEM_ASSENTO)
      return
    }

    try {
      setLoading(true)
      setErro(null)

      const reserva = await api.criarReserva({
        viagemId: viagem.id,
        numeroAssento,
        nome: passageiro.nome,
        cpf: passageiro.cpf,
        email: passageiro.email,
        dataNascimento: passageiro.dataNascimento,
      })

      setReservaAtual(reserva)
    } catch (error) {
      const mensagem = extrairMensagemErro(
        error,
        ERROR_MESSAGES.FALHA_CRIAR_RESERVA
      )
      setErro(mensagem)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cancela uma reserva existente
   */
  const cancelarReserva = async (codigo: string): Promise<void> => {
    try {
      setLoading(true)
      setErro(null)

      const reserva = await api.cancelarReserva(codigo)
      setReservaAtual(reserva)
    } catch (error) {
      const mensagem = extrairMensagemErro(
        error,
        ERROR_MESSAGES.NAO_FOI_POSSIVEL_CANCELAR
      )
      setErro(mensagem)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Reseta estado de reserva (limpa seleção e reserva atual)
   */
  const resetarReserva = () => {
    setAssentoSelecionado(null)
    setReservaAtual(null)
    setErro(null)
  }

  return {
    assentoSelecionado,
    setAssentoSelecionado,
    reservaAtual,
    setReservaAtual,
    erro,
    loading,
    criarReserva,
    cancelarReserva,
    resetarReserva,
  }
}
