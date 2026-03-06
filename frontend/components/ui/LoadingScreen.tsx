'use client';

/**
 * LoadingScreen - 全局加载屏幕组件
 * 用于页面加载、认证检查等场景
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  fullscreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  size = 'md',
  text = '加载中...',
  className,
  fullscreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loader2 className={cn('animate-spin text-cyan-400', sizeClasses[size])} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={cn('text-gray-400', textSizeClasses[size])}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingScreen;
