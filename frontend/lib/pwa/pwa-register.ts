/**
 * PWA Registration and Management
 * Handles service worker registration, updates, and PWA features
 */

export interface PWAConfig {
  swPath?: string;
  scope?: string;
  updateInterval?: number;
  enableNotifications?: boolean;
  enablePush?: boolean;
}

export interface SWUpdateAvailableEvent extends CustomEvent {
  detail: {
    registration: ServiceWorkerRegistration;
    waiting: ServiceWorker;
  };
}

export class PWAManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateInterval: number;
  private updateTimer: NodeJS.Timeout | null = null;
  private config: Required<PWAConfig>;

  constructor(config: PWAConfig = {}) {
    this.config = {
      swPath: config.swPath || '/sw.js',
      scope: config.scope || '/',
      updateInterval: config.updateInterval || 60 * 60 * 1000, // 1 hour
      enableNotifications: config.enableNotifications ?? true,
      enablePush: config.enablePush ?? false,
    };
    this.updateInterval = this.config.updateInterval;
  }

  /**
   * Register the service worker
   */
  async register(): Promise<boolean> {
    if (typeof window === 'undefined') {
      return false;
    }

    if (!('serviceWorker' in navigator)) {
      console.warn('[PWA] Service workers are not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register(
        this.config.swPath,
        { scope: this.config.scope }
      );

      console.log('[PWA] Service worker registered successfully');

      // Handle updates
      this.setupUpdateListener();

      // Start periodic update checks
      this.startUpdateChecks();

      // Setup push notifications if enabled
      if (this.config.enablePush) {
        await this.setupPushNotifications();
      }

      return true;
    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
      return false;
    }
  }

  /**
   * Setup listener for service worker updates
   */
  private setupUpdateListener(): void {
    if (!this.registration) return;

    // Listen for waiting service worker
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;

      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version available
          const event = new CustomEvent('sw-update-available', {
            detail: {
              registration: this.registration,
              waiting: newWorker,
            },
          } as any);

          window.dispatchEvent(event);
        }
      });
    });
  }

  /**
   * Start periodic update checks
   */
  private startUpdateChecks(): void {
    this.updateTimer = setInterval(() => {
      this.checkForUpdates();
    }, this.updateInterval);
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      await this.registration.update();
      return true;
    } catch (error) {
      console.error('[PWA] Update check failed:', error);
      return false;
    }
  }

  /**
   * Skip waiting and activate new service worker
   */
  async activateUpdate(): Promise<void> {
    if (!this.registration || !this.registration.waiting) {
      return;
    }

    // Send message to waiting service worker
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload page
    window.location.reload();
  }

  /**
   * Setup push notifications
   */
  async setupPushNotifications(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('[PWA] Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(serverKey: string): Promise<PushSubscription | null> {
    if (!this.registration) return null;

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(serverKey),
      });

      return subscription;
    } catch (error) {
      console.error('[PWA] Push subscription failed:', error);
      return null;
    }
  }

  /**
   * Show local notification
   */
  async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    if (this.registration) {
      await this.registration.showNotification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options,
      });
    } else {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options,
      });
    }
  }

  /**
   * Get app installation status
   */
  async isInstalled(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // Check if running as standalone PWA
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  }

  /**
   * Prompt for PWA installation (if available)
   */
  async promptInstall(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const event = (window as any).deferredPrompt;

    if (!event) {
      console.warn('[PWA] No installation prompt available');
      return false;
    }

    try {
      event.prompt();
      const { outcome } = await event.userChoice;
      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Installation prompt failed:', error);
      return false;
    }
  }

  /**
   * Get network status
   */
  getNetworkStatus(): {
    online: boolean;
    effectiveType: string;
    downlink: number;
    rtt: number;
  } {
    if (typeof window === 'undefined' || !('navigator' in window)) {
      return {
        online: true,
        effectiveType: '4g',
        downlink: 10,
        rtt: 0,
      };
    }

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      rtt: connection?.rtt || 0,
    };
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<boolean> {
    if (!('caches' in window)) return false;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      return true;
    } catch (error) {
      console.error('[PWA] Clear caches failed:', error);
      return false;
    }
  }

  /**
   * Get cache size estimate
   */
  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

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
      console.error('[PWA] Get cache size failed:', error);
      return 0;
    }
  }

  /**
   * Unregister service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      await this.registration.unregister();
      this.registration = null;

      if (this.updateTimer) {
        clearInterval(this.updateTimer);
        this.updateTimer = null;
      }

      return true;
    } catch (error) {
      console.error('[PWA] Unregister failed:', error);
      return false;
    }
  }

  /**
   * Convert URL base64 to Uint8Array for push subscription
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

// Create singleton instance
let pwaManager: PWAManager | null = null;

export function getPWAManager(config?: PWAConfig): PWAManager {
  if (!pwaManager) {
    pwaManager = new PWAManager(config);
  }
  return pwaManager;
}

export default PWAManager;
