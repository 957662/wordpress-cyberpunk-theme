/**
 * 通知系统组件
 * 支持多种通知类型：success, error, warning, info
 * 支持自动关闭、手动关闭、进度条
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// 通知类型定义
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  showProgress?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => string;
  hideNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 通知提供者
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
      showProgress: notification.showProgress ?? true,
    };

    setNotifications(prev => [...prev, newNotification]);

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification, clearAll }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

// 使用通知的 Hook
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

// 通知容器
function NotificationContainer() {
  const { notifications, hideNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      <AnimatePresence mode="popLayout">
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => hideNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// 单个通知项
function NotificationItem({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (notification.duration && notification.duration > 0 && notification.showProgress) {
      const interval = 50;
      const step = 100 / (notification.duration / interval);
      const timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - step;
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [notification.duration, notification.showProgress]);

  const icons = {
    success: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colors = {
    success: 'bg-cyber-green/10 border-cyber-green text-cyber-green',
    error: 'bg-cyber-pink/10 border-cyber-pink text-cyber-pink',
    warning: 'bg-cyber-yellow/10 border-cyber-yellow text-cyber-yellow',
    info: 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative backdrop-blur-md rounded-lg border-2 p-4 shadow-lg',
        colors[notification.type]
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icons[notification.type]}</div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{notification.title}</h4>
          {notification.message && (
            <p className="mt-1 text-sm opacity-90">{notification.message}</p>
          )}

          {notification.actions && notification.actions.length > 0 && (
            <div className="mt-3 flex gap-2">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded transition-all',
                    action.variant === 'primary'
                      ? 'bg-current text-white'
                      : 'border border-current hover:bg-current/10'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {notification.showProgress && notification.duration && notification.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-current/10 rounded-b-lg overflow-hidden">
          <motion.div
            className="h-full bg-current"
            initial={{ width: '100%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.05, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
}

// 快捷方法
export const notification = {
  success: (title: string, message?: string, duration?: number) => {
    const { showNotification } = useNotification();
    return showNotification({ type: 'success', title, message, duration });
  },
  error: (title: string, message?: string, duration?: number) => {
    const { showNotification } = useNotification();
    return showNotification({ type: 'error', title, message, duration });
  },
  warning: (title: string, message?: string, duration?: number) => {
    const { showNotification } = useNotification();
    return showNotification({ type: 'warning', title, message, duration });
  },
  info: (title: string, message?: string, duration?: number) => {
    const { showNotification } = useNotification();
    return showNotification({ type: 'info', title, message, duration });
  },
};
