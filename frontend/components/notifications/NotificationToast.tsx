'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  AlertTriangle,
  XCircle,
  Mail,
  MessageSquare,
  Heart,
  Star,
  UserPlus,
  Calendar,
  FileText,
  Zap,
} from 'lucide-react';

export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'comment'
  | 'like'
  | 'follow'
  | 'mention'
  | 'system'
  | 'reminder';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  read?: boolean;
  avatar?: string;
  link?: string;
}

export interface NotificationToastProps {
  notification: Notification;
  onClose: (id: string) => void;
  onActionClick?: (notification: Notification) => void;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const notificationIcons: Record<NotificationType, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  comment: MessageSquare,
  like: Heart,
  follow: UserPlus,
  mention: Bell,
  system: Zap,
  reminder: Calendar,
};

const notificationColors: Record<NotificationType, { bg: string; border: string; icon: string }> = {
  success: { bg: 'bg-green-500/10', border: 'border-green-500/30', icon: 'text-green-400' },
  error: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: 'text-red-400' },
  warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: 'text-yellow-400' },
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: 'text-blue-400' },
  comment: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: 'text-purple-400' },
  like: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', icon: 'text-pink-400' },
  follow: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
  mention: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: 'text-orange-400' },
  system: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', icon: 'text-indigo-400' },
  reminder: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', icon: 'text-teal-400' },
};

const positionStyles = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};

export function NotificationToast({
  notification,
  onClose,
  onActionClick,
  colorScheme = 'cyan',
  position = 'top-right',
}: NotificationToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const colors = notificationColors[notification.type];
  const Icon = notificationIcons[notification.type];

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const interval = 100;
      const step = 100 / (notification.duration / interval);
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= step) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return prev - step;
        });
      }, interval);

      return () => clearInterval(timer);
    }
  }, [notification.duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(notification.id), 300);
  };

  const handleActionClick = () => {
    if (onActionClick && notification.action) {
      onActionClick(notification);
      notification.action.onClick();
    }
    handleClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: position.includes('right') ? 100 : -100, scale: 0.9 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        x: isExiting ? (position.includes('right') ? 100 : -100) : 0,
        scale: isExiting ? 0.9 : 1,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`
        relative w-80 max-w-[calc(100vw-2rem)] p-4 rounded-lg border-2 backdrop-blur-md
        ${colors.bg} ${colors.border}
        shadow-xl overflow-hidden
        hover:shadow-2xl transition-shadow duration-300
      `}
    >
      {/* Progress Bar */}
      {notification.duration && notification.duration > 0 && (
        <motion.div
          className="absolute top-0 left-0 h-1 bg-current opacity-50"
          style={{
            width: `${progress}%`,
            color: colors.icon.replace('text-', ''),
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      )}

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>

      {/* Content */}
      <div className="flex gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${colors.bg} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-gray-100 mb-1 ${!notification.read ? 'text-glow' : ''}`}>
            {notification.title}
          </h4>
          <p className="text-sm text-gray-400 line-clamp-2">{notification.message}</p>

          {/* Timestamp */}
          <p className="text-xs text-gray-500 mt-2">
            {notification.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Action Button */}
      {notification.action && (
        <motion.button
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onClick={handleActionClick}
          className={`
            mt-3 w-full py-2 px-4 rounded-lg text-sm font-semibold
            bg-gradient-to-r from-cyan-500/20 to-purple-500/20
            border border-cyan-500/30
            text-cyan-400 hover:from-cyan-500/30 hover:to-purple-500/30
            transition-all duration-300
          `}
        >
          {notification.action.label}
        </motion.button>
      )}

      {/* Avatar (for social notifications) */}
      {notification.avatar && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2">
          <img
            src={notification.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full border-2 border-gray-800"
          />
        </div>
      )}

      {/* Glow Effect */}
      {!notification.read && (
        <motion.div
          className={`absolute inset-0 rounded-lg ${colors.border} opacity-30 pointer-events-none`}
          animate={{
            boxShadow: [
              `0 0 20px ${colors.icon.replace('text-', '')}`,
              `0 0 30px ${colors.icon.replace('text-', '')}`,
              `0 0 20px ${colors.icon.replace('text-', '')}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );
}

// Notification Container
export interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
  onActionClick?: (notification: Notification) => void;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'blue';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  limit?: number;
}

export function NotificationContainer({
  notifications,
  onClose,
  onActionClick,
  colorScheme = 'cyan',
  position = 'top-right',
  limit = 5,
}: NotificationContainerProps) {
  const visibleNotifications = notifications.slice(-limit);

  return (
    <div
      className={`fixed ${positionStyles[position]} z-50 flex flex-col gap-3 pointer-events-none`}
    >
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationToast
              notification={notification}
              onClose={onClose}
              onActionClick={onActionClick}
              colorScheme={colorScheme}
              position={position}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
