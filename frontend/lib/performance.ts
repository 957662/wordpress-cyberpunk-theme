/**
 * 性能优化工具
 */

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
}

/**
 * requestAnimationFrame 节流
 */
export function rafThrottle<T extends (...args: any[]) => any>(func: T): T {
  let rafId: number | null = null;

  return ((...args: Parameters<T>) => {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  }) as T;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * 批处理函数
 */
export function batch<T>(items: T[], batchSize: number, processor: (batch: T[]) => Promise<void>) {
  return async () => {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await processor(batch);
    }
  };
}

/**
 * 懒加载函数
 */
export function lazy<T>(factory: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;

  return () => {
    if (!promise) {
      promise = factory();
    }
    return promise;
  };
}

/**
 * 缓存函数结果
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);

    return result;
  }) as T;
}

/**
 * 测量函数执行时间
 */
export function measureTime<T extends (...args: any[]) => any>(
  func: T,
  label?: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();

    const time = end - start;
    const message = label || func.name || 'anonymous';

    if (typeof window !== 'undefined' && window.console) {
      console.log(`${message} took ${time.toFixed(2)}ms`);
    }

    return result;
  }) as T;
}

/**
 * 异步测量函数执行时间
 */
export async function measureTimeAsync<T>(
  func: () => Promise<T>,
  label?: string
): Promise<T> {
  const start = performance.now();
  const result = await func();
  const end = performance.now();

  const time = end - start;
  const message = label || 'async function';

  if (typeof window !== 'undefined' && window.console) {
    console.log(`${message} took ${time.toFixed(2)}ms`);
  }

  return result;
}

/**
 * 重试函数
 */
export async function retry<T>(
  func: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = 2, onRetry } = options;

  let lastError: Error;

  for (let i = 0; i <= retries; i++) {
    try {
      return await func();
    } catch (error) {
      lastError = error as Error;

      if (i < retries) {
        onRetry?.(lastError, i + 1);
        const waitTime = delay * Math.pow(backoff, i);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError!;
}

/**
 * 并发控制
 */
export async function parallel<T, R>(
  items: T[],
  mapper: (item: T, index: number) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (let i = 0; i < items.length; i++) {
    const promise = mapper(items[i], i).then(result => {
      results[i] = result;
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * 超时控制
 */
export function timeout<T>(
  promise: Promise<T>,
  ms: number,
  error: Error = new Error(`Timeout after ${ms}ms`)
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(error), ms)
    ),
  ]);
}

/**
 * 性能标记
 */
export class PerformanceMarker {
  private marks = new Map<string, number>();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    if (!start) {
      console.warn(`Mark "${startMark}" not found`);
      return 0;
    }

    const end = endMark ? this.marks.get(endMark) : performance.now();
    if (!end) {
      console.warn(`Mark "${endMark}" not found`);
      return 0;
    }

    return end - start;
  }

  getMark(name: string): number | undefined {
    return this.marks.get(name);
  }

  clear(): void {
    this.marks.clear();
  }
}

export const perfMarker = new PerformanceMarker();
