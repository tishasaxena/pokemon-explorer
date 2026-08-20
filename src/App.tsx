import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GitCompare, Loader2 } from 'lucide-react'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { TypeFilter } from './components/TypeFilter'
import { SortControl } from './components/SortControl'
import { PokemonGrid } from './components/PokemonGrid'
import { SkeletonGrid } from './components/LoadingSkeleton'
import { ErrorState } from './components/ErrorState'
import { EmptyState } from './components/EmptyState'
import { PokemonModal } from './components/PokemonModal'
import { CompareModal } from './components/CompareModal'
import { useTheme } from './hooks/useTheme'
import { useFavorites } from './hooks/useFavorites'
import { usePokemonExplorer } from './hooks/usePokemonExplorer'
import { fetchAllTypes, fetchPokemonDetail } from './services/pokemonApi'
import type { PokemonSummary } from './types/pokemon'
import { formatName } from './utils/format'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { favorites, toggleFavorite, isFavorite } = useFavorites()
  const navigate = useNavigate()
  const params = useParams<{ name?: string }>()

  const explorer = usePokemonExplorer()
  const [allTypes, setAllTypes] = useState<string[]>([])

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favoritePokemon, setFavoritePokemon] = useState<PokemonSummary[]>([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  const [favoritesError, setFavoritesError] = useState<string | null>(null)

  const [compareMode, setCompareMode] = useState(false)
  const [compareSelection, setCompareSelection] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  const [selectedPokemon, setSelectedPokemon] = useState<PokemonSummary | null>(null)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllTypes()
      .then(setAllTypes)
      .catch(() => setAllTypes([]))
  }, [])

  const loadFavoritesList = useCallback(async () => {
    if (favorites.size === 0) {
      setFavoritePokemon([])
      return
    }
    setFavoritesLoading(true)
    setFavoritesError(null)
    try {
      const results = await Promise.all([...favorites].map((name) => fetchPokemonDetail(name)))
      setFavoritePokemon(results.sort((a, b) => a.id - b.id))
    } catch {
      setFavoritesError('Failed to load your favorites.')
    } finally {
      setFavoritesLoading(false)
    }
  }, [favorites])

  useEffect(() => {
    if (showFavoritesOnly) loadFavoritesList()
  }, [showFavoritesOnly, loadFavoritesList])

  useEffect(() => {
    const name = params.name
    if (!name) {
      setSelectedPokemon(null)
      return
    }
    let cancelled = false
    setModalLoading(true)
    setModalError(null)
    fetchPokemonDetail(name)
      .then((p) => {
        if (!cancelled) setSelectedPokemon(p)
      })
      .catch((err) => {
        if (!cancelled) setModalError(err instanceof Error ? err.message : 'Failed to load this Pokémon.')
      })
      .finally(() => {
        if (!cancelled) setModalLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [params.name])

  const openPokemon = (name: string) => navigate(`/pokemon/${name}`)
  const closeModal = () => navigate('/')

  const handleCardSelect = (name: string) => {
    if (compareMode) {
      setCompareSelection((prev) => {
        if (prev.includes(name)) return prev.filter((n) => n !== name)
        if (prev.length >= 2) return [prev[1], name]
        return [...prev, name]
      })
      return
    }
    openPokemon(name)
  }

  const displayedItems = showFavoritesOnly ? favoritePokemon : explorer.items
  const displayedLoading = showFavoritesOnly ? favoritesLoading : explorer.loading
  const displayedError = showFavoritesOnly ? favoritesError : explorer.error

  const compareA = compareSelection[0]
    ? [...explorer.items, ...favoritePokemon].find((p) => p.name === compareSelection[0])
    : undefined
  const compareB = compareSelection[1]
    ? [...explorer.items, ...favoritePokemon].find((p) => p.name === compareSelection[1])
    : undefined

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly((v) => !v)}
        favoriteCount={favorites.size}
      />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6">
        {!showFavoritesOnly && (
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="sm:max-w-sm sm:flex-1">
                <SearchBar value={explorer.searchInput} onChange={explorer.setSearchInput} />
              </div>
              <div className="flex items-center gap-3">
                <SortControl value={explorer.sortKey} onChange={explorer.setSortKey} />
                <button
                  type="button"
                  onClick={() => {
                    setCompareMode((v) => !v)
                    setCompareSelection([])
                  }}
                  aria-pressed={compareMode}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                    compareMode
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  <GitCompare size={16} />
                  Compare
                </button>
              </div>
            </div>
            <TypeFilter types={allTypes} selected={explorer.typeFilter} onSelect={explorer.setTypeFilter} />
          </div>
        )}

        {displayedLoading && <SkeletonGrid />}

        {!displayedLoading && displayedError && (
          <ErrorState message={displayedError} onRetry={showFavoritesOnly ? loadFavoritesList : explorer.retry} />
        )}

        {!displayedLoading && !displayedError && explorer.notFound && !showFavoritesOnly && (
          <EmptyState
            title="Pokémon not found."
            subtitle="Try searching for another Pokémon."
          />
        )}

        {!displayedLoading && !displayedError && !explorer.notFound && displayedItems.length === 0 && (
          <EmptyState
            title={showFavoritesOnly ? 'No favorites yet.' : 'No Pokémon found.'}
            subtitle={
              showFavoritesOnly
                ? 'Tap the heart on any Pokémon card to add it here.'
                : 'Try searching for a different Pokémon or choosing another type.'
            }
          />
        )}

        {!displayedLoading && !displayedError && displayedItems.length > 0 && (
          <PokemonGrid
            items={displayedItems}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelect={handleCardSelect}
            compareMode={compareMode}
            compareSelection={compareSelection}
          />
        )}

        {!showFavoritesOnly && explorer.hasMore && !displayedLoading && !displayedError && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={explorer.loadMore}
              disabled={explorer.loadingMore}
              className="flex items-center gap-2 rounded-full bg-zinc-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 hover:bg-zinc-700 disabled:opacity-60 disabled:hover:scale-100 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {explorer.loadingMore && <Loader2 size={16} className="animate-spin" />}
              {explorer.loadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </main>

      {compareMode && compareSelection.length === 2 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-fade-in-up">
          <button
            type="button"
            onClick={() => setShowCompare(true)}
            className="flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
          >
            <GitCompare size={16} />
            Compare {formatName(compareSelection[0])} vs {formatName(compareSelection[1])}
          </button>
        </div>
      )}

      {showCompare && compareA && compareB && (
        <CompareModal pokemonA={compareA} pokemonB={compareB} onClose={() => setShowCompare(false)} />
      )}

      {params.name && modalLoading && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <Loader2 size={32} className="animate-spin text-white" />
        </div>
      )}

      {params.name && !modalLoading && modalError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm">
            <ErrorState message={modalError} onRetry={closeModal} />
          </div>
        </div>
      )}

      {selectedPokemon && !modalLoading && (
        <PokemonModal
          pokemon={selectedPokemon}
          isFavorite={isFavorite(selectedPokemon.name)}
          onToggleFavorite={toggleFavorite}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default App
