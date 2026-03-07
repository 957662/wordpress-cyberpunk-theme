/**
 * Performance Utility Functions
 * 用于性能监控和优化的工具函数集
 */

/**
 * 性能指标接口
 */
export interface PerformanceMetrics {
  fps: number;
  memory: number;
  timing: {
    domContentLoaded: number;
    loadComplete: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
}

/**
 * FPS 监控类
 */
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();
  private callback?: (fps: number) => void;

  constructor(callback?: (fps: number) => void) {
    this.callback = callback;
    this.start();
  }

  private start() {
    const measure = () => {
      const now = performance.now();
      const delta = now - this.lastTime;

      this.frames.push(1000 / delta);
      this.lastTime = now;

      // 保留最近60帧
      if (this.frames.length > 60) {
        this.frames.shift();
      }

      // 每秒计算一次平均FPS
      if (this.frames.length === 60) {
        const avgFps = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
        this.callback?.(avgFps);
      }

      requestAnimationFrame(measure);
    };

    requestAnimationFrame(measure);
  }

  getAverageFPS(): number {
    if (this.frames.length === 0) return 0;
    return this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
  }
}

/**
 * 获取性能指标
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  const firstPaint = paint.find(entry => entry.name === 'first-paint')?.startTime || 0;
  const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;

  return {
    fps: 0,
    memory: (performance as any).memory?.usedJSHeapSize || 0,
    timing: {
      domContentLoaded: navigation?.domContentLoadedEventEnd || 0,
      loadComplete: navigation?.loadEventEnd || 0,
      firstPaint,
      firstContentfulPaint,
    },
  };
}

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
  let inThrottle = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 批量处理函数
 */
export function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => R,
  batchSize: number = 10,
  delay: number = 0
): Promise<R[]> {
  return new Promise((resolve) => {
    const results: R[] = [];
    let index = 0;

    function processBatch() {
      const batch = items.slice(index, index + batchSize);
      const batchResults = batch.map(processor);
      results.push(...batchResults);

      index += batchSize;

      if (index < items.length) {
        setTimeout(processBatch, delay);
      } else {
        resolve(results);
      }
    }

    processBatch();
  });
}

/**
 * 懒加载图片
 */
export function lazyLoadImage(img: HTMLImageElement, src: string): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '50px' }
  );

  observer.observe(img);
}

/**
 * 虚拟滚动计算
 */
export function calculateVisibleRange(
  scrollTop: number,
  viewportHeight: number,
  itemHeight: number,
  totalItems: number,
  buffer: number = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const visibleCount = Math.ceil(viewportHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + buffer * 2);

  return { start, end };
}

/**
 * 测量函数执行时间
 */
export async function measureAsync<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
  }
}

/**
 * 测量同步函数执行时间
 */
export function measure<T>(fn: () => T, label: string): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    const duration = performance.now() - start;
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
  }
}

/**
 * 内存使用监控
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} {
  const memory = (performance as any).memory;
  if (!memory) {
    return { used: 0, total: 0, percentage: 0 };
  }

  return {
    used: memory.usedJSHeapSize,
    total: memory.jsHeapSizeLimit,
    percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
}

/**
 * 请求空闲回调
 */
export function requestIdleCallback(
  callback: () => void,
  timeout?: number
): number {
  if ('requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  }
  return window.setTimeout(callback, 1);
}

/**
 * 取消空闲回调
 */
export function cancelIdleCallback(id: number): void {
  if ('cancelIdleCallback' in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    window.clearTimeout(id);
  }
}

/**
 * 性能标记
 */
export class PerformanceMark {
  private marks: Map<string, number> = new Map();

  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  end(label: string): number {
    const start = this.marks.get(label);
    if (!start) {
      console.warn(`No start mark found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - start;
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    this.marks.delete(label);
    return duration;
  }

  measure<T>(label: string, fn: () => T): T {
    this.start(label);
    try {
      return fn();
    } finally {
      this.end(label);
    }
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      return await fn();
    } finally {
      this.end(label);
    }
  }
}

// 默认导出
export default {
  FPSMonitor,
  getPerformanceMetrics,
  debounce,
  throttle,
  batchProcess,
  lazyLoadImage,
  calculateVisibleRange,
  measureAsync,
  measure,
  getMemoryUsage,
  requestIdleCallback,
  cancelIdleCallback,
  PerformanceMark,
};
