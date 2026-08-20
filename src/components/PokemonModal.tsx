import { useEffect, useRef, useState } from 'react'
import { Heart, Ruler, Sparkles, Volume2, Weight, X } from 'lucide-react'
import type { PokemonSummary } from '../types/pokemon'
import { getTypeColor } from '../constants/typeColors'
import { fetchFlavorText } from '../services/pokemonApi'
import { formatHeight, formatId, formatName, formatWeight } from '../utils/format'
import { TypeBadge } from './TypeBadge'
import { StatBar } from './StatBar'
import { TypeMatchups } from './TypeMatchups'

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
  const audioRef = useRef<HTMLAudioElement>(null)
  const primaryColor = getTypeColor(pokemon.types[0] ?? 'normal')

  const [showShiny, setShowShiny] = useState(false)
  const [flavorText, setFlavorText] = useState<string | null>(null)
  const [flavorLoading, setFlavorLoading] = useState(true)
  const [isPlayingCry, setIsPlayingCry] = useState(false)

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

  useEffect(() => {
    setShowShiny(false)
    setFlavorLoading(true)
    setFlavorText(null)
    let cancelled = false
    fetchFlavorText(pokemon.name)
      .then((text) => {
        if (!cancelled) setFlavorText(text)
      })
      .catch(() => {
        if (!cancelled) setFlavorText(null)
      })
      .finally(() => {
        if (!cancelled) setFlavorLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [pokemon.name])

  const displayedImage = (showShiny && pokemon.shinyImage) || pokemon.image

  const playCry = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }

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
        {pokemon.cryUrl && <audio ref={audioRef} src={pokemon.cryUrl} onEnded={() => setIsPlayingCry(false)} onPlay={() => setIsPlayingCry(true)} onPause={() => setIsPlayingCry(false)} />}

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
            <Heart
              key={isFavorite ? 'fav-on' : 'fav-off'}
              size={18}
              fill={isFavorite ? 'currentColor' : 'none'}
              className={isFavorite ? 'animate-heart-pop text-rose-500' : ''}
            />
          </button>

          <span className="font-mono text-sm font-bold text-zinc-400 dark:text-zinc-400">
            {formatId(pokemon.id)}
          </span>

          <div className="relative">
            {displayedImage && (
              <img
                key={displayedImage}
                src={displayedImage}
                alt={pokemon.name}
                className="animate-fade-in-up h-40 w-40 object-contain drop-shadow-xl sm:h-48 sm:w-48"
              />
            )}
            {showShiny && (
              <Sparkles size={22} className="absolute right-0 top-0 animate-pulse text-amber-400" />
            )}
          </div>

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

          <div className="mt-4 flex items-center gap-2">
            {pokemon.shinyImage && (
              <button
                type="button"
                onClick={() => setShowShiny((v) => !v)}
                aria-pressed={showShiny}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  showShiny
                    ? 'bg-amber-400 text-amber-950'
                    : 'bg-white/80 text-zinc-600 hover:bg-white dark:bg-zinc-700/80 dark:text-zinc-300'
                }`}
              >
                <Sparkles size={14} />
                Shiny
              </button>
            )}
            {pokemon.cryUrl && (
              <button
                type="button"
                onClick={playCry}
                aria-label={`Play ${pokemon.name}'s cry`}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isPlayingCry
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/80 text-zinc-600 hover:bg-white dark:bg-zinc-700/80 dark:text-zinc-300'
                }`}
              >
                <Volume2 size={14} className={isPlayingCry ? 'animate-pulse' : ''} />
                Cry
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6 px-6 pb-8">
          {(flavorLoading || flavorText) && (
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-700/40">
              {flavorLoading ? (
                <div className="space-y-2">
                  <div className="shimmer h-3 w-full rounded" />
                  <div className="shimmer h-3 w-2/3 rounded" />
                </div>
              ) : (
                <p className="text-sm italic leading-relaxed text-zinc-600 dark:text-zinc-300">
                  &ldquo;{flavorText}&rdquo;
                </p>
              )}
            </div>
          )}

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
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-400">Type Matchups</h3>
            <TypeMatchups types={pokemon.types} />
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
