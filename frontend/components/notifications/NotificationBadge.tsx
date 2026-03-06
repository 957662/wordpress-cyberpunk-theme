/**
 * NotificationBadge - 通知徽章组件
 * 带计数的通知铃铛图标
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useState, useEffect } from 'react';

export interface NotificationBadgeProps {
  count?: number;
  maxCount?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  pulse?: boolean;
  onClick?: () => void;
}

export function NotificationBadge({
  count = 0,
  maxCount = 99,
  color = 'pink',
  size = 'md',
  className,
  pulse = true,
  onClick,
}: NotificationBadgeProps) {
  const [prevCount, setPrevCount] = useState(count);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (count !== prevCount) {
      setAnimate(true);
      setPrevCount(count);
      setTimeout(() => setAnimate(false), 500);
    }
  }, [count, prevCount]);

  const sizes = {
    sm: { icon: 'w-4 h-4', badge: 'w-4 h-4 text-[10px]' },
    md: { icon: 'w-5 h-5', badge: 'w-5 h-5 text-xs' },
    lg: { icon: 'w-6 h-6', badge: 'w-6 h-5 text-sm' },
  };

  const colors = {
    cyan: 'bg-cyber-cyan text-cyber-dark',
    purple: 'bg-cyber-purple text-white',
    pink: 'bg-cyber-pink text-white',
    yellow: 'bg-cyber-yellow text-cyber-dark',
    red: 'bg-red-500 text-white',
  };

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center p-2 rounded-lg',
        'text-gray-400 hover:text-cyber-cyan',
        'transition-colors duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      animate={animate ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* 铃铛图标 */}
      <Bell className={sizes[size].icon} />

      {/* 徽章 */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={cn(
              'absolute -top-1 -right-1 flex items-center justify-center rounded-full font-bold',
              sizes[size].badge,
              colors[color],
              pulse && 'animate-pulse'
            )}
            style={{
              boxShadow: `0 0 10px ${color === 'red' ? '#ef4444' : colors[color].split(' ')[0].replace('bg-', '')}`,
            }}
          >
            {displayCount}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
