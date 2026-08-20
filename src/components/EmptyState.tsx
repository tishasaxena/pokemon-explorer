import { Search } from 'lucide-react'

interface EmptyStateProps {
  title: string
  subtitle?: string
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div className="animate-fade-in-up flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-200 px-6 py-20 text-center dark:border-zinc-700">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
        <Search size={26} />
      </div>
      <p className="text-lg font-bold text-zinc-700 dark:text-zinc-200">{title}</p>
      {subtitle && <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
    </div>
  )
}
