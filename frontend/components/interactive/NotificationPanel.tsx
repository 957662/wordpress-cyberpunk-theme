'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Star, MessageCircle, Heart, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  action_url?: string;
}

export interface NotificationPanelProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
  apiBaseUrl?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications: initialNotifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  className,
  apiBaseUrl = '/api/notifications',
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const filteredNotifications = notifications.filter((n) =>
    filter === 'all' ? true : !n.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${id}/read`, { method: 'POST' });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        onMarkAsRead?.(id);
      }
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/mark-all-read`, { method: 'POST' });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        onMarkAllAsRead?.();
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        onDelete?.(id);
        toast.success('Notification deleted');
      }
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const icons = {
    like: Heart,
    comment: MessageCircle,
    follow: UserPlus,
    mention: MessageCircle,
    system: Bell,
  };

  const colors = {
    like: 'text-cyber-pink bg-cyber-pink/10 border-cyber-pink/30',
    comment: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30',
    follow: 'text-cyber-green bg-cyber-green/10 border-cyber-green/30',
    mention: 'text-cyber-purple bg-cyber-purple/10 border-cyber-purple/30',
    system: 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-3 rounded-lg cyber-card',
          'hover:border-cyber-cyan/50 transition-all duration-300'
        )}
      >
        <Bell className="h-5 w-5 text-cyber-cyan" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-pink rounded-full text-xs flex items-center justify-center text-white font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 max-h-[600px] bg-cyber-dark border border-cyber-cyan/30 rounded-xl shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-cyber-muted/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">Notifications</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-cyber-muted" />
                  </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-all duration-300',
                      filter === 'all'
                        ? 'bg-cyber-cyan/20 text-cyber-cyan'
                        : 'bg-cyber-dark/50 text-cyber-muted hover:text-white'
                    )}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-all duration-300',
                      filter === 'unread'
                        ? 'bg-cyber-cyan/20 text-cyber-cyan'
                        : 'bg-cyber-dark/50 text-cyber-muted hover:text-white'
                    )}
                  >
                    Unread ({unreadCount})
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="ml-auto px-3 py-1.5 text-sm rounded-lg bg-cyber-cyan/10 text-cyber-cyan hover:bg-cyber-cyan/20 transition-all duration-300"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-2">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {filteredNotifications.map((notification) => {
                        const Icon = icons[notification.type];
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={cn(
                              'p-4 rounded-lg cyber-card transition-all duration-300',
                              !notification.read && 'bg-cyber-cyan/5 border-cyber-cyan/50',
                              notification.read && 'opacity-70'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div className={cn('p-2 rounded-lg border', colors[notification.type])}>
                                <Icon className="h-4 w-4" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white mb-1">
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-cyber-muted line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-cyber-muted mt-2">
                                  {new Date(notification.created_at).toLocaleString()}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="p-1.5 hover:bg-cyber-cyan/10 rounded-lg transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="h-4 w-4 text-cyber-cyan" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(notification.id)}
                                  className="p-1.5 hover:bg-cyber-pink/10 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4 text-cyber-pink" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="p-12 text-center text-cyber-muted">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-4 border-t border-cyber-muted/20">
                  <button
                    onClick={onClearAll}
                    className="w-full px-4 py-2 text-sm text-cyber-pink hover:bg-cyber-pink/10 rounded-lg transition-all duration-300"
                  >
                    Clear all notifications
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

export default NotificationPanel;
