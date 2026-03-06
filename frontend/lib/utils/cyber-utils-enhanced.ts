// ============================================
// CyberPress Platform - 增强版实用工具函数库
// ============================================
// 版本: 2.0.0
// 描述: 常用的工具函数集合 - 增强版
// ============================================

// ============================================
// 性能优化工具
// ============================================

/**
 * 高性能防抖
 */
export const debounceEnhanced = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  let result: any;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) result = func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) result = func(...args);

    return result;
  };
};

/**
 * 高性能节流
 */
export const throttleEnhanced = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Parameters<T>) => void) => {
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const { leading = true, trailing = true } = options;

    if (!lastRan) {
      if (leading) {
        func(...args);
        lastRan = Date.now();
      }
    } else {
      clearTimeout(lastFunc!);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan!) >= limit) {
          if (trailing) func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan!));
    }
  };
};

/**
 * RequestAnimationFrame 节流
 */
export const throttleRAF = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => void) => {
  let ticking = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
};

// ============================================
// 缓存工具
// ============================================

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl?: number;
}

class EnhancedCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTL = 60000) {
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
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

  clean(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.ttl && now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  get size(): number {
    return this.cache.size;
  }
}

export const createCache = (defaultTTL?: number) => new EnhancedCache(defaultTTL);

// ============================================
// 异步工具
// ============================================

/**
 * 异步重试
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> => {
  const { retries = 3, delay = 1000, backoff = 2, onRetry } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < retries) {
        onRetry?.(lastError, attempt);
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(backoff, attempt)));
      }
    }
  }

  throw lastError!;
};

/**
 * 并发控制
 */
export const asyncPool = async <T, R>(
  poolLimit: number,
  array: T[],
  iteratorFn: (item: T, array: T[]) => Promise<R>
): Promise<R[]> => {
  const ret: R[] = [];
  const executing: Promise<any>[] = [];

  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e: Promise<any> = p.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);

      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(ret);
};

/**
 * 批处理
 */
export const batch = async <T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> => {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
  }

  return results;
};

// ============================================
// DOM 工具
// ============================================

/**
 * 等待元素出现
 */
export const waitForElement = (
  selector: string,
  timeout = 5000
): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
};

/**
 * 检测元素是否在视口中
 */
export const isInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * 平滑滚动到元素
 */
export const scrollToElement = (
  element: Element,
  options: ScrollIntoOptions = { behavior: 'smooth' }
): void => {
  element.scrollIntoView(options);
};

/**
 * 全屏切换
 */
export const toggleFullScreen = async (): Promise<boolean> => {
  if (!document.fullscreenElement) {
    try {
      await document.documentElement.requestFullscreen();
      return true;
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
      return false;
    }
  } else {
    try {
      await document.exitFullscreen();
      return false;
    } catch (err) {
      console.error('Failed to exit fullscreen:', err);
      return true;
    }
  }
};

// ============================================
// 类型守卫
// ============================================

/**
 * 检查是否为 null 或 undefined
 */
export const isNullOrUndefined = (value: any): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * 检查是否为空对象
 */
export const isEmptyObject = (obj: any): boolean => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * 检查是否为空数组
 */
export const isEmptyArray = (arr: any): boolean => {
  return Array.isArray(arr) && arr.length === 0;
};

/**
 * 检查是否为空值
 */
export const isEmpty = (value: any): boolean => {
  if (isNullOrUndefined(value)) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// ============================================
// 事件处理工具
// ============================================

/**
 * 阻止事件冒泡
 */
export const stopPropagation = (e: React.SyntheticEvent | Event): void => {
  e.stopPropagation();
};

/**
 * 阻止默认行为
 */
export const preventDefault = (e: React.SyntheticEvent | Event): void => {
  e.preventDefault();
};

/**
 * 阻止事件冒泡和默认行为
 */
export const stopEvent = (e: React.SyntheticEvent | Event): void => {
  e.stopPropagation();
  e.preventDefault();
};

// ============================================
// 样式工具
// ============================================

/**
 * 合并 className
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * 条件 className
 */
export const conditionalClass = (
  condition: boolean,
  className: string
): string | undefined => {
  return condition ? className : undefined;
};

// ============================================
// 数字格式化
// ============================================

/**
 * 格式化百分比
 */
export const formatPercent = (value: number, decimals = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * 格式化货币
 */
export const formatCurrency = (
  value: number,
  currency = 'CNY',
  locale = 'zh-CN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * 简化数字（如：1.2k, 1.5M）
 */
export const simplifyNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'G';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// ============================================
// URL 工具
// ============================================

/**
 * 构建 URL 查询字符串
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

/**
 * 解析 URL 查询字符串
 */
export const parseQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * 更新 URL 参数
 */
export const updateURLParams = (params: Record<string, any>): void => {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  });
  window.history.replaceState({}, '', url.toString());
};

// ============================================
// 导出所有工具
// ============================================

export const cyberUtilsEnhanced = {
  // 性能工具
  debounceEnhanced,
  throttleEnhanced,
  throttleRAF,

  // 缓存工具
  createCache,

  // 异步工具
  retry,
  asyncPool,
  batch,

  // DOM 工具
  waitForElement,
  isInViewport,
  scrollToElement,
  toggleFullScreen,

  // 类型守卫
  isNullOrUndefined,
  isEmptyObject,
  isEmptyArray,
  isEmpty,

  // 事件工具
  stopPropagation,
  preventDefault,
  stopEvent,

  // 样式工具
  cn,
  conditionalClass,

  // 数字格式化
  formatPercent,
  formatCurrency,
  simplifyNumber,

  // URL 工具
  buildQueryString,
  parseQueryString,
  updateURLParams,
};

export default cyberUtilsEnhanced;
