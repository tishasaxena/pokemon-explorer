export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy' | 'stellar' | 'unknown' | 'shadow'

export interface StatBlock {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

export interface PokemonSummary {
  id: number
  name: string
  image: string
  shinyImage: string | null
  cryUrl: string | null
  types: PokemonType[]
  stats: StatBlock
  height: number
  weight: number
  abilities: string[]
  moves: string[]
}

export interface NamedApiResource {
  name: string
  url: string
}

export type SortKey = 'id' | 'name' | 'attack' | 'speed' | 'hp'

export type Effectiveness = 4 | 2 | 1 | 0.5 | 0.25 | 0

export interface TypeMatchup {
  type: string
  multiplier: Effectiveness
}
