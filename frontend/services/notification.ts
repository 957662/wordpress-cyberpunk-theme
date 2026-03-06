/**
 * 通知服务
 * 管理应用内通知和推送通知
 */

import toast, { ToastOptions, ToastPosition } from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'loading' | 'warning' | 'info';

export interface NotificationOptions extends ToastOptions {
  type?: NotificationType;
  title?: string;
  duration?: number;
  position?: ToastPosition;
}

class NotificationService {
  private defaultOptions: NotificationOptions = {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#1a1a2e',
      color: '#fff',
      border: '1px solid rgba(0, 240, 255, 0.2)',
      borderRadius: '8px',
      padding: '16px'
    }
  };

  /**
   * 显示成功通知
   */
  success(message: string, options?: NotificationOptions) {
    return toast.success(message, {
      ...this.defaultOptions,
      ...options,
      style: {
        ...this.defaultOptions.style,
        border: '1px solid rgba(0, 255, 136, 0.3)'
      }
    });
  }

  /**
   * 显示错误通知
   */
  error(message: string, options?: NotificationOptions) {
    return toast.error(message, {
      ...this.defaultOptions,
      ...options,
      duration: 6000,
      style: {
        ...this.defaultOptions.style,
        border: '1px solid rgba(255, 0, 128, 0.3)'
      }
    });
  }

  /**
   * 显示加载通知
   */
  loading(message: string, options?: NotificationOptions) {
    return toast.loading(message, {
      ...this.defaultOptions,
      ...options
    });
  }

  /**
   * 显示警告通知
   */
  warning(message: string, options?: NotificationOptions) {
    return toast(message, {
      ...this.defaultOptions,
      ...options,
      icon: '⚠️',
      style: {
        ...this.defaultOptions.style,
        border: '1px solid rgba(240, 255, 0, 0.3)'
      }
    });
  }

  /**
   * 显示信息通知
   */
  info(message: string, options?: NotificationOptions) {
    return toast(message, {
      ...this.defaultOptions,
      ...options,
      icon: 'ℹ️',
      style: {
        ...this.defaultOptions.style,
        border: '1px solid rgba(0, 240, 255, 0.2)'
      }
    });
  }

  /**
   * 自定义通知
   */
  custom(message: string, options?: NotificationOptions) {
    return toast(message, {
      ...this.defaultOptions,
      ...options
    });
  }

  /**
   * Promise 通知（自动处理加载和结果）
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: NotificationOptions
  ): Promise<T> {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error
      },
      {
        ...this.defaultOptions,
        ...options
      }
    );
  }

  /**
   * 关闭通知
   */
  dismiss(toastId?: string) {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  /**
   * 请求通知权限
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  /**
   * 显示系统通知（浏览器推送通知）
   */
  async showSystemNotification(title: string, options?: NotificationOptions & {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
  }) {
    const permission = await this.requestPermission();

    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
      // 使用 Service Worker 显示通知
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body: options?.body,
        icon: options?.icon || '/icons/icon-192x192.png',
        badge: options?.badge || '/icons/badge-72x72.png',
        tag: options?.tag,
        data: options?.data
      });
    } else if ('Notification' in window) {
      // 使用原生 Notification API
      new Notification(title, {
        body: options?.body,
        icon: options?.icon,
        tag: options?.tag
      });
    }
  }
}

// 单例实例
export const notification = new NotificationService();

// 导出便捷方法
export const notify = {
  success: (message: string, options?: NotificationOptions) => notification.success(message, options),
  error: (message: string, options?: NotificationOptions) => notification.error(message, options),
  loading: (message: string, options?: NotificationOptions) => notification.loading(message, options),
  warning: (message: string, options?: NotificationOptions) => notification.warning(message, options),
  info: (message: string, options?: NotificationOptions) => notification.info(message, options),
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: NotificationOptions
  ) => notification.promise(promise, messages, options),
  dismiss: (toastId?: string) => notification.dismiss(toastId)
};

export default notification;
