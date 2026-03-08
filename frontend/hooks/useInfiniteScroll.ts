'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseInfiniteScrollOptions<T> {
  fetchData: (page: number) => Promise<T[]>
  threshold?: number
  initialData?: T[]
  pageSize?: number
}

interface UseInfiniteScrollReturn<T> {
  data: T[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  reset: () => void
  observerTarget: React.RefObject<HTMLDivElement>
}

/**
 * 无限滚动 Hook
 * 
 * @example
 * const { data, loading, hasMore, observerTarget } = useInfiniteScroll({
 *   fetchData: async (page) => {
 *     const res = await fetch(`/api/posts?page=${page}`)
 *     return res.json()
 *   },
 *   pageSize: 10
 * })
 */
export function useInfiniteScroll<T>({
  fetchData,
  threshold = 100,
  initialData = [],
  pageSize = 10,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const newData = await fetchData(page)
      
      if (newData.length === 0) {
        setHasMore(false)
      } else {
        setData(prev => [...prev, ...newData])
        setPage(prev => prev + 1)
        
        // 如果返回的数据少于页面大小，说明没有更多数据了
        if (newData.length < pageSize) {
          setHasMore(false)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
      console.error('Infinite scroll error:', err)
    } finally {
      setLoading(false)
    }
  }, [fetchData, page, loading, hasMore, pageSize])

  const reset = useCallback(() => {
    setData([])
    setPage(1)
    setHasMore(true)
    setError(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMore()
        }
      },
      { rootMargin: `${threshold}px` }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMore, loading, hasMore, threshold])

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
    observerTarget,
  }
}

export default useInfiniteScroll
