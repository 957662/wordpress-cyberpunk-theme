'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'dots' | 'pulse' | 'bars';
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: 'border-cyan-500 text-cyan-500',
  purple: 'border-purple-500 text-purple-500',
  pink: 'border-pink-500 text-pink-500',
  green: 'border-green-500 text-green-500',
  yellow: 'border-yellow-500 text-yellow-500',
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'md',
  color = 'cyan',
  text,
  fullScreen = false,
  className = '',
}) => {
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {type === 'spinner' && (
        <motion.div
          className={cn('border-4 border-t-transparent rounded-full', colors, sizes)}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {type === 'dots' && (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn('rounded-full bg-current', colors, size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4')}
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}

      {type === 'pulse' && (
        <motion.div
          className={cn('rounded-full bg-current', colors, sizes)}
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {type === 'bars' && (
        <div className="flex gap-1 items-end">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className={cn('bg-current rounded-sm', colors, size === 'sm' ? 'w-1 h-6' : size === 'md' ? 'w-1.5 h-8' : 'w-2 h-10')}
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}

      {type === 'skeleton' && (
        <div className="space-y-3 w-full max-w-md">
          {/* 标题骨架 */}
          <motion.div
            className={cn('h-6 rounded bg-gray-800', colors)}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* 内容骨架 */}
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={cn('h-4 rounded bg-gray-800', colors)}
                style={{ width: `${Math.random() * 30 + 70}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>

          {/* 图片骨架 */}
          <motion.div
            className={cn('h-40 rounded-lg bg-gray-800', colors)}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      )}

      {text && (
        <motion.p
          className={cn('text-sm font-medium', colors)}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

// 文章卡片骨架屏
export const ArticleCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden', className)}>
    {/* 图片骨架 */}
    <motion.div
      className="h-48 bg-gray-800"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />

    {/* 内容骨架 */}
    <div className="p-6 space-y-4">
      <motion.div
        className="h-6 bg-gray-800 rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
      />

      <motion.div
        className="h-4 bg-gray-800 rounded w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />

      <motion.div
        className="h-4 bg-gray-800 rounded w-2/3"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      />

      {/* 元信息骨架 */}
      <div className="flex items-center gap-3">
        <motion.div
          className="h-4 bg-gray-800 rounded w-20"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
        <motion.div
          className="h-4 bg-gray-800 rounded w-16"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>
    </div>
  </div>
);

// 列表骨架屏
export const ListSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className = '',
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex gap-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
      >
        <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-800 rounded w-1/2" />
        </div>
      </motion.div>
    ))}
  </div>
);

// 表格骨架屏
export const TableSkeleton: React.FC<{ rows?: number; cols?: number; className?: string }> = ({
  rows = 5,
  cols = 4,
  className = '',
}) => (
  <div className={cn('space-y-3', className)}>
    {/* 表头 */}
    <div className="flex gap-4 pb-3 border-b border-gray-800">
      {Array.from({ length: cols }).map((_, i) => (
        <motion.div
          key={`header-${i}`}
          className="h-6 bg-gray-800 rounded flex-1"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>

    {/* 表格行 */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex gap-4 py-3">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <motion.div
            key={`cell-${rowIndex}-${colIndex}`}
            className="h-4 bg-gray-800 rounded flex-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: (rowIndex * cols + colIndex) * 0.05 }}
          />
        ))}
      </div>
    ))}
  </div>
);

export default LoadingState;
