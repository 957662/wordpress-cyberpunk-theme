/**
 * 性能优化工具函数库
 * 用于优化前端性能、减少重渲染、优化资源加载等
 */

// ==========================================
// 性能监控
// ==========================================

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  // 页面加载相关
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;

  // 资源加载相关
  resourceCount: number;
  totalResourceSize: number;

  // 内存使用相关
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };

  // 自定义指标
  renderTime: number;
  interactionTime: number;
}

/**
 * 获取页面性能指标
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  const resources = performance.getEntriesByType('resource');

  const firstPaintEntry = paint.find((entry) => entry.name === 'first-paint');
  const firstContentfulPaintEntry = paint.find(
    (entry) => entry.name === 'first-contentful-paint'
  );

  return {
    domContentLoaded: timing?.domContentLoadedEventEnd - timing?.domContentLoadedEventStart || 0,
    loadComplete: timing?.loadEventEnd - timing?.loadEventStart || 0,
    firstPaint: firstPaintEntry?.startTime || 0,
    firstContentfulPaint: firstContentfulPaintEntry?.startTime || 0,
    resourceCount: resources.length,
    totalResourceSize: resources.reduce((sum, resource) => {
      return sum + (resource.transferSize || 0);
    }, 0),
    memoryUsage: (performance as any).memory
      ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        }
      : undefined,
    renderTime: 0,
    interactionTime: 0,
  };
}

/**
 * 记录性能指标
 */
export function logPerformanceMetrics(label: string = 'Performance') {
  if (typeof window === 'undefined' || !performance) return;

  const metrics = getPerformanceMetrics();

  console.group(`📊 ${label} Metrics`);
  console.log(`DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
  console.log(`Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
  console.log(`First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
  console.log(`First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
  console.log(`Resources: ${metrics.resourceCount}`);
  console.log(`Total Size: ${formatBytes(metrics.totalResourceSize)}`);

  if (metrics.memoryUsage) {
    console.log(`Memory Used: ${formatBytes(metrics.memoryUsage.usedJSHeapSize)}`);
    console.log(`Memory Total: ${formatBytes(metrics.memoryUsage.totalJSHeapSize)}`);
    console.log(`Memory Limit: ${formatBytes(metrics.memoryUsage.jsHeapSizeLimit)}`);
  }

  console.groupEnd();

  return metrics;
}

/**
 * 测量函数执行时间
 */
export function measurePerformance<T>(
  label: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);

  return result;
}

/**
 * 异步函数性能测量
 */
export async function measureAsyncPerformance<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);

  return result;
}

// ==========================================
// 防抖和节流
// ==========================================

/**
 * 防抖函数
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
 * 节流函数
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

// ==========================================
// 批处理和队列
// ==========================================

/**
 * 批处理函数
 */
export class BatchProcessor<T> {
  private queue: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  private maxBatchSize: number;
  private maxWaitTime: number;
  private processor: (batch: T[]) => void;

  constructor(
    processor: (batch: T[]) => void,
    maxBatchSize: number = 100,
    maxWaitTime: number = 1000
  ) {
    this.processor = processor;
    this.maxBatchSize = maxBatchSize;
    this.maxWaitTime = maxWaitTime;
  }

  add(item: T): void {
    this.queue.push(item);

    if (this.queue.length >= this.maxBatchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.maxWaitTime);
    }
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.queue.length);
      this.processor(batch);
    }
  }
}

/**
 * 请求队列管理器
 */
export class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private activeRequests = 0;
  private maxConcurrent: number;

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  private process(): void {
    while (
      this.queue.length > 0 &&
      this.activeRequests < this.maxConcurrent
    ) {
      this.activeRequests++;
      const request = this.queue.shift()!;

      request()
        .finally(() => {
          this.activeRequests--;
          this.process();
        });
    }
  }
}

// ==========================================
// 资源优化
// ==========================================

/**
 * 图片懒加载观察器
 */
export function createLazyLoader(
  callback: (entries: IntersectionObserverEntry[]) => void,
  rootMargin: string = '50px'
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin,
  });
}

/**
 * 预加载资源
 */
export function preloadResource(url: string, as: string = 'fetch'): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;

    link.onload = () => {
      resolve();
      document.head.removeChild(link);
    };

    link.onerror = () => {
      reject(new Error(`Failed to preload: ${url}`));
      document.head.removeChild(link);
    };

    document.head.appendChild(link);
  });
}

/**
 * 预加载图片
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

// ==========================================
// 内存优化
// ==========================================

/**
 * 清理对象中的空值
 */
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * 对象池模式 - 重用对象减少GC
 */
export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (obj: T) => void;
  private maxSize: number;

  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    maxSize: number = 100
  ) {
    this.factory = factory;
    this.reset = reset;
    this.maxSize = maxSize;
  }

  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.reset(obj);
      this.pool.push(obj);
    }
  }

  clear(): void {
    this.pool = [];
  }
}

// ==========================================
// 渲染优化
// ==========================================

/**
 * 虚拟滚动辅助函数
 */
export function getVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  buffer: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + buffer * 2);

  return { start, end };
}

/**
 * 检查元素是否在视口中
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

// ==========================================
// 缓存工具
// ==========================================

/**
 * LRU缓存实现
 */
export class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    // Remove existing key if present
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Remove oldest if at capacity
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * 带TTL的缓存
 */
export class TTLCache<K, V> {
  private cache: Map<K, { value: V; expires: number }>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 60000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  set(key: K, value: V, ttl?: number): void {
    const expires = Date.now() + (ttl ?? this.defaultTTL);
    this.cache.set(key, { value, expires });
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }

  clean(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// ==========================================
// 工具函数
// ==========================================

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化持续时间
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(2)}m`;
  return `${(ms / 3600000).toFixed(2)}h`;
}

/**
 * 生成唯一ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 带超时的Promise
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string = 'Operation timed out'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), timeoutMs)
    ),
  ]);
}
