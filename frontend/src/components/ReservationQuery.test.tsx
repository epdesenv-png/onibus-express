import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReservationQuery } from './ReservationQuery'
import type { Reserva } from '../types'

describe('ReservationQuery', () => {
  it('deve permitir consultar e cancelar reserva ativa', async () => {
    const user = userEvent.setup()

    const reserva: Reserva = {
      codigo: 'ABC-12345',
      viagemId: 1,
      numeroAssento: 10,
      status: 'Ativa',
      nomePassageiro: 'Maria',
      cpf: '12345678909',
      email: 'maria@email.com',
      criadaEmUtc: '2026-06-17T10:00:00Z',
    }

    function ReservationQueryHarness() {
      const [codigo, setCodigo] = useState('')
      const [consultou, setConsultou] = useState(false)
      const [cancelou, setCancelou] = useState(false)

      return (
        <>
          <ReservationQuery
            codigo={codigo}
            loading={false}
            reserva={reserva}
            onCodigoChange={setCodigo}
            onQuery={(event) => {
              event.preventDefault()
              setConsultou(true)
            }}
            onCancel={() => setCancelou(true)}
          />
          {consultou && <p>Consulta enviada</p>}
          {cancelou && <p>Cancelamento solicitado</p>}
        </>
      )
    }

    render(<ReservationQueryHarness />)

    await user.type(screen.getByLabelText('Código da reserva'), 'ABC-12345')
    await user.click(screen.getByRole('button', { name: 'Consultar' }))

    expect(screen.getByText('Consulta enviada')).toBeInTheDocument()
    expect(screen.getByText('Maria')).toBeInTheDocument()
    expect(screen.getByText('Ativa')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancelar reserva' }))

    expect(screen.getByText('Cancelamento solicitado')).toBeInTheDocument()
  })

  it('nao deve renderizar botao de cancelar quando reserva estiver cancelada', () => {
    const reserva: Reserva = {
      codigo: 'ABC-12345',
      viagemId: 1,
      numeroAssento: 10,
      status: 'Cancelada',
      nomePassageiro: 'Maria',
      cpf: '12345678909',
      email: 'maria@email.com',
      criadaEmUtc: '2026-06-17T10:00:00Z',
    }

    render(
      <ReservationQuery
        codigo="ABC-12345"
        loading={false}
        reserva={reserva}
        onCodigoChange={vi.fn()}
        onQuery={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Cancelar reserva' }),
    ).not.toBeInTheDocument()
  })
})
