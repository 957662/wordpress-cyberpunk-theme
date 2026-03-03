'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Bell, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'bookmark' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actor?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  targetType?: string;
  targetId?: string;
}

interface NotificationClientProps {
  initialNotifications: Notification[];
  initialSettings: any;
}

export default function NotificationClient({
  initialNotifications,
  initialSettings,
}: NotificationClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to mark as read');

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const markAllAsRead = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications/read-all', {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to mark all as read');

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('已全部标记为已读');
    } catch (error) {
      toast.error('操作失败');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      toast.success('已删除');
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const clearAll = async () => {
    if (!confirm('确定要清空所有通知吗？')) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications/clear', {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to clear');

      setNotifications([]);
      toast.success('已清空所有通知');
    } catch (error) {
      toast.error('清空失败');
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      follow: '👤',
      like: '❤️',
      comment: '💬',
      mention: '@',
      bookmark: '🔖',
      system: '🔔',
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type: Notification['type']) => {
    const colors = {
      follow: 'bg-purple-500/20 border-purple-500/50',
      like: 'bg-red-500/20 border-red-500/50',
      comment: 'bg-blue-500/20 border-blue-500/50',
      mention: 'bg-green-500/20 border-green-500/50',
      bookmark: 'bg-amber-500/20 border-amber-500/50',
      system: 'bg-slate-500/20 border-slate-500/50',
    };
    return colors[type] || colors.system;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
              filter === 'all'
                ? 'bg-cyber-primary text-white'
                : 'text-cyber-text-secondary hover:text-cyber-text-primary'
            )}
          >
            全部 ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
              filter === 'unread'
                ? 'bg-cyber-primary text-white'
                : 'text-cyber-text-secondary hover:text-cyber-text-primary'
            )}
          >
            未读 ({unreadCount})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700
                       text-cyber-text-primary rounded-lg border border-slate-700
                       transition-colors duration-200 flex items-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              全部已读
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-slate-800 hover:bg-red-500/20
                       text-cyber-text-primary hover:text-red-500 rounded-lg border border-slate-700
                       transition-colors duration-200 flex items-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              清空
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-cyber-text-secondary">
          <Bell size={64} className="mb-4 opacity-50" />
          <p className="text-lg mb-2">
            {filter === 'unread' ? '没有未读通知' : '还没有通知'}
          </p>
          <p className="text-sm">
            {filter === 'unread' ? '太棒了！您已读完所有通知' : '当有新通知时，它们会显示在这里'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  'p-4 rounded-lg border transition-all duration-200 group',
                  !notification.read
                    ? 'bg-slate-800/70 border-cyber-primary/50 shadow-lg shadow-cyber-primary/5'
                    : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                )}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center text-xl border shrink-0',
                      getNotificationColor(notification.type)
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {notification.actor && (
                          <Link
                            href={`/users/${notification.actor.username}`}
                            className="flex items-center gap-2 mb-2"
                          >
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              {notification.actor.avatar ? (
                                <Image
                                  src={notification.actor.avatar}
                                  alt={notification.actor.displayName || notification.actor.username}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-cyber-primary to-cyber-accent flex items-center justify-center text-white text-sm font-bold">
                                  {(notification.actor.displayName || notification.actor.username).charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium text-cyber-primary hover:underline">
                              {notification.actor.displayName || notification.actor.username}
                            </span>
                          </Link>
                        )}

                        <h4
                          className={cn(
                            'font-semibold mb-1',
                            notification.read ? 'text-cyber-text-primary' : 'text-cyber-primary'
                          )}
                        >
                          {notification.title}
                        </h4>
                        <p className="text-sm text-cyber-text-secondary mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-cyber-text-secondary">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: zhCN,
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 rounded hover:bg-slate-700/50
                                     text-cyber-text-secondary hover:text-cyber-primary
                                     transition-colors duration-200"
                            title="标记为已读"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 rounded hover:bg-slate-700/50
                                   text-cyber-text-secondary hover:text-red-500
                                   transition-colors duration-200"
                          title="删除"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
