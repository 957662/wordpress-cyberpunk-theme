/**
 * 增强型库导出
 * 集中导出所有工具函数和工具类
 */

// 工具函数
export * from './utils/cn';
export * from './utils/date';

// Hooks
export * from './hooks/useInView';
export * from './hooks/useScrollDirection';
export * from './hooks/useOnClickOutside';
export * from './hooks/useAsync';

// API 客户端
export { apiClient, EnhancedApiClient } from './api/enhanced-client';

// 配置
export * from './config/theme';

// 常量
export const CONSTANTS = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  CDN_URL: process.env.NEXT_PUBLIC_CDN_URL || '',
  SITE_NAME: 'CyberPress',
  SITE_DESCRIPTION: 'Cyberpunk Blog Platform',
  DEFAULT_LOCALE: 'zh-CN',

  // 分页配置
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // 上传配置
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

  // 缓存配置
  DEFAULT_CACHE_DURATION: 60000, // 1分钟
  LONG_CACHE_DURATION: 3600000, // 1小时

  // 动画配置
  ANIMATION_DURATION: 300,
  TRANSITION_DURATION: 200,

  // 主题配置
  THEME_STORAGE_KEY: 'cyberpress-theme',
  AUTH_STORAGE_KEY: 'cyberpress-auth',
};

// 环境判断
export const isClient = typeof window !== 'undefined';
export const isServer = typeof window === 'undefined';
export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';

// 性能监控
export const performance = {
  mark: (name: string) => {
    if (isClient && window.performance) {
      window.performance.mark(name);
    }
  },

  measure: (name: string, startMark: string, endMark: string) => {
    if (isClient && window.performance) {
      window.performance.measure(name, startMark, endMark);
    }
  },

  getMeasurements: () => {
    if (isClient && window.performance) {
      return window.performance.getEntriesByType('measure');
    }
    return [];
  },
};

// 调试工具
export const debug = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log('[CyberPress]', ...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDev) {
      console.warn('[CyberPress]', ...args);
    }
  },

  error: (...args: any[]) => {
    if (isDev) {
      console.error('[CyberPress]', ...args);
    }
  },

  group: (label: string) => {
    if (isDev) {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  },
};

// 错误处理
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('未知错误');
}

// 延迟工具
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 重试工具
export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; delay?: number } = {}
): Promise<T> {
  const { retries = 3, delay: retryDelay = 1000 } = options;

  let lastError: Error;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        await delay(retryDelay * (i + 1));
      }
    }
  }

  throw lastError!;
}

// 批处理工具
export async function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}

// 并发控制
export async function withConcurrency<T>(
  tasks: Array<() => Promise<T>>,
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const task of tasks) {
    const promise = task().then((result) => {
      results.push(result);
      // 从 executing 数组中移除已完成的 promise
      executing.splice(executing.indexOf(promise), 1);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

// 本地存储工具
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (!isClient) return defaultValue ?? null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch {
      return defaultValue ?? null;
    }
  },

  set: (key: string, value: any): void => {
    if (!isClient) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      debug.error('Failed to save to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    if (!isClient) return;

    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (!isClient) return;

    localStorage.clear();
  },
};

// Session Storage 工具
export const session = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (!isClient) return defaultValue ?? null;

    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch {
      return defaultValue ?? null;
    }
  },

  set: (key: string, value: any): void => {
    if (!isClient) return;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      debug.error('Failed to save to sessionStorage:', error);
    }
  },

  remove: (key: string): void => {
    if (!isClient) return;

    sessionStorage.removeItem(key);
  },

  clear: (): void => {
    if (!isClient) return;

    sessionStorage.clear();
  },
};

// Cookie 工具
export const cookies = {
  get: (name: string): string | undefined => {
    if (!isClient) return undefined;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  },

  set: (name: string, value: string, days = 7): void => {
    if (!isClient) return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  },

  remove: (name: string): void => {
    if (!isClient) return;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  },
};
