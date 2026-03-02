'use client';

/**
 * Notification Center Component
 * 通知中心组件，支持多种通知类型、分组、筛选
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Settings, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  category?: string;
}

interface NotificationCenterProps {
  /**
   * 通知列表
   */
  notifications: Notification[];
  /**
   * 标记已读回调
   */
  onMarkAsRead: (id: string) => void;
  /**
   * 删除通知回调
   */
  onDelete: (id: string) => void;
  /**
   * 全部标记已读回调
   */
  onMarkAllAsRead?: () => void;
  /**
   * 清空所有回调
   */
  onClearAll?: () => void;
  /**
   * 自定义样式
   */
  className?: string;
  /**
   * 位置
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// 通知图标
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    default:
      return Info;
  }
};

// 通知颜色
const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-400 bg-green-500/20 border-green-500/30';
    case 'warning':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    case 'error':
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    default:
      return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
  }
};

// 优先级指示器
const PriorityIndicator: React.FC<{ priority: NotificationPriority }> = ({ priority }) => {
  const colors = {
    low: 'bg-gray-500',
    medium: 'bg-cyan-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500 animate-pulse',
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'w-0.5 h-3 rounded-full',
            i <= { low: 1, medium: 2, high: 3, urgent: 3 }[priority]
              ? colors[priority]
              : 'bg-gray-700'
          )}
        />
      ))}
    </div>
  );
};

// 通知项
const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  const Icon = getNotificationIcon(notification.type);
  const [isExiting, setIsExiting] = useState(false);

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    setIsExiting(true);
    setTimeout(() => onDelete(notification.id), 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className={cn(
        'relative p-4 rounded-xl border cursor-pointer transition-all',
        'hover:bg-white/5',
        notification.read ? 'opacity-60' : 'opacity-100',
        getNotificationColor(notification.type)
      )}
    >
      <div className="flex items-start gap-3">
        {/* 图标 */}
        <div className="flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-white text-sm">{notification.title}</h4>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
            )}
          </div>
          <p className="text-sm text-gray-300 line-clamp-2">{notification.message}</p>

          {/* 元数据 */}
          <div className="flex items-center gap-3 mt-2">
            <PriorityIndicator priority={notification.priority} />
            <span className="text-xs text-gray-500">
              {notification.timestamp.toLocaleString()}
            </span>
            {notification.category && (
              <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">
                {notification.category}
              </span>
            )}
          </div>

          {/* 操作按钮 */}
          {notification.action && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                notification.action?.onClick();
              }}
              className="mt-3 px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              {notification.action.label}
            </motion.button>
          )}
        </div>

        {/* 删除按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </motion.div>
  );
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onClearAll,
  className,
  position = 'top-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // 获取未读数量
  const unreadCount = notifications.filter(n => !n.read).length;

  // 获取分类
  const categories = Array.from(new Set(notifications.map(n => n.category).filter(Boolean) as string[]));

  // 筛选通知
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (filter === 'important' && !['high', 'urgent'].includes(n.priority)) return false;
    if (categoryFilter && n.category !== categoryFilter) return false;
    return true;
  });

  // 位置样式
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-20 right-6';
      case 'top-left':
        return 'top-20 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      default:
        return 'top-20 right-6';
    }
  };

  return (
    <>
      {/* 通知按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl hover:bg-white/10 transition-colors"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* 通知面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* 面板 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'fixed z-50 w-96 max-w-[calc(100vw-3rem)] max-h-[600px]',
                'bg-black/95 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl',
                'flex flex-col overflow-hidden',
                getPositionClasses(),
                className
              )}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="font-semibold text-white">通知</h3>
                    <p className="text-xs text-gray-500">
                      {unreadCount} 条未读
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onMarkAllAsRead && (
                    <button
                      onClick={() => onMarkAllAsRead()}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="全部已读"
                    >
                      <Check className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  {onClearAll && (
                    <button
                      onClick={() => onClearAll()}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="清空所有"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* 筛选器 */}
              <div className="p-4 border-b border-cyan-500/10 space-y-3">
                {/* 快速筛选 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-colors',
                      filter === 'all'
                        ? 'bg-cyan-500/30 text-cyan-300'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    )}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-colors',
                      filter === 'unread'
                        ? 'bg-cyan-500/30 text-cyan-300'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    )}
                  >
                    未读
                  </button>
                  <button
                    onClick={() => setFilter('important')}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-colors',
                      filter === 'important'
                        ? 'bg-cyan-500/30 text-cyan-300'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    )}
                  >
                    重要
                  </button>
                </div>

                {/* 分类筛选 */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCategoryFilter(null)}
                      className={cn(
                        'px-2 py-1 text-xs rounded-full transition-colors',
                        !categoryFilter
                          ? 'bg-cyan-500/30 text-cyan-300'
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      )}
                    >
                      全部分类
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={cn(
                          'px-2 py-1 text-xs rounded-full transition-colors',
                          categoryFilter === cat
                            ? 'bg-cyan-500/30 text-cyan-300'
                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                          )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 通知列表 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <AnimatePresence>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={onMarkAsRead}
                        onDelete={onDelete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-500">暂无通知</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* 底部统计 */}
              <div className="p-4 border-t border-cyan-500/10">
                <p className="text-xs text-gray-500 text-center">
                  共 {notifications.length} 条通知
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
