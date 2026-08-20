import { X } from 'lucide-react'
import type { PokemonSummary } from '../types/pokemon'
import { getTypeColor } from '../constants/typeColors'
import { formatName } from '../utils/format'
import { TypeBadge } from './TypeBadge'

interface CompareModalProps {
  pokemonA: PokemonSummary
  pokemonB: PokemonSummary
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

export function CompareModal({ pokemonA, pokemonB, onClose }: CompareModalProps) {
  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-800"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">Compare Pokémon</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4">
          {[pokemonA, pokemonB].map((p) => (
            <div key={p.name} className="flex flex-col items-center">
              <img src={p.image} alt={p.name} className="h-20 w-20 object-contain" />
              <p className="font-bold capitalize text-zinc-800 dark:text-zinc-100">{formatName(p.name)}</p>
              <div className="mt-1 flex gap-1">
                {p.types.map((t) => (
                  <TypeBadge key={t} type={t} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {STAT_LABELS.map(([key, label]) => {
            const a = pokemonA.stats[key]
            const b = pokemonB.stats[key]
            const max = Math.max(a, b, 1)
            return (
              <div key={key}>
                <div className="mb-1 flex justify-between text-xs font-semibold uppercase text-zinc-400">
                  <span>{a}</span>
                  <span>{label}</span>
                  <span>{b}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                    <div
                      className="ml-auto h-full rounded-full transition-all"
                      style={{
                        width: `${(a / max) * 100}%`,
                        backgroundColor: a >= b ? getTypeColor(pokemonA.types[0]) : '#d4d4d8',
                      }}
                    />
                  </div>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(b / max) * 100}%`,
                        backgroundColor: b >= a ? getTypeColor(pokemonB.types[0]) : '#d4d4d8',
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
