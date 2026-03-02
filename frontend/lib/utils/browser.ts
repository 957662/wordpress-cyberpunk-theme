/**
 * Browser Utilities
 * 浏览器环境工具函数
 */

/**
 * 检测是否为浏览器环境
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * 检测是否为移动设备
 */
export function isMobile(): boolean {
  if (!isBrowser) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 检测是否为触摸设备
 */
export function isTouchDevice(): boolean {
  if (!isBrowser) return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 检测是否为 iOS 设备
 */
export function isIOS(): boolean {
  if (!isBrowser) return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * 检测是否为 Android 设备
 */
export function isAndroid(): boolean {
  if (!isBrowser) return false;
  return /Android/.test(navigator.userAgent);
}

/**
 * 检测是否为 Safari 浏览器
 */
export function isSafari(): boolean {
  if (!isBrowser) return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/**
 * 检测是否为 Chrome 浏览器
 */
export function isChrome(): boolean {
  if (!isBrowser) return false;
  return /Chrome/.test(navigator.userAgent) && !/Edge|OPR\//.test(navigator.userAgent);
}

/**
 * 检测是否为 Firefox 浏览器
 */
export function isFirefox(): boolean {
  if (!isBrowser) return false;
  return /Firefox/.test(navigator.userAgent);
}

/**
 * 检测是否为 Edge 浏览器
 */
export function isEdge(): boolean {
  if (!isBrowser) return false;
  return /Edge/.test(navigator.userAgent);
}

/**
 * 获取浏览器信息
 */
export function getBrowserInfo(): {
  name: string;
  version: string;
  os: string;
} {
  if (!isBrowser) {
    return { name: 'unknown', version: '0', os: 'unknown' };
  }

  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = '0';

  // 检测浏览器名称和版本
  if (/Chrome/.test(ua) && !/Edge|OPR\//.test(ua)) {
    name = 'Chrome';
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] || '0';
  } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
    name = 'Safari';
    version = ua.match(/Version\/([\d.]+)/)?.[1] || '0';
  } else if (/Firefox/.test(ua)) {
    name = 'Firefox';
    version = ua.match(/Firefox\/([\d.]+)/)?.[1] || '0';
  } else if (/Edge/.test(ua)) {
    name = 'Edge';
    version = ua.match(/Edge\/([\d.]+)/)?.[1] || '0';
  } else if (/OPR\//.test(ua)) {
    name = 'Opera';
    version = ua.match(/OPR\/([\d.]+)/)?.[1] || '0';
  }

  // 检测操作系统
  let os = 'unknown';
  if (isWindows()) {
    os = 'Windows';
  } else if (isMac()) {
    os = 'macOS';
  } else if (isIOS()) {
    os = 'iOS';
  } else if (isAndroid()) {
    os = 'Android';
  } else if (isLinux()) {
    os = 'Linux';
  }

  return { name, version, os };
}

/**
 * 检测是否为 Windows 系统
 */
export function isWindows(): boolean {
  if (!isBrowser) return false;
  return /Win/.test(navigator.platform);
}

/**
 * 检测是否为 Mac 系统
 */
export function isMac(): boolean {
  if (!isBrowser) return false;
  return /Mac/.test(navigator.platform);
}

/**
 * 检测是否为 Linux 系统
 */
export function isLinux(): boolean {
  if (!isBrowser) return false;
  return /Linux/.test(navigator.platform);
}

/**
 * 获取屏幕尺寸
 */
export function getScreenSize(): {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
} {
  if (!isBrowser) {
    return { width: 0, height: 0, availWidth: 0, availHeight: 0 };
  }

  return {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
  };
}

/**
 * 获取视口尺寸
 */
export function getViewportSize(): {
  width: number;
  height: number;
} {
  if (!isBrowser) {
    return { width: 0, height: 0 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * 获取设备像素比
 */
export function getDevicePixelRatio(): number {
  if (!isBrowser) return 1;
  return window.devicePixelRatio || 1;
}

/**
 * 获取屏幕方向
 */
export function getOrientation(): 'portrait' | 'landscape' {
  if (!isBrowser) return 'portrait';
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser) return false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 兼容旧浏览器
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch {
    return false;
  }
}

/**
 * 从剪贴板读取文本
 */
export async function readFromClipboard(): Promise<string | null> {
  if (!isBrowser) return null;

  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText();
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * 下载文件
 */
export function downloadFile(content: string | Blob, filename: string, mimeType?: string): void {
  if (!isBrowser) return;

  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 下载 URL 文件
 */
export function downloadUrl(url: string, filename?: string): void {
  if (!isBrowser) return;

  const link = document.createElement('a');
  link.href = url;
  if (filename) {
    link.download = filename;
  }
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 打印页面
 */
export function printPage(): void {
  if (!isBrowser) return;
  window.print();
}

/**
 * 全屏切换
 */
export function toggleFullScreen(): Promise<void> {
  if (!isBrowser) return Promise.resolve();

  if (!document.fullscreenElement) {
    return document.documentElement.requestFullscreen() as Promise<void>;
  } else {
    return document.exitFullscreen();
  }
}

/**
 * 检查是否为全屏
 */
export function isFullScreen(): boolean {
  if (!isBrowser) return false;
  return !!document.fullscreenElement;
}

/**
 * 获取用户语言
 */
export function getUserLanguage(): string {
  if (!isBrowser) return 'en';
  return navigator.language || 'en';
}

/**
 * 获取用户时区
 */
export function getUserTimezone(): string {
  if (!isBrowser) return 'UTC';
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

/**
 * 检查是否在线
 */
export function isOnline(): boolean {
  if (!isBrowser) return true;
  return navigator.onLine;
}

/**
 * 添加在线状态监听器
 */
export function addOnlineListener(callback: (online: boolean) => void): () => void {
  if (!isBrowser) return () => {};

  const handler = () => callback(navigator.onLine);
  window.addEventListener('online', handler);
  window.addEventListener('offline', handler);

  return () => {
    window.removeEventListener('online', handler);
    window.removeEventListener('offline', handler);
  };
}

/**
 * 获取网络连接信息
 */
export function getConnectionInfo(): {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
} {
  if (!isBrowser) return {};

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  if (!connection) return {};

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
}

/**
 * 检查是否为暗色模式
 */
export function isDarkMode(): boolean {
  if (!isBrowser) return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * 添加暗色模式监听器
 */
export function addDarkModeListener(callback: (isDark: boolean) => void): () => void {
  if (!isBrowser) return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  } else {
    // 兼容旧浏览器
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }
}

/**
 * 获取滚动位置
 */
export function getScrollPosition(): {
  x: number;
  y: number;
} {
  if (!isBrowser) return { x: 0, y: 0 };

  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  };
}

/**
 * 平滑滚动到指定位置
 */
export function scrollTo(x: number, y: number, behavior: ScrollBehavior = 'smooth'): void {
  if (!isBrowser) return;
  window.scrollTo({ left: x, top: y, behavior });
}

/**
 * 平滑滚动到元素
 */
export function scrollToElement(elementId: string, offset: number = 0): void {
  if (!isBrowser) return;

  const element = document.getElementById(elementId);
  if (element) {
    const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
    scrollTo(0, y);
  }
}

/**
 * 获取 Cookie 值
 */
export function getCookie(name: string): string | undefined {
  if (!isBrowser) return undefined;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

/**
 * 设置 Cookie
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    expires?: Date | number;
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void {
  if (!isBrowser) return;

  let cookie = `${name}=${value}`;

  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 1000);
      cookie += `; expires=${date.toUTCString()}`;
    } else {
      cookie += `; expires=${options.expires.toUTCString()}`;
    }
  }

  if (options.maxAge) {
    cookie += `; max-age=${options.maxAge}`;
  }

  if (options.domain) {
    cookie += `; domain=${options.domain}`;
  }

  if (options.path) {
    cookie += `; path=${options.path}`;
  }

  if (options.secure) {
    cookie += '; secure';
  }

  if (options.sameSite) {
    cookie += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookie;
}

/**
 * 删除 Cookie
 */
export function deleteCookie(name: string, options?: { domain?: string; path?: string }): void {
  if (!isBrowser) return;
  setCookie(name, '', { ...options, expires: -1 });
}

/**
 * 清除所有 Cookie
 */
export function clearAllCookies(): void {
  if (!isBrowser) return;

  const cookies = document.cookie.split(';');
  cookies.forEach((cookie) => {
    const name = cookie.split('=')[0]?.trim();
    if (name) {
      deleteCookie(name);
    }
  });
}

/**
 * 获取本地存储
 */
export function getLocalStorage<T = any>(key: string): T | null {
  if (!isBrowser) return null;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

/**
 * 设置本地存储
 */
export function setLocalStorage<T = any>(key: string, value: T): boolean {
  if (!isBrowser) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * 删除本地存储
 */
export function removeLocalStorage(key: string): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
}

/**
 * 清空本地存储
 */
export function clearLocalStorage(): void {
  if (!isBrowser) return;
  window.localStorage.clear();
}

/**
 * 获取会话存储
 */
export function getSessionStorage<T = any>(key: string): T | null {
  if (!isBrowser) return null;

  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

/**
 * 设置会话存储
 */
export function setSessionStorage<T = any>(key: string, value: T): boolean {
  if (!isBrowser) return false;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * 删除会话存储
 */
export function removeSessionStorage(key: string): void {
  if (!isBrowser) return;
  window.sessionStorage.removeItem(key);
}

/**
 * 清空会话存储
 */
export function clearSessionStorage(): void {
  if (!isBrowser) return;
  window.sessionStorage.clear();
}
