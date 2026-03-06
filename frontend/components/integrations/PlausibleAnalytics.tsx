'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

interface PlausibleAnalyticsProps {
  domain: string;
  scriptUrl?: string;
  apiHost?: string;
  trackLocalhost?: boolean;
  exclude?: string[];
  hashMode?: boolean;
  manualPageview?: boolean;
}

/**
 * Plausible Analytics 集成组件
 * 隐私友好的轻量级网站分析工具
 */
export const PlausibleAnalytics: React.FC<PlausibleAnalyticsProps> = ({
  domain,
  scriptUrl = 'https://plausible.io/js/script.js',
  apiHost,
  trackLocalhost = false,
  exclude,
  hashMode = false,
  manualPageview = false
}) => {
  const dataProps: Record<string, string | boolean> = {
    domain
  };

  if (apiHost) {
    dataProps['data-api'] = apiHost;
  }

  if (trackLocalhost) {
    dataProps['data-local'] = true;
  }

  if (hashMode) {
    dataProps['data-hash'] = true;
  }

  if (manualPageview) {
    dataProps['data-manual'] = true;
  }

  if (exclude && exclude.length > 0) {
    dataProps['data-exclude'] = exclude.join('|');
  }

  return (
    <>
      <Script
        src={scriptUrl}
        defer
        data-domain={domain}
        {...dataProps}
      />
      {apiHost && (
        <Script
          src={`${apiHost}/js/script.js`}
          defer
          data-domain={domain}
          {...dataProps}
        />
      )}
    </>
  );
};

/**
 * Plausible 事件跟踪 Hook
 */
export const usePlausible = () => {
  useEffect(() => {
    // Plausible 会自动初始化
    return () => {
      // 清理
    };
  }, []);

  /**
   * 跟踪页面浏览
   */
  const trackPageview = (props?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('pageview', { props });
    }
  };

  /**
   * 跟踪自定义事件
   */
  const trackEvent = (eventName: string, props?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(eventName, { props });
    }
  };

  /**
   * 跟踪收入事件（用于电商）
   */
  const trackRevenue = (props: { amount: number; currency?: string }) => {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Revenue', { props });
    }
  };

  return {
    trackPageview,
    trackEvent,
    trackRevenue
  };
};

/**
 * 常见事件跟踪组件
 */
interface PlausibleEventProps {
  eventName: string;
  props?: Record<string, any>;
  children: React.ReactElement;
  onClick?: () => void;
}

export const PlausibleEvent: React.FC<PlausibleEventProps> = ({
  eventName,
  props,
  children,
  onClick
}) => {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(eventName, { props });
    }
    onClick?.();
  };

  return React.cloneElement(children, {
    onClick: handleClick
  } as any);
};

// TypeScript 类型声明
declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: {
        props?: Record<string, any>;
        callback?: () => void;
      }
    ) => void;
  }
}

export default PlausibleAnalytics;
