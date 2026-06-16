import { useState } from 'react'
import {
  Header,
  SearchForm,
  TripList,
  SeatSelector,
  PassengerForm,
  ReservationSuccess,
  ReservationQuery,
  ErrorMessage,
  type PassengerData,
} from './components'
import { useTripSearch, useReservation, useReservationQuery } from './hooks'
import './App.css'

/**
 * Componente principal da aplicação OniBus Express
 *
 * Responsabilidades:
 * - Orquestrar fluxo de compra de passagens
 * - Gerenciar estado global com hooks customizados
 * - Renderizar componentes de acordo com etapa do fluxo
 *
 * Fluxo de compra:
 * 1. Buscar viagens (origem, destino, data)
 * 2. Selecionar viagem
 * 3. Escolher assento
 * 4. Informar dados do passageiro
 * 5. Confirmar compra
 * 6. Exibir código de reserva
 *
 * Funcionalidade adicional:
 * - Consultar reserva por código
 * - Cancelar reserva existente
 */
function App() {
  // Estado de busca de viagens
  const {
    rotas,
    viagens,
    viagemSelecionada,
    erro: erroViagem,
    loading: loadingViagem,
    buscarViagens,
    selecionarViagem,
    resetarBusca,
  } = useTripSearch()

  // Estado de reserva
  const {
    assentoSelecionado,
    setAssentoSelecionado,
    reservaAtual,
    erro: erroReserva,
    loading: loadingReserva,
    criarReserva,
  } = useReservation()

  // Estado de consulta de reserva
  const {
    reserva: reservaConsultada,
    erro: erroConsulta,
    loading: loadingConsulta,
    consultarReserva,
    cancelarReserva,
  } = useReservationQuery()

  // Estado de formulário de busca
  const [search, setSearch] = useState({
    origem: 'Sao Paulo',
    destino: 'Rio de Janeiro',
    data: new Date().toISOString().slice(0, 10),
  })

  // Estado de dados do passageiro
  const [passageiro, setPassageiro] = useState<PassengerData>({
    nome: '',
    cpf: '',
    email: '',
    dataNascimento: '1990-01-01',
  })

  // Estado de consulta de reserva
  const [consultaCodigo, setConsultaCodigo] = useState('')

  // Handlers para atualizar estado de busca
  const handleOrigemChange = (origem: string) => {
    setSearch((prev) => ({ ...prev, origem }))
  }

  const handleDestinoChange = (destino: string) => {
    setSearch((prev) => ({ ...prev, destino }))
  }

  const handleDataChange = (data: string) => {
    setSearch((prev) => ({ ...prev, data }))
  }

  // Handler para buscar viagens
  const handleBuscarViagens = async (event: React.FormEvent) => {
    event.preventDefault()
    resetarBusca()
    await buscarViagens(search.origem, search.destino, search.data)
  }

  // Handler para selecionar viagem
  const handleSelecionarViagem = async (viagem: any) => {
    await selecionarViagem(viagem)
  }

  // Handlers para atualizar dados do passageiro
  const handleNomeChange = (nome: string) => {
    setPassageiro((prev) => ({ ...prev, nome }))
  }

  const handleCpfChange = (cpf: string) => {
    setPassageiro((prev) => ({ ...prev, cpf }))
  }

  const handleEmailChange = (email: string) => {
    setPassageiro((prev) => ({ ...prev, email }))
  }

  const handleDataNascimentoChange = (dataNascimento: string) => {
    setPassageiro((prev) => ({ ...prev, dataNascimento }))
  }

  // Handler para confirmar compra
  const handleConfirmarCompra = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!viagemSelecionada || !assentoSelecionado) {
      return
    }

    await criarReserva(viagemSelecionada, passageiro, assentoSelecionado)
  }

  // Handler para consultar reserva
  const handleConsultarReserva = async (event: React.FormEvent) => {
    event.preventDefault()
    await consultarReserva(consultaCodigo)
  }

  // Handler para cancelar reserva
  const handleCancelarReserva = async () => {
    await cancelarReserva()
  }

  // Estado consolidado
  const loading = loadingViagem || loadingReserva || loadingConsulta
  const erro = erroViagem || erroReserva || erroConsulta

  return (
    <main className="page">
      <Header />

      {/* Exibir erros em qualquer ponto do fluxo */}
      <ErrorMessage erro={erro} />

      {/* 1. Busca de viagens */}
      <SearchForm
        origem={search.origem}
        destino={search.destino}
        data={search.data}
        rotas={rotas}
        loading={loading}
        onOrigemChange={handleOrigemChange}
        onDestinoChange={handleDestinoChange}
        onDataChange={handleDataChange}
        onSubmit={handleBuscarViagens}
      />

      {/* Lista de viagens encontradas */}
      <TripList viagens={viagens} onSelectTrip={handleSelecionarViagem} />

      {/* 2. Seleção de assento */}
      {viagemSelecionada && (
        <SeatSelector
          viagem={viagemSelecionada}
          assentoSelecionado={assentoSelecionado}
          onSelectSeat={setAssentoSelecionado}
        />
      )}

      {/* 3. Dados do passageiro */}
      {viagemSelecionada && (
        <PassengerForm
          passageiro={passageiro}
          loading={loading}
          assentoSelecionado={assentoSelecionado}
          onNomeChange={handleNomeChange}
          onCpfChange={handleCpfChange}
          onEmailChange={handleEmailChange}
          onDataNascimentoChange={handleDataNascimentoChange}
          onSubmit={handleConfirmarCompra}
        />
      )}

      {/* 4. Sucesso na compra */}
      {reservaAtual && <ReservationSuccess reserva={reservaAtual} />}

      {/* 5. Consultar/cancelar reserva existente */}
      <ReservationQuery
        codigo={consultaCodigo}
        loading={loading}
        reserva={reservaConsultada}
        onCodigoChange={setConsultaCodigo}
        onQuery={handleConsultarReserva}
        onCancel={handleCancelarReserva}
      />
    </main>
  )
}

export default App
