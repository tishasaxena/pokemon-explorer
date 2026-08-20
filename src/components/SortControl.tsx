import type { SortKey } from '../types/pokemon'

interface SortControlProps {
  value: SortKey
  onChange: (value: SortKey) => void
}

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'id', label: 'ID' },
  { value: 'name', label: 'Name' },
  { value: 'attack', label: 'Attack' },
  { value: 'speed', label: 'Speed' },
  { value: 'hp', label: 'HP' },
]

export function SortControl({ value, onChange }: SortControlProps) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
      Sort by
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 outline-none transition-colors focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
