/**
 * 通知服务
 * 统一的消息通知管理
 */

import { toast } from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'loading' | 'warning' | 'info';
export type NotificationPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface NotificationOptions {
  duration?: number;
  position?: NotificationPosition;
  icon?: string;
  style?: React.CSSProperties;
  className?: string;
}

class NotificationService {
  /**
   * 成功通知
   */
  success(message: string, options?: NotificationOptions): string {
    return toast.success(message, {
      duration: options?.duration || 3000,
      position: (options?.position || 'top-center') as any,
      className: `cyber-toast-success ${options?.className || ''}`,
      style: options?.style,
      iconTheme: {
        primary: '#00ff88',
        secondary: '#0a0a0f',
      },
    });
  }

  /**
   * 错误通知
   */
  error(message: string, options?: NotificationOptions): string {
    return toast.error(message, {
      duration: options?.duration || 4000,
      position: (options?.position || 'top-center') as any,
      className: `cyber-toast-error ${options?.className || ''}`,
      style: options?.style,
      iconTheme: {
        primary: '#ff0080',
        secondary: '#0a0a0f',
      },
    });
  }

  /**
   * 加载通知
   */
  loading(message: string, options?: NotificationOptions): string {
    return toast.loading(message, {
      position: (options?.position || 'top-center') as any,
      className: `cyber-toast-loading ${options?.className || ''}`,
      style: options?.style,
    });
  }

  /**
   * 警告通知
   */
  warning(message: string, options?: NotificationOptions): string {
    return toast(message, {
      duration: options?.duration || 3000,
      position: (options?.position || 'top-center') as any,
      className: `cyber-toast-warning ${options?.className || ''}`,
      style: {
        ...options?.style,
        borderLeft: '4px solid #f0ff00',
      },
      icon: '⚠️',
    });
  }

  /**
   * 信息通知
   */
  info(message: string, options?: NotificationOptions): string {
    return toast(message, {
      duration: options?.duration || 3000,
      position: (options?.position || 'top-center') as any,
      className: `cyber-toast-info ${options?.className || ''}`,
      style: {
        ...options?.style,
        borderLeft: '4px solid #00f0ff',
      },
      icon: 'ℹ️',
    });
  }

  /**
   * Promise 通知 - 自动处理加载、成功、失败
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
    return toast.promise(promise, messages, {
      position: (options?.position || 'top-center') as any,
      className: options?.className,
      style: options?.style,
      loading: {
        duration: Infinity,
      },
      success: {
        duration: options?.duration || 3000,
        iconTheme: {
          primary: '#00ff88',
          secondary: '#0a0a0f',
        },
      },
      error: {
        duration: options?.duration || 4000,
        iconTheme: {
          primary: '#ff0080',
          secondary: '#0a0a0f',
        },
      },
    });
  }

  /**
   * 自定义通知
   */
  custom(message: string, options?: NotificationOptions): string {
    return toast(message, {
      duration: options?.duration || 3000,
      position: (options?.position || 'top-center') as any,
      className: options?.className,
      style: options?.style,
      icon: options?.icon,
    });
  }

  /**
   * 更新通知
   */
  update(
    toastId: string,
    message: string,
    type: NotificationType,
    options?: NotificationOptions
  ): void {
    toast.loading(message, {
      id: toastId,
      ...options,
    });
  }

  /**
   * 关闭通知
   */
  dismiss(toastId?: string): void {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }

  /**
   * 移除所有通知
   */
  removeAll(): void {
    toast.remove();
  }
}

// 导出单例
export const notificationService = new NotificationService();

// 快捷方法
export const notify = {
  success: (message: string, options?: NotificationOptions) =>
    notificationService.success(message, options),
  error: (message: string, options?: NotificationOptions) =>
    notificationService.error(message, options),
  loading: (message: string, options?: NotificationOptions) =>
    notificationService.loading(message, options),
  warning: (message: string, options?: NotificationOptions) =>
    notificationService.warning(message, options),
  info: (message: string, options?: NotificationOptions) =>
    notificationService.info(message, options),
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: NotificationOptions
  ) => notificationService.promise(promise, messages, options),
  dismiss: (toastId?: string) => notificationService.dismiss(toastId),
  removeAll: () => notificationService.removeAll(),
};

export default notificationService;
