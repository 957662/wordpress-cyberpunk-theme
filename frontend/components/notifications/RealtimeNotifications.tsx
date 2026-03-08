'use client';

/**
 * RealtimeNotifications - 实时通知组件
 * 使用 WebSocket 实现实时通知推送
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CyberButton } from '@/components/ui/CyberButton';
import { Card } from '@/components/ui/Card';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface RealtimeNotificationsProps {
  wsUrl?: string;
  maxNotifications?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function RealtimeNotifications({
  wsUrl = 'ws://localhost:8000/ws/notifications',
  maxNotifications = 5,
  position = 'top-right',
}: RealtimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // 连接 WebSocket
  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          // 发送认证信息
          ws.send(JSON.stringify({
            type: 'auth',
            token: localStorage.getItem('token'),
          }));
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            addNotification(data.notification);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          // 自动重连
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [wsUrl]);

  // 添加通知
  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      const newNotifications = [notification, ...prev];
      // 限制通知数量
      if (newNotifications.length > maxNotifications) {
        return newNotifications.slice(0, maxNotifications);
      }
      return newNotifications;
    });

    // 播放通知声音
    playNotificationSound();
  }, [maxNotifications]);

  // 播放通知声音
  const playNotificationSound = useCallback(() => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(console.error);
  }, []);

  // 标记为已读
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // 删除通知
  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // 清空所有通知
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // 标记所有为已读
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  }, []);

  // 未读通知数量
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 通知图标样式
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  };

  // 通知颜色样式
  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-cyber-green bg-cyber-green/10';
      case 'warning':
        return 'border-cyber-yellow bg-cyber-yellow/10';
      case 'error':
        return 'border-cyber-pink bg-cyber-pink/10';
      default:
        return 'border-cyber-cyan bg-cyber-cyan/10';
    }
  };

  // 位置样式
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <>
      {/* 通知按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-cyber-cyan/10 transition-colors"
      >
        <Bell className={cn(
          'w-6 h-6 transition-colors',
          isConnected ? 'text-cyber-cyan' : 'text-gray-500'
        )} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-pink text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount}
          </motion.span>
        )}
        {/* 连接状态指示器 */}
        <span className={cn(
          'absolute bottom-0 right-0 w-2 h-2 rounded-full',
          isConnected ? 'bg-cyber-green' : 'bg-gray-500'
        )} />
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
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* 通知列表 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'fixed z-50 w-96 max-h-[600px] cyber-card overflow-hidden',
                positionStyles[position]
              )}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-cyber-border">
                <div>
                  <h3 className="text-lg font-bold text-white">通知</h3>
                  <p className="text-sm text-gray-400">
                    {unreadCount} 条未读
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="p-2 rounded hover:bg-cyber-cyan/10 transition-colors"
                    title="全部标为已读"
                  >
                    <Check className="w-4 h-4 text-cyber-cyan" />
                  </button>
                  <button
                    onClick={clearAll}
                    className="p-2 rounded hover:bg-cyber-pink/10 transition-colors"
                    title="清空所有"
                  >
                    <Trash2 className="w-4 h-4 text-cyber-pink" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded hover:bg-cyber-cyan/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* 通知列表 */}
              <div className="overflow-y-auto max-h-[500px] p-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>暂无通知</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => markAsRead(notification.id)}
                        className={cn(
                          'p-3 mb-2 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02]',
                          getNotificationColor(notification.type),
                          !notification.read && 'shadow-lg'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* 图标 */}
                          <div className={cn(
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold',
                            notification.type === 'success' && 'bg-cyber-green',
                            notification.type === 'warning' && 'bg-cyber-yellow',
                            notification.type === 'error' && 'bg-cyber-pink',
                            notification.type === 'info' && 'bg-cyber-cyan'
                          )}>
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* 内容 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-cyber-cyan rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleString('zh-CN')}
                            </p>
                          </div>

                          {/* 删除按钮 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="flex-shrink-0 p-1 rounded hover:bg-cyber-pink/20 transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-400 hover:text-cyber-pink" />
                          </button>
                        </div>

                        {/* 操作按钮 */}
                        {notification.action && (
                          <div className="mt-2">
                            <CyberButton
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action!.onClick();
                              }}
                            >
                              {notification.action.label}
                            </CyberButton>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* 底部 */}
              <div className="p-3 border-t border-cyber-border text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-cyber-cyan hover:text-cyber-purple transition-colors"
                >
                  查看所有通知
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default RealtimeNotifications;
