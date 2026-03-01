'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * NotificationCenter - 通知中心组件
 * 管理和显示系统通知、消息和提醒
 */

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'cyber';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon?: React.ReactNode;
  duration?: number; // Auto-dismiss duration in ms
  onDismiss?: () => void;
  onClick?: () => void;
}

// ==================== Toast 通知组件 ====================

export interface ToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

const typeStyles = {
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: '💡',
    text: 'text-blue-400',
  },
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: '✅',
    text: 'text-green-400',
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    icon: '⚠️',
    text: 'text-yellow-400',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: '❌',
    text: 'text-red-400',
  },
  cyber: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    icon: '⚡',
    text: 'text-cyan-400',
  },
};

export const Toast: React.FC<ToastProps> = ({
  notification,
  onDismiss,
  position = 'top-right',
}) => {
  const styles = typeStyles[notification.type];

  // Auto-dismiss logic
  React.useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration, onDismiss]);

  return (
    <motion.div
      className={cn(
        'relative max-w-sm w-full rounded-lg border backdrop-blur-md shadow-lg',
        'overflow-hidden',
        styles.bg,
        styles.border
      )}
      initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={notification.onClick}
    >
      {/* Progress bar for auto-dismiss */}
      {notification.duration && (
        <motion.div
          className={cn('absolute bottom-0 left-0 h-0.5', styles.text.replace('text', 'bg'))}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: notification.duration / 1000, ease: 'linear' }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn('text-xl flex-shrink-0', styles.text)}>
            {notification.icon || styles.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={cn('font-semibold mb-1', styles.text)}>
              {notification.title}
            </h4>
            <p className="text-sm text-gray-300">{notification.message}</p>

            {notification.actionUrl && (
              <a
                href={notification.actionUrl}
                className="inline-block mt-2 text-sm font-medium underline underline-offset-2"
                style={{ color: styles.text }}
              >
                {notification.actionLabel || 'View Details'}
              </a>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Priority indicator */}
      {notification.priority === 'urgent' && (
        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      )}
    </motion.div>
  );
};

// ==================== Toast 容器组件 ====================

export interface ToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  maxVisible?: number;
  className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onDismiss,
  position = 'top-right',
  maxVisible = 5,
  className,
}) => {
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
  };

  const visibleNotifications = notifications.slice(-maxVisible);

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionStyles[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Toast
              notification={notification}
              onDismiss={onDismiss}
              position={position}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ==================== 通知中心面板组件 ====================

export interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDismiss?: (id: string) => void;
  onDismissAll?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onDismissAll,
  isOpen = true,
  onClose,
  className,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentCount = notifications.filter((n) => n.priority === 'urgent').length;

  const filteredNotifications = React.useMemo(() => {
    switch (filter) {
      case 'unread':
        return notifications.filter((n) => !n.read);
      case 'priority':
        return notifications.filter(
          (n) => n.priority === 'urgent' || n.priority === 'high'
        );
      default:
        return notifications;
    }
  }, [notifications, filter]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className={cn(
              'fixed right-0 top-0 h-full w-full max-w-md bg-gray-900/95',
              'backdrop-blur-xl border-l border-cyan-500/20',
              'shadow-2xl z-50 overflow-hidden flex flex-col',
              className
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Notifications</h2>
                  <p className="text-sm text-gray-400">
                    {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-colors',
                    filter === 'all'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  )}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-colors',
                    filter === 'unread'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  )}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('priority')}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-colors',
                    filter === 'priority'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  )}
                >
                  Priority ({urgentCount})
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                {onMarkAllAsRead && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="px-3 py-1.5 text-xs font-medium rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Mark All Read
                  </button>
                )}
                {onDismissAll && (
                  <button
                    onClick={onDismissAll}
                    className="px-3 py-1.5 text-xs font-medium rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>No notifications</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={onMarkAsRead}
                      onDismiss={onDismiss}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ==================== 单个通知项组件 ====================

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
}) => {
  const styles = typeStyles[notification.type];

  return (
    <motion.div
      className={cn(
        'p-4 rounded-lg border backdrop-blur-sm cursor-pointer',
        'transition-all hover:scale-[1.02]',
        notification.read ? 'opacity-60' : 'opacity-100',
        styles.bg,
        styles.border
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      layout
      onClick={() => !notification.read && onMarkAsRead?.(notification.id)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn('text-lg flex-shrink-0', styles.text)}>
          {notification.icon || styles.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn('font-semibold text-sm', styles.text)}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>

          {notification.actionUrl && (
            <a
              href={notification.actionUrl}
              className="inline-block mt-2 text-xs font-medium underline underline-offset-2"
              style={{ color: styles.text }}
              onClick={(e) => e.stopPropagation()}
            >
              {notification.actionLabel || 'View'}
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          {onDismiss && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(notification.id);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Priority indicator */}
      {notification.priority === 'urgent' && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      )}
    </motion.div>
  );
};

// ==================== 通知铃铛按钮组件 ====================

export interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-2 rounded-lg hover:bg-gray-800 transition-colors',
        className
      )}
    >
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      {unreadCount > 0 && (
        <motion.span
          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </motion.span>
      )}
    </button>
  );
};

// ==================== Hook: useNotificationCenter ====================

export const useNotificationCenter = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, newNotification]);
    return newNotification.id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
};

export default NotificationCenter;
