'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '@/components/ui/Avatar';

export type NotificationType =
  | 'follow'
  | 'like'
  | 'comment'
  | 'mention'
  | 'reply'
  | 'bookmark'
  | 'system'
  | 'achievement';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actor?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  actionUrl?: string;
  resource?: {
    id: string;
    type: 'post' | 'comment' | 'user';
    title?: string;
  };
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  userId: string;
  limit?: number;
  showActions?: boolean;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (notificationId: string) => void;
  className?: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  userId,
  limit = 20,
  showActions = true,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  className,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}/notifications?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId, limit]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
        onMarkAsRead?.(notificationId);
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/notifications/read-all`, {
        method: 'POST',
      });

      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        onMarkAllAsRead?.();
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        onDelete?.(notificationId);
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    const icons = {
      follow: '👤',
      like: '❤️',
      comment: '💬',
      mention: '@',
      reply: '↩️',
      bookmark: '🔖',
      system: '⚙️',
      achievement: '🏆',
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type: NotificationType) => {
    const colors = {
      follow: 'bg-blue-500/10 border-blue-500/30',
      like: 'bg-red-500/10 border-red-500/30',
      comment: 'bg-green-500/10 border-green-500/30',
      mention: 'bg-yellow-500/10 border-yellow-500/30',
      reply: 'bg-purple-500/10 border-purple-500/30',
      bookmark: 'bg-orange-500/10 border-orange-500/30',
      system: 'bg-gray-500/10 border-gray-500/30',
      achievement: 'bg-fuchsia-500/10 border-fuchsia-500/30',
    };
    return colors[type] || 'bg-cyan-500/10 border-cyan-500/30';
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={cn('bg-gray-900/95 backdrop-blur-sm rounded-lg border border-cyan-500/30', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="text-cyan-400" size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white">Notifications</h2>
        </div>

        {showActions && unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-3 py-1.5 text-sm bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors flex items-center gap-2"
          >
            <Check size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-4 border-b border-cyan-500/20">
        {(['all', 'unread', 'read'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              filter === filterType
                ? 'bg-cyan-500 text-black'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            {filterType}
            {filterType === 'unread' && unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-red-500 rounded text-xs">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <div className="max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Bell size={48} className="mb-4 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative p-4 border-b border-cyan-500/10 hover:bg-gray-800/30 transition-colors',
                  !notification.isRead && 'bg-cyan-500/5',
                  'last:border-b-0'
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full border flex items-center justify-center text-lg flex-shrink-0',
                      getNotificationColor(notification.type)
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {notification.actor && (
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar
                          src={notification.actor.avatar}
                          alt={notification.actor.displayName}
                          size="sm"
                        />
                        <span className="font-semibold text-white">
                          {notification.actor.displayName}
                        </span>
                        <span className="text-sm text-gray-400">
                          @{notification.actor.username}
                        </span>
                      </div>
                    )}

                    <h4 className="font-medium text-white mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2">{notification.message}</p>

                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                      {notification.actionUrl && (
                        <a
                          href={notification.actionUrl}
                          onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {showActions && (
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check size={16} className="text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Unread Indicator */}
                {!notification.isRead && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
