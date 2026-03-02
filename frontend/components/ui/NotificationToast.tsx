'use client';

/**
 * 通知提示组件
 * 支持多种类型、位置、自动关闭
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

export interface NotificationToastProps {
  notifications: Notification[];
  position?: NotificationPosition;
  onClose?: (id: string) => void;
  className?: string;
}

export function NotificationToast({
  notifications,
  position = 'top-right',
  onClose,
  className,
}: NotificationToastProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!visibleNotifications.has(notification.id)) {
        setVisibleNotifications((prev) => new Set(prev).add(notification.id));

        if (notification.duration !== 0) {
          const duration = notification.duration || 5000;
          const timer = setTimeout(() => {
            handleClose(notification.id);
          }, duration);

          return () => clearTimeout(timer);
        }
      }
    });
  }, [notifications]);

  const handleClose = (id: string) => {
    setVisibleNotifications((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    onClose?.(id);
  };

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-cyber-green/10',
      borderColor: 'border-cyber-green/50',
      iconColor: 'text-cyber-green',
      titleColor: 'text-cyber-green',
    },
    error: {
      icon: X,
      bgColor: 'bg-cyber-pink/10',
      borderColor: 'border-cyber-pink/50',
      iconColor: 'text-cyber-pink',
      titleColor: 'text-cyber-pink',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-cyber-yellow/10',
      borderColor: 'border-cyber-yellow/50',
      iconColor: 'text-cyber-yellow',
      titleColor: 'text-cyber-yellow',
    },
    info: {
      icon: Info,
      bgColor: 'bg-cyber-cyan/10',
      borderColor: 'border-cyber-cyan/50',
      iconColor: 'text-cyber-cyan',
      titleColor: 'text-cyber-cyan',
    },
  };

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
        'fixed z-50 flex flex-col gap-3 max-w-md w-full',
        positionClasses[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {notifications
          .filter((notification) => visibleNotifications.has(notification.id))
          .map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0, y: position.includes('top') ? -50 : 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: position.includes('right') ? 100 : position.includes('left') ? -100 : 0, y: position.includes('top') ? -50 : 50, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'relative overflow-hidden rounded-xl border-2 p-4 shadow-lg',
                  config.bgColor,
                  config.borderColor
                )}
              >
                {/* Progress Bar */}
                {notification.duration && notification.duration > 0 && (
                  <motion.div
                    className="absolute top-0 left-0 h-1 bg-current opacity-30"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: notification.duration / 1000, ease: 'linear' }}
                    style={{ color: config.iconColor.replace('text-', '') }}
                  />
                )}

                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={cn('flex-shrink-0', config.iconColor)}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={cn('font-semibold text-sm', config.titleColor)}>
                      {notification.title}
                    </h4>
                    {notification.message && (
                      <p className="mt-1 text-sm text-gray-400">
                        {notification.message}
                      </p>
                    )}
                  </div>

                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleClose(notification.id)}
                    className="flex-shrink-0 p-1 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
}

export default NotificationToast;
