import type { Reserva } from '../types'

interface ReservationSuccessProps {
  reserva: Reserva
}

/**
 * Exibe informações de reserva bem-sucedida
 * Mostra código, status, assento e dados do passageiro
 */
export function ReservationSuccess({ reserva }: ReservationSuccessProps) {
  return (
    <section className="card success-card">
      <h2>Sucesso</h2>
      <p>
        <strong>Código da reserva:</strong> {reserva.codigo}
      </p>
      <p>
        <strong>Status:</strong> {reserva.status}
      </p>
      <p>
        <strong>Assento:</strong> {reserva.numeroAssento}
      </p>
      <p>
        <strong>Passageiro:</strong> {reserva.nomePassageiro}
      </p>
      <p>
        <strong>CPF:</strong> {reserva.cpf}
      </p>
      <p>
        <strong>E-mail:</strong> {reserva.email}
      </p>
      <p className="creation-date">
        Criado em: {new Date(reserva.criadaEmUtc).toLocaleString('pt-BR')}
      </p>
    </section>
  )
}
