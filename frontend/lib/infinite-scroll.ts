/**
 * Infinite Scroll Utilities
 * Handles infinite scrolling functionality for lists and grids
 */

import { useEffect, useState, useCallback, useRef } from 'react'

export interface InfiniteScrollOptions {
  threshold?: number
  initialPage?: number
  enabled?: boolean
}

export interface InfiniteScrollResult<T> {
  data: T[]
  isLoading: boolean
  isError: boolean
  hasMore: boolean
  page: number
  loadMore: () => void
  reset: () => void
}

export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
  options: InfiniteScrollOptions = {}
): InfiniteScrollResult<T> {
  const { threshold = 100, initialPage = 1, enabled = true } = options

  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isResetting, setIsResetting] = useState(false)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !enabled || isResetting) return

    setIsLoading(true)
    setIsError(false)

    try {
      const result = await fetchFn(page)

      if (isResetting) {
        setData(result.data)
      } else {
        setData(prev => [...prev, ...result.data])
      }

      setHasMore(result.hasMore)
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Error loading more data:', error)
      setIsError(true)
    } finally {
      setIsLoading(false)
      setIsResetting(false)
    }
  }, [fetchFn, page, isLoading, hasMore, enabled, isResetting])

  const reset = useCallback(() => {
    setIsResetting(true)
    setData([])
    setPage(1)
    setHasMore(true)
    setIsError(false)
  }, [])

  useEffect(() => {
    loadMore()
  }, [])

  return {
    data,
    isLoading,
    isError,
    hasMore,
    page,
    loadMore,
    reset,
  }
}

export function useInfiniteScrollTrigger(
  callback: () => void,
  options: InfiniteScrollOptions = {}
) {
  const { threshold = 100, enabled = true } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        rootMargin: `${threshold}px`,
      }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [threshold, enabled])

  useEffect(() => {
    if (isIntersecting && enabled) {
      callback()
    }
  }, [isIntersecting, callback, enabled])

  return containerRef
}

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY ? 'down' : 'up'

      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction)
      }

      lastScrollY = scrollY > 0 ? scrollY : 0
      setScrollY(scrollY)
    }

    window.addEventListener('scroll', updateScrollDirection)
    return () => {
      window.removeEventListener('scroll', updateScrollDirection)
    }
  }, [scrollDirection])

  return { scrollDirection, scrollY }
}

export function useScrollTo(offset: number = 0) {
  const scrollTo = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: offset,
      behavior,
    })
  }, [offset])

  const scrollToTop = useCallback(() => {
    scrollTo('smooth')
  }, [scrollTo])

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  return {
    scrollTo,
    scrollToTop,
    scrollToBottom,
  }
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return progress
}
