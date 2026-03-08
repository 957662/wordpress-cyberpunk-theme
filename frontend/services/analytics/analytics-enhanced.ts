/**
 * 增强型分析服务
 * 提供文章阅读分析、用户行为追踪等功能
 */

export interface ReadingMetrics {
  articleId: string | number
  userId?: string
  sessionId: string
  startTime: number
  endTime?: number
  scrollDepth: number
  timeSpent: number
  completed: boolean
  sections: {
    section: string
    timeSpent: number
    completed: boolean
  }[]
}

export interface ArticleAnalytics {
  articleId: string | number
  totalViews: number
  uniqueReaders: number
  avgReadingTime: number
  avgScrollDepth: number
  completionRate: number
  dailyViews: {
    date: string
    views: number
    engagement: number
  }[]
  topReferrers: {
    source: string
    count: number
  }[]
  popularSections: {
    section: string
    views: number
  }[]
}

class AnalyticsEnhancedService {
  private sessionId: string
  private currentSession: ReadingMetrics | null = null
  private metricsQueue: ReadingMetrics[] = []
  private isTracking = false

  constructor() {
    this.sessionId = this.generateSessionId()
    if (typeof window !== 'undefined') {
      this.initVisibilityTracking()
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 开始追踪文章阅读
   */
  startReading(articleId: string | number, userId?: string): void {
    this.currentSession = {
      articleId,
      userId,
      sessionId: this.sessionId,
      startTime: Date.now(),
      scrollDepth: 0,
      timeSpent: 0,
      completed: false,
      sections: [],
    }
    this.isTracking = true
  }

  /**
   * 更新滚动深度
   */
  updateScrollDepth(depth: number): void {
    if (!this.currentSession || !this.isTracking) return
    this.currentSession.scrollDepth = Math.max(this.currentSession.scrollDepth, depth)
  }

  /**
   * 记录章节阅读
   */
  trackSection(section: string, timeSpent: number, completed: boolean): void {
    if (!this.currentSession || !this.isTracking) return
    
    const existingSection = this.currentSession.sections.find(s => s.section === section)
    if (existingSection) {
      existingSection.timeSpent += timeSpent
      existingSection.completed = existingSection.completed || completed
    } else {
      this.currentSession.sections.push({ section, timeSpent, completed })
    }
  }

  /**
   * 停止追踪并保存指标
   */
  stopReading(completed = false): void {
    if (!this.currentSession || !this.isTracking) return

    this.currentSession.endTime = Date.now()
    this.currentSession.timeSpent = this.currentSession.endTime - this.currentSession.startTime
    this.currentSession.completed = completed

    this.metricsQueue.push(this.currentSession)
    this.isTracking = false
    this.currentSession = null

    // 发送到后端
    this.flushMetrics()
  }

  /**
   * 获取文章分析数据
   */
  async getArticleAnalytics(articleId: string | number): Promise<ArticleAnalytics> {
    try {
      const response = await fetch(`/api/analytics/articles/${articleId}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching article analytics:', error)
      return this.getMockAnalytics(articleId)
    }
  }

  /**
   * 追踪页面浏览
   */
  trackPageView(articleId: string | number, userId?: string): void {
    if (typeof window === 'undefined') return

    const event = {
      type: 'pageview',
      articleId,
      userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    }

    this.sendEvent(event)
  }

  /**
   * 追踪用户互动
   */
  trackInteraction(
    articleId: string | number,
    interactionType: 'like' | 'share' | 'comment' | 'bookmark',
    userId?: string
  ): void {
    const event = {
      type: 'interaction',
      articleId,
      userId,
      sessionId: this.sessionId,
      interactionType,
      timestamp: Date.now(),
    }

    this.sendEvent(event)
  }

  /**
   * 初始化可见性追踪（处理标签页切换）
   */
  private initVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isTracking) {
        // 页面隐藏时暂停计时
        this.isTracking = false
      } else if (!document.hidden && this.currentSession) {
        // 页面显示时恢复计时
        this.isTracking = true
      }
    })
  }

  /**
   * 发送事件到后端
   */
  private async sendEvent(event: any): Promise<void> {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error('Error sending analytics event:', error)
    }
  }

  /**
   * 刷新指标队列
   */
  private async flushMetrics(): Promise<void> {
    if (this.metricsQueue.length === 0) return

    const metrics = [...this.metricsQueue]
    this.metricsQueue = []

    try {
      await fetch('/api/analytics/reading-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      })
    } catch (error) {
      console.error('Error flushing metrics:', error)
      // 失败时重新加入队列
      this.metricsQueue.unshift(...metrics)
    }
  }

  /**
   * 生成模拟分析数据（用于演示）
   */
  private getMockAnalytics(articleId: string | number): ArticleAnalytics {
    const days = 30
    const dailyViews = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      dailyViews.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 500) + 50,
        engagement: Math.floor(Math.random() * 100),
      })
    }

    return {
      articleId,
      totalViews: dailyViews.reduce((sum, day) => sum + day.views, 0),
      uniqueReaders: Math.floor(Math.random() * 1000) + 100,
      avgReadingTime: Math.floor(Math.random() * 300) + 60,
      avgScrollDepth: Math.floor(Math.random() * 100),
      completionRate: Math.floor(Math.random() * 100),
      dailyViews,
      topReferrers: [
        { source: 'Google', count: Math.floor(Math.random() * 500) + 100 },
        { source: 'Twitter', count: Math.floor(Math.random() * 300) + 50 },
        { source: 'Direct', count: Math.floor(Math.random() * 200) + 30 },
      ],
      popularSections: [
        { section: '引言', views: Math.floor(Math.random() * 500) + 100 },
        { section: '正文', views: Math.floor(Math.random() * 400) + 80 },
        { section: '结论', views: Math.floor(Math.random() * 300) + 50 },
      ],
    }
  }

  /**
   * 计算阅读时间
   */
  calculateReadingTime(content: string, wordsPerMinute = 200): number {
    const text = content.replace(/<[^>]*>/g, '')
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0
    const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0
    const totalWords = chineseChars + englishWords
    
    return Math.ceil(totalWords / wordsPerMinute)
  }

  /**
   * 获取阅读进度
   */
  getReadingProgress(): number {
    if (!this.currentSession) return 0
    return this.currentSession.scrollDepth
  }

  /**
   * 获取当前会话信息
   */
  getCurrentSession(): ReadingMetrics | null {
    return this.currentSession
  }
}

// 导出单例实例
export const analyticsEnhancedService = new AnalyticsEnhancedService()

export default AnalyticsEnhancedService
