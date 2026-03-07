/**
 * Optimization Utility Functions
 * 性能优化工具函数
 */

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
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * requestAnimationFrame 节流
 */
export function rafThrottle<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    }
  };
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 批处理函数 - 将多次调用合并为一次
 */
export function batchCalls<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 0
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let argsQueue: Parameters<T>[] = [];

  return function executedFunction(...args: Parameters<T>) {
    argsQueue.push(args);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...argsQueue.flat() as any);
      argsQueue = [];
      timeout = null;
    }, wait);
  };
}

/**
 * 检测是否在浏览器环境
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * 检测是否支持某项功能
 */
export function supports(feature: string): boolean {
  if (!isBrowser) return false;

  const features: Record<string, () => boolean> = {
    intersectionObserver: () => 'IntersectionObserver' in window,
    mutationObserver: () => 'MutationObserver' in window,
    resizeObserver: () => 'ResizeObserver' in window,
    webp: () => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },
    passiveEvents: () => {
      let supports = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: () => {
            supports = true;
            return true;
          },
        });
        window.addEventListener('test', () => {}, opts);
        window.removeEventListener('test', () => {}, opts);
      } catch (e) {
        // ignore
      }
      return supports;
    },
  };

  return features[feature]?.() ?? false;
}

/**
 * 获取性能指标
 */
export function getPerformanceMetrics() {
  if (!isBrowser || !window.performance) {
    return null;
  }

  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;
  const domContentLoadedTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;

  return {
    pageLoadTime,
    connectTime,
    renderTime,
    domContentLoadedTime,
  };
}

/**
 * 测量函数执行时间
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label: string = 'Performance'
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();

    console.log(`${label}: ${(end - start).toFixed(2)}ms`);

    return result;
  }) as T;
}

/**
 * 预加载资源
 */
export function preloadResource(href: string, as: string = 'script'): void {
  if (!isBrowser) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;

  if (as === 'fetch') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * 预连接到域名
 */
export function preconnectTo(hostname: string): void {
  if (!isBrowser) return;

  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = hostname;

  document.head.appendChild(link);
}

/**
 * 优化图片加载
 */
export function optimizeImageUrl(
  url: string,
  width: number,
  height: number,
  quality: number = 75
): string {
  // 如果是外部 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // 这里可以根据你的图片服务进行调整
  // 例如: Next.js Image Optimization, Cloudinary, etc.
  return `${url}?w=${width}&h=${height}&q=${quality}`;
}

/**
 * 获取网络类型
 */
export function getNetworkType(): string {
  if (!isBrowser || !('connection' in navigator)) {
    return 'unknown';
  }

  const conn = (navigator as any).connection;
  return conn?.effectiveType || 'unknown';
}

/**
 * 检测是否为慢速网络
 */
export function isSlowNetwork(): boolean {
  const networkType = getNetworkType();
  return networkType === 'slow-2g' || networkType === '2g';
}

/**
 * 节省数据模式
 */
export function isDataSaverMode(): boolean {
  if (!isBrowser || !('connection' in navigator)) {
    return false;
  }

  const conn = (navigator as any).connection;
  return conn?.saveData || false;
}

/**
 * 空闲时执行任务
 */
export function runWhenIdle(
  callback: () => void,
  timeout: number = 2000
): () => void {
  if (!isBrowser || !('requestIdleCallback' in window)) {
    // 不支持时使用 setTimeout
    const timeoutId = setTimeout(callback, 0);
    return () => clearTimeout(timeoutId);
  }

  const id = (window as any).requestIdleCallback(
    () => callback(),
    { timeout }
  );

  return () => (window as any).cancelIdleCallback(id);
}

/**
 * 虚拟滚动计算
 */
export function calculateVisibleRange(
  scrollTop: number,
  viewportHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItemCount = Math.ceil(viewportHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleItemCount + overscan * 2);

  return { start, end };
}

/**
 * 内存缓存
 */
export class MemoryCache<T = any> {
  private cache = new Map<string, { value: T; expiry: number }>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // 清理过期项
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * 创建缓存实例
 */
export const cache = new MemoryCache();
