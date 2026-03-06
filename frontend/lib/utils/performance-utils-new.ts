/**
 * 性能优化工具函数
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * 防抖函数 - 延迟执行
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数 - 限制执行频率
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 请求空闲回调执行
 */
export function requestIdleCallback(
  callback: () => void,
  timeout?: number
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  }
  return window.setTimeout(callback, 1);
}

/**
 * 取消空闲回调
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    window.clearTimeout(id);
  }
}

/**
 * 批量更新 DOM
 */
export function batchDOMUpdates(updates: (() => void)[]): void {
  if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
    window.requestAnimationFrame(() => {
      updates.forEach((update) => update());
    });
  } else {
    updates.forEach((update) => update());
  }
}

/**
 * 延迟加载组件
 */
export function lazyLoad<T>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.LazyExoticComponent<React.ComponentType<T>> {
  return React.lazy(() =>
    importFunc().catch((error) => {
      console.error('Lazy loading failed:', error);
      // 返回一个默认组件或错误组件
      return Promise.resolve({
        default: fallback || (() => null),
      } as any);
    })
  );
}

/**
 * 预加载资源
 */
export function preloadResource(href: string, as: 'script' | 'style' | 'image' | 'font'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;

  document.head.appendChild(link);
}

/**
 * 预连接到域名
 */
export function preconnectToDomain(href: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;

  document.head.appendChild(link);
}

/**
 * 测量函数执行时间
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label: string
): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();

    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(`${label}-start`);
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);

      console.log(`${label} took ${(end - start).toFixed(2)}ms`);
    }

    return result;
  }) as T;
}

/**
 * 内存使用统计
 */
export function getMemoryUsage(): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null {
  if (
    typeof window !== 'undefined' &&
    'performance' in window &&
    (performance as any).memory
  ) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }
  return null;
}

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 检测是否在视口中
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 检测元素是否可见
 */
export function isElementVisible(
  element: HTMLElement,
  threshold = 0
): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = rect.top <= windowHeight && rect.top + rect.height >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width >= 0;

  const visibleHeight = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
  const visibleWidth = Math.max(0, Math.min(rect.right, windowWidth) - Math.max(rect.left, 0));
  const visibleArea = visibleHeight * visibleWidth;
  const totalArea = rect.height * rect.width;
  const visiblePercentage = (visibleArea / totalArea) * 100;

  return vertInView && horInView && visiblePercentage >= threshold;
}

/**
 * 性能标记
 */
export function markPerformance(label: string): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(label);
  }
}

/**
 * 性能测量
 */
export function measurePerformanceMark(
  label: string,
  startMark: string,
  endMark: string
): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    try {
      performance.measure(label, startMark, endMark);
      const measure = performance.getEntriesByName(label)[0];
      console.log(`${label}: ${measure.duration.toFixed(2)}ms`);
    } catch (error) {
      console.warn(`Performance measure failed for ${label}:`, error);
    }
  }
}

/**
 * 获取性能指标
 */
export function getPerformanceMetrics(): {
  navigation?: PerformanceNavigationTiming;
  paint?: PerformancePaintTiming[];
  resource?: PerformanceResourceTiming[];
} | null {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  const perfData = window.performance;

  return {
    navigation: perfData.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
    paint: perfData.getEntriesByType('paint') as PerformancePaintTiming[],
    resource: perfData.getEntriesByType('resource') as PerformanceResourceTiming[],
  };
}

/**
 * 清理性能标记和测量
 */
export function clearPerformanceMarks(): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.clearMarks();
    performance.clearMeasures();
  }
}

/**
 * 创建性能观察者
 */
export function createPerformanceObserver(
  callback: (list: PerformanceObserverEntryList) => void,
  entryTypes: string[]
): PerformanceObserver | null {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null;
  }

  try {
    const observer = new PerformanceObserver(callback);
    observer.observe({ entryTypes });
    return observer;
  } catch (error) {
    console.warn('PerformanceObserver creation failed:', error);
    return null;
  }
}

/**
 * 使用性能监控 Hook
 */
export function usePerformanceMonitor(componentName: string) {
  const mountTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    mountTime.current = performance.now();
    renderCount.current = 0;

    markPerformance(`${componentName}-mount`);

    return () => {
      const unmountTime = performance.now();
      const duration = unmountTime - mountTime.current;
      console.log(`${componentName} mounted for ${duration.toFixed(2)}ms`);
      console.log(`${componentName} rendered ${renderCount.current} times`);
      measurePerformanceMark(`${componentName}-lifecycle`, `${componentName}-mount`, `${componentName}-unmount`);
    };
  }, [componentName]);

  useEffect(() => {
    renderCount.current++;
  });
}

/**
 * 优化列表渲染
 */
export function optimizeListRender<T>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactNode,
  keyExtractor: (item: T) => string
): React.ReactNode[] {
  return items.map((item, index) => (
    <React.Fragment key={keyExtractor(item)}>
      {renderItem(item, index)}
    </React.Fragment>
  ));
}

/**
 * 虚拟滚动计算
 */
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  buffer = 3
): { startIndex: number; endIndex: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    totalItems - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
  );

  return { startIndex, endIndex };
}

/**
 * 防止布局偏移
 */
export function preventLayoutShift(element: HTMLElement, height: number): void {
  element.style.minHeight = `${height}px`;
}

/**
 * 图片懒加载
 */
export function lazyLoadImage(imgElement: HTMLImageElement, src: string): void {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            imgElement.src = src;
            observer.unobserve(imgElement);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(imgElement);
  } else {
    // 降级处理
    imgElement.src = src;
  }
}

/**
 * 代码分割优化
 */
export function codeSplit<T>(
  loader: () => Promise<T>,
  componentName: string
): () => Promise<T> {
  return () => {
    markPerformance(`${componentName}-load-start`);
    return loader().then((module) => {
      markPerformance(`${componentName}-load-end`);
      measurePerformanceMark(
        `${componentName}-load`,
        `${componentName}-load-start`,
        `${componentName}-load-end`
      );
      return module;
    });
  };
}
