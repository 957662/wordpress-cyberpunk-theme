'use client';

/**
 * 分析组件 - 追踪用户行为和页面性能
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

interface AnalyticsProps {
  /**
   * Google Analytics ID
   */
  gaId?: string;

  /**
   * 是否启用追踪
   */
  enabled?: boolean;

  /**
   * 自定义端点
   */
  customEndpoint?: string;

  /**
   * 是否追踪页面视图
   */
  trackPageViews?: boolean;

  /**
   * 是否追踪性能指标
   */
  trackPerformance?: boolean;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function Analytics({
  gaId,
  enabled = true,
  customEndpoint,
  trackPageViews = true,
  trackPerformance = true,
}: AnalyticsProps) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (!enabled || !gaId) return;

    // 初始化 Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = \`https://www.googletagmanager.com/gtag/js?id=\${gaId}\`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      send_page_view: false, // 我们手动追踪页面视图
    });

    return () => {
      // 清理
      const scripts = document.head.querySelectorAll(\`script[src*="gtag/js?id=\${gaId}"]\`);
      scripts.forEach((s) => s.remove());
    };
  }, [gaId, enabled]);

  // 追踪页面视图
  useEffect(() => {
    if (!enabled || !trackPageViews || !gaId) return;

    if (previousPath.current !== pathname) {
      window.gtag?.('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname,
      });
      previousPath.current = pathname;
    }
  }, [pathname, enabled, trackPageViews, gaId]);

  // 追踪性能指标
  useEffect(() => {
    if (!enabled || !trackPerformance) return;

    // 使用 PerformanceObserver 监控性能指标
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // 上报性能数据
          if (customEndpoint) {
            fetch(customEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: entry.name,
                duration: entry.duration,
                startTime: entry.startTime,
              }),
              keepalive: true,
            }).catch(console.error);
          }
        });
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });

      return () => observer.disconnect();
    }
  }, [enabled, trackPerformance, customEndpoint]);

  return null;
}

/**
 * 追踪自定义事件的 Hook
 */
export function useAnalytics() {
  const trackEvent = ({ category, action, label, value, nonInteraction }: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
        non_interaction: nonInteraction,
      });
    }
  };

  const trackPageView = (path: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
      });
    }
  };

  const trackConversion = (id: string, value?: number, label?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: id,
        value,
        transaction_id: label,
      });
    }
  };

  const trackTiming = (category: string, variable: string, value: number, label?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value,
        event_category: category,
        event_label: label,
      });
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackConversion,
    trackTiming,
  };
}

/**
 * 事件追踪组件
 */
export function EventTracker({
  event,
  children,
}: {
  event: AnalyticsEvent;
  children: React.ReactElement;
}) {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent(event);
  };

  return <children.type {...children.props} onClick={handleClick} />;
}

export default Analytics;
