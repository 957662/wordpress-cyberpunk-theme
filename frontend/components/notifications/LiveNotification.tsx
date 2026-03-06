'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LiveNotificationProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
  maxVisible?: number;
  className?: string;
}

const typeConfig = {
  success: {
    icon: Check,
    color: 'green',
    gradient: 'from-green-500 to-emerald-500',
  },
  error: {
    icon: AlertCircle,
    color: 'red',
    gradient: 'from-red-500 to-pink-500',
  },
  warning: {
    icon: AlertTriangle,
    color: 'yellow',
    gradient: 'from-yellow-500 to-orange-500',
  },
  info: {
    icon: Info,
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
  },
};

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
};

export const LiveNotification: React.FC<LiveNotificationProps> = ({
  notifications,
  onDismiss,
  position = 'top-right',
  maxVisible = 5,
  className,
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState(notifications);

  useEffect(() => {
    setVisibleNotifications(notifications.slice(0, maxVisible));
  }, [notifications, maxVisible]);

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-3 max-w-md w-full',
        positionClasses[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification) => {
          const config = typeConfig[notification.type];
          const Icon = notification.icon || config.icon;

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: position === 'top-left' || position === 'bottom-left' ? -100 : 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className={cn(
                'relative bg-gray-800/95 backdrop-blur-sm rounded-lg border',
                'shadow-2xl overflow-hidden',
                'hover:shadow-lg transition-shadow duration-300'
              )}
            >
              {/* Gradient Border */}
              <div className={cn('absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b', config.gradient)} />

              {/* Content */}
              <div className="flex items-start gap-3 p-4">
                {/* Icon */}
                <div className={cn('flex-shrink-0 p-2 rounded-lg bg-gradient-to-br', config.gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {notification.message}
                  </p>

                  {/* Action Button */}
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className="mt-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => onDismiss(notification.id)}
                  className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Progress Bar */}
              {notification.duration && (
                <motion.div
                  className={cn('h-0.5 bg-gradient-to-r', config.gradient)}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: notification.duration / 1000, ease: 'linear' }}
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

    setNotifications((prev) => [...prev, newNotification]);

    if (notification.duration) {
      setTimeout(() => {
        dismissNotification(id);
      }, notification.duration);
    }

    return id;
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    dismissAll,
  };
};

export default LiveNotification;
