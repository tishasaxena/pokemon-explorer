import { fetchDamageRelations } from '../services/pokemonApi'
import type { Effectiveness, TypeMatchup } from '../types/pokemon'

const ALL_ATTACKING_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark',
  'steel', 'fairy',
]

export async function computeTypeMatchups(types: string[]): Promise<TypeMatchup[]> {
  const relations = await Promise.all(types.map((t) => fetchDamageRelations(t)))

  const multipliers = ALL_ATTACKING_TYPES.map((attacker) => {
    let multiplier = 1
    for (const relation of relations) {
      if (relation.no_damage_from.some((t) => t.name === attacker)) multiplier *= 0
      else if (relation.double_damage_from.some((t) => t.name === attacker)) multiplier *= 2
      else if (relation.half_damage_from.some((t) => t.name === attacker)) multiplier *= 0.5
    }
    return { type: attacker, multiplier: multiplier as Effectiveness }
  })

  return multipliers.filter((m) => m.multiplier !== 1).sort((a, b) => b.multiplier - a.multiplier)
}
