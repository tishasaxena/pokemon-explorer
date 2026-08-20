import { AlertTriangle, RotateCcw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-16 text-center dark:border-red-900/40 dark:bg-red-950/20">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/40">
        <AlertTriangle size={28} />
      </div>
      <div>
        <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Something went wrong.</p>
        <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          {message ?? "We couldn't load the Pokémon. Please check your connection and try again."}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 hover:bg-red-600 active:scale-95"
      >
        <RotateCcw size={16} />
        Try Again
      </button>
    </div>
  )
}
