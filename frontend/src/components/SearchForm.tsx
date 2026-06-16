import type { FormEvent } from 'react'
import type { Rota } from '../types'

interface SearchFormProps {
  origem: string
  destino: string
  data: string
  rotas: Rota[]
  loading: boolean
  onOrigemChange: (origem: string) => void
  onDestinoChange: (destino: string) => void
  onDataChange: (data: string) => void
  onSubmit: (event: FormEvent) => void
}

/**
 * Formulário de busca de passagens
 * - Campos: origem, destino, data
 * - Autocomplete via datalist
 * - Estado de loading durante busca
 */
export function SearchForm({
  origem,
  destino,
  data,
  rotas,
  loading,
  onOrigemChange,
  onDestinoChange,
  onDataChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <section className="card search-card">
      <h2>1. Busca de passagens</h2>
      <form onSubmit={onSubmit} className="grid-form">
        <label>
          Origem
          <input
            value={origem}
            onChange={(e) => onOrigemChange(e.target.value)}
            list="origens"
            required
          />
        </label>
        <label>
          Destino
          <input
            value={destino}
            onChange={(e) => onDestinoChange(e.target.value)}
            list="destinos"
            required
          />
        </label>
        <label>
          Data
          <input
            type="date"
            value={data}
            onChange={(e) => onDataChange(e.target.value)}
            lang="pt-BR"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar viagens'}
        </button>
      </form>

      <datalist id="origens">
        {rotas.map((rota) => (
          <option key={`${rota.id}-origem`} value={rota.origem} />
        ))}
      </datalist>
      <datalist id="destinos">
        {rotas.map((rota) => (
          <option key={`${rota.id}-destino`} value={rota.destino} />
        ))}
      </datalist>
    </section>
  )
}
