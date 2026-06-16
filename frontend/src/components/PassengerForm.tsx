import type { FormEvent } from 'react'

export type PassengerData = {
  nome: string
  cpf: string
  email: string
  dataNascimento: string
}

interface PassengerFormProps {
  passageiro: PassengerData
  loading: boolean
  assentoSelecionado: number | null
  onNomeChange: (nome: string) => void
  onCpfChange: (cpf: string) => void
  onEmailChange: (email: string) => void
  onDataNascimentoChange: (data: string) => void
  onSubmit: (event: FormEvent) => void
}

/**
 * Formulário de dados do passageiro
 * - Campos: nome, CPF, email, data de nascimento
 * - Submit desabilitado até assento ser selecionado
 */
export function PassengerForm({
  passageiro,
  loading,
  assentoSelecionado,
  onNomeChange,
  onCpfChange,
  onEmailChange,
  onDataNascimentoChange,
  onSubmit,
}: PassengerFormProps) {
  return (
    <section className="card passenger-card">
      <h2>3. Dados do passageiro</h2>
      <form onSubmit={onSubmit} className="grid-form">
        <label>
          Nome completo
          <input
            value={passageiro.nome}
            onChange={(e) => onNomeChange(e.target.value)}
            required
          />
        </label>
        <label>
          CPF
          <input
            value={passageiro.cpf}
            onChange={(e) => onCpfChange(e.target.value)}
            required
          />
        </label>
        <label>
          E-mail
          <input
            type="email"
            value={passageiro.email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
        </label>
        <label>
          Data de nascimento
          <input
            type="date"
            value={passageiro.dataNascimento}
            onChange={(e) => onDataNascimentoChange(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading || !assentoSelecionado}>
          {loading ? 'Confirmando...' : 'Confirmar compra'}
        </button>
      </form>
    </section>
  )
}
