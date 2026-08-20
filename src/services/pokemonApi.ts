import type { NamedApiResource, PokemonSummary } from '../types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function getJson<T>(url: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new ApiError('Network connection failed. Please check your connection and try again.')
  }

  if (response.status === 404) {
    throw new ApiError('not_found')
  }
  if (!response.ok) {
    throw new ApiError(`The API returned an unexpected response (status ${response.status}).`)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('The API returned an unexpected response.')
  }
}

interface RawStat {
  base_stat: number
  stat: { name: string }
}

interface RawPokemonDetail {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: { front_default: string | null }
      home?: { front_default: string | null }
    }
  }
  types: { type: { name: string } }[]
  stats: RawStat[]
  abilities: { ability: { name: string } }[]
  moves: { move: { name: string } }[]
}

function statValue(stats: RawStat[], name: string): number {
  return stats.find((s) => s.stat.name === name)?.base_stat ?? 0
}

function mapPokemon(raw: RawPokemonDetail): PokemonSummary {
  return {
    id: raw.id,
    name: raw.name,
    image:
      raw.sprites.other?.['official-artwork']?.front_default ??
      raw.sprites.other?.home?.front_default ??
      raw.sprites.front_default ??
      '',
    types: raw.types.map((t) => t.type.name) as PokemonSummary['types'],
    stats: {
      hp: statValue(raw.stats, 'hp'),
      attack: statValue(raw.stats, 'attack'),
      defense: statValue(raw.stats, 'defense'),
      specialAttack: statValue(raw.stats, 'special-attack'),
      specialDefense: statValue(raw.stats, 'special-defense'),
      speed: statValue(raw.stats, 'speed'),
    },
    height: raw.height,
    weight: raw.weight,
    abilities: raw.abilities.map((a) => a.ability.name),
    moves: raw.moves.map((m) => m.move.name),
  }
}

export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonSummary> {
  const raw = await getJson<RawPokemonDetail>(
    `${BASE_URL}/pokemon/${String(nameOrId).toLowerCase().trim()}`,
  )
  return mapPokemon(raw)
}

export interface PokemonPage {
  results: PokemonSummary[]
  total: number
}

export async function fetchPokemonPage(limit: number, offset: number): Promise<PokemonPage> {
  const list = await getJson<{ count: number; results: NamedApiResource[] }>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
  )
  const results = await Promise.all(list.results.map((p) => fetchPokemonDetail(p.name)))
  return { results, total: list.count }
}

export async function fetchTypeMembers(type: string): Promise<NamedApiResource[]> {
  const data = await getJson<{ pokemon: { pokemon: NamedApiResource }[] }>(
    `${BASE_URL}/type/${type}`,
  )
  return data.pokemon.map((p) => p.pokemon)
}

export async function fetchAllTypes(): Promise<string[]> {
  const data = await getJson<{ results: NamedApiResource[] }>(`${BASE_URL}/type`)
  const excluded = new Set(['unknown', 'shadow'])
  return data.results.map((t) => t.name).filter((t) => !excluded.has(t))
}
