/**
 * Analytics Service
 * 数据分析服务 - 用于收集和分析用户行为数据
 */

import { WordPressClient } from '../wordpress/wordpress-client';

export interface PageViewEvent {
  path: string;
  title: string;
  referrer?: string;
  userId?: number;
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface EventTracking {
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: number;
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface UserEngagement {
  userId?: number;
  sessionId: string;
  duration: number;
  scrollDepth: number;
  interactions: number;
  timestamp: number;
}

export interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  averageDuration: number;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
  }>;
  topPosts: Array<{
    postId: number;
    title: string;
    views: number;
  }>;
}

export interface AnalyticsConfig {
  enabled: boolean;
  apiEndpoint?: string;
  batchSize?: number;
  flushInterval?: number;
  sessionTimeout?: number;
}

class AnalyticsService {
  private config: AnalyticsConfig;
  private eventQueue: Array<PageViewEvent | EventTracking | UserEngagement> = [];
  private sessionId: string;
  private sessionStartTime: number;
  private pageViewStartTime: number;
  private flushTimer?: NodeJS.Timeout;
  private interactions: number = 0;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.pageViewStartTime = Date.now();
    this.interactions = 0;

    if (this.config.enabled && typeof window !== 'undefined') {
      this.initializeTracking();
      this.startFlushTimer();
      this.setupBeforeUnload();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking(): void {
    // Track page view on mount
    this.trackPageView(window.location.pathname, document.title);

    // Track user interactions
    this.setupInteractionTracking();

    // Track scroll depth
    this.setupScrollTracking();

    // Track performance
    this.setupPerformanceTracking();
  }

  private setupInteractionTracking(): void {
    const events = ['click', 'scroll', 'keydown', 'touchstart'];

    events.forEach(event => {
      document.addEventListener(event, () => {
        this.interactions++;
      }, { passive: true });
    });
  }

  private setupScrollTracking(): void {
    let maxScroll = 0;

    const trackScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;

        // Track scroll milestones
        const milestones = [25, 50, 75, 90, 100];
        milestones.forEach(milestone => {
          if (scrollPercentage >= milestone && scrollPercentage < milestone + 5) {
            this.trackEvent('Scroll', `Reach ${milestone}%`, undefined, undefined);
          }
        });
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });
  }

  private setupPerformanceTracking(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

          this.trackEvent('Performance', 'Page Load', String(Math.round(perfData.loadEventEnd - perfData.fetchStart)), undefined);
          this.trackEvent('Performance', 'DOM Ready', String(Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)), undefined);
        }, 0);
      });
    }
  }

  private startFlushTimer(): void {
    const flushInterval = this.config.flushInterval || 30000; // 30 seconds default

    this.flushTimer = setInterval(() => {
      this.flush();
    }, flushInterval);
  }

  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      // Send engagement data before page unload
      this.trackEngagement();

      // Flush remaining events
      this.flush();

      // Send data with navigator.sendBeacon for reliability
      if (this.eventQueue.length > 0 && this.config.apiEndpoint) {
        const data = JSON.stringify(this.eventQueue);
        navigator.sendBeacon(`${this.config.apiEndpoint}/events/batch`, data);
      }
    });
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title: string, metadata?: Record<string, any>): void {
    if (!this.config.enabled) return;

    const event: PageViewEvent = {
      path,
      title,
      referrer: document.referrer,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      metadata,
    };

    this.addToQueue(event);
    this.pageViewStartTime = Date.now();
    this.interactions = 0;
  }

  /**
   * Track custom event
   */
  trackEvent(
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.config.enabled) return;

    const event: EventTracking = {
      category,
      action,
      label,
      value,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      metadata,
    };

    this.addToQueue(event);
  }

  /**
   * Track user engagement
   */
  private trackEngagement(): void {
    if (!this.config.enabled) return;

    const duration = Date.now() - this.pageViewStartTime;
    const scrollDepth = this.getScrollDepth();

    const engagement: UserEngagement = {
      sessionId: this.sessionId,
      duration,
      scrollDepth,
      interactions: this.interactions,
      timestamp: Date.now(),
    };

    this.addToQueue(engagement);
  }

  private getScrollDepth(): number {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
  }

  private addToQueue(event: PageViewEvent | EventTracking | UserEngagement): void {
    this.eventQueue.push(event);

    const batchSize = this.config.batchSize || 10;
    if (this.eventQueue.length >= batchSize) {
      this.flush();
    }
  }

  private async flush(): void {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    if (this.config.apiEndpoint) {
      try {
        await fetch(`${this.config.apiEndpoint}/events/batch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ events }),
          keepalive: true,
        });
      } catch (error) {
        console.error('Failed to send analytics events:', error);
        // Re-add events to queue for retry
        this.eventQueue.unshift(...events);
      }
    }
  }

  /**
   * Get analytics stats
   */
  async getStats(startDate?: Date, endDate?: Date): Promise<AnalyticsStats> {
    if (!this.config.apiEndpoint) {
      throw new Error('API endpoint not configured');
    }

    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate.toISOString());
    if (endDate) params.append('end_date', endDate.toISOString());

    const response = await fetch(`${this.config.apiEndpoint}/stats?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch analytics stats');
    }

    return response.json();
  }

  /**
   * Track post view
   */
  async trackPostView(postId: number, postTitle: string): Promise<void> {
    this.trackEvent('Post', 'View', postTitle, postId);

    // Also increment view count via API
    try {
      const client = WordPressClient.getInstance();
      await client.incrementPostViewCount(postId);
    } catch (error) {
      console.error('Failed to increment post view count:', error);
    }
  }

  /**
   * Track comment submission
   */
  trackComment(postId: number, postTitle: string): void {
    this.trackEvent('Comment', 'Submit', postTitle, postId);
  }

  /**
   * Track like
   */
  trackLike(entityType: 'post' | 'comment', entityId: number, title?: string): void {
    this.trackEvent('Like', entityType, title, entityId);
  }

  /**
   * Track bookmark
   */
  trackBookmark(postId: number, postTitle: string): void {
    this.trackEvent('Bookmark', 'Add', postTitle, postId);
  }

  /**
   * Track search
   */
  trackSearch(query: string, resultsCount: number): void {
    this.trackEvent('Search', 'Query', query, resultsCount);
  }

  /**
   * Track share
   */
  trackShare(platform: string, contentType: string, contentId: number): void {
    this.trackEvent('Share', platform, contentType, contentId);
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.trackEvent('Error', error.name, error.message, undefined, {
      ...context,
      stack: error.stack,
    });
  }

  /**
   * Set user ID for authenticated users
   */
  setUserId(userId: number): void {
    (window as any).analyticsUserId = userId;
  }

  /**
   * Clear user ID on logout
   */
  clearUserId(): void {
    delete (window as any).analyticsUserId;
  }

  /**
   * Reset session (e.g., after timeout)
   */
  resetSession(): void {
    this.trackEngagement();
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
  }

  /**
   * Disable analytics
   */
  disable(): void {
    this.config.enabled = false;
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }

  /**
   * Enable analytics
   */
  enable(): void {
    this.config.enabled = true;
    this.startFlushTimer();
    this.initializeTracking();
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.trackEngagement();
    this.flush();

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }
}

// Create singleton instance
let analyticsService: AnalyticsService | null = null;

export function initAnalytics(config: AnalyticsConfig): AnalyticsService {
  if (!analyticsService) {
    analyticsService = new AnalyticsService(config);
  }
  return analyticsService;
}

export function getAnalytics(): AnalyticsService | null {
  return analyticsService;
}

export default AnalyticsService;
