import { Heart, Moon, Sun } from 'lucide-react'
import { PokeballIcon } from './PokeballIcon'

interface HeaderProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  showFavoritesOnly: boolean
  onToggleFavoritesOnly: () => void
  favoriteCount: number
}

export function Header({
  theme,
  onToggleTheme,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoriteCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/75 backdrop-blur-lg dark:border-white/5 dark:bg-zinc-900/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <PokeballIcon size={30} className="drop-shadow-sm transition-transform hover:rotate-12" />
          <h1 className="font-heading bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-xl">
            Pokémon Explorer
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFavoritesOnly}
            aria-pressed={showFavoritesOnly}
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all ${
              showFavoritesOnly
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10'
            }`}
          >
            <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">Favorites</span>
            {favoriteCount > 0 && (
              <span className="rounded-full bg-black/10 px-1.5 py-0.5 text-xs">{favoriteCount}</span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  )
}
