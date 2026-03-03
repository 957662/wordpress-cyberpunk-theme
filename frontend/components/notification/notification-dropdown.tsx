/**
 * 通知下拉组件
 * 显示用户的通知列表
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellDot, X, Check, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notificationService, Notification } from '@/services/notificationService';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface NotificationDropdownProps {
  trigger?: React.ReactNode;
  className?: string;
}

export function NotificationDropdown({
  trigger,
  className,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();

    // 点击外部关闭
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications({
        pageSize: 10,
      });
      setNotifications(data.items);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const stats = await notificationService.getNotificationStats();
      setUnreadCount(stats.unread);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
      toast.success('已全部标记为已读');
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (notifications.find((n) => n.id === notificationId)?.isRead === false) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = 'h-5 w-5';
    switch (type) {
      case 'follow':
        return <span className={iconClass}>👤</span>;
      case 'like':
        return <span className={iconClass}>❤️</span>;
      case 'comment':
      case 'reply':
        return <span className={iconClass}>💬</span>;
      case 'mention':
        return <span className={iconClass}>🔔</span>;
      case 'system':
        return <span className={iconClass}>⚙️</span>;
      default:
        return <span className={iconClass}>📬</span>;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'follow':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'like':
        return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'comment':
      case 'reply':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'mention':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'system':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-lg p-2 transition-colors hover:bg-cyber-primary/10"
      >
        {unreadCount > 0 ? (
          <BellDot className="h-6 w-6 text-cyber-primary" />
        ) : (
          <Bell className="h-6 w-6" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyber-pink text-xs font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 w-96 rounded-xl border border-cyber-border bg-background/95 backdrop-blur-lg shadow-2xl"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between border-b border-cyber-border px-4 py-3">
              <h3 className="font-bold">通知</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="rounded-lg p-1.5 text-sm text-cyber-primary transition-colors hover:bg-cyber-primary/10"
                    title="全部标记为已读"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-cyber-primary/10"
                  title="通知设置"
                >
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 通知列表 */}
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyber-primary border-t-transparent" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Bell className="mb-2 h-12 w-12 opacity-20" />
                  <p>暂无通知</p>
                </div>
              ) : (
                <div className="divide-y divide-cyber-border">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        'relative px-4 py-3 transition-colors hover:bg-cyber-primary/5',
                        !notification.isRead && 'bg-cyber-primary/5'
                      )}
                    >
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                            getNotificationColor(notification.type)
                          )}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-tight">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.content}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              {
                                addSuffix: true,
                                locale: zhCN,
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="rounded p-1 text-cyber-primary transition-colors hover:bg-cyber-primary/10"
                              title="标记为已读"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                            title="删除"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 底部 */}
            <div className="border-t border-cyber-border px-4 py-2">
              <button
                className="w-full rounded-lg py-2 text-center text-sm text-cyber-primary transition-colors hover:bg-cyber-primary/10"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/notifications';
                }}
              >
                查看全部通知
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
