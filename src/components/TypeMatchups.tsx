import { useEffect, useState } from 'react'
import { computeTypeMatchups } from '../utils/typeMatchups'
import type { PokemonType, TypeMatchup } from '../types/pokemon'
import { TypeBadge } from './TypeBadge'

interface TypeMatchupsProps {
  types: PokemonType[]
}

export function TypeMatchups({ types }: TypeMatchupsProps) {
  const [matchups, setMatchups] = useState<TypeMatchup[] | null>(null)
  const key = types.join(',')

  useEffect(() => {
    let cancelled = false
    setMatchups(null)
    computeTypeMatchups(types)
      .then((result) => {
        if (!cancelled) setMatchups(result)
      })
      .catch(() => {
        if (!cancelled) setMatchups([])
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (matchups === null) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="shimmer h-6 w-16 rounded-full" />
        ))}
      </div>
    )
  }

  const weak = matchups.filter((m) => m.multiplier > 1)
  const resistant = matchups.filter((m) => m.multiplier < 1 && m.multiplier > 0)
  const immune = matchups.filter((m) => m.multiplier === 0)

  if (weak.length === 0 && resistant.length === 0 && immune.length === 0) return null

  return (
    <div className="space-y-3">
      {weak.length > 0 && (
        <MatchupRow label="Weak against" items={weak} />
      )}
      {resistant.length > 0 && (
        <MatchupRow label="Resistant to" items={resistant} />
      )}
      {immune.length > 0 && (
        <MatchupRow label="Immune to" items={immune} />
      )}
    </div>
  )
}

function MatchupRow({ label, items }: { label: string; items: TypeMatchup[] }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((m) => (
          <div key={m.type} className="flex items-center gap-1">
            <TypeBadge type={m.type} />
            <span className="text-xs font-bold text-zinc-400">×{m.multiplier}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
