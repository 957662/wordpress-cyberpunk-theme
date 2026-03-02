'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'red' | 'green';
  size?: 'sm' | 'md' | 'lg';
  showZero?: boolean;
  pulsing?: boolean;
  className?: string;
  children: React.ReactNode;
}

const colorMap = {
  cyan: 'bg-cyan-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  red: 'bg-red-500',
  green: 'bg-green-500',
};

const sizeMap = {
  sm: 'h-4 min-w-[1rem] text-xs',
  md: 'h-5 min-w-[1.25rem] text-sm',
  lg: 'h-6 min-w-[1.5rem] text-base',
};

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  color = 'red',
  size = 'md',
  showZero = false,
  pulsing = false,
  className = '',
  children,
}) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  const shouldShow = count > 0 || showZero;

  return (
    <div className={`relative inline-flex ${className}`}>
      {children}

      <AnimatePresence>
        {shouldShow && (
          <motion.div
            initial={{ scale: 0, x: 10, y: -10 }}
            animate={{ scale: 1, x: 0, y: 0 }}
            exit={{ scale: 0 }}
            className={`absolute -top-2 -right-2 ${sizeMap[size]} ${colorMap[color]} text-white rounded-full flex items-center justify-center font-bold px-1 shadow-lg border-2 border-gray-900`}
          >
            {pulsing && count > 0 && (
              <motion.span
                className={`absolute inset-0 ${colorMap[color]} rounded-full`}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            )}
            <span className="relative z-10">{displayCount}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBadge;
