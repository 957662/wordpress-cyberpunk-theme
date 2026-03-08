/**
 * 分析数据服务
 */

export interface PageViewData {
  path: string
  views: number
  uniqueVisitors: number
  avgTimeOnPage: number
}

export interface TrafficSourceData {
  source: string
  visits: number
  percentage: number
}

export interface RealtimeStats {
  onlineUsers: number
  currentViews: number
  actionsPerMinute: number
  serverLoad: number
}

class AnalyticsService {
  private baseUrl = '/api/analytics'

  /**
   * 获取页面浏览数据
   */
  async getPageViews(timeRange: string = '30d'): Promise<PageViewData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/page-views?range=${timeRange}`)
      if (!response.ok) throw new Error('Failed to fetch page views')
      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching page views:', error)
      return []
    }
  }

  /**
   * 获取流量来源数据
   */
  async getTrafficSources(timeRange: string = '30d'): Promise<TrafficSourceData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/traffic-sources?range=${timeRange}`)
      if (!response.ok) throw new Error('Failed to fetch traffic sources')
      const data = await response.json()
      return data.data || []
    } catch (error) {
      console.error('Error fetching traffic sources:', error)
      return []
    }
  }

  /**
   * 获取实时统计
   */
  async getRealtimeStats(): Promise<RealtimeStats> {
    try {
      const response = await fetch(`${this.baseUrl}/realtime`)
      if (!response.ok) throw new Error('Failed to fetch realtime stats')
      const data = await response.json()
      return data.data || {
        onlineUsers: 0,
        currentViews: 0,
        actionsPerMinute: 0,
        serverLoad: 0
      }
    } catch (error) {
      console.error('Error fetching realtime stats:', error)
      return {
        onlineUsers: 0,
        currentViews: 0,
        actionsPerMinute: 0,
        serverLoad: 0
      }
    }
  }

  /**
   * 记录页面浏览
   */
  async trackPageView(path: string, title: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path, title })
      })
    } catch (error) {
      console.error('Error tracking page view:', error)
    }
  }

  /**
   * 记录用户行为
   */
  async trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventName, properties })
      })
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }
}

export const analyticsService = new AnalyticsService()
