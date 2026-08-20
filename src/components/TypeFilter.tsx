import { getTypeColor, getTypeIcon } from '../constants/typeColors'
import { capitalize } from '../utils/format'

interface TypeFilterProps {
  types: string[]
  selected: string
  onSelect: (type: string) => void
}

export function TypeFilter({ types, selected, onSelect }: TypeFilterProps) {
  return (
    <div className="flex w-full flex-wrap gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by type">
      <button
        type="button"
        onClick={() => onSelect('all')}
        className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
          selected === 'all'
            ? 'bg-zinc-800 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
        }`}
      >
        All
      </button>
      {types.map((type) => {
        const active = selected === type
        const color = getTypeColor(type)
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            style={active ? { backgroundColor: color } : undefined}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize transition-all ${
              active
                ? 'text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            <span className="mr-1" aria-hidden="true">
              {getTypeIcon(type)}
            </span>
            {capitalize(type)}
          </button>
        )
      })}
    </div>
  )
}
