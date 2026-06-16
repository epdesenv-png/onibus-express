import { useEffect, useState } from 'react'
import type { Rota, Viagem, ViagemDetalhe } from '../types'
import { api } from '../services/api'
import {
  extrairMensagemErro,
  ERROR_MESSAGES,
} from '../utils/constants'

/**
 * Hook para gerenciar estado de busca de viagens
 * Encapsula: carregamento de rotas, busca de viagens, seleção de viagem
 */
export function useTripSearch() {
  const [rotas, setRotas] = useState<Rota[]>([])
  const [viagens, setViagens] = useState<Viagem[]>([])
  const [viagemSelecionada, setViagemSelecionada] = useState<ViagemDetalhe | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Carregar rotas ao montar componente
  useEffect(() => {
    const carregarRotas = async () => {
      try {
        const rotasCarregadas = await api.listarRotas()
        setRotas(rotasCarregadas)
      } catch {
        // Silenciosamente falha ao carregar rotas; array vazio será usado
        setRotas([])
      }
    }

    carregarRotas()
  }, [])

  /**
   * Busca viagens baseado em origem, destino e data
   */
  const buscarViagens = async (
    origem: string,
    destino: string,
    data: string
  ): Promise<void> => {
    try {
      setLoading(true)
      setErro(null)
      setViagemSelecionada(null)
      const viagensEncontradas = await api.buscarViagens(origem, destino, data)
      setViagens(viagensEncontradas)
    } catch (error) {
      const mensagem = extrairMensagemErro(
        error,
        ERROR_MESSAGES.ERRO_BUSCAR_VIAGENS
      )
      setErro(mensagem)
      setViagens([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Seleciona uma viagem e carrega detalhes (assentos ocupados)
   */
  const selecionarViagem = async (viagem: Viagem): Promise<void> => {
    try {
      setLoading(true)
      setErro(null)
      const detalhe = await api.detalheViagem(viagem.id)
      setViagemSelecionada(detalhe)
    } catch (error) {
      const mensagem = extrairMensagemErro(
        error,
        ERROR_MESSAGES.ERRO_CARREGAR_VIAGEM
      )
      setErro(mensagem)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Reseta busca (limpa viagens e viagem selecionada)
   */
  const resetarBusca = () => {
    setViagens([])
    setViagemSelecionada(null)
    setErro(null)
  }

  return {
    rotas,
    viagens,
    viagemSelecionada,
    erro,
    loading,
    buscarViagens,
    selecionarViagem,
    resetarBusca,
  }
}
