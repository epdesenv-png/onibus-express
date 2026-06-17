import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorMessage } from './ErrorMessage'

describe('ErrorMessage', () => {
  it('deve exibir popup de erro e fechar com botao', async () => {
    const user = userEvent.setup()

    render(<ErrorMessage erro="Erro de teste" />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Atenção!')).toBeInTheDocument()
    expect(screen.getByText('Erro de teste')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fechar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('deve fechar popup ao pressionar Esc', async () => {
    const user = userEvent.setup()

    render(<ErrorMessage erro="Erro de teste" />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
