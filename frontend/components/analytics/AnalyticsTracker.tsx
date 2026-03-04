'use client';

import { useEffect, useRef } from 'react';
import { analytics } from '@/services/analytics-enhanced';

interface AnalyticsTrackerProps {
  trackingId?: string;
  userId?: string;
  trackPageView?: boolean;
  trackScrollDepth?: boolean;
  trackTimeOnPage?: boolean;
  trackLinks?: boolean;
  debug?: boolean;
}

/**
 * 分析追踪器组件
 * 自动初始化分析服务并追踪各种用户行为
 */
export function AnalyticsTracker({
  trackingId = process.env.NEXT_PUBLIC_GA_ID,
  userId,
  trackPageView = true,
  trackScrollDepth = true,
  trackTimeOnPage = true,
  trackLinks = true,
  debug = false,
}: AnalyticsTrackerProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || !trackingId) return;
    initializedRef.current = true;

    // 初始化分析服务
    analytics.initialize(trackingId, { userId, debug });

    // 追踪页面浏览
    if (trackPageView) {
      analytics.trackPageView();
    }

    // 追踪滚动深度
    let cleanupScrollDepth: (() => void) | undefined;
    if (trackScrollDepth) {
      cleanupScrollDepth = analytics.trackScrollDepth();
    }

    // 追踪页面停留时间
    let cleanupTimeOnPage: (() => void) | undefined;
    if (trackTimeOnPage) {
      cleanupTimeOnPage = analytics.trackTimeOnPage();
    }

    // 追踪链接点击
    let cleanupLinks: (() => void) | undefined;
    if (trackLinks) {
      cleanupLinks = analytics.trackLinkClick();
    }

    // 清理
    return () => {
      cleanupScrollDepth?.();
      cleanupTimeOnPage?.();
      cleanupLinks?.();
    };
  }, [trackingId, userId, trackPageView, trackScrollDepth, trackTimeOnPage, trackLinks, debug]);

  return null;
}

/**
 * 页面变化追踪器
 * 用于 SPA 路由变化时追踪页面浏览
 */
export function PageViewTracker({ title }: { title?: string }) {
  useEffect(() => {
    analytics.trackPageView({ title });
  }, [title]);

  return null;
}

/**
 * 事件追踪器 HOC
 */
export function withEventTracking<T extends object>(
  Component: React.ComponentType<T>,
  event: {
    category: string;
    action: string;
    label?: string;
    value?: number;
  }
) {
  return function TrackedComponent(props: T) {
    useEffect(() => {
      analytics.trackEvent(event);
    }, []);

    return <Component {...props} />;
  };
}

/**
 * 点击追踪器组件
 */
export function ClickTracker({
  children,
  onClick,
  ...event
}: React.PropsWithChildren<{
  onClick?: () => void;
  category: string;
  action: string;
  label?: string;
  value?: number;
}>) {
  const handleClick = () => {
    analytics.trackEvent(event);
    onClick?.();
  };

  return (
    <div onClick={handleClick} role="button" tabIndex={0}>
      {children}
    </div>
  );
}

/**
 * 可见性追踪器组件
 * 当元素进入视口时触发事件
 */
export function ViewTracker({
  children,
  threshold = 0.5,
  ...event
}: React.PropsWithChildren<{
  threshold?: number;
  category: string;
  action: string;
  label?: string;
  value?: number;
}>) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          analytics.trackEvent({
            ...event,
            label: event.label || entry.target.id || entry.target.className,
          });
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, event]);

  return <div ref={elementRef}>{children}</div>;
}
