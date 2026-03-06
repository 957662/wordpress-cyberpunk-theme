'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  MessageCircle,
  Heart,
  UserPlus,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast, { Toaster } from 'react-hot-toast';

type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'like' | 'follow' | 'comment' | 'mention';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface RealtimeNotificationSystemProps {
  wsUrl?: string;
  maxNotifications?: number;
  className?: string;
}

export function RealtimeNotificationSystem({
  wsUrl = 'ws://localhost:8000/ws/notifications',
  maxNotifications = 10,
  className,
}: RealtimeNotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    // Initialize WebSocket connection
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        addNotification(data.notification);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        setWs(new WebSocket(wsUrl));
      }, 3000);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [wsUrl]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev].slice(0, maxNotifications);
      return newNotifications;
    });

    // Show toast for important notifications
    if (
!['like', 'follow'].includes(notification.type)
) {
      const toastFn = notification.type === 'error' ? toast.error :
                      notification.type === 'success' ? toast.success :
                      notification.type === 'warning' ? toast.error :
                      toast;

      toastFn(notification.title, {
        description: notification.message,
        icon: getNotificationIcon(notification.type),
      });
    }
  }, [maxNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      case 'like':
        return <Heart className="w-5 h-5 text-pink-400" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-purple-400" />;
      case 'comment':
      case 'mention':
        return <MessageCircle className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10 hover:border-green-500/50';
      case 'error':
        return 'border-red-500/30 bg-red-500/10 hover:border-red-500/50';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-500/50';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10 hover:border-blue-500/50';
      case 'like':
        return 'border-pink-500/30 bg-pink-500/10 hover:border-pink-500/50';
      case 'follow':
        return 'border-purple-500/30 bg-purple-500/10 hover:border-purple-500/50';
      case 'comment':
      case 'mention':
        return 'border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-500/50';
      default:
        return 'border-gray-500/30 bg-gray-500/10 hover:border-gray-500/50';
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <motion.div
        className={cn('relative', className)}
        initial={false}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'relative p-3 rounded-lg transition-all duration-200',
            'bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/20',
            'hover:bg-cyber-cyan/10 hover:border-cyber-cyan/40'
          )}
        >
          <Bell className={cn(
            'w-5 h-5 transition-colors',
            unreadCount > 0 ? 'text-cyber-cyan' : 'text-gray-400'
          )} />

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-pink rounded-full text-xs font-bold text-white flex items-center justify-center"
            >
              {unreadCount}
            </motion.div>
          )}

          {/* Pulse Animation */}
          {unreadCount > 0 && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-cyber-cyan/20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </motion.button>

        {/* Notification Panel */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />

              {/* Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-96 max-h-[600px] bg-cyber-dark/95 backdrop-blur-xl border border-cyber-cyan/30 rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cyber-cyan/20">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-cyber-cyan" />
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-cyber-pink/20 text-cyber-pink rounded-full text-xs font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="px-3 py-1 text-xs bg-cyber-cyan/20 text-cyber-cyan rounded-full hover:bg-cyber-cyan/30 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto max-h-[500px] p-2">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn(
                            'relative p-4 rounded-lg border-2 transition-all duration-200',
                            getNotificationColor(notification.type),
                            !notification.read && 'border-l-4 border-l-cyber-cyan'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className={cn(
                                'text-sm font-semibold mb-1',
                                notification.read ? 'text-gray-400' : 'text-white'
                              )}>
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-400 mb-2">
                                {notification.message}
                              </p>

                              {/* Action Button */}
                              {notification.actionUrl && (
                                <a
                                  href={notification.actionUrl}
                                  className="text-xs text-cyber-cyan hover:underline"
                                >
                                  {notification.actionLabel || 'View'} →
                                </a>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="w-3 h-3 text-gray-400" />
                                </button>
                              )}
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="p-1 hover:bg-gray-700 rounded transition-colors"
                                title="Remove"
                              >
                                <X className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                          </div>

                          {/* Timestamp */}
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(10, 10, 15, 0.95)',
            color: '#fff',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
          },
        }}
      />
    </>
  );
}

function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Notification hook for easy use across the app
 */
export function useNotification() {
  const notify = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      actionUrl?: string;
      actionLabel?: string;
    }
  ) => {
    const toastFn = type === 'error' ? toast.error :
                    type === 'success' ? toast.success :
                    type === 'warning' ? toast.error :
                    toast;

    toastFn(title, {
      description: message,
      duration: options?.duration || 4000,
    });
  }, []);

  return { notify };
}
