/**
 * Async Utils - 异步工具函数
 * 提供异步操作的辅助函数
 */

// ============= Types =============
export type AsyncResult<T, E = Error> = Promise<
  { success: true; data: T; error: null } |
  { success: false; data: null; error: E }
>;

export type RetryOptions = {
  /** 最大重试次数 */
  maxAttempts?: number;
  /** 重试延迟 (ms) */
  delay?: number;
  /** 延迟倍数 */
  backoffMultiplier?: number;
  /** 最大延迟 (ms) */
  maxDelay?: number;
  /** 是否应该在重试前延迟 */
  shouldDelay?: boolean;
  /** 重试条件判断 */
  shouldRetry?: (error: any) => boolean;
};

export type TimeoutOptions = {
  /** 超时时间 (ms) */
  timeout: number;
  /** 超时错误消息 */
  message?: string;
};

export type DebounceAsyncOptions = {
  /** 延迟时间 (ms) */
  delay?: number;
  /** 是否使用最近的调用结果 */
  leading?: boolean;
};

// ============= Functions =============

/**
 * 安全的异步执行，返回 { success, data, error }
 */
export async function safeAsync<T>(
  promise: Promise<T>
): AsyncResult<T> {
  try {
    const data = await promise;
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: error as Error };
  }
}

/**
 * 延迟执行
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay: initialDelay = 1000,
    backoffMultiplier = 2,
    maxDelay = 10000,
    shouldDelay = true,
    shouldRetry = () => true,
  } = options;

  let lastError: any;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      if (shouldDelay) {
        const currentDelay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt - 1),
          maxDelay
        );
        await delay(currentDelay);
      }
    }
  }

  throw lastError;
}

/**
 * 超时控制
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  options: TimeoutOptions
): Promise<T> {
  const { timeout, message = 'Operation timed out' } = options;

  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(message)), timeout)
    ),
  ]);
}

/**
 * 并行执行（限制并发数）
 */
export async function parallel<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrency: number = 5
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  const execute = async (): Promise<void> => {
    while (index < items.length) {
      const currentIndex = index++;
      const item = items[currentIndex];
      results[currentIndex] = await fn(item, currentIndex);
    }
  };

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () =>
    execute()
  );

  await Promise.all(workers);
  return results;
}

/**
 * 串行执行
 */
export async function series<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i++) {
    results.push(await fn(items[i], i));
  }

  return results;
}

/**
 * 批处理
 */
export async function batch<T, R>(
  items: T[],
  fn: (batch: T[]) => Promise<R[]>,
  batchSize: number
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await fn(batch);
    results.push(...batchResults);
  }

  return results;
}

/**
 * 防抖异步函数
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: DebounceAsyncOptions = {}
): T {
  const { delay = 300, leading = false } = options;

  let timeoutId: NodeJS.Timeout | null = null;
  let pendingPromise: Promise<any> | null = null;
  let pendingArgs: Parameters<T> | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    pendingArgs = args;

    if (!pendingPromise) {
      if (leading) {
        pendingPromise = fn(...args).finally(() => {
          pendingPromise = null;
          pendingArgs = null;
        });
        return pendingPromise;
      }
    }

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...(pendingArgs || args));
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          pendingPromise = null;
          pendingArgs = null;
        }
      }, delay);
    });
  }) as T;
}

/**
 * 节流异步函数
 */
export function throttleAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  interval: number = 300
): T {
  let lastCallTime = 0;
  let pendingPromise: Promise<any> | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCallTime >= interval) {
      lastCallTime = now;
      return fn(...args);
    }

    if (!pendingPromise) {
      pendingPromise = fn(...args).finally(() => {
        pendingPromise = null;
        lastCallTime = Date.now();
      });
    }

    return pendingPromise;
  }) as T;
}

/**
 * 缓存异步结果
 */
export function memoize<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, Promise<any>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const promise = fn(...args).finally(() => {
      // 可选：设置过期时间
      // setTimeout(() => cache.delete(key), 60000);
    });

    cache.set(key, promise);
    return promise;
  }) as T;
}

/**
 * 轮询函数
 */
export function poll<T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: {
    interval?: number;
    timeout?: number;
    maxAttempts?: number;
  } = {}
): Promise<T> {
  const { interval = 1000, timeout = 30000, maxAttempts = 30 } = options;
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error('Polling timed out'));
    }, timeout);

    const intervalId = setInterval(async () => {
      attempts++;

      try {
        const result = await fn();

        if (condition(result)) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          resolve(result);
        } else if (attempts >= maxAttempts) {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
          reject(new Error('Max polling attempts reached'));
        }
      } catch (error) {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        reject(error);
      }
    }, interval);
  });
}

/**
 * 队列执行
 */
export class AsyncQueue {
  private queue: Array<() => Promise<any>> = [];
  private pending = false;
  private concurrency: number;
  private running = 0;

  constructor(concurrency: number = 1) {
    this.concurrency = concurrency;
  }

  add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.pending || this.running >= this.concurrency) {
      return;
    }

    this.pending = true;

    while (this.queue.length > 0 && this.running < this.concurrency) {
      const fn = this.queue.shift();
      if (fn) {
        this.running++;
        fn().finally(() => {
          this.running--;
          this.process();
        });
      }
    }

    this.pending = false;
  }

  clear(): void {
    this.queue = [];
  }

  size(): number {
    return this.queue.length;
  }

  getRunning(): number {
    return this.running;
  }
}

/**
 * 创建异步队列
 */
export function createAsyncQueue(concurrency: number = 1): AsyncQueue {
  return new AsyncQueue(concurrency);
}

/**
 * 所有 Promise 完成（不管成功失败）
 */
export async function allSettled<T>(
  promises: Promise<T>[]
): Promise<PromiseSettledResult<T>[]> {
  return Promise.allSettled(promises);
}

/**
 * 只返回成功的 Promise 结果
 */
export async function onlySuccessful<T>(
  promises: Promise<T>[]
): Promise<T[]> {
  const results = await Promise.allSettled(promises);

  return results
    .filter((result): result is PromiseFulfilledResult<T> => result.status === 'fulfilled')
    .map(result => result.value);
}

/**
 * 第一个完成的 Promise
 */
export async function first<T>(promises: Promise<T>[]): Promise<T> {
  return Promise.race(promises);
}

/**
 * 第一个成功的 Promise
 */
export async function firstSuccessful<T>(
  promises: Promise<T>[]
): Promise<T> {
  const errors: any[] = [];

  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      promise.then(resolve).catch(error => {
        errors.push(error);
        if (errors.length === promises.length) {
          reject(new Error('All promises failed', { cause: errors }));
        }
      });
    });
  });
}

/**
 * 延迟执行函数
 */
export function defer<T>(fn: () => T | Promise<T>): Promise<T> {
  return new Promise(resolve => {
    setTimeout(async () => {
      resolve(await fn());
    }, 0);
  });
}

/**
 * 异步互斥锁
 */
export class AsyncMutex {
  private locked = false;
  private queue: Array<() => void> = [];

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve?.();
    } else {
      this.locked = false;
    }
  }

  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

/**
 * 创建异步互斥锁
 */
export function createAsyncMutex(): AsyncMutex {
  return new AsyncMutex();
}
