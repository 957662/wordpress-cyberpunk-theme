'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Settings, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface Notification {
  id: string;
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  avatar?: string;
}

interface NotificationCenterProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// Mock data - replace with actual API calls
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'comment',
    title: 'New Comment',
    message: 'John Doe commented on your post "Getting Started with React"',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    actionUrl: '/blog/getting-started-with-react',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '2',
    type: 'like',
    title: 'New Like',
    message: 'Jane Smith liked your comment',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
  {
    id: '3',
    type: 'follow',
    title: 'New Follower',
    message: 'Bob Wilson started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    actionUrl: '/users/bob-wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    message: 'Your account settings have been updated successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
];

const notificationIcons = {
  comment: '💬',
  like: '❤️',
  follow: '👤',
  mention: '🔔',
  system: '⚙️',
};

const notificationColors = {
  comment: 'from-cyan-500 to-blue-500',
  like: 'from-pink-500 to-rose-500',
  follow: 'from-purple-500 to-violet-500',
  mention: 'from-yellow-500 to-orange-500',
  system: 'from-gray-500 to-slate-500',
};

export function NotificationCenter({ className, position = 'top-right' }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className={cn('relative', className)}>
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/30 hover:border-cyber-cyan/50 transition-all group"
      >
        <Bell className="w-5 h-5 text-cyber-cyan group-hover:text-cyber-cyan/80 transition-colors" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute z-50 w-96 max-h-[600px] bg-cyber-dark/95 backdrop-blur-xl rounded-xl border border-cyber-cyan/30 shadow-2xl shadow-cyber-cyan/10 overflow-hidden',
                {
                  'right-0 top-full mt-2': position === 'top-right',
                  'left-0 top-full mt-2': position === 'top-left',
                  'right-0 bottom-full mb-2': position === 'bottom-right',
                  'left-0 bottom-full mb-2': position === 'bottom-left',
                }
              )}
            >
              {/* Header */}
              <div className="p-4 border-b border-cyber-cyan/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-cyber-cyan" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-sm font-normal text-cyber-cyan">
                        ({unreadCount} new)
                      </span>
                    )}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded hover:bg-cyber-cyan/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      filter === 'all'
                        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                        : 'text-gray-400 hover:text-white hover:bg-cyber-cyan/10'
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      filter === 'unread'
                        ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                        : 'text-gray-400 hover:text-white hover:bg-cyber-cyan/10'
                    )}
                  >
                    Unread
                  </button>
                  <div className="flex-1" />
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1.5 rounded-lg hover:bg-cyber-cyan/10 transition-colors group"
                      title="Mark all as read"
                    >
                      <Check className="w-4 h-4 text-gray-400 group-hover:text-cyber-cyan" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="p-1.5 rounded-lg hover:bg-cyber-cyan/10 transition-colors group"
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-pink-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No notifications</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={cn(
                          'p-4 border-b border-cyber-cyan/10 hover:bg-cyber-cyan/5 transition-all cursor-pointer group',
                          !notification.read && 'bg-cyber-cyan/5'
                        )}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (notification.actionUrl) {
                            window.location.href = notification.actionUrl;
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          {/* Icon */}
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-lg flex-shrink-0',
                              notificationColors[notification.type]
                            )}
                          >
                            {notificationIcons[notification.type]}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-white truncate">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {formatTime(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1.5 rounded hover:bg-cyber-cyan/10 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5 text-cyber-cyan" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1.5 rounded hover:bg-pink-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-pink-500" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-cyber-cyan/20 flex items-center justify-between">
                <button
                  onClick={() => {
                    /* Navigate to notifications settings */
                  }}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-cyan transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Notification Settings
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-cyber-cyan hover:text-cyber-cyan/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export a default component for easy importing
export default NotificationCenter;
