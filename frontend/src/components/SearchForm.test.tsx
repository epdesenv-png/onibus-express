import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchForm } from './SearchForm'

describe('SearchForm', () => {
  it('deve permitir preencher os campos e buscar viagens', async () => {
    const user = userEvent.setup()

    function SearchFormHarness() {
      const [origem, setOrigem] = useState('Sao Paulo')
      const [destino, setDestino] = useState('Rio de Janeiro')
      const [data, setData] = useState('2026-06-17')
      const [buscaRealizada, setBuscaRealizada] = useState(false)

      return (
        <>
          <SearchForm
            origem={origem}
            destino={destino}
            data={data}
            rotas={[]}
            loading={false}
            onOrigemChange={setOrigem}
            onDestinoChange={setDestino}
            onDataChange={setData}
            onSubmit={(event) => {
              event.preventDefault()
              setBuscaRealizada(true)
            }}
          />
          {buscaRealizada && <p>Busca enviada</p>}
        </>
      )
    }

    render(<SearchFormHarness />)

    await user.clear(screen.getByLabelText('Origem'))
    await user.type(screen.getByLabelText('Origem'), 'Curitiba')
    await user.clear(screen.getByLabelText('Destino'))
    await user.type(screen.getByLabelText('Destino'), 'Florianopolis')
    await user.clear(screen.getByLabelText('Data'))
    await user.type(screen.getByLabelText('Data'), '2026-06-18')
    await user.click(screen.getByRole('button', { name: 'Buscar viagens' }))

    expect(screen.getByLabelText('Origem')).toHaveValue('Curitiba')
    expect(screen.getByLabelText('Destino')).toHaveValue('Florianopolis')
    expect(screen.getByLabelText('Data')).toHaveValue('2026-06-18')
    expect(screen.getByText('Busca enviada')).toBeInTheDocument()
  })

  it('deve exibir estado de carregamento durante busca', () => {
    render(
      <SearchForm
        origem="Sao Paulo"
        destino="Rio de Janeiro"
        data="2026-06-17"
        rotas={[]}
        loading
        onOrigemChange={vi.fn()}
        onDestinoChange={vi.fn()}
        onDataChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Buscando...' })).toBeDisabled()
  })
})
