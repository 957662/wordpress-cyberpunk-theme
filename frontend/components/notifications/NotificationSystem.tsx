'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, XCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationSystemProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
  className?: string;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-400',
    textColor: 'text-green-400'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-400',
    textColor: 'text-red-400'
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    textColor: 'text-yellow-400'
  },
  info: {
    icon: Info,
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
    textColor: 'text-cyan-400'
  }
};

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
};

// 全局通知管理器
class NotificationManager {
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private notifications: Notification[] = [];

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  add(notification: Omit<Notification, 'id'>) {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };
    this.notifications.push(newNotification);
    this.notify();

    if (notification.duration !== 0) {
      setTimeout(() => this.remove(id), notification.duration || 5000);
    }
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  getAll() {
    return [...this.notifications];
  }
}

export const notificationManager = new NotificationManager();

// 快捷方法
export const notify = {
  success: (title: string, message?: string, duration?: number) => {
    notificationManager.add({ type: 'success', title, message, duration });
  },
  error: (title: string, message?: string, duration?: number) => {
    notificationManager.add({ type: 'error', title, message, duration });
  },
  warning: (title: string, message?: string, duration?: number) => {
    notificationManager.add({ type: 'warning', title, message, duration });
  },
  info: (title: string, message?: string, duration?: number) => {
    notificationManager.add({ type: 'info', title, message, duration });
  }
};

export function NotificationSystem({
  position = 'top-right',
  maxNotifications = 5,
  className
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const remove = (id: string) => {
    notificationManager.remove(id);
  };

  const visibleNotifications = notifications.slice(-maxNotifications);

  return (
    <div className={cn('fixed z-50 flex flex-col gap-2 pointer-events-none', positionClasses[position], className)}>
      <AnimatePresence>
        {visibleNotifications.map((notification) => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'pointer-events-auto w-80 p-4 rounded-lg border-2 backdrop-blur-sm shadow-lg',
                'flex items-start gap-3',
                config.bgColor,
                config.borderColor
              )}
            >
              {/* 图标 */}
              <div className={cn('flex-shrink-0', config.iconColor)}>
                <Icon size={20} />
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <h4 className={cn('font-semibold text-sm mb-1', config.textColor)}>
                  {notification.title}
                </h4>
                {notification.message && (
                  <p className="text-xs text-gray-400">{notification.message}</p>
                )}
                
                {/* 操作按钮 */}
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>

              {/* 关闭按钮 */}
              <button
                onClick={() => remove(notification.id)}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              {/* 进度条 */}
              {notification.duration && notification.duration > 0 && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: notification.duration / 1000, ease: 'linear' }}
                  className={cn('absolute bottom-0 left-0 h-0.5', config.textColor.replace('text-', 'bg-'))}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// 通知铃铛组件
export interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationBell({ count = 0, onClick, className }: NotificationBellProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn('relative p-2 rounded-lg hover:bg-cyan-500/10 transition-colors', className)}
    >
      <Bell className="text-cyan-400" size={20} />
      
      {count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
        >
          {count > 9 ? '9+' : count}
        </motion.div>
      )}
    </motion.button>
  );
}

// Toast 容器组件（用于页面级通知）
export interface ToastContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ToastContainer({ children, className }: ToastContainerProps) {
  return (
    <div className={cn('fixed bottom-4 right-4 z-50 flex flex-col gap-2', className)}>
      {children}
    </div>
  );
}
