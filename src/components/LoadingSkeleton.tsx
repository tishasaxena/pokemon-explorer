export function SkeletonCard() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-black/5 bg-white p-4 shadow-sm ring-1 ring-black/5 dark:border-white/5 dark:bg-zinc-800 dark:ring-white/5">
      <div className="flex w-full items-start justify-between">
        <div className="shimmer h-3 w-8 rounded" />
        <div className="shimmer h-4 w-4 rounded-full" />
      </div>
      <div className="shimmer my-3 h-28 w-28 rounded-full" />
      <div className="shimmer h-4 w-24 rounded" />
      <div className="mt-3 flex gap-1.5">
        <div className="shimmer h-5 w-16 rounded-full" />
        <div className="shimmer h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
