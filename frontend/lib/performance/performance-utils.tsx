/**
 * Performance Utilities - 性能优化工具集
 * 代码分割、懒加载、虚拟滚动等
 */

import { lazy, Suspense, ComponentType, useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 加载状态组件
 */
export function LoadingState({ message = '加载中...', className }: { message?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin mb-4" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

/**
 * 动态导入包装器
 */
export function dynamicImport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
): T {
  const LazyComponent = lazy(importFunc);

  const WrappedComponent = (props: React.ComponentProps<T>) => {
    return (
      <Suspense fallback={fallback || <LoadingState />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };

  return WrappedComponent as T;
}

/**
 * 懒加载图片Hook
 */
export function useLazyImage(src: string, options?: { threshold?: number; rootMargin?: string }) {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, options]);

  return { imgRef, imageSrc, isLoaded };
}

/**
 * 防抖Hook
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 节流Hook
 */
export function useThrottle<T>(value: T, limit: number = 300): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => clearTimeout(handler);
  }, [value, limit]);

  return throttledValue;
}

/**
 * 虚拟滚动列表
 */
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 资源预加载
 */
export function preloadImage(src: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

export function preloadStyle(href: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = href;
  document.head.appendChild(link);
}

export function preloadScript(src: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = src;
  document.head.appendChild(link);
}

/**
 * 批量预加载资源
 */
export function preloadResources(resources: {
  images?: string[];
  styles?: string[];
  scripts?: string[];
}): void {
  resources.images?.forEach(preloadImage);
  resources.styles?.forEach(preloadStyle);
  resources.scripts?.forEach(preloadScript);
}

/**
 * 性能监控
 */
export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    // 监控页面加载性能
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        console.log('[Performance]', {
          // DNS查询时间
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          // TCP连接时间
          tcp: perfData.connectEnd - perfData.connectStart,
          // 请求响应时间
          request: perfData.responseEnd - perfData.requestStart,
          // DOM解析时间
          domParsing: perfData.domInteractive - perfData.responseEnd,
          // DOM内容加载时间
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          // 完整页面加载时间
          pageLoad: perfData.loadEventEnd - perfData.navigationStart,
        });
      }, 0);
    });
  }, []);
}

/**
 * 内存泄漏检测
 */
export function useMemoryLeakDetector() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('[Memory]', {
          usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
          totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
          jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
        });
      }
    };

    const interval = setInterval(checkMemory, 30000); // 每30秒检查一次

    return () => clearInterval(interval);
  }, []);
}

/**
 * 代码分割配置
 */

// 博客页面
export const BlogListPage = dynamicImport(
  () => import('@/app/blog/page'),
  { fallback: <LoadingState message="加载博客列表..." /> }
);

export const BlogDetailPage = dynamicImport(
  () => import('@/app/blog/[id]/page'),
  { fallback: <LoadingState message="加载文章详情..." /> }
);

// 用户页面
export const ProfilePage = dynamicImport(
  () => import('@/app/profile/page'),
  { fallback: <LoadingState message="加载个人资料..." /> }
);

export const SettingsPage = dynamicImport(
  () => import('@/app/settings/page'),
  { fallback: <LoadingState message="加载设置..." /> }
);

// 管理页面
export const DashboardPage = dynamicImport(
  () => import('@/app/admin/page'),
  { fallback: <LoadingState message="加载仪表盘..." /> }
);

export const EditorPage = dynamicImport(
  () => import('@/app/admin/editor/page'),
  { fallback: <LoadingState message="加载编辑器..." /> }
);

// 功能组件
export const CommentSystem = dynamicImport(
  () => import('@/components/comments/CommentSystem')
);

export const ShareDialog = dynamicImport(
  () => import('@/components/share/ShareDialog')
);

export const SearchModal = dynamicImport(
  () => import('@/components/search/SearchModal')
);

export default {
  LoadingState,
  dynamicImport,
  useLazyImage,
  useDebounce,
  useThrottle,
  VirtualList,
  preloadImage,
  preloadStyle,
  preloadScript,
  preloadResources,
  usePerformanceMonitor,
  useMemoryLeakDetector,
};
