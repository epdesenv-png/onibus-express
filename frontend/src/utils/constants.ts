// Constantes de negócio para facilitar manutenção
export const CONSTANTS = {
  // Cancelamento
  HORAS_ANTES_PARA_CANCELAR: 2,
  // Geração de código de reserva
  MAX_RETRIES_CODIGO: 20,
  // Validação
  CPF_LENGTH: 11,
}

// Mensagens padrão de erro
export const ERROR_MESSAGES = {
  VIAGEM_NAO_ENCONTRADA: 'Viagem não encontrada.',
  RESERVA_NAO_ENCONTRADA: 'Reserva não encontrada.',
  FALHA_CRIAR_RESERVA: 'Falha ao criar reserva.',
  ERRO_BUSCAR_VIAGENS: 'Erro ao buscar viagens.',
  ERRO_CARREGAR_VIAGEM: 'Erro ao carregar viagem.',
  NENHUMA_VIAGEM_CARREGADA: 'Nenhuma viagem carregada ainda.',
  SELECIONE_VIAGEM_ASSENTO: 'Selecione uma viagem e um assento para continuar.',
  NAO_FOI_POSSIVEL_CANCELAR: 'Não foi possível cancelar.',
  ERRO_GENERICO: 'Erro ao processar requisição.',
}

/**
 * Extrai mensagem de erro ou retorna fallback
 */
export function extrairMensagemErro(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message
  }
  return fallback
}

/**
 * Formata data para exibição no padrão brasileiro
 */
export function formatarDataBr(dataString: string): string {
  return new Date(dataString).toLocaleString('pt-BR', { timeZone: 'UTC' })
}

/**
 * Formata data ISO (AAAA-MM-DD) para exibição no padrão brasileiro (DD/MM/AAAA)
 */
export function formatarDataIsoParaBr(dataIso: string): string {
  const [ano, mes, dia] = dataIso.split('-')
  if (!ano || !mes || !dia) {
    return dataIso
  }

  return `${dia}/${mes}/${ano}`
}

/**
 * Converte data no padrão brasileiro (DD/MM/AAAA) para ISO (AAAA-MM-DD)
 */
export function converterDataBrParaIso(dataBr: string): string | null {
  const match = dataBr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) {
    return null
  }

  const [, dia, mes, ano] = match
  const dataIso = `${ano}-${mes}-${dia}`
  const data = new Date(`${dataIso}T00:00:00Z`)

  if (Number.isNaN(data.getTime())) {
    return null
  }

  // Garante que datas inválidas como 31/02 sejam rejeitadas
  if (data.toISOString().slice(0, 10) !== dataIso) {
    return null
  }

  return dataIso
}

/**
 * Formata valor monetário para BRL
 */
export function formatarMoeda(valor: number): string {
  return `R$ ${valor.toFixed(2)}`
}
