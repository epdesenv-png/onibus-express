import { useState } from 'react'
import type { Reserva } from '../types'
import { api } from '../services/api'
import {
  extrairMensagemErro,
  ERROR_MESSAGES,
} from '../utils/constants'

/**
 * Hook para gerenciar consulta de reservas existentes
 * Encapsula: busca por código, cancelamento
 */
export function useReservationQuery() {
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * Consulta uma reserva pelo código
   */
  const consultarReserva = async (codigo: string): Promise<void> => {
    try {
      setLoading(true)
      setErro(null)

      const reservaEncontrada = await api.consultarReserva(codigo)
      setReserva(reservaEncontrada)
    } catch (error) {
      const mensagem = extrairMensagemErro(
        error,
        ERROR_MESSAGES.RESERVA_NAO_ENCONTRADA
      )
      setErro(mensagem)
      setReserva(null)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cancela a reserva consultada
   */
  const cancelarReserva = async (): Promise<void> => {
    if (!reserva) return

    try {
      setLoading(true)
      setErro(null)

      const reservaCancelada = await api.cancelarReserva(reserva.codigo)
      setReserva(reservaCancelada)
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
   * Limpa estado de consulta
   */
  const resetar = () => {
    setReserva(null)
    setErro(null)
  }

  return {
    reserva,
    erro,
    loading,
    consultarReserva,
    cancelarReserva,
    resetar,
  }
}
