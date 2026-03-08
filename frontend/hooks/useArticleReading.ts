'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { analyticsEnhancedService } from '@/services/analytics/analytics-enhanced'

export interface UseArticleReadingOptions {
  articleId: string | number
  userId?: string
  enabled?: boolean
  trackScroll?: boolean
  trackTime?: boolean
}

export interface ReadingProgress {
  scrollDepth: number
  timeSpent: number
  isActive: boolean
}

export function useArticleReading({
  articleId,
  userId,
  enabled = true,
  trackScroll = true,
  trackTime = true,
}: UseArticleReadingOptions) {
  const [progress, setProgress] = useState<ReadingProgress>({
    scrollDepth: 0,
    timeSpent: 0,
    isActive: false,
  })
  
  const [isTracking, setIsTracking] = useState(false)
  const startTime = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  // 开始追踪
  const startTracking = useCallback(() => {
    if (!enabled || isTracking) return
    
    analyticsEnhancedService.startReading(articleId, userId)
    startTime.current = Date.now()
    setIsTracking(true)
    setProgress(prev => ({ ...prev, isActive: true }))

    // 定期更新时间
    if (trackTime) {
      intervalRef.current = setInterval(() => {
        const timeSpent = Date.now() - startTime.current
        setProgress(prev => ({ ...prev, timeSpent }))
      }, 1000)
    }
  }, [articleId, userId, enabled, isTracking, trackTime])

  // 停止追踪
  const stopTracking = useCallback((completed = false) => {
    if (!isTracking) return
    
    analyticsEnhancedService.stopReading(completed)
    setIsTracking(false)
    setProgress(prev => ({ ...prev, isActive: false }))

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [isTracking])

  // 追踪滚动
  useEffect(() => {
    if (!enabled || !trackScroll || !isTracking) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollDepth = scrollHeight > 0 
        ? (window.scrollY / scrollHeight) * 100 
        : 0
      
      analyticsEnhancedService.updateScrollDepth(Math.round(scrollDepth))
      setProgress(prev => ({ ...prev, scrollDepth: Math.round(scrollDepth) }))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [enabled, trackScroll, isTracking])

  // 页面可见性变化
  useEffect(() => {
    if (!enabled) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTracking(false)
      } else {
        startTracking()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [enabled, startTracking, stopTracking])

  // 组件卸载时停止追踪
  useEffect(() => {
    return () => {
      stopTracking(false)
    }
  }, [stopTracking])

  return {
    progress,
    isTracking,
    startTracking,
    stopTracking,
    getProgress: useCallback(() => analyticsEnhancedService.getReadingProgress(), []),
  }
}
