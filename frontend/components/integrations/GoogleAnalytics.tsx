'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface GoogleAnalyticsProps {
  measurementId: string;
  trackPageViews?: boolean;
  debug?: boolean;
}

/**
 * Google Analytics 集成组件
 * 支持 GA4 跟踪和事件上报
 */
export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({
  measurementId,
  trackPageViews = true,
  debug = false
}) => {
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    // 初始化 GA4
    if (typeof window !== 'undefined' && !window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        debug_mode: debug,
        send_page_view: false
      });
    }
  }, [measurementId, debug]);

  // 跟踪页面变化
  useEffect(() => {
    if (trackPageViews && typeof window !== 'undefined' && window.gtag) {
      if (previousPathRef.current !== pathname) {
        window.gtag('event', 'page_view', {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title
        });
        previousPathRef.current = pathname;
      }
    }
  }, [pathname, trackPageViews]);

  return null;
};

/**
 * 跟踪自定义事件
 */
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

/**
 * 跟踪页面浏览
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title || document.title
    });
  }
};

/**
 * 设置用户属性
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', properties);
  }
};

/**
 * 设置用户 ID
 */
export const setUserId = (userId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      user_id: userId
    });
  }
};

/**
 * 异常跟踪
 */
export const trackException = (
  description: string,
  fatal: boolean = false
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description,
      fatal
    });
  }
};

// TypeScript 类型声明
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default GoogleAnalytics;
