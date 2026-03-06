'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bell, MessageCircle, Heart, Bookmark, UserPlus, AlertCircle, CheckCircle, X } from 'lucide-react';

export type NotificationType =
  | 'comment'
  | 'like'
  | 'bookmark'
  | 'follow'
  | 'system'
  | 'mention'
  | 'reply';

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read?: boolean;
  avatar?: string;
  actionUrl?: string;
  onRead?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  type,
  title,
  message,
  time,
  read = false,
  avatar,
  actionUrl,
  onRead,
  onDismiss,
  className
}) => {
  const config = {
    comment: {
      icon: MessageCircle,
      color: 'cyan',
      bgColor: 'bg-cyber-cyan/10',
      textColor: 'text-cyber-cyan'
    },
    like: {
      icon: Heart,
      color: 'pink',
      bgColor: 'bg-cyber-pink/10',
      textColor: 'text-cyber-pink'
    },
    bookmark: {
      icon: Bookmark,
      color: 'purple',
      bgColor: 'bg-cyber-purple/10',
      textColor: 'text-cyber-purple'
    },
    follow: {
      icon: UserPlus,
      color: 'green',
      bgColor: 'bg-cyber-green/10',
      textColor: 'text-cyber-green'
    },
    system: {
      icon: Bell,
      color: 'yellow',
      bgColor: 'bg-cyber-yellow/10',
      textColor: 'text-cyber-yellow'
    },
    mention: {
      icon: AlertCircle,
      color: 'cyan',
      bgColor: 'bg-cyber-cyan/10',
      textColor: 'text-cyber-cyan'
    },
    reply: {
      icon: MessageCircle,
      color: 'cyan',
      bgColor: 'bg-cyber-cyan/10',
      textColor: 'text-cyber-cyan'
    }
  };

  const { icon: Icon, bgColor, textColor } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'relative p-4 rounded-lg border transition-all duration-200',
        'hover:shadow-lg hover:shadow-cyber-cyan/5',
        read
          ? 'bg-cyber-dark/30 border-gray-800'
          : 'bg-cyber-dark/50 border-cyber-cyan/30',
        !read && 'shadow-sm shadow-cyber-cyan/10',
        className
      )}
    >
      {/* 未读标记 */}
      {!read && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-cyber-cyan rounded-full animate-pulse" />
      )}

      {/* 关闭按钮 */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex gap-4">
        {/* 图标 */}
        <div className={cn('p-3 rounded-lg', bgColor, 'flex-shrink-0')}>
          <Icon className={cn('w-5 h-5', textColor)} />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          {/* 标题 */}
          <h4 className={cn(
            'font-semibold mb-1',
            read ? 'text-gray-400' : 'text-white'
          )}>
            {title}
          </h4>

          {/* 消息 */}
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {message}
          </p>

          {/* 时间 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{time}</span>

            {/* 操作按钮 */}
            {actionUrl && !read && (
              <button
                onClick={onRead}
                className={cn(
                  'px-3 py-1 text-xs font-medium rounded transition-colors',
                  'bg-cyber-cyan/10 text-cyber-cyan',
                  'hover:bg-cyber-cyan/20'
                )}
              >
                查看
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 通知列表
export const NotificationList: React.FC<{
  notifications: Array<{
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read?: boolean;
  }>;
  onRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  className?: string;
}> = ({ notifications, onRead, onDismiss, className }) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>暂无通知</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          {...notification}
          onRead={() => onRead?.(notification.id)}
          onDismiss={() => onDismiss?.(notification.id)}
        />
      ))}
    </div>
  );
};

// 通知摘要
export const NotificationSummary: React.FC<{
  unreadCount: number;
  totalCount: number;
  onClick?: () => void;
  className?: string;
}> = ({ unreadCount, totalCount, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-3 rounded-lg border transition-all duration-200',
        'hover:shadow-lg',
        'bg-cyber-dark/50 border-cyber-cyan/30',
        className
      )}
    >
      <Bell className="w-5 h-5 text-cyber-cyan" />

      {/* 未读徽章 */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-cyber-pink text-white text-xs font-bold rounded-full">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      <span className="sr-only">通知 ({unreadCount} 未读)</span>
    </button>
  );
};

export default NotificationCard;
