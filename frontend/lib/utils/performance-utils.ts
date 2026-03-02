/**
 * 性能优化工具函数
 * 用于提升应用性能和用户体验
 */

import { useCallback, useEffect, useRef } from 'react';

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
 * 深度比较对象
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== 'object') return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * 懒加载图片
 */
export function lazyLoadImage(imgElement: HTMLImageElement, src: string): void {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        imgElement.src = src;
        imgElement.classList.add('loaded');
        observer.unobserve(imgElement);
      }
    });
  });

  observer.observe(imgElement);
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

/**
 * 批量预加载图片
 */
export async function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  const promises = srcs.map((src) => preloadImage(src));
  return Promise.all(promises);
}

/**
 * 请求动画节流
 */
export function rafThrottle<T extends (...args: any[]) => any>(callback: T): T {
  let requestId: number | null = null;

  return ((...args: Parameters<T>) => {
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
    }

    requestId = requestAnimationFrame(() => {
      callback(...args);
      requestId = null;
    });
  }) as T;
}

/**
 * 检测元素是否在视口中
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
 * 平滑滚动到元素
 */
export function scrollToElement(
  element: HTMLElement,
  offset: number = 0,
  behavior: ScrollBehavior = 'smooth'
): void {
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior
  });
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      return true;
    } catch (err) {
      textArea.remove();
      return false;
    }
  }
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 格式化持续时间
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 生成唯一 ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 本地存储封装
 */
export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return defaultValue ?? null;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Error writing to localStorage:', err);
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error('Error removing from localStorage:', err);
      return false;
    }
  },

  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.error('Error clearing localStorage:', err);
      return false;
    }
  }
};

/**
 * 会话存储封装
 */
export const sessionStorage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch (err) {
      console.error('Error reading from sessionStorage:', err);
      return defaultValue ?? null;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error('Error writing to sessionStorage:', err);
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      window.sessionStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error('Error removing from sessionStorage:', err);
      return false;
    }
  }
};

/**
 * 性能监控
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string): number {
    const start = this.marks.get(startMark);
    if (!start) {
      console.warn(`Mark "${startMark}" not found`);
      return 0;
    }

    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const duration = performance.now() - start;
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }
  }
}

/**
 * Hook: 使用防抖
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
}

/**
 * Hook: 使用节流
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, delay]
  ) as T;
}

/**
 * Hook: 使用本地存储
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    return storage.get(key, initialValue);
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    storage.set(key, value);
  };

  return [storedValue, setValue];
}
