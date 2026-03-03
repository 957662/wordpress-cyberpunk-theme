/**
 * 通知铃铛组件
 * 显示通知图标和未读数量
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotificationStats, useNotifications } from '@/hooks/useSocialQueries';
import NotificationPanel from './NotificationPanel';

/**
 * 通知铃铛组件
 */
export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: stats, isLoading } = useNotificationStats();
  const { data: notifications } = useNotifications({ page: 1, limit: 5 });

  const unreadCount = stats?.unread || 0;

  /**
   * 切换面板显示
   */
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  /**
   * 点击外部关闭面板
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.notification-bell-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="notification-bell-container relative">
      {/* 铃铛按钮 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePanel}
        className="relative text-cyber-cyan hover:text-cyber-purple hover:bg-cyber-cyan/10"
      >
        <Bell className="w-5 h-5" />
        
        {/* 未读数量徽章 */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-cyber-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      {/* 通知面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-80 bg-cyber-dark border border-cyber-cyan/30 rounded-lg shadow-xl shadow-cyber-cyan/20 z-50"
          >
            <NotificationPanel
              notifications={notifications?.notifications || []}
              unreadCount={unreadCount}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
