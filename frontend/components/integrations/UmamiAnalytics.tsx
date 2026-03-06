'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface UmamiAnalyticsProps {
  websiteId: string;
  src?: string;
  domains?: string[];
  scriptName?: string;
  autoTrack?: boolean;
  excludeSearchQueries?: boolean;
  hashMode?: boolean;
  doNotTrack?: boolean;
}

/**
 * Umami Analytics 集成组件
 * 开源、隐私友好的网站分析工具
 */
export const UmamiAnalytics: React.FC<UmamiAnalyticsProps> = ({
  websiteId,
  src = 'https://analytics.umami.is/script.js',
  domains,
  scriptName = 'umami',
  autoTrack = true,
  excludeSearchQueries = false,
  hashMode = false,
  doNotTrack = false
}) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 检查是否已加载 Umami
    if (window[scriptName as keyof Window]) {
      return;
    }

    // 创建 Umami 脚本
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = src;
    script.setAttribute('data-website-id', websiteId);

    if (domains) {
      script.setAttribute('data-domains', domains.join(','));
    }

    if (!autoTrack) {
      script.setAttribute('data-auto-track', 'false');
    }

    if (excludeSearchQueries) {
      script.setAttribute('data-exclude-search', '');
    }

    if (hashMode) {
      script.setAttribute('data-hash-mode', '');
    }

    if (doNotTrack) {
      script.setAttribute('data-do-not-track', 'true');
    }

    document.head.appendChild(script);

    return () => {
      const scripts = document.head.querySelectorAll(`script[src="${src}"]`);
      scripts.forEach(s => s.remove());
    };
  }, [
    websiteId,
    src,
    domains,
    scriptName,
    autoTrack,
    excludeSearchQueries,
    hashMode,
    doNotTrack
  ]);

  // 手动跟踪页面变化
  useEffect(() => {
    if (!autoTrack && typeof window !== 'undefined') {
      const umami = window[scriptName as keyof Window] as any;
      if (umami && umami.track) {
        umami.track((props = {}) => {
          return {
            ...props,
            url: pathname
          };
        });
      }
    }
  }, [pathname, autoTrack, scriptName]);

  return null;
};

/**
 * 跟踪自定义事件
 */
export const trackUmamiEvent = (
  eventName: string,
  eventData?: Record<string, any>
) => {
  if (typeof window !== 'undefined') {
    const umami = (window as any).umami;
    if (umami && umami.trackEvent) {
      umami.trackEvent(eventName, eventData);
    }
  }
};

/**
 * 跟踪页面浏览
 */
export const trackUmamiPageView = (
  url: string,
  referrer?: string,
  websiteId?: string
) => {
  if (typeof window !== 'undefined') {
    const umami = (window as any).umami;
    if (umami && umami.track) {
      umami.track({
        url,
        referrer,
        websiteId
      });
    }
  }
};

/**
 * 识别用户
 */
export const identifyUmamiUser = (userId: string, userData?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    const umami = (window as any).umami;
    if (umami && umami.identify) {
      umami.identify({
        userId,
        ...userData
      });
    }
  }
};

// TypeScript 类型声明
declare global {
  interface Window {
    umami?: {
      track: (props?: Record<string, any>) => void;
      trackEvent: (eventName: string, eventData?: Record<string, any>) => void;
      identify: (userData: Record<string, any>) => void;
    };
  }
}

export default UmamiAnalytics;
