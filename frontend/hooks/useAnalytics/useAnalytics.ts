/**
 * 分析追踪 Hook
 * 用于追踪用户行为和页面性能
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// 事件类型
export type AnalyticsEvent =
  | 'page_view'
  | 'click'
  | 'scroll'
  | 'form_submit'
  | 'search'
  | 'download'
  | 'share'
  | 'comment'
  | 'like'
  | 'bookmark'
  | 'custom';

// 事件数据接口
export interface AnalyticsEventData {
  event: AnalyticsEvent;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp?: number;
}

// 页面性能数据
export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  loadTime?: number;
  domContentLoaded?: number;
}

// Hook 配置
interface UseAnalyticsOptions {
  enable?: boolean;
  debug?: boolean;
  trackPageViews?: boolean;
  trackScroll?: boolean;
  trackClicks?: boolean;
  trackPerformance?: boolean;
  sampleRate?: number;
}

/**
 * 分析追踪 Hook
 */
export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    enable = true,
    debug = false,
    trackPageViews = true,
    trackScroll = true,
    trackClicks = true,
    trackPerformance = true,
    sampleRate = 1,
  } = options;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasTrackedPageView = useRef(false);

  // 检查是否应该追踪（基于采样率）
  const shouldTrack = useCallback(() => {
    return enable && Math.random() <= sampleRate;
  }, [enable, sampleRate]);

  // 发送事件到分析平台
  const trackEvent = useCallback((data: AnalyticsEventData) => {
    if (!shouldTrack()) return;

    const eventData = {
      ...data,
      timestamp: data.timestamp || Date.now(),
    };

    // 发送到 Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', data.event, {
        event_category: data.category,
        event_label: data.label,
        value: data.value,
        ...data.properties,
      });
    }

    // 发送到其他分析平台（可以在这里添加）
    // Plausible, Mixpanel, Amplitude 等

    // 开发环境日志
    if (debug) {
      console.log('[Analytics]', eventData);
    }
  }, [shouldTrack, debug]);

  // 追踪页面浏览
  useEffect(() => {
    if (!trackPageViews || !shouldTrack() || hasTrackedPageView.current) return;

    trackEvent({
      event: 'page_view',
      category: 'navigation',
      label: pathname,
      properties: {
        path: pathname,
        search: searchParams.toString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
      },
    });

    hasTrackedPageView.current = true;
  }, [pathname, searchParams, trackPageViews, trackEvent, shouldTrack]);

  // 追踪滚动深度
  useEffect(() => {
    if (!trackScroll || !shouldTrack()) return;

    let maxScrollDepth = 0;
    const scrollMilestones = [25, 50, 75, 90, 100];
    const reachedMilestones = new Set<number>();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = (window.scrollY / scrollHeight) * 100;

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
      }

      // 检查是否达到里程碑
      scrollMilestones.forEach((milestone) => {
        if (scrollDepth >= milestone && !reachedMilestones.has(milestone)) {
          reachedMilestones.add(milestone);

          trackEvent({
            event: 'scroll',
            category: 'engagement',
            label: `${milestone}%`,
            value: milestone,
            properties: {
              path: pathname,
              scrollDepth: Math.round(maxScrollDepth),
            },
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScroll, trackEvent, shouldTrack, pathname]);

  // 追踪点击事件
  useEffect(() => {
    if (!trackClicks || !shouldTrack()) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      const button = target.closest('button');

      if (link) {
        trackEvent({
          event: 'click',
          category: 'link',
          label: link.textContent || link.getAttribute('href') || '',
          properties: {
            href: link.getAttribute('href'),
            external: link.hostname !== window.location.hostname,
          },
        });
      } else if (button) {
        trackEvent({
          event: 'click',
          category: 'button',
          label: button.textContent || button.getAttribute('aria-label') || '',
          properties: {
            type: button.getAttribute('type'),
            name: button.getAttribute('name'),
          },
        });
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [trackClicks, trackEvent, shouldTrack]);

  // 追踪性能指标
  useEffect(() => {
    if (!trackPerformance || !shouldTrack()) return;

    // 等待页面加载完成
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    function measurePerformance() {
      // 获取 Navigation Timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const metrics: PerformanceMetrics = {
          ttfb: navigation.responseStart - navigation.requestStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        };

        trackEvent({
          event: 'custom',
          category: 'performance',
          label: 'navigation_timing',
          properties: metrics,
        });
      }

      // 获取 Paint Timing
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcp) {
        trackEvent({
          event: 'custom',
          category: 'performance',
          label: 'first_contentful_paint',
          value: Math.round(fcp.startTime),
        });
      }

      // 获取 LCP（需要使用 PerformanceObserver）
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            trackEvent({
              event: 'custom',
              category: 'performance',
              label: 'largest_contentful_paint',
              value: Math.round(lastEntry.startTime),
            });
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // 忽略错误
        }
      }

      // 获取 CLS
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
                trackEvent({
                  event: 'custom',
                  category: 'performance',
                  label: 'cumulative_layout_shift',
                  value: Math.round(clsValue * 1000) / 1000,
                });
              }
            }
          });
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // 忽略错误
        }
      }
    }
  }, [trackPerformance, trackEvent, shouldTrack]);

  return {
    trackEvent,
    // 便捷方法
    trackClick: (label: string, properties?: Record<string, any>) => {
      trackEvent({
        event: 'click',
        category: 'interaction',
        label,
        properties,
      });
    },
    trackSearch: (query: string, resultsCount?: number) => {
      trackEvent({
        event: 'search',
        category: 'search',
        label: query,
        value: resultsCount,
        properties: {
          query,
          resultsCount,
        },
      });
    },
    trackFormSubmit: (formName: string, properties?: Record<string, any>) => {
      trackEvent({
        event: 'form_submit',
        category: 'form',
        label: formName,
        properties,
      });
    },
    trackDownload: (url: string, filename?: string) => {
      trackEvent({
        event: 'download',
        category: 'download',
        label: filename || url,
        properties: { url },
      });
    },
    trackShare: (platform: string, contentUrl?: string) => {
      trackEvent({
        event: 'share',
        category: 'social',
        label: platform,
        properties: { contentUrl },
      });
    },
    trackComment: (articleId: string, commentLength?: number) => {
      trackEvent({
        event: 'comment',
        category: 'engagement',
        label: articleId,
        value: commentLength,
        properties: { articleId, commentLength },
      });
    },
    trackLike: (articleId: string) => {
      trackEvent({
        event: 'like',
        category: 'engagement',
        label: articleId,
        properties: { articleId },
      });
    },
    trackBookmark: (articleId: string) => {
      trackEvent({
        event: 'bookmark',
        category: 'engagement',
        label: articleId,
        properties: { articleId },
      });
    },
  };
}

export default useAnalytics;
