import { useRef, useState } from 'react'
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
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovered: false })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ rx: -py * 10, ry: px * 10, hovered: true })
  }

  const resetTilt = () => setTilt({ rx: 0, ry: 0, hovered: false })

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(pokemon.name)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(pokemon.name)
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      style={{
        ...style,
        background: `linear-gradient(160deg, ${primaryColor}22 0%, transparent 55%)`,
        transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(${tilt.hovered ? -4 : 0}px)`,
        boxShadow: tilt.hovered
          ? `0 20px 30px -12px ${primaryColor}55, 0 4px 10px -4px rgba(0,0,0,0.15)`
          : undefined,
        ...(isSelectedForCompare ? { boxShadow: `0 0 0 3px ${primaryColor}` } : {}),
      }}
      className="animate-fade-in-up group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-[1.5rem] border border-black/5 bg-white/90 p-4 text-left shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-[transform,box-shadow] duration-150 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 dark:border-white/5 dark:bg-zinc-800/90 dark:ring-white/5"
    >
      <div className="flex w-full items-start justify-between">
        <span className="rounded-full bg-zinc-100/80 px-2 py-0.5 font-mono text-xs font-bold text-zinc-400 dark:bg-white/5 dark:text-zinc-500">
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
            key={isFavorite ? 'fav-on' : 'fav-off'}
            size={18}
            fill={isFavorite ? 'currentColor' : 'none'}
            className={isFavorite ? 'animate-heart-pop text-rose-500' : ''}
          />
        </button>
      </div>

      <div className="relative flex h-28 w-28 items-center justify-center">
        <div
          className="absolute h-20 w-20 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
          style={{ backgroundColor: primaryColor }}
          aria-hidden="true"
        />
        {pokemon.image ? (
          <img
            src={pokemon.image}
            alt={pokemon.name}
            loading="lazy"
            className="relative h-full w-full object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-110"
          />
        ) : (
          <div className="relative text-4xl">❓</div>
        )}
      </div>

      <h3 className="font-heading mt-1 text-base font-bold capitalize text-zinc-900 dark:text-zinc-50">
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
