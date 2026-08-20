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
      'official-artwork'?: { front_default: string | null; front_shiny?: string | null }
      home?: { front_default: string | null }
    }
  }
  types: { type: { name: string } }[]
  stats: RawStat[]
  abilities: { ability: { name: string } }[]
  moves: { move: { name: string } }[]
  cries?: { latest: string | null; legacy: string | null }
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
    shinyImage: raw.sprites.other?.['official-artwork']?.front_shiny ?? null,
    cryUrl: raw.cries?.latest ?? null,
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

export async function fetchAllPokemonNames(): Promise<NamedApiResource[]> {
  const data = await getJson<{ results: NamedApiResource[] }>(`${BASE_URL}/pokemon?limit=100000&offset=0`)
  return data.results
}

export async function fetchTypeMembers(type: string): Promise<NamedApiResource[]> {
  const data = await getJson<{ pokemon: { pokemon: NamedApiResource }[] }>(
    `${BASE_URL}/type/${type}`,
  )
  return data.pokemon.map((p) => p.pokemon)
}

export async function fetchPokemonCount(): Promise<number> {
  const data = await getJson<{ count: number }>(`${BASE_URL}/pokemon?limit=1`)
  return data.count
}

export async function fetchAllTypes(): Promise<string[]> {
  const data = await getJson<{ results: NamedApiResource[] }>(`${BASE_URL}/type`)
  const excluded = new Set(['unknown', 'shadow'])
  return data.results.map((t) => t.name).filter((t) => !excluded.has(t))
}

interface RawSpecies {
  flavor_text_entries: {
    flavor_text: string
    language: { name: string }
  }[]
}

export async function fetchFlavorText(nameOrId: string | number): Promise<string | null> {
  const data = await getJson<RawSpecies>(
    `${BASE_URL}/pokemon-species/${String(nameOrId).toLowerCase().trim()}`,
  )
  const entry = data.flavor_text_entries.find((e) => e.language.name === 'en')
  if (!entry) return null
  return entry.flavor_text.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim()
}

interface RawDamageRelations {
  double_damage_from: NamedApiResource[]
  half_damage_from: NamedApiResource[]
  no_damage_from: NamedApiResource[]
}

export async function fetchDamageRelations(type: string): Promise<RawDamageRelations> {
  const data = await getJson<{ damage_relations: RawDamageRelations }>(`${BASE_URL}/type/${type}`)
  return data.damage_relations
}
