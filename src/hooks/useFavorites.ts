import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'pokemon-explorer:favorites'

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return new Set(parsed)
  } catch {
    return new Set()
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
  }, [favorites])

  const toggleFavorite = useCallback((name: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  const isFavorite = useCallback((name: string) => favorites.has(name), [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
