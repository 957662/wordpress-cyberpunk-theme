'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  UserPlus,
  Heart,
  MessageCircle,
  Bookmark,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { notificationApi } from '@/lib/api/social';
import { useNotifications } from '@/hooks/useSocialFeatures';

interface NotificationBellProps {
  position?: 'header' | 'floating';
  showUnreadCount?: boolean;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  position = 'header',
  showUnreadCount = true,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { unreadCount, markAsRead, markAllAsRead, refreshUnreadCount } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
      refreshUnreadCount();
    }
  }, [isOpen]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationApi.getNotifications({
        page: 1,
        perPage: 10,
        unreadOnly: false,
      });

      if (response.success && response.data) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getIconForType = (type: string) => {
    const icons = {
      follow: <UserPlus size={16} className="text-cyber-purple" />,
      like: <Heart size={16} className="text-cyber-pink" />,
      comment: <MessageCircle size={16} className="text-cyber-cyan" />,
      mention: <MessageCircle size={16} className="text-orange-400" />,
      bookmark: <Bookmark size={16} className="text-cyber-yellow" />,
      system: <Bell size={16} className="text-cyber-muted" />,
    };
    return icons[type as keyof typeof icons] || icons.system;
  };

  const formatTimeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-lg transition-all duration-300',
          isOpen
            ? 'bg-cyber-purple/20 text-cyber-purple'
            : 'hover:bg-cyber-purple/10 text-cyber-muted hover:text-cyber-purple'
        )}
      >
        {unreadCount > 0 ? (
          <BellRing size={20} className="animate-swing" />
        ) : (
          <Bell size={20} />
        )}

        {/* Unread Badge */}
        {showUnreadCount && unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-cyber-pink to-cyber-purple flex items-center justify-center"
          >
            <span className="text-xs font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute right-0 top-12 w-96 rounded-xl',
                'bg-gradient-to-br from-cyber-dark to-cyber-dark/80',
                'border border-cyber-purple/20 shadow-2xl',
                'z-50 overflow-hidden'
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-cyber-purple/20">
                <h3 className="font-semibold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="p-1.5 rounded hover:bg-cyber-purple/10 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck size={16} className="text-cyber-muted hover:text-cyber-cyan" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded hover:bg-cyber-purple/10 transition-colors"
                  >
                    <Settings size={16} className="text-cyber-muted" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-cyber-purple border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Bell size={48} className="text-cyber-muted/30 mb-3" />
                    <p className="text-cyber-muted text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-cyber-purple/10">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          'relative p-4 hover:bg-cyber-purple/5 transition-colors',
                          'group cursor-pointer',
                          !notification.read && 'bg-cyber-purple/10'
                        )}
                        onClick={() => {
                          if (!notification.read) {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                      >
                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyber-purple rounded-r-full" />
                        )}

                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="mt-0.5">
                            {getIconForType(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium">
                              {notification.title}
                            </p>
                            <p className="text-xs text-cyber-muted mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-cyber-muted/60 mt-1">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="p-1.5 rounded hover:bg-cyber-purple/10 transition-colors"
                              >
                                <Check size={14} className="text-cyber-muted" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              className="p-1.5 rounded hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={14} className="text-cyber-muted hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-cyber-purple/20">
                  <button
                    onClick={() => {
                      /* Navigate to full notifications page */
                    }}
                    className={cn(
                      'w-full py-2 px-4 rounded-lg',
                      'bg-cyber-purple/10 border border-cyber-purple/20',
                      'text-cyber-purple hover:bg-cyber-purple/20',
                      'text-sm font-medium transition-all duration-300'
                    )}
                  >
                    View All Notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
