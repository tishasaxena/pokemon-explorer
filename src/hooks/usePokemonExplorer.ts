import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ApiError,
  fetchAllPokemonNames,
  fetchPokemonDetail,
  fetchPokemonPage,
  fetchTypeMembers,
} from '../services/pokemonApi'
import type { NamedApiResource, PokemonSummary, SortKey } from '../types/pokemon'
import { useDebounce } from './useDebounce'

function idFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() ?? ''
}

const PAGE_SIZE = 20

type Mode = 'search' | 'type' | 'list'

export function usePokemonExplorer() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput.trim().toLowerCase(), 400)
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('id')

  const [items, setItems] = useState<PokemonSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  const offsetRef = useRef(0)
  const typeMembersRef = useRef<Record<string, NamedApiResource[]>>({})
  const allPokemonRef = useRef<NamedApiResource[] | null>(null)
  const searchMatchesRef = useRef<NamedApiResource[]>([])
  const requestIdRef = useRef(0)

  const mode: Mode = debouncedSearch ? 'search' : typeFilter !== 'all' ? 'type' : 'list'

  const loadFirstPage = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)
    setNotFound(false)
    offsetRef.current = 0

    try {
      if (mode === 'search') {
        if (!allPokemonRef.current) {
          allPokemonRef.current = await fetchAllPokemonNames()
        }
        if (requestId !== requestIdRef.current) return
        const allPokemon = allPokemonRef.current
        const matches = allPokemon.filter(
          (p) => p.name.startsWith(debouncedSearch) || idFromUrl(p.url).startsWith(debouncedSearch),
        )
        searchMatchesRef.current = matches
        if (matches.length === 0) {
          setItems([])
          setNotFound(true)
          setHasMore(false)
          setTotal(0)
        } else {
          const slice = matches.slice(0, PAGE_SIZE)
          const details = await Promise.all(slice.map((m) => fetchPokemonDetail(m.name)))
          if (requestId !== requestIdRef.current) return
          setItems(details)
          offsetRef.current = slice.length
          setHasMore(slice.length < matches.length)
          setTotal(matches.length)
        }
      } else if (mode === 'type') {
        let members = typeMembersRef.current[typeFilter]
        if (!members) {
          members = await fetchTypeMembers(typeFilter)
          typeMembersRef.current[typeFilter] = members
        }
        if (requestId !== requestIdRef.current) return
        const slice = members.slice(0, PAGE_SIZE)
        const details = await Promise.all(slice.map((m) => fetchPokemonDetail(m.name)))
        if (requestId !== requestIdRef.current) return
        setItems(details)
        offsetRef.current = slice.length
        setHasMore(slice.length < members.length)
        setTotal(members.length)
      } else {
        const page = await fetchPokemonPage(PAGE_SIZE, 0)
        if (requestId !== requestIdRef.current) return
        setItems(page.results)
        offsetRef.current = page.results.length
        setHasMore(page.results.length < page.total)
        setTotal(page.total)
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      if (err instanceof ApiError && err.message === 'not_found') {
        setItems([])
        setNotFound(true)
        setHasMore(false)
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
        setItems([])
        setHasMore(false)
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false)
    }
  }, [mode, debouncedSearch, typeFilter])

  useEffect(() => {
    loadFirstPage()
  }, [loadFirstPage])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    setError(null)
    try {
      if (mode === 'search') {
        const matches = searchMatchesRef.current
        const slice = matches.slice(offsetRef.current, offsetRef.current + PAGE_SIZE)
        const details = await Promise.all(slice.map((m) => fetchPokemonDetail(m.name)))
        setItems((prev) => [...prev, ...details])
        offsetRef.current += slice.length
        setHasMore(offsetRef.current < matches.length)
      } else if (mode === 'type') {
        const members = typeMembersRef.current[typeFilter] ?? []
        const slice = members.slice(offsetRef.current, offsetRef.current + PAGE_SIZE)
        const details = await Promise.all(slice.map((m) => fetchPokemonDetail(m.name)))
        setItems((prev) => [...prev, ...details])
        offsetRef.current += slice.length
        setHasMore(offsetRef.current < members.length)
      } else {
        const page = await fetchPokemonPage(PAGE_SIZE, offsetRef.current)
        setItems((prev) => [...prev, ...page.results])
        offsetRef.current += page.results.length
        setHasMore(offsetRef.current < page.total)
      }
    } catch {
      setError('Failed to load more Pokémon.')
    } finally {
      setLoadingMore(false)
    }
  }, [mode, typeFilter, hasMore, loadingMore])

  const sortedItems = useMemo(() => {
    const sorted = [...items]
    switch (sortKey) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'attack':
        sorted.sort((a, b) => b.stats.attack - a.stats.attack)
        break
      case 'speed':
        sorted.sort((a, b) => b.stats.speed - a.stats.speed)
        break
      case 'hp':
        sorted.sort((a, b) => b.stats.hp - a.stats.hp)
        break
      default:
        sorted.sort((a, b) => a.id - b.id)
    }
    return sorted
  }, [items, sortKey])

  return {
    searchInput,
    setSearchInput,
    typeFilter,
    setTypeFilter,
    sortKey,
    setSortKey,
    items: sortedItems,
    loading,
    loadingMore,
    error,
    notFound,
    hasMore,
    total,
    loadMore,
    retry: loadFirstPage,
    mode,
  }
}
