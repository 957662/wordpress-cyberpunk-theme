'use client';

/**
 * 通知管理器组件
 * CyberPress Platform
 *
 * 统一管理应用中的各种通知消息
 */

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Bell } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

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
  onClose?: () => void;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => string;
  hideNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
}

export function NotificationProvider({
  children,
  position = 'top-right',
  maxNotifications = 5,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };

    setNotifications((prev) => {
      const updated = [...prev, newNotification];
      // 限制通知数量
      if (updated.length > maxNotifications) {
        updated.shift();
      }
      return updated;
    });

    // 自动隐藏
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, [maxNotifications]);

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification?.onClose) {
        notification.onClose();
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification, clearAll }}
    >
      {children}
      <NotificationContainer position={position} />
    </NotificationContext.Provider>
  );
}

/**
 * 通知容器组件
 */
function NotificationContainer({ position }: { position: string }) {
  const { notifications, hideNotification } = useNotifications();

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()} flex flex-col gap-2 pointer-events-none`}>
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={hideNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * 单个通知项组件
 */
function NotificationItem({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: (id: string) => void;
}) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'success':
        return 'border-cyber-green bg-cyber-green/10 text-cyber-green';
      case 'error':
        return 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink';
      case 'warning':
        return 'border-cyber-yellow bg-cyber-yellow/10 text-cyber-yellow';
      case 'info':
      default:
        return 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-lg border-2 backdrop-blur-md shadow-lg shadow-black/20 ${getColorClasses()}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">
            {notification.title}
          </h4>
          {notification.message && (
            <p className="mt-1 text-sm opacity-90">
              {notification.message}
            </p>
          )}

          {notification.action && (
            <button
              onClick={() => {
                notification.action!.onClick();
                onClose(notification.id);
              }}
              className="mt-2 text-sm font-medium underline hover:opacity-80"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        <button
          onClick={() => onClose(notification.id)}
          className="flex-shrink-0 p-1 rounded hover:bg-black/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Hook: 使用通知系统
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

/**
 * Hook: 快捷通知方法
 */
export function useToast() {
  const { showNotification } = useNotifications();

  return {
    success: (title: string, message?: string) =>
      showNotification({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      showNotification({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      showNotification({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      showNotification({ type: 'info', title, message }),
    promise: <T,>(
      promise: Promise<T>,
      { loading, success, error }: { loading: string; success: string; error: string }
    ) => {
      const id = showNotification({ type: 'info', title: loading, duration: 0 });

      promise
        .then(() => {
          showNotification({ type: 'success', title: success });
        })
        .catch((err) => {
          showNotification({ type: 'error', title: error, message: err.message });
        })
        .finally(() => {
          // 这里需要访问 hideNotification 方法
          // 在实际应用中可能需要改进
        });
    },
  };
}

/**
 * 简化的通知按钮组件
 */
export function NotificationButton() {
  const { notifications } = useNotifications();
  const unreadCount = notifications.length;

  return (
    <button className="relative p-2 rounded-lg bg-cyber-dark/80 backdrop-blur-sm border border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all">
      <Bell className="w-5 h-5 text-cyber-cyan" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-cyber-pink text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

export default NotificationProvider;
