import type { PokemonSummary } from '../types/pokemon'
import { PokemonCard } from './PokemonCard'

interface PokemonGridProps {
  items: PokemonSummary[]
  isFavorite: (name: string) => boolean
  onToggleFavorite: (name: string) => void
  onSelect: (name: string) => void
  compareMode?: boolean
  compareSelection?: string[]
}

export function PokemonGrid({
  items,
  isFavorite,
  onToggleFavorite,
  onSelect,
  compareMode = false,
  compareSelection = [],
}: PokemonGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((pokemon, i) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          isFavorite={isFavorite(pokemon.name)}
          onToggleFavorite={onToggleFavorite}
          onSelect={onSelect}
          compareMode={compareMode}
          isSelectedForCompare={compareSelection.includes(pokemon.name)}
          style={{ animationDelay: `${Math.min(i, 20) * 25}ms` }}
        />
      ))}
    </div>
  )
}
