import type { FormEvent } from 'react'
import type { Reserva } from '../types'

interface ReservationQueryProps {
  codigo: string
  loading: boolean
  reserva: Reserva | null
  onCodigoChange: (codigo: string) => void
  onQuery: (event: FormEvent) => void
  onCancel: () => void
}

/**
 * Formulário para consultar e cancelar reserva
 * - Campo: código da reserva
 * - Exibe informações da reserva se encontrada
 * - Botão de cancelamento aparece se reserva está ativa
 */
export function ReservationQuery({
  codigo,
  loading,
  reserva,
  onCodigoChange,
  onQuery,
  onCancel,
}: ReservationQueryProps) {
  const podesCancelar = reserva?.status === 'Ativa'

  return (
    <section className="card consultation-card">
      <h2>4. Consultar ou cancelar reserva</h2>
      <form onSubmit={onQuery} className="grid-form">
        <label>
          Código da reserva
          <input
            value={codigo}
            onChange={(e) => onCodigoChange(e.target.value)}
            placeholder="ABC-12345"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </form>

      {reserva && (
        <div className="reservation-details">
          <p>
            <strong>Status:</strong> {reserva.status}
          </p>
          <p>
            <strong>Passageiro:</strong> {reserva.nomePassageiro}
          </p>
          <p>
            <strong>Assento:</strong> {reserva.numeroAssento}
          </p>
          {podesCancelar && (
            <button
              onClick={onCancel}
              disabled={loading}
              className="cancel-button"
            >
              {loading ? 'Cancelando...' : 'Cancelar reserva'}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
