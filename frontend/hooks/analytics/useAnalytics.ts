/**
 * useAnalytics Hook
 * 分析数据收集Hook
 */

import { useEffect, useRef } from 'react';

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

/**
 * 跟踪页面访问
 */
export function usePageView(pageTitle: string, pagePath: string) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath,
      });
    }
  }, [pageTitle, pagePath]);
}

/**
 * 跟踪自定义事件
 */
export function useAnalytics() {
  const trackEvent = (event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction,
      });
    }
  };

  return { trackEvent };
}

/**
 * 跟踪页面停留时间
 */
export function useTimeOnPage(pagePath: string) {
  const startTime = useRef(Date.now());

  useEffect(() => {
    return () => {
      const endTime = Date.now();
      const duration = (endTime - startTime.current) / 1000; // 秒

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'timing_complete', {
          name: 'time_on_page',
          value: Math.round(duration * 1000), // 毫秒
          event_category: 'engagement',
          event_label: pagePath,
        });
      }
    };
  }, [pagePath]);
}

/**
 * 跟踪滚动深度
 */
export function useScrollDepth() {
  const maxDepth = useRef(0);
  const milestones = [25, 50, 75, 90, 100];
  const reachedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxDepth.current) {
        maxDepth.current = scrollPercent;
      }

      // 检查是否达到新的里程碑
      milestones.forEach((milestone) => {
        if (
          scrollPercent >= milestone &&
          !reachedMilestones.current.has(milestone)
        ) {
          reachedMilestones.current.add(milestone);

          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'scroll_tracking', {
              event_category: 'engagement',
              event_label: `${milestone}%`,
              value: milestone,
            });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return maxDepth.current;
}

/**
 * 跟踪点击事件
 */
export function useClickTracking(elementId: string, eventType: string) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'engagement',
        event_label: elementId,
        value: eventType,
      });
    }
  };

  return handleClick;
}

/**
 * 跟踪表单提交
 */
export function useFormTracking(formName: string) {
  const trackSubmit = (success: boolean, errorMessage?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', success ? 'form_submit' : 'form_error', {
        event_category: 'form',
        event_label: formName,
        value: success ? 1 : 0,
        error_message: errorMessage,
      });
    }
  };

  return { trackSubmit };
}

/**
 * 跟踪搜索查询
 */
export function useSearchTracking() {
  const trackSearch = (query: string, resultsCount: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: query,
        results_count: resultsCount,
      });
    }
  };

  return { trackSearch };
}

/**
 * 跟踪下载
 */
export function useDownloadTracking() {
  const trackDownload = (url: string, filename: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'download', {
        event_category: 'engagement',
        event_label: filename,
        link_url: url,
      });
    }
  };

  return { trackDownload };
}

/**
 * 跟踪社交分享
 */
export function useSocialShareTracking() {
  const trackShare = (network: string, contentType: string, contentId: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        event_category: 'social',
        event_label: network,
        content_type: contentType,
        content_id: contentId,
      });
    }
  };

  return { trackShare };
}

/**
 * 跟踪视频播放
 */
export function useVideoTracking(videoTitle: string) {
  const trackPlay = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'video_play', {
        event_category: 'video',
        event_label: videoTitle,
      });
    }
  };

  const trackPause = (currentTime: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'video_pause', {
        event_category: 'video',
        event_label: videoTitle,
        value: Math.round(currentTime),
      });
    }
  };

  const trackComplete = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'video_complete', {
        event_category: 'video',
        event_label: videoTitle,
      });
    }
  };

  return { trackPlay, trackPause, trackComplete };
}

export default useAnalytics;
