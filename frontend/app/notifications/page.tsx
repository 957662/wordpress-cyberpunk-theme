/**
 * 通知页面
 * 显示所有通知并支持筛选和管理
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Filter, Settings, Trash2, Check, Archive } from 'lucide-react';
import { useNotifications, useNotificationActions, useNotificationStats } from '../../hooks/api/useNotification';
import { NotificationType, NotificationStatus } from '../../types/notification.types';
import { cn, formatRelativeTime } from '../../lib/utils';
import Link from 'next/link';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<{
    type?: NotificationType;
    status?: NotificationStatus;
  }>({});

  const { notifications, total, unreadCount, isLoading } = useNotifications({
    ...filter,
    pageSize: 50,
  });

  const { stats } = useNotificationStats();
  const { markAsRead, markAsUnread, archive, delete: deleteNotification, markAllAsRead } = useNotificationActions();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COMMENT:
      case NotificationType.REPLY:
        return '💬';
      case NotificationType.LIKE:
        return '❤️';
      case NotificationType.FOLLOW:
        return '👥';
      case NotificationType.MENTION:
        return '🏷️';
      case NotificationType.SYSTEM:
        return '⚙️';
      case NotificationType.POST:
        return '📝';
      case NotificationType.BOOKMARK:
        return '🔖';
      case NotificationType.ACHIEVEMENT:
        return '🏆';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COMMENT:
      case NotificationType.REPLY:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case NotificationType.LIKE:
        return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
      case NotificationType.FOLLOW:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case NotificationType.MENTION:
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case NotificationType.SYSTEM:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      default:
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyber-cyan mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'No unread notifications'}
            </p>
          </div>

          <div className="flex gap-2">
            {unreadCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => markAllAsRead()}
                className="flex items-center gap-2 rounded-lg bg-cyber-cyan/10 px-4 py-2 text-cyber-cyan hover:bg-cyber-cyan/20"
              >
                <Check className="h-4 w-4" />
                <span>Mark All Read</span>
              </motion.button>
            )}

            <Link href="/settings/notifications">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 hover:bg-muted/80"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/5 p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-cyber-cyan">{stats.total}</p>
            </div>
            <div className="rounded-lg border border-cyber-pink/30 bg-cyber-pink/5 p-4">
              <p className="text-sm text-muted-foreground">Unread</p>
              <p className="text-2xl font-bold text-cyber-pink">{stats.unread}</p>
            </div>
            <div className="rounded-lg border border-cyber-purple/30 bg-cyber-purple/5 p-4">
              <p className="text-sm text-muted-foreground">Read</p>
              <p className="text-2xl font-bold text-cyber-purple">{stats.read}</p>
            </div>
            <div className="rounded-lg border border-cyber-green/30 bg-cyber-green/5 p-4">
              <p className="text-sm text-muted-foreground">Archived</p>
              <p className="text-2xl font-bold text-cyber-green">{stats.archived}</p>
            </div>
          </div>
        )}
      </div>

      {/* 过滤器 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter({})}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-all',
            !filter.type && !filter.status
              ? 'bg-cyber-cyan text-black shadow-[0_0_20px_rgba(0,240,255,0.5)]'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          All
        </button>

        <button
          onClick={() => setFilter({ status: NotificationStatus.UNREAD })}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-all',
            filter.status === NotificationStatus.UNREAD
              ? 'bg-cyber-pink text-black shadow-[0_0_20px_rgba(255,0,128,0.5)]'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          Unread
        </button>

        <button
          onClick={() => setFilter({ status: NotificationStatus.READ })}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-all',
            filter.status === NotificationStatus.READ
              ? 'bg-cyber-purple text-white shadow-[0_0_20px_rgba(157,0,255,0.5)]'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          Read
        </button>

        <div className="ml-auto">
          <select
            value={filter.type || ''}
            onChange={(e) => setFilter({ type: e.target.value as NotificationType })}
            className="rounded-lg border border-cyber-cyan/30 bg-background px-4 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value={NotificationType.COMMENT}>Comments</option>
            <option value={NotificationType.LIKE}>Likes</option>
            <option value={NotificationType.FOLLOW}>Follows</option>
            <option value={NotificationType.MENTION}>Mentions</option>
            <option value={NotificationType.SYSTEM}>System</option>
          </select>
        </div>
      </div>

      {/* 通知列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyber-cyan border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <Bell className="mb-4 h-16 w-16 text-muted-foreground" />
          <p className="text-lg font-medium text-muted-foreground">No notifications</p>
          <p className="text-sm text-muted-foreground">
            {filter.type || filter.status ? 'Try adjusting your filters' : 'You\'re all caught up!'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'rounded-lg border p-4 transition-all hover:shadow-lg',
                getNotificationColor(notification.type),
                notification.status === NotificationStatus.UNREAD && 'border-l-4 border-l-cyber-cyan'
              )}
            >
              <div className="flex gap-4">
                {/* 图标 */}
                <div className="flex-shrink-0 text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* 内容 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {notification.content}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatRelativeTime(new Date(notification.createdAt))}
                      </p>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-1">
                      {notification.status === NotificationStatus.UNREAD && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => markAsRead(notification.id)}
                          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-cyber-cyan/20 hover:text-cyber-cyan"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </motion.button>
                      )}

                      {notification.status === NotificationStatus.READ && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => markAsUnread(notification.id)}
                          className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-cyber-cyan/20 hover:text-cyber-cyan"
                          title="Mark as unread"
                        >
                          <Bell className="h-4 w-4" />
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => archive(notification.id)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-cyber-purple/20 hover:text-cyber-purple"
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteNotification(notification.id)}
                        className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-cyber-pink/20 hover:text-cyber-pink"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
