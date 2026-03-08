'use client'

import { useState, useEffect, useCallback } from 'react'
import { socialReactionService } from '@/services/social/social-reaction-service'
import type { ReactionStats, ReactionType } from '@/services/social/social-reaction-service'

export interface UseReactionBarOptions {
  articleId: string | number
  userId?: string
  enabled?: boolean
}

export function useReactionBar({
  articleId,
  userId,
  enabled = true,
}: UseReactionBarOptions) {
  const [stats, setStats] = useState<ReactionStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取反应统计
  const fetchStats = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await socialReactionService.getReactionStats(articleId)
      setStats(data)
    } catch (err) {
      console.error('Error fetching reaction stats:', err)
      setError('获取反应统计失败')
    } finally {
      setIsLoading(false)
    }
  }, [articleId, enabled])

  // 切换反应
  const toggleReaction = useCallback(async (type: ReactionType) => {
    if (!enabled) return

    try {
      const newStats = await socialReactionService.toggleReaction(
        articleId,
        type,
        userId
      )
      setStats(newStats)
    } catch (err) {
      console.error('Error toggling reaction:', err)
      setError('操作失败，请稍后重试')
    }
  }, [articleId, userId, enabled])

  // 获取用户当前反应
  const getUserReaction = useCallback((): ReactionType | undefined => {
    return stats?.userReaction
  }, [stats])

  // 获取特定反应数量
  const getReactionCount = useCallback((type: ReactionType): number => {
    return stats?.byType[type] || 0
  }, [stats])

  // 获取总反应数
  const getTotalReactions = useCallback((): number => {
    return stats?.total || 0
  }, [stats])

  // 初始化
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    isLoading,
    error,
    toggleReaction,
    getUserReaction,
    getReactionCount,
    getTotalReactions,
    refreshStats: fetchStats,
  }
}
