'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Heart, MessageCircle, UserPlus, Bookmark, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationType } from './NotificationList';

interface ToastNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actor?: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  actionUrl?: string;
  duration?: number;
}

interface NotificationToastProps {
  notification: ToastNotification;
  onClose: (id: string) => void;
  onAction?: (notification: ToastNotification) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onAction,
  position = 'top-right',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = notification.duration || 5000;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(notification.id), 300);
  };

  const handleAction = () => {
    onAction?.(notification);
    handleClose();
  };

  const getIcon = (type: NotificationType) => {
    const icons = {
      follow: { icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-500/10' },
      like: { icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
      comment: { icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
      mention: { icon: MessageCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
      reply: { icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
      bookmark: { icon: Bookmark, color: 'text-orange-400', bg: 'bg-orange-500/10' },
      system: { icon: Check, color: 'text-gray-400', bg: 'bg-gray-500/10' },
      achievement: { icon: Trophy, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
    };
    return icons[type] || icons.system;
  };

  const iconConfig = getIcon(notification.type);
  const Icon = iconConfig.icon;

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed z-50 w-80 max-w-[calc(100vw-2rem)]',
            positionStyles[position]
          )}
        >
          <div className="relative bg-gray-900 border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden">
            {/* Progress Bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: (notification.duration || 5000) / 1000, ease: 'linear' }}
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500"
            />

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-fuchsia-500/5 pointer-events-none" />

            <div className="relative p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn('p-2 rounded-lg', iconConfig.bg)}>
                  <Icon className={iconConfig.color} size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {notification.message}
                  </p>
                  {notification.actor && (
                    <p className="text-xs text-cyan-400 mt-1">
                      by @{notification.actor.username}
                    </p>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-800 rounded transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>

              {/* Action Button */}
              {notification.actionUrl && (
                <button
                  onClick={handleAction}
                  className="w-full mt-3 py-2 text-sm bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors font-medium"
                >
                  View
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface NotificationToastContainerProps {
  notifications: ToastNotification[];
  onClose: (id: string) => void;
  onAction?: (notification: ToastNotification) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  limit?: number;
}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({
  notifications,
  onClose,
  onAction,
  position = 'top-right',
  limit = 3,
}) => {
  // Show only the most recent notifications
  const visibleNotifications = notifications.slice(-limit);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className={cn('absolute', position)}>
        <AnimatePresence mode="popLayout">
          {visibleNotifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              notification={notification}
              onClose={onClose}
              onAction={onAction}
              position={position}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationToast;
