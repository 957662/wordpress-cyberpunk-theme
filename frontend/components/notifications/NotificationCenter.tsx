'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Trash2, Settings, Award, MessageCircle, Heart, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

// 通知类型定义
export interface Notification {
  id: string
  type: 'comment' | 'like' | 'follow' | 'mention' | 'system' | 'achievement'
  title: string
  content: string
  link?: string
  isRead: boolean
  createdAt: Date
  avatar?: string
  username?: string
}

// 通知类型图标配置
const notificationIcons = {
  comment: { icon: MessageCircle, color: 'text-blue-400', bgColor: 'bg-blue-400/10' },
  like: { icon: Heart, color: 'text-red-400', bgColor: 'bg-red-400/10' },
  follow: { icon: UserPlus, color: 'text-green-400', bgColor: 'bg-green-400/10' },
  mention: { icon: MessageCircle, color: 'text-purple-400', bgColor: 'bg-purple-400/10' },
  system: { icon: Bell, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' },
  achievement: { icon: Award, color: 'text-orange-400', bgColor: 'bg-orange-400/10' },
}

interface NotificationCenterProps {
  notifications?: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onDelete?: (id: string) => void
  onClearAll?: () => void
  className?: string
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const unreadCount = notifications.filter(n => !n.isRead).length

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : !n.isRead
  )

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }
    if (notification.link) {
      window.location.href = notification.link
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return '刚刚'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className={cn('relative', className)}>
      {/* 通知铃铛按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-cyan-400" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* 通知面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 通知内容 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-96 max-h-[600px] bg-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 z-50 overflow-hidden"
            >
              {/* 头部 */}
              <div className="p-4 border-b border-cyan-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-cyan-400">通知中心</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && onMarkAllAsRead && (
                      <button
                        onClick={onMarkAllAsRead}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        全部已读
                      </button>
                    )}
                    {notifications.length > 0 && onClearAll && (
                      <button
                        onClick={onClearAll}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        清空
                      </button>
                    )}
                  </div>
                </div>

                {/* 过滤器 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      'flex-1 px-3 py-1.5 text-xs rounded-lg transition-all',
                      filter === 'all'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    全部 ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={cn(
                      'flex-1 px-3 py-1.5 text-xs rounded-lg transition-all',
                      filter === 'unread'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    )}
                  >
                    未读 ({unreadCount})
                  </button>
                </div>
              </div>

              {/* 通知列表 */}
              <div className="overflow-y-auto max-h-[450px] custom-scrollbar">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Bell className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm">暂无通知</p>
                  </div>
                ) : (
                  <div className="divide-y divide-cyan-500/10">
                    {filteredNotifications.map((notification, index) => {
                      const Icon = notificationIcons[notification.type]?.icon || Bell
                      const iconColor = notificationIcons[notification.type]?.color || 'text-gray-400'
                      const iconBgColor = notificationIcons[notification.type]?.bgColor || 'bg-gray-400/10'

                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleNotificationClick(notification)}
                          className={cn(
                            'p-4 hover:bg-white/5 transition-colors cursor-pointer relative',
                            !notification.isRead && 'bg-cyan-500/5'
                          )}
                        >
                          {!notification.isRead && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
                          )}

                          <div className="flex gap-3">
                            {/* 图标 */}
                            <div className={cn('flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', iconBgColor)}>
                              <Icon className={cn('w-5 h-5', iconColor)} />
                            </div>

                            {/* 内容 */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-white truncate">
                                  {notification.title}
                                </h4>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {notification.content}
                              </p>
                              {notification.username && (
                                <p className="text-xs text-cyan-400 mt-1">
                                  @{notification.username}
                                </p>
                              )}
                            </div>

                            {/* 删除按钮 */}
                            {onDelete && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDelete(notification.id)
                                }}
                                className="flex-shrink-0 p-1 hover:bg-red-500/20 rounded transition-colors group"
                              >
                                <X className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 底部 */}
              <div className="p-3 border-t border-cyan-500/20 bg-black/50">
                <button
                  onClick={() => window.location.href = '/notifications'}
                  className="w-full py-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors text-center"
                >
                  查看所有通知
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// 默认导出
export default NotificationCenter
