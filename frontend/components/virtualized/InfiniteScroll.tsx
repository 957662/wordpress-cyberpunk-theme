'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface InfiniteScrollProps {
  children: React.ReactNode
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  threshold?: number
  className?: string
  loader?: React.ReactNode
  endMessage?: React.ReactNode
}

export function InfiniteScroll({
  children,
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100,
  className,
  loader,
  endMessage,
}: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  const handleScroll = useCallback(() => {
    if (!sentinelRef.current || !hasMore || isLoading) return

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    const distanceToBottom = scrollHeight - scrollTop - clientHeight

    if (distanceToBottom < threshold) {
      onLoadMore()
    }
  }, [hasMore, isLoading, onLoadMore, threshold])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Intersection Observer 作为备选方案
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { rootMargin: `${threshold}px` },
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, onLoadMore, threshold])

  return (
    <div className={cn('space-y-4', className)}>
      {children}

      {hasMore && (
        <div ref={sentinelRef} className="py-4">
          {loader || (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              <span className="text-cyber-cyan">Loading more...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && endMessage && (
        <div className="text-center text-gray-500 py-4">{endMessage}</div>
      )}
    </div>
  )
}

// 使用示例 Hook
export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
  initialPage = 1,
) {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const result = await fetchFn(page)
      setData((prev) => [...prev, ...result.data])
      setHasMore(result.hasMore)
      setPage((p) => p + 1)
    } catch (error) {
      console.error('Error loading more data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn, page, isLoading, hasMore])

  const reset = useCallback(() => {
    setData([])
    setPage(initialPage)
    setHasMore(true)
    setIsLoading(false)
  }, [initialPage])

  return { data, loadMore, hasMore, isLoading, reset }
}

// 使用示例组件
interface Post {
  id: number
  title: string
  excerpt: string
}

export function InfiniteScrollExample() {
  const { data, loadMore, hasMore, isLoading } = useInfiniteScroll<Post>(
    async (page) => {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const newData = Array.from({ length: 10 }, (_, i) => ({
        id: (page - 1) * 10 + i,
        title: `Post ${(page - 1) * 10 + i + 1}`,
        excerpt: `This is the excerpt for post ${(page - 1) * 10 + i + 1}`,
      }))
      return {
        data: newData,
        hasMore: page < 5, // 5 页后结束
      }
    },
  )

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-cyber-cyan">
        Infinite Scroll Demo
      </h2>
      <InfiniteScroll
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={loadMore}
        endMessage={<div className="text-cyber-purple">No more posts!</div>}
      >
        {data.map((post) => (
          <div
            key={post.id}
            className="p-6 border border-cyber-border rounded-lg bg-cyber-card mb-4 hover:border-cyber-cyan transition-colors"
          >
            <h3 className="text-xl font-semibold text-cyber-cyan mb-2">
              {post.title}
            </h3>
            <p className="text-gray-400">{post.excerpt}</p>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}
