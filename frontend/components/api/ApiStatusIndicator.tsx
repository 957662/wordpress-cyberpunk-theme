/**
 * API 状态指示器组件
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ApiStatus = 'connected' | 'disconnected' | 'loading' | 'error';

export interface ApiStatusIndicatorProps {
  status: ApiStatus;
  endpoint?: string;
  lastChecked?: Date;
  showText?: boolean;
  className?: string;
}

export function ApiStatusIndicator({
  status,
  endpoint,
  lastChecked,
  showText = true,
  className,
}: ApiStatusIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  const statusConfig = {
    connected: {
      color: 'bg-cyber-green',
      glow: 'shadow-neon-green',
      text: '已连接',
      textColor: 'text-cyber-green',
    },
    disconnected: {
      color: 'bg-gray-500',
      glow: 'shadow-gray-500',
      text: '未连接',
      textColor: 'text-gray-500',
    },
    loading: {
      color: 'bg-cyber-yellow',
      glow: 'shadow-neon-yellow',
      text: '连接中...',
      textColor: 'text-cyber-yellow',
    },
    error: {
      color: 'bg-cyber-pink',
      glow: 'shadow-neon-pink',
      text: '错误',
      textColor: 'text-cyber-pink',
    },
  };

  const config = statusConfig[status];

  // 自动隐藏逻辑（可选）
  useEffect(() => {
    if (status === 'connected') {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (status === 'error' || status === 'disconnected') {
      setIsVisible(true);
    }
  }, [status]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'flex items-center gap-3 px-4 py-2 rounded-lg bg-cyber-card/80 backdrop-blur-sm border border-cyber-border',
            className
          )}
        >
          {/* 状态指示灯 */}
          <div className="relative">
            <motion.div
              className={`w-2 h-2 rounded-full ${config.color}`}
              animate={
                status === 'loading'
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }
                  : status === 'error'
                  ? {
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1],
                    }
                  : {}
              }
              transition={
                status === 'loading'
                  ? {
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : status === 'error'
                  ? {
                      duration: 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : {}
              }
            />
            <div
              className={`absolute inset-0 rounded-full ${config.color} blur-sm ${config.glow}`}
            />
          </div>

          {/* 状态文本 */}
          {showText && (
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${config.textColor}`}>
                {config.text}
              </span>
              {endpoint && (
                <span className="text-xs text-gray-400">{endpoint}</span>
              )}
              {lastChecked && (
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(lastChecked)}
                </span>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return `${seconds}秒前检查`;
  if (minutes < 60) return `${minutes}分钟前检查`;
  return `${hours}小时前检查`;
}

// API 连接监控 Hook
export function useApiConnection(endpoint: string, checkInterval: number = 30000) {
  const [status, setStatus] = useState<ApiStatus>('loading');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(endpoint, { method: 'HEAD' });
        setStatus(response.ok ? 'connected' : 'error');
      } catch (error) {
        setStatus('disconnected');
      }
      setLastChecked(new Date());
    };

    checkConnection();
    const interval = setInterval(checkConnection, checkInterval);

    return () => clearInterval(interval);
  }, [endpoint, checkInterval]);

  return { status, lastChecked };
}
