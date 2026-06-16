import type { ViagemDetalhe } from '../types'
import { formatarMoeda } from '../utils/constants'

interface SeatSelectorProps {
  viagem: ViagemDetalhe
  assentoSelecionado: number | null
  onSelectSeat: (assento: number) => void
}

/**
 * Seletor de assentos com visualização em grid
 * - Assentos ocupados aparecem desabilitados
 * - Assento selecionado destaca-se visualmente
 */
export function SeatSelector({
  viagem,
  assentoSelecionado,
  onSelectSeat,
}: SeatSelectorProps) {
  const assentos = Array.from({ length: viagem.totalAssentos }, (_, i) => i + 1)

  return (
    <section className="card seats-card">
      <h2>2. Seleção de assento</h2>
      <p>
        Viagem {viagem.origem} → {viagem.destino} | {formatarMoeda(viagem.preco)}
      </p>
      <div className="seat-grid">
        {assentos.map((assento) => {
          const ocupado = viagem.assentosOcupados.includes(assento)
          const selecionado = assentoSelecionado === assento

          return (
            <button
              key={assento}
              type="button"
              className={`seat ${ocupado ? 'occupied' : ''} ${
                selecionado ? 'selected' : ''
              }`}
              disabled={ocupado}
              onClick={() => onSelectSeat(assento)}
            >
              {assento}
            </button>
          )
        })}
      </div>
    </section>
  )
}
