import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SeatSelector } from './SeatSelector'
import type { ViagemDetalhe } from '../types'

describe('SeatSelector', () => {
  const viagemBase: ViagemDetalhe = {
    id: 1,
    origem: 'Sao Paulo',
    destino: 'Rio de Janeiro',
    dataHoraPartidaUtc: '2026-06-18T08:00:00Z',
    preco: 149.9,
    totalAssentos: 6,
    assentosOcupados: [2, 4],
  }

  it('deve permitir selecionar assento livre e bloquear assento ocupado', async () => {
    const user = userEvent.setup()

    function SeatSelectorHarness() {
      const [assentoSelecionado, setAssentoSelecionado] = useState<number | null>(null)

      return (
        <>
          <SeatSelector
            viagem={viagemBase}
            assentoSelecionado={assentoSelecionado}
            onSelectSeat={setAssentoSelecionado}
          />
          <p>Assento atual: {assentoSelecionado ?? 'nenhum'}</p>
        </>
      )
    }

    render(<SeatSelectorHarness />)

    const assentoOcupado = screen.getByRole('button', { name: '2' })
    const assentoLivre = screen.getByRole('button', { name: '3' })

    expect(assentoOcupado).toBeDisabled()
    expect(assentoLivre).toBeEnabled()

    await user.click(assentoLivre)
    expect(screen.getByText('Assento atual: 3')).toBeInTheDocument()

    await user.click(assentoOcupado)
    expect(screen.getByText('Assento atual: 3')).toBeInTheDocument()
  })
})
