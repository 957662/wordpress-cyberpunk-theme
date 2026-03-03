/**
 * 通知面板组件
 * 显示通知列表和快速操作
 */

'use client';

import { motion } from 'framer-motion';
import { Check, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notification } from '@/types/social.types';
import { formatDistanceToNow } from '@/lib/utils';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useDeleteNotification } from '@/hooks/useSocialQueries';
import Link from 'next/link';

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onClose: () => void;
}

/**
 * 通知图标映射
 */
const notificationIcons: Record<string, string> = {
  follow: '👤',
  like: '❤️',
  comment: '💬',
  mention: '📢',
  reply: '↩️',
  bookmark: '🔖',
  system: '🔔',
};

/**
 * 通知面板组件
 */
export default function NotificationPanel({
  notifications,
  unreadCount,
  onClose,
}: NotificationPanelProps) {
  const markAllRead = useMarkAllNotificationsRead();
  const markRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();

  /**
   * 标记所有为已读
   */
  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync();
    } catch (error) {
      console.error('标记失败:', error);
    }
  };

  /**
   * 标记单个通知为已读
   */
  const handleMarkRead = async (notificationId: number) => {
    try {
      await markRead.mutateAsync(notificationId);
    } catch (error) {
      console.error('标记失败:', error);
    }
  };

  /**
   * 删除通知
   */
  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification.mutateAsync(notificationId);
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  /**
   * 渲染通知项
   */
  const renderNotification = (notification: Notification) => {
    const icon = notificationIcons[notification.type] || '📌';
    const timeAgo = formatDistanceToNow(new Date(notification.created_at));

    return (
      <motion.div
        key={notification.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-3 border-b border-cyber-cyan/10 last:border-0 hover:bg-cyber-cyan/5 transition-colors ${
          !notification.is_read ? 'bg-cyber-purple/10' : ''
        }`}
      >
        <div className="flex gap-3">
          {/* 图标 */}
          <div className="text-2xl">{icon}</div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cyber-cyan line-clamp-2">
              {notification.title}
            </p>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {notification.content}
            </p>
            <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col gap-1">
            {!notification.is_read && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => handleMarkRead(Number(notification.id))}
              >
                <Check className="w-3 h-3" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-red-400 hover:text-red-300"
              onClick={() => handleDelete(Number(notification.id))}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="notification-panel">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-cyber-cyan/20">
        <div>
          <h3 className="font-bold text-cyber-cyan">通知</h3>
          <p className="text-xs text-gray-400">
            {unreadCount} 条未读
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Link href="/notifications" onClick={onClose}>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 通知列表 */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>暂无通知</p>
          </div>
        ) : (
          notifications.map(notification => renderNotification(notification))
        )}
      </div>

      {/* 底部 */}
      <div className="p-3 border-t border-cyber-cyan/20">
        <Link href="/notifications" onClick={onClose}>
          <Button variant="outline" className="w-full border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10">
            查看全部通知
          </Button>
        </Link>
      </div>
    </div>
  );
}
