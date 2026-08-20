import { PokeballIcon } from './PokeballIcon'

interface HeroProps {
  totalCount: number | null
}

export function Hero({ totalCount }: HeroProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-12 text-center shadow-xl shadow-violet-500/20 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1.5px)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full border-[18px] border-white/10 sm:h-64 sm:w-64"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-12 h-40 w-40 animate-[spin_22s_linear_infinite] rounded-full border-[16px] border-white/10 sm:h-56 sm:w-56"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/4 top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center">
        <div className="mb-4 flex h-16 w-16 animate-[spin_7s_linear_infinite] items-center justify-center rounded-full bg-white/15 shadow-lg backdrop-blur-sm sm:h-20 sm:w-20">
          <PokeballIcon size={40} />
        </div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl">
          Discover Every Pokémon
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/85 sm:text-base">
          Search, filter, and compare across the entire Pokédex — powered by live data from the PokéAPI.
        </p>
        <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-inner backdrop-blur-sm sm:text-sm">
          {totalCount ? `${totalCount.toLocaleString()} Pokémon and counting` : 'Loading the Pokédex…'}
        </p>
      </div>
    </div>
  )
}
