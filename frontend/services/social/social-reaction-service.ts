/**
 * 社交反应服务
 * 处理文章的点赞、反应、评论等社交功能
 */

export interface Reaction {
  id: string
  articleId: string | number
  userId?: string
  type: ReactionType
  createdAt: number
}

export type ReactionType = 'like' | 'love' | 'laugh' | 'fire' | 'rocket'

export interface ReactionStats {
  articleId: string | number
  total: number
  byType: {
    [key in ReactionType]: number
  }
  userReaction?: ReactionType
}

export interface Comment {
  id: string
  articleId: string | number
  userId?: string
  userName: string
  userAvatar?: string
  content: string
  parentId?: string
  createdAt: number
  updatedAt: number
  likes: number
  replies?: Comment[]
}

class SocialReactionService {
  private apiBaseUrl: string
  private cache: Map<string, any> = new Map()

  constructor() {
    this.apiBaseUrl = '/api/social'
  }

  /**
   * 获取文章反应统计
   */
  async getReactionStats(articleId: string | number): Promise<ReactionStats> {
    const cacheKey = `reactions-${articleId}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/reactions/${articleId}`)
      if (!response.ok) throw new Error('Failed to fetch reaction stats')
      
      const stats = await response.json()
      this.cache.set(cacheKey, stats)
      return stats
    } catch (error) {
      console.error('Error fetching reaction stats:', error)
      return this.getMockReactionStats(articleId)
    }
  }

  /**
   * 添加/移除反应
   */
  async toggleReaction(
    articleId: string | number,
    type: ReactionType,
    userId?: string
  ): Promise<ReactionStats> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, type, userId }),
      })

      if (!response.ok) throw new Error('Failed to toggle reaction')

      const stats = await response.json()
      
      // 更新缓存
      this.cache.set(`reactions-${articleId}`, stats)
      
      return stats
    } catch (error) {
      console.error('Error toggling reaction:', error)
      throw error
    }
  }

  /**
   * 模拟反应统计
   */
  private getMockReactionStats(articleId: string | number): ReactionStats {
    return {
      articleId,
      total: Math.floor(Math.random() * 100) + 10,
      byType: {
        like: Math.floor(Math.random() * 50) + 5,
        love: Math.floor(Math.random() * 30) + 2,
        laugh: Math.floor(Math.random() * 20) + 1,
        fire: Math.floor(Math.random() * 15) + 1,
        rocket: Math.floor(Math.random() * 10) + 1,
      },
    }
  }

  /**
   * 清除缓存
   */
  clearCache(articleId?: string | number): void {
    if (articleId) {
      this.cache.delete(`reactions-${articleId}`)
    } else {
      this.cache.clear()
    }
  }
}

// 导出单例实例
export const socialReactionService = new SocialReactionService()

export default SocialReactionService
