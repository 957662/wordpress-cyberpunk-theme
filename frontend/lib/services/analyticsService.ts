/**
 * 分析服务
 *
 * 处理网站分析、统计数据等
 */

import { API_BASE_URL } from '@/lib/config';

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: string;
  page: string;
}

export interface SiteStats {
  totalPosts: number;
  totalComments: number;
  totalViews: number;
  totalUsers: number;
  todayViews: number;
  todayComments: number;
}

export interface PostAnalytics {
  postId: string;
  views: number;
  uniqueViews: number;
  avgReadTime: number;
  completionRate: number;
  shares: number;
  likes: number;
  comments: number;
  dailyViews: Array<{
    date: string;
    views: number;
  }>;
}

/**
 * 记录页面浏览
 */
export async function trackPageView(data: Omit<PageView, 'timestamp'>): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/analytics/pageview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }),
      // 使用 keepalive 确保在页面卸载时也能发送
      keepalive: true,
    });
  } catch (error) {
    // 静默失败，不影响用户体验
    console.error('Failed to track page view:', error);
  }
}

/**
 * 记录自定义事件
 */
export async function trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * 获取站点统计
 */
export async function getSiteStats(): Promise<SiteStats> {
  const response = await fetch(`${API_BASE_URL}/analytics/site-stats`);

  if (!response.ok) {
    throw new Error('Failed to fetch site stats');
  }

  return response.json();
}

/**
 * 获取文章分析数据
 */
export async function getPostAnalytics(postId: string): Promise<PostAnalytics> {
  const response = await fetch(`${API_BASE_URL}/analytics/posts/${postId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch post analytics');
  }

  return response.json();
}

/**
 * 获取热门文章
 */
export async function getPopularPosts(
  period: 'day' | 'week' | 'month' | 'all' = 'week',
  limit = 10
): Promise<Array<{ postId: string; title: string; views: number }>> {
  const response = await fetch(
    `${API_BASE_URL}/analytics/popular?period=${period}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch popular posts');
  }

  return response.json();
}

/**
 * 获取实时在线人数
 */
export async function getOnlineCount(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/online`);
    if (response.ok) {
      const data = await response.json();
      return data.count;
    }
  } catch (error) {
    console.error('Failed to fetch online count:', error);
  }
  return 0;
}

/**
 * 分析客户端类
 */
export class AnalyticsClient {
  private sessionId: string;
  private userId?: string;
  private queue: AnalyticsEvent[] = [];
  private flushTimer?: NodeJS.Timeout;

  constructor(userId?: string) {
    this.sessionId = this.generateSessionId();
    this.userId = userId;
    this.startFlushTimer();
  }

  /**
   * 生成会话 ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 启动定时刷新
   */
  private startFlushTimer() {
    // 每 30 秒或队列达到 10 个事件时发送
    this.flushTimer = setInterval(() => {
      this.flush();
    }, 30000);
  }

  /**
   * 记录页面浏览
   */
  pageView(path: string, title: string, referrer?: string) {
    trackPageView({
      path,
      title,
      referrer,
      sessionId: this.sessionId,
      userId: this.userId,
    });
  }

  /**
   * 记录事件
   */
  event(category: string, action: string, label?: string, value?: number) {
    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
    };

    this.queue.push(event);

    // 队列达到 10 个立即发送
    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  /**
   * 发送队列中的事件
   */
  private async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch(`${API_BASE_URL}/analytics/events/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      // 失败时重新加入队列
      this.queue = [...events, ...this.queue];
    }
  }

  /**
   * 设置用户 ID
   */
  setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * 销毁客户端
   */
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

/**
 * 创建全局分析实例
 */
let analyticsInstance: AnalyticsClient | null = null;

export function initAnalytics(userId?: string): AnalyticsClient {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsClient(userId);
  }
  return analyticsInstance;
}

export function getAnalytics(): AnalyticsClient | null {
  return analyticsInstance;
}
