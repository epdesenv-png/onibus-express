import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const apiMock = vi.hoisted(() => ({
  listarRotas: vi.fn(),
  buscarViagens: vi.fn(),
  detalheViagem: vi.fn(),
  criarReserva: vi.fn(),
  consultarReserva: vi.fn(),
  cancelarReserva: vi.fn(),
}))

vi.mock('./services/api', () => ({
  api: apiMock,
}))

describe('App - comportamento do usuario', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    apiMock.listarRotas.mockResolvedValue([
      {
        id: 1,
        origem: 'Sao Paulo',
        destino: 'Rio de Janeiro',
        duracaoMinutos: 360,
      },
    ])

    apiMock.buscarViagens.mockResolvedValue([])
    apiMock.detalheViagem.mockResolvedValue(null)
    apiMock.criarReserva.mockResolvedValue(null)
    apiMock.consultarReserva.mockResolvedValue(null)
    apiMock.cancelarReserva.mockResolvedValue(null)
  })

  it('deve permitir buscar viagens e exibir resultado na tela', async () => {
    const user = userEvent.setup()

    apiMock.buscarViagens.mockResolvedValueOnce([
      {
        id: 1,
        origem: 'Sao Paulo',
        destino: 'Rio de Janeiro',
        dataHoraPartidaUtc: '2026-06-18T08:00:00Z',
        preco: 149.9,
        totalAssentos: 40,
        assentosDisponiveis: 39,
      },
    ])

    render(<App />)

    await user.clear(screen.getByLabelText('Data'))
    await user.type(screen.getByLabelText('Data'), '2026-06-18')
    await user.click(screen.getByRole('button', { name: 'Buscar viagens' }))

    expect(await screen.findByText('Sao Paulo → Rio de Janeiro')).toBeInTheDocument()
    expect(apiMock.buscarViagens).toHaveBeenCalledWith(
      'Sao Paulo',
      'Rio de Janeiro',
      '2026-06-18',
    )
  })

  it('deve exibir popup de erro ao consultar reserva invalida e fechar com Esc', async () => {
    const user = userEvent.setup()

    apiMock.consultarReserva.mockRejectedValueOnce(new Error('Reserva nao encontrada.'))

    render(<App />)

    await user.type(screen.getByLabelText('Código da reserva'), 'ABC-00000')
    await user.click(screen.getByRole('button', { name: 'Consultar' }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Atenção!' })).toBeInTheDocument()
    expect(screen.getByText('Reserva nao encontrada.')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
