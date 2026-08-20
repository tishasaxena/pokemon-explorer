interface StatBarProps {
  label: string
  value: number
  max?: number
  color: string
}

export function StatBar({ label, value, max = 180, color }: StatBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-28 shrink-0 font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
        <div
          className="animate-stat-grow h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-9 shrink-0 text-right font-mono font-semibold text-zinc-700 dark:text-zinc-200">
        {value}
      </span>
    </div>
  )
}
