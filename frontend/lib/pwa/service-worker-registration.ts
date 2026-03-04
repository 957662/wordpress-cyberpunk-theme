/**
 * PWA Service Worker 注册管理
 * CyberPress Platform
 */

export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

export interface PushSubscriptionOptions {
  userVisibleOnly: boolean;
  applicationServerKey: Uint8Array;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig = {};

  /**
   * 注册 Service Worker
   */
  async register(config: ServiceWorkerConfig = {}): Promise<boolean> {
    this.config = config;

    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('Service Worker is not supported in this environment');
      return false;
    }

    try {
      // 获取 public/sw.js 的路径
      const publicUrl = new URL('/sw.js', window.location.href);

      // 检查是否在同一源下
      if (publicUrl.origin !== window.location.origin) {
        console.warn('Service worker is not from the same origin');
        return false;
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none',
      });

      this.registration = registration;

      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 新的 Service Worker 已安装并激活
              if (this.config.onUpdate) {
                this.config.onUpdate(registration);
              }
            } else if (newWorker.state === 'activated') {
              // Service Worker 首次安装成功
              if (this.config.onSuccess) {
                this.config.onSuccess(registration);
              }
            }
          });
        }
      });

      // 检查并等待 Service Worker 激活
      if (registration.active) {
        console.log('Service Worker is already active');
        if (this.config.onSuccess) {
          this.config.onSuccess(registration);
        }
      }

      // 定期检查更新（每小时）
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      console.log('Service Worker registered successfully:', registration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      if (this.config.onError) {
        this.config.onError(error as Error);
      }
      return false;
    }
  }

  /**
   * 获取 Service Worker 注册实例
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  /**
   * 等待 Service Worker 就绪
   */
  async ready(): Promise<ServiceWorkerRegistration | null> {
    if (this.registration) {
      return this.registration;
    }

    if (!('serviceWorker' in navigator)) {
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
      return this.registration;
    } catch (error) {
      console.error('Service Worker ready failed:', error);
      return null;
    }
  }

  /**
   * 手动检查更新
   */
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) {
      console.warn('Service Worker is not registered');
      return false;
    }

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('Service Worker update check failed:', error);
      return false;
    }
  }

  /**
   * 跳过等待，立即激活新的 Service Worker
   */
  async skipWaiting(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      console.warn('No waiting Service Worker found');
      return;
    }

    // 发送消息给等待中的 Service Worker
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // 等待新的 Service Worker 激活
    await new Promise((resolve) => {
      const newWorker = this.registration!.waiting;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            resolve(null);
          }
        });
      }
    });

    // 重新加载页面
    window.location.reload();
  }

  /**
   * 订阅推送通知
   */
  async subscribeToPush(
    options: PushSubscriptionOptions
  ): Promise<PushSubscription | null> {
    const registration = await this.ready();
    if (!registration) {
      console.warn('Service Worker is not ready');
      return null;
    }

    try {
      const subscription = await registration.pushManager.subscribe(options);
      console.log('Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }

  /**
   * 获取当前推送订阅
   */
  async getPushSubscription(): Promise<PushSubscription | null> {
    const registration = await this.ready();
    if (!registration) {
      return null;
    }

    try {
      return await registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Get push subscription failed:', error);
      return null;
    }
  }

  /**
   * 取消推送订阅
   */
  async unsubscribeFromPush(): Promise<boolean> {
    const subscription = await this.getPushSubscription();
    if (!subscription) {
      console.warn('No push subscription found');
      return false;
    }

    try {
      await subscription.unsubscribe();
      console.log('Push unsubscription successful');
      return true;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  }

  /**
   * 发送消息给 Service Worker
   */
  async sendMessage(message: any): Promise<void> {
    if (!this.registration || !this.registration.active) {
      console.warn('No active Service Worker found');
      return;
    }

    this.registration.active.postMessage(message);
  }

  /**
   * 获取所有已注册的 Service Worker
   */
  async getRegistrations(): Promise<ServiceWorkerRegistration[]> {
    if (!('serviceWorker' in navigator)) {
      return [];
    }

    try {
      return await navigator.serviceWorker.getRegistrations();
    } catch (error) {
      console.error('Get registrations failed:', error);
      return [];
    }
  }

  /**
   * 注销所有 Service Worker
   */
  async unregisterAll(): Promise<boolean> {
    const registrations = await this.getRegistrations();

    for (const registration of registrations) {
      try {
        await registration.unregister();
        console.log('Service Worker unregistered:', registration);
      } catch (error) {
        console.error('Service Worker unregistration failed:', error);
        return false;
      }
    }

    this.registration = null;
    return true;
  }

  /**
   * 检查是否有待处理的更新
   */
  hasUpdate(): boolean {
    return this.registration?.waiting !== undefined;
  }
}

export const serviceWorkerManager = new ServiceWorkerManager();

/**
 * 注册 Service Worker 的便捷函数
 */
export async function registerServiceWorker(config: ServiceWorkerConfig = {}): Promise<boolean> {
  return serviceWorkerManager.register(config);
}
