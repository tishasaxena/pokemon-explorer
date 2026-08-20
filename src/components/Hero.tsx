interface HeroProps {
  totalCount: number | null
}

export function Hero({ totalCount }: HeroProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-10 text-center shadow-lg sm:py-14">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border-[16px] border-white/10 sm:h-56 sm:w-56"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 animate-[spin_18s_linear_infinite] rounded-full border-[14px] border-white/10 sm:h-48 sm:w-48"
        aria-hidden="true"
      />

      <span className="mb-3 inline-block animate-[spin_6s_linear_infinite] text-4xl drop-shadow-sm sm:text-5xl" aria-hidden="true">
        🔴
      </span>
      <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-4xl">
        Discover Every Pokémon
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/80 sm:text-base">
        Search, filter, and compare across the entire Pokédex — powered by live data from the PokéAPI.
      </p>
      <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:text-sm">
        {totalCount ? `${totalCount.toLocaleString()} Pokémon and counting` : 'Loading the Pokédex…'}
      </p>
    </div>
  )
}
