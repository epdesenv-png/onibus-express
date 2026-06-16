import type { Viagem } from '../types'
import { formatarDataBr, formatarMoeda } from '../utils/constants'

interface TripListProps {
  viagens: Viagem[]
  onSelectTrip: (viagem: Viagem) => void
}

/**
 * Lista de viagens disponíveis
 * Exibe origem, destino, data/hora, preço e assentos disponíveis
 */
export function TripList({ viagens, onSelectTrip }: TripListProps) {
  return (
    <div className="trip-list">
      {viagens.length === 0 && <p>Nenhuma viagem carregada ainda.</p>}
      {viagens.map((viagem) => (
        <button
          key={viagem.id}
          className="trip-item"
          onClick={() => onSelectTrip(viagem)}
        >
          <strong>
            {viagem.origem} → {viagem.destino}
          </strong>
          <span>{formatarDataBr(viagem.dataHoraPartidaUtc)}</span>
          <span>{formatarMoeda(viagem.preco)}</span>
          <span>{viagem.assentosDisponiveis} vagas</span>
        </button>
      ))}
    </div>
  )
}
