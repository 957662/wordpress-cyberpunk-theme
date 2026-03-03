/**
 * Performance Utilities
 * 性能优化工具函数集
 */

/**
 * 防抖函数 - 延迟执行函数直到等待时间结束
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
 * 节流函数 - 限制函数执行频率
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
 * 请求动画节流 - 使用 requestAnimationFrame 的节流
 */
export function rafThrottle<T extends (...args: any[]) => any>(func: T): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * 批处理 - 将多个更新合并为一次
 */
export class BatchProcessor<T> {
  private items: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  private processor: (items: T[]) => void;
  private delay: number;

  constructor(processor: (items: T[]) => void, delay: number = 100) {
    this.processor = processor;
    this.delay = delay;
  }

  add(item: T): void {
    this.items.push(item);

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  flush(): void {
    if (this.items.length === 0) return;

    const items = [...this.items];
    this.items = [];

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.processor(items);
  }
}

/**
 * 延迟加载 - 延迟执行非关键任务
 */
export function defer(callback: () => void, timeout: number = 0): void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => setTimeout(callback, timeout),
      { timeout: timeout + 100 }
    );
  } else {
    setTimeout(callback, timeout);
  }
}

/**
 * 优先级任务调度器
 */
export class TaskScheduler {
  private queues: Map<string, Array<() => Promise<any>>> = new Map();
  private running: Set<string> = new Set();

  async schedule(queueName: string, task: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      if (!this.queues.has(queueName)) {
        this.queues.set(queueName, []);
      }

      this.queues.get(queueName)!.push(wrappedTask);
      this.processQueue(queueName);
    });
  }

  private async processQueue(queueName: string): Promise<void> {
    if (this.running.has(queueName)) {
      return;
    }

    const queue = this.queues.get(queueName);
    if (!queue || queue.length === 0) {
      return;
    }

    this.running.add(queueName);

    while (queue.length > 0) {
      const task = queue.shift();
      if (task) {
        await task();
      }
    }

    this.running.delete(queueName);
  }
}

/**
 * 内存缓存 - 带大小限制的缓存
 */
export class MemoryCache<K, V> {
  private cache: Map<K, V> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Delete first entry (FIFO)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * 性能监控 - 测量函数执行时间
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label?: string
): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${label || func.name}: ${end - start}ms`);
    }

    return result;
  }) as T;
}

/**
 * 资源预加载
 */
export function preloadResource(url: string, as: 'image' | 'script' | 'style' | 'font'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;

  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * 图片懒加载观察器
 */
export class LazyLoadObserver {
  private observer: IntersectionObserver;
  private elements: Map<Element, (entry: IntersectionObserverEntry) => void> = new Map();

  constructor(options?: IntersectionObserverInit) {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const callback = this.elements.get(entry.target);
        if (callback) {
          callback(entry);
        }
      });
    }, options);
  }

  observe(element: Element, callback: (entry: IntersectionObserverEntry) => void): void {
    this.elements.set(element, callback);
    this.observer.observe(element);
  }

  unobserve(element: Element): void {
    this.elements.delete(element);
    this.observer.unobserve(element);
  }

  disconnect(): void {
    this.elements.clear();
    this.observer.disconnect();
  }
}

/**
 * 代码分割加载器
 */
export async function loadChunk<T>(importFn: () => Promise<T>): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    console.error('Failed to load chunk:', error);
    throw error;
  }
}

/**
 * Web Worker 管理器
 */
export class WorkerManager {
  private workers: Map<string, Worker> = new Map();

  create(key: string, workerFn: () => Worker): Worker {
    if (this.workers.has(key)) {
      return this.workers.get(key)!;
    }

    const worker = workerFn();
    this.workers.set(key, worker);
    return worker;
  }

  get(key: string): Worker | undefined {
    return this.workers.get(key);
  }

  terminate(key: string): void {
    const worker = this.workers.get(key);
    if (worker) {
      worker.terminate();
      this.workers.delete(key);
    }
  }

  terminateAll(): void {
    this.workers.forEach((worker) => worker.terminate());
    this.workers.clear();
  }
}
