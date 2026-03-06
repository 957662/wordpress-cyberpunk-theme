/**
 * Performance Optimizer - 性能优化工具集
 *
 * 提供各种性能优化相关的工具函数
 */

/**
 * 防抖函数
 *
 * 在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 *
 * @example
 * const debouncedSearch = debounce((value) => search(value), 300);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(context, args);
      timeout = null;
    }, wait);
  };
}

/**
 * 节流函数
 *
 * 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
 *
 * @example
 * const throttledScroll = throttle(() => updatePosition(), 100);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let previous = 0;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();

    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

/**
 * requestAnimationFrame 节流
 *
 * 适合用于动画和滚动事件
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      func.apply(this, args);
      rafId = null;
    });
  };
}

/**
 * 批量更新
 *
 * 将多个状态更新合并为一次，减少渲染次数
 */
export function createBatchUpdate<T>(updateFn: (items: T[]) => void, delay = 0) {
  let batch: T[] = [];
  let timeout: NodeJS.Timeout | null = null;

  return (item: T) => {
    batch.push(item);

    if (!timeout) {
      timeout = setTimeout(() => {
        updateFn(batch);
        batch = [];
        timeout = null;
      }, delay);
    }
  };
}

/**
 * 内存缓存
 *
 * 简单的内存缓存实现，支持过期时间
 */
interface CacheItem<T> {
  value: T;
  expires: number;
}

export class MemoryCache {
  private cache: Map<string, CacheItem<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;

    // 定期清理过期缓存
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const expires = Date.now() + (ttl ?? this.defaultTTL);
    this.cache.set(key, { value, expires });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * 单例缓存实例
 */
export const cache = new MemoryCache();

/**
 * 异步缓存装饰器
 *
 * 为异步函数添加缓存功能
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  options: {
    keyGenerator?: (...args: Parameters<T>) => string;
    ttl?: number;
  } = {}
): T {
  const { keyGenerator, ttl } = options;
  const memoCache = new MemoryCache();

  return (async (...args: Parameters<T>) => {
    const key = keyGenerator
      ? keyGenerator(...args)
      : JSON.stringify(args);

    // 尝试从缓存获取
    const cached = memoCache.get(key);
    if (cached !== null) {
      return cached;
    }

    // 执行函数并缓存结果
    const result = await func(...args);
    memoCache.set(key, result, ttl);

    return result;
  }) as T;
}

/**
 * 图片懒加载观察器
 *
 * 使用 IntersectionObserver 实现图片懒加载
 */
export function createImageLazyLoader(options?: IntersectionObserverInit) {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px',
      ...options,
    }
  );

  return {
    observe: (img: HTMLImageElement) => imageObserver.observe(img),
    unobserve: (img: HTMLImageElement) => imageObserver.unobserve(img),
    disconnect: () => imageObserver.disconnect(),
  };
}

/**
 * 资源预加载
 *
 * 预加载指定资源（图片、样式、脚本等）
 */
export function preloadResource(
  href: string,
  as: 'image' | 'style' | 'script' | 'fetch'
): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;

    link.onload = () => {
      resolve();
      document.head.removeChild(link);
    };

    link.onerror = () => {
      reject(new Error(`Failed to preload: ${href}`));
      document.head.removeChild(link);
    };

    document.head.appendChild(link);
  });
}

/**
 * 批量预加载资源
 */
export async function preloadResources(
  resources: Array<{ href: string; as: 'image' | 'style' | 'script' | 'fetch' }>
): Promise<void[]> {
  const promises = resources.map(({ href, as }) => preloadResource(href, as));
  return Promise.all(promises);
}

/**
 * 性能测量
 *
 * 测量函数执行时间
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label?: string
): T {
  return (function (this: any, ...args: any[]) {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();

    const duration = end - start;
    const measurementLabel = label || func.name || 'anonymous';

    if (typeof window !== 'undefined' && window.performance) {
      performance.measure(measurementLabel, start.toString(), end.toString());
    }

    console.log(`[Performance] ${measurementLabel}: ${duration.toFixed(2)}ms`);

    return result;
  }) as T;
}

/**
 * 批处理队列
 *
 * 将操作批量执行以提高性能
 */
export class BatchQueue<T> {
  private queue: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  private handler: (items: T[]) => void;
  private delay: number;

  constructor(handler: (items: T[]) => void, delay: number = 100) {
    this.handler = handler;
    this.delay = delay;
  }

  add(item: T): void {
    this.queue.push(item);

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flush();
      }, this.delay);
    }
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length > 0) {
      const items = [...this.queue];
      this.queue = [];
      this.handler(items);
    }
  }

  clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.queue = [];
  }

  get size(): number {
    return this.queue.length;
  }
}

/**
 * 虚拟滚动辅助函数
 *
 * 计算可见区域的项目
 */
export function getVisibleRange<T>({
  items,
  itemHeight,
  containerHeight,
  scrollTop,
  overscan = 3,
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
}): {
  visibleItems: Array<{ item: T; index: number }>;
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
} {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items
    .slice(startIndex, endIndex + 1)
    .map((item, i) => ({ item, index: startIndex + i }));

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight,
  };
}

/**
 * 代码分割辅助
 *
 * 动态导入组件时显示加载状态
 */
export function createDynamicImport<T>(
  importFn: () => Promise<T>,
  fallback?: React.ComponentType
): () => Promise<T> {
  return async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error('Dynamic import failed:', error);
      throw error;
    }
  };
}

export default {
  debounce,
  throttle,
  rafThrottle,
  cache,
  memoizeAsync,
  preloadResource,
  measurePerformance,
  BatchQueue,
  getVisibleRange,
};
