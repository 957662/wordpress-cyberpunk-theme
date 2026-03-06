/**
 * PWA (Progressive Web App) 工具函数
 */

/**
 * 检查是否为 PWA 环境
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * 检查是否支持安装提示
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  // 检查是否在支持的浏览器中
  return 'beforeinstallprompt' in window;
}

/**
 * 注册 Service Worker
 */
export async function registerServiceWorker(
  scriptURL: string = '/sw.js'
): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(scriptURL, {
      scope: '/',
    });
    
    console.log('Service Worker 注册成功:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker 注册失败:', error);
    return null;
  }
}

/**
 * 等待 Service Worker 准备就绪
 */
export async function waitForServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return registration;
  } catch (error) {
    console.error('Service Worker 未准备就绪:', error);
    return null;
  }
}

/**
 * 获取 Service Worker 版本信息
 */
export async function getServiceWorkerVersion(): Promise<string | null> {
  const registration = await waitForServiceWorker();
  
  if (!registration?.active) {
    return null;
  }

  try {
    // 尝试从 Service Worker 获取版本信息
    const worker = registration.active as any;
    return worker.scriptURL || null;
  } catch {
    return null;
  }
}

/**
 * 更新 Service Worker
 */
export async function updateServiceWorker(): Promise<boolean> {
  const registration = await waitForServiceWorker();
  
  if (!registration) {
    return false;
  }

  try {
    await registration.update();
    return true;
  } catch (error) {
    console.error('Service Worker 更新失败:', error);
    return false;
  }
}

/**
 * 跳过等待并激活新的 Service Worker
 */
export async function skipWaiting(): Promise<boolean> {
  const registration = await waitForServiceWorker();
  
  if (!registration?.waiting) {
    return false;
  }

  try {
    // 发送消息给等待中的 Service Worker
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    return true;
  } catch (error) {
    console.error('跳过等待失败:', error);
    return false;
  }
}

/**
 * 显示安装提示
 */
export async function showInstallPrompt(
  event: Event
): Promise<boolean> {
  const promptEvent = event as any;
  
  if (!promptEvent || !promptEvent.prompt) {
    return false;
  }

  try {
    // 显示安装提示
    await promptEvent.prompt();
    
    // 等待用户响应
    const { outcome } = await promptEvent.userChoice;
    
    return outcome === 'accepted';
  } catch (error) {
    console.error('显示安装提示失败:', error);
    return false;
  }
}

/**
 * 获取应用安装状态
 */
export function getInstallState(): 'installed' | 'installable' | 'unsupported' {
  if (typeof window === 'undefined') {
    return 'unsupported';
  }

  if (isPWA()) {
    return 'installed';
  }

  if (canInstallPWA()) {
    return 'installable';
  }

  return 'unsupported';
}

/**
 * 监听安装事件
 */
export function listenForInstallPrompt(
  callback: (event: Event) => void
): (() => void) | null {
  if (typeof window === 'undefined' || !canInstallPWA()) {
    return null;
  }

  window.addEventListener('beforeinstallprompt', callback);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('beforeinstallprompt', callback);
  };
}

/**
 * 监听应用安装成功事件
 */
export function listenForAppInstalled(
  callback: () => void
): (() => void) | null {
  if (typeof window === 'undefined') {
    return null;
  }

  window.addEventListener('appinstalled', callback);
  
  // 返回清理函数
  return () => {
    window.removeEventListener('appinstalled', callback);
  };
}

/**
 * 清除应用缓存
 */
export async function clearAppCache(): Promise<boolean> {
  const registration = await waitForServiceWorker();
  
  if (!registration) {
    return false;
  }

  try {
    // 清除所有缓存
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    
    return true;
  } catch (error) {
    console.error('清除缓存失败:', error);
    return false;
  }
}

/**
 * 获取缓存大小
 */
export async function getCacheSize(): Promise<number> {
  try {
    const cacheNames = await caches.keys();
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('获取缓存大小失败:', error);
    return 0;
  }
}

/**
 * 预缓存关键资源
 */
export async function precacheResources(
  urls: string[]
): Promise<boolean> {
  const registration = await waitForServiceWorker();
  
  if (!registration) {
    return false;
  }

  try {
    const cache = await caches.open('precache-v1');
    await cache.addAll(urls);
    return true;
  } catch (error) {
    console.error('预缓存失败:', error);
    return false;
  }
}

/**
 * 检查网络连接状态
 */
export function getNetworkStatus(): {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
} {
  if (typeof window === 'undefined' || !('navigator' in window)) {
    return { online: true };
  }

  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
  };
}

/**
 * 监听网络状态变化
 */
export function listenForNetworkChanges(
  callback: (online: boolean) => void
): (() => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return 'denied';
}

/**
 * 显示本地通知
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<Notification | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  if (Notification.permission !== 'granted') {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return null;
    }
  }

  try {
    return new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      ...options,
    });
  } catch (error) {
    console.error('显示通知失败:', error);
    return null;
  }
}
