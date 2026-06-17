import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('deve renderizar o titulo principal da pagina', () => {
    render(<Header />)

    expect(
      screen.getByRole('heading', { name: /passagem rodoviária em minutos/i }),
    ).toBeInTheDocument()
  })
})
