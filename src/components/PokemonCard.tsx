import { Heart } from 'lucide-react'
import type { PokemonSummary } from '../types/pokemon'
import { getTypeColor } from '../constants/typeColors'
import { formatId, formatName } from '../utils/format'
import { TypeBadge } from './TypeBadge'

interface PokemonCardProps {
  pokemon: PokemonSummary
  isFavorite: boolean
  onToggleFavorite: (name: string) => void
  onSelect: (name: string) => void
  compareMode?: boolean
  isSelectedForCompare?: boolean
  style?: React.CSSProperties
}

export function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onSelect,
  compareMode = false,
  isSelectedForCompare = false,
  style,
}: PokemonCardProps) {
  const primaryColor = getTypeColor(pokemon.types[0] ?? 'normal')

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(pokemon.name)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(pokemon.name)
        }
      }}
      style={{
        ...style,
        background: `linear-gradient(160deg, ${primaryColor}22 0%, transparent 55%)`,
        ...(isSelectedForCompare ? { boxShadow: `0 0 0 3px ${primaryColor}` } : {}),
      }}
      className="animate-fade-in-up group relative flex cursor-pointer flex-col items-center rounded-2xl border border-black/5 bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-2 dark:border-white/5 dark:bg-zinc-800 dark:ring-white/5"
    >
      <div className="flex w-full items-start justify-between">
        <span className="font-mono text-xs font-semibold text-zinc-400 dark:text-zinc-500">
          {formatId(pokemon.id)}
        </span>
        <button
          type="button"
          aria-label={isFavorite ? `Remove ${pokemon.name} from favorites` : `Add ${pokemon.name} to favorites`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(pokemon.name)
          }}
          className="rounded-full p-1 text-zinc-300 transition-colors hover:text-rose-500 dark:text-zinc-600"
        >
          <Heart
            size={18}
            fill={isFavorite ? 'currentColor' : 'none'}
            className={isFavorite ? 'text-rose-500' : ''}
          />
        </button>
      </div>

      <div className="flex h-28 w-28 items-center justify-center">
        {pokemon.image ? (
          <img
            src={pokemon.image}
            alt={pokemon.name}
            loading="lazy"
            className="h-full w-full object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-110"
          />
        ) : (
          <div className="text-4xl">❓</div>
        )}
      </div>

      <h3 className="mt-1 text-base font-bold capitalize text-zinc-900 dark:text-zinc-50">
        {formatName(pokemon.name)}
      </h3>

      <div className="mt-2 flex flex-wrap justify-center gap-1.5">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>

      {compareMode && (
        <div
          className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-bold text-white ${
            isSelectedForCompare ? 'border-transparent' : 'border-zinc-300 dark:border-zinc-600'
          }`}
          style={isSelectedForCompare ? { backgroundColor: primaryColor } : undefined}
        >
          {isSelectedForCompare ? '✓' : ''}
        </div>
      )}
    </div>
  )
}
