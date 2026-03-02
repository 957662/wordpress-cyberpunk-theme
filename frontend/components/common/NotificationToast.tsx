'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, XCircle } from 'lucide-react';
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

interface NotificationToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxVisible?: number;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-cyber-green',
    bgColor: 'bg-cyber-green/10',
    borderColor: 'border-cyber-green/30',
    glow: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
  },
  error: {
    icon: XCircle,
    color: 'text-cyber-pink',
    bgColor: 'bg-cyber-pink/10',
    borderColor: 'border-cyber-pink/30',
    glow: 'shadow-[0_0_20px_rgba(255,0,128,0.3)]',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-cyber-yellow',
    bgColor: 'bg-cyber-yellow/10',
    borderColor: 'border-cyber-yellow/30',
    glow: 'shadow-[0_0_20px_rgba(240,255,0,0.3)]',
  },
  info: {
    icon: Info,
    color: 'text-cyber-cyan',
    bgColor: 'bg-cyber-cyan/10',
    borderColor: 'border-cyber-cyan/30',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  },
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onRemove,
  className,
  position = 'top-right',
  maxVisible = 5,
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const sorted = notifications.slice(-maxVisible);
    setVisibleNotifications(sorted);
  }, [notifications, maxVisible]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionClasses[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification) => {
          const config = typeConfig[notification.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0, y: position.includes('top') ? -50 : 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              layout
              className={cn(
                'pointer-events-auto w-80 p-4 rounded-lg border backdrop-blur-sm',
                config.bgColor,
                config.borderColor,
                config.glow,
                'relative overflow-hidden group'
              )}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundPosition: ['0% 0%', '200% 200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                style={{
                  background: `linear-gradient(115deg, transparent 40%, ${notification.type === 'success' ? '#00ff88' : notification.type === 'error' ? '#ff0080' : notification.type === 'warning' ? '#f0ff00' : '#00f0ff'} 45%, transparent 60%)`,
                  backgroundSize: '200% 200%',
                }}
              />

              {/* Content */}
              <div className="relative flex items-start gap-3">
                {/* Icon */}
                <motion.div
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className={cn('flex-shrink-0', config.color)}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn('text-sm font-semibold text-cyber-white mb-1')}>
                    {notification.title}
                  </h4>
                  {notification.message && (
                    <p className="text-xs text-cyber-gray">{notification.message}</p>
                  )}

                  {/* Action Button */}
                  {notification.action && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={notification.action.onClick}
                      className="mt-2 text-xs font-medium underline underline-offset-2"
                      style={{ color: config.color.replace('text-', '') }}
                    >
                      {notification.action.label}
                    </motion.button>
                  )}
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemove(notification.id)}
                  className={cn('flex-shrink-0 p-0.5 rounded hover:bg-black/20 transition-colors', config.color)}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Progress Bar */}
              {notification.duration && notification.duration > 0 && (
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: notification.duration / 1000, ease: 'linear' }}
                  className={cn('absolute bottom-0 left-0 h-0.5', config.color.replace('text-', 'bg-'))}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const success = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration });
  };

  const error = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration });
  };

  const warning = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'warning', title, message, duration });
  };

  const info = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
  };
};

export default NotificationToast;
