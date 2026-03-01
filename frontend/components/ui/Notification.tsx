'use client';

/**
 * 通知组件
 * 显示全局通知消息
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// 通知项
export interface NotificationItem {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

// 单个通知项组件
interface NotificationToastProps {
  item: NotificationItem;
  onClose: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ item, onClose }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  // 图标映射
  const icons = useMemo(() => ({
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }), []);

  // 颜色映射
  const colors = useMemo(() => ({
    success: 'border-cyber-green bg-cyber-green/10 text-cyber-green',
    error: 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink',
    warning: 'border-cyber-yellow bg-cyber-yellow/10 text-cyber-yellow',
    info: 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan',
  }), []);

  // 自动关闭
  useEffect(() => {
    if (item.duration !== 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => onClose(item.id), 300);
      }, item.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [item.id, item.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={cn(
        'relative p-4 rounded-lg border-2 shadow-lg',
        'backdrop-blur-md',
        colors[item.type]
      )}
    >
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(() => onClose(item.id), 300);
        }}
        className="absolute top-2 right-2 p-1 hover:bg-black/20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icons[item.type]}
        </div>
        <div className="flex-1 min-w-0">
          {item.title && (
            <h4 className="font-semibold mb-1">{item.title}</h4>
          )}
          <p className="text-sm opacity-90">{item.message}</p>
        </div>
      </div>
    </motion.div>
  );
};

// 通知容器组件
interface NotificationContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxNotifications?: number;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  position = 'top-right',
  maxNotifications = 5
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // 添加通知
  const addNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const item: NotificationItem = {
      ...notification,
      id,
    };

    setNotifications(prev => {
      const updated = [...prev, item];
      // 限制最大数量
      if (updated.length > maxNotifications) {
        return updated.slice(-maxNotifications);
      }
      return updated;
    });

    return id;
  }, [maxNotifications]);

  // 移除通知
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // 清空所有通知
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // 位置样式映射
  const positionStyles = useMemo(() => ({
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  }), []);

  useEffect(() => {
    // 将方法暴露到全局
    (window as any).notification = {
      success: (message: string, title?: string) => addNotification({ type: 'success', message, title }),
      error: (message: string, title?: string) => addNotification({ type: 'error', message, title }),
      warning: (message: string, title?: string) => addNotification({ type: 'warning', message, title }),
      info: (message: string, title?: string) => addNotification({ type: 'info', message, title }),
      clear: clearAll,
    };
  }, [addNotification, clearAll]);

  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2 max-w-md w-full',
      positionStyles[position]
    )}>
      <AnimatePresence mode="popLayout">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            item={notification}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// 快捷方法 Hook
export const useNotification = () => {
  return {
    success: (message: string, title?: string, duration?: number) => {
      (window as any).notification?.success?.(message, title);
    },
    error: (message: string, title?: string, duration?: number) => {
      (window as any).notification?.error?.(message, title);
    },
    warning: (message: string, title?: string, duration?: number) => {
      (window as any).notification?.warning?.(message, title);
    },
    info: (message: string, title?: string, duration?: number) => {
      (window as any).notification?.info?.(message, title);
    },
    clear: () => {
      (window as any).notification?.clear?.();
    },
  };
};

export default NotificationContainer;
