import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PassengerForm, type PassengerData } from './PassengerForm'

describe('PassengerForm', () => {
  it('deve manter envio desabilitado sem assento e permitir confirmar com dados preenchidos', async () => {
    const user = userEvent.setup()

    function PassengerFormHarness() {
      const [passageiro, setPassageiro] = useState<PassengerData>({
        nome: '',
        cpf: '',
        email: '',
        dataNascimento: '1990-01-01',
      })
      const [assentoSelecionado, setAssentoSelecionado] = useState<number | null>(null)
      const [compraEnviada, setCompraEnviada] = useState(false)

      return (
        <>
          <PassengerForm
            passageiro={passageiro}
            loading={false}
            assentoSelecionado={assentoSelecionado}
            onNomeChange={(nome) => setPassageiro((prev) => ({ ...prev, nome }))}
            onCpfChange={(cpf) => setPassageiro((prev) => ({ ...prev, cpf }))}
            onEmailChange={(email) => setPassageiro((prev) => ({ ...prev, email }))}
            onDataNascimentoChange={(dataNascimento) =>
              setPassageiro((prev) => ({ ...prev, dataNascimento }))
            }
            onSubmit={(event) => {
              event.preventDefault()
              setCompraEnviada(true)
            }}
          />

          <button type="button" onClick={() => setAssentoSelecionado(5)}>
            Selecionar assento 5
          </button>

          {compraEnviada && <p>Compra enviada</p>}
        </>
      )
    }

    render(<PassengerFormHarness />)

    const botaoConfirmar = screen.getByRole('button', { name: 'Confirmar compra' })
    expect(botaoConfirmar).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Selecionar assento 5' }))
    expect(screen.getByRole('button', { name: 'Confirmar compra' })).toBeEnabled()

    await user.type(screen.getByLabelText('Nome completo'), 'Maria da Silva')
    await user.type(screen.getByLabelText('CPF'), '12345678909')
    await user.type(screen.getByLabelText('E-mail'), 'maria@email.com')

    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))
    expect(screen.getByText('Compra enviada')).toBeInTheDocument()
  })
})
