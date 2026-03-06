'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertCircle, Info, XCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
  read?: boolean;
}

export interface RealtimeNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
  defaultDuration?: number;
  className?: string;
  onNotificationClick?: (notification: Notification) => void;
  onNotificationClose?: (id: string) => void;
}

const notificationIcons = {
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
};

const notificationColors = {
  info: 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan',
  success: 'bg-cyber-green/10 border-cyber-green text-cyber-green',
  warning: 'bg-cyber-yellow/10 border-cyber-yellow text-cyber-yellow',
  error: 'bg-cyber-pink/10 border-cyber-pink text-cyber-pink',
};

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const RealtimeNotification: React.FC<RealtimeNotificationProps> = ({
  position = 'top-right',
  maxNotifications = 5,
  defaultDuration = 5000,
  className,
  onNotificationClick,
  onNotificationClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 添加通知
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      duration: notification.duration ?? defaultDuration,
    };

    setNotifications((prev) => {
      const updated = [newNotification, ...prev];
      return updated.slice(0, maxNotifications);
    });

    // 自动移除
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    }
  }, [maxNotifications, defaultDuration]);

  // 移除通知
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    onNotificationClose?.(id);
  }, [onNotificationClose]);

  // 标记为已读
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // 清空所有通知
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // 监听自定义事件
  useEffect(() => {
    const handleNotification = (event: CustomEvent<Omit<Notification, 'id' | 'timestamp'>>) => {
      addNotification(event.detail);
    };

    window.addEventListener('notification' as any, handleNotification);
    return () => window.removeEventListener('notification' as any, handleNotification);
  }, [addNotification]);

  return (
    <div
      className={cn(
        'fixed z-50 w-full max-w-sm pointer-events-none',
        positionClasses[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'pointer-events-auto mb-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
              notificationColors[notification.type],
              !notification.read && 'ring-2 ring-cyber-cyan/50'
            )}
            onClick={() => {
              markAsRead(notification.id);
              onNotificationClick?.(notification);
            }}
          >
            <div className="flex items-start gap-3">
              {/* 图标 */}
              <div className="flex-shrink-0 mt-0.5">
                {notificationIcons[notification.type]}
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-white">
                    {notification.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                    aria-label="关闭通知"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-300 line-clamp-2">
                  {notification.message}
                </p>

                {/* 操作按钮 */}
                {notification.action && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      notification.action!.onClick();
                      removeNotification(notification.id);
                    }}
                    className={cn(
                      'mt-2 px-3 py-1 text-xs font-medium rounded',
                      'bg-cyber-cyan/20 hover:bg-cyber-cyan/30',
                      'text-cyber-cyan border border-cyber-cyan/50',
                      'transition-colors'
                    )}
                  >
                    {notification.action.label}
                  </motion.button>
                )}

                {/* 时间戳 */}
                <p className="mt-2 text-xs text-gray-500">
                  {notification.timestamp.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 清空按钮 */}
      {notifications.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={clearAll}
          className="pointer-events-auto mt-2 w-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-cyber-card/50 hover:bg-cyber-card border border-cyber-border rounded-lg transition-colors"
        >
          清空所有通知
        </motion.button>
      )}
    </div>
  );
};

// 便捷函数：触发通知
export const showNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
  window.dispatchEvent(
    new CustomEvent('notification', {
      detail: notification,
    })
  );
};

// 便捷函数：显示信息
export const showInfo = (message: string, title = '信息') => {
  showNotification({ type: 'info', title, message });
};

// 便捷函数：显示成功
export const showSuccess = (message: string, title = '成功') => {
  showNotification({ type: 'success', title, message });
};

// 便捷函数：显示警告
export const showWarning = (message: string, title = '警告') => {
  showNotification({ type: 'warning', title, message });
};

// 便捷函数：显示错误
export const showError = (message: string, title = '错误') => {
  showNotification({ type: 'error', title, message });
};

export default RealtimeNotification;
