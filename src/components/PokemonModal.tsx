import { useEffect, useRef } from 'react'
import { Heart, Ruler, Weight, X } from 'lucide-react'
import type { PokemonSummary } from '../types/pokemon'
import { getTypeColor } from '../constants/typeColors'
import { formatHeight, formatId, formatName, formatWeight } from '../utils/format'
import { TypeBadge } from './TypeBadge'
import { StatBar } from './StatBar'

interface PokemonModalProps {
  pokemon: PokemonSummary
  isFavorite: boolean
  onToggleFavorite: (name: string) => void
  onClose: () => void
}

const STAT_LABELS: [keyof PokemonSummary['stats'], string][] = [
  ['hp', 'HP'],
  ['attack', 'Attack'],
  ['defense', 'Defense'],
  ['specialAttack', 'Sp. Atk'],
  ['specialDefense', 'Sp. Def'],
  ['speed', 'Speed'],
]

export function PokemonModal({ pokemon, isFavorite, onToggleFavorite, onClose }: PokemonModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const primaryColor = getTypeColor(pokemon.types[0] ?? 'normal')

  useEffect(() => {
    closeButtonRef.current?.focus()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pokemon-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl dark:bg-zinc-800"
      >
        <div
          className="relative flex flex-col items-center px-6 pb-6 pt-12"
          style={{ background: `linear-gradient(160deg, ${primaryColor}33 0%, transparent 70%)` }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-zinc-600 shadow-sm transition-transform hover:scale-105 hover:bg-white dark:bg-zinc-700/80 dark:text-zinc-200"
          >
            <X size={18} />
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(pokemon.name)}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-zinc-500 shadow-sm transition-transform hover:scale-105 hover:bg-white dark:bg-zinc-700/80 dark:text-zinc-300"
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-rose-500' : ''} />
          </button>

          <span className="font-mono text-sm font-bold text-zinc-400 dark:text-zinc-400">
            {formatId(pokemon.id)}
          </span>
          {pokemon.image && (
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="h-40 w-40 object-contain drop-shadow-xl sm:h-48 sm:w-48"
            />
          )}
          <h2
            id="pokemon-modal-title"
            className="mt-1 text-2xl font-extrabold capitalize text-zinc-900 dark:text-zinc-50"
          >
            {formatName(pokemon.name)}
          </h2>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} size="md" />
            ))}
          </div>
        </div>

        <div className="space-y-6 px-6 pb-8">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-700/40">
              <Ruler size={18} className="text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-400">Height</p>
                <p className="font-semibold text-zinc-700 dark:text-zinc-200">{formatHeight(pokemon.height)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-3 dark:bg-zinc-700/40">
              <Weight size={18} className="text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-400">Weight</p>
                <p className="font-semibold text-zinc-700 dark:text-zinc-200">{formatWeight(pokemon.weight)}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-zinc-400">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span
                  key={ability}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium capitalize text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                >
                  {formatName(ability)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">Base Statistics</h3>
            <div className="space-y-2.5">
              {STAT_LABELS.map(([key, label]) => (
                <StatBar key={key} label={label} value={pokemon.stats[key]} color={primaryColor} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-zinc-400">
              Moves ({pokemon.moves.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.moves.slice(0, 12).map((move) => (
                <span
                  key={move}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium capitalize text-zinc-500 dark:border-zinc-600 dark:text-zinc-400"
                >
                  {formatName(move)}
                </span>
              ))}
              {pokemon.moves.length > 12 && (
                <span className="rounded-full px-3 py-1 text-xs font-medium text-zinc-400">
                  +{pokemon.moves.length - 12} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
