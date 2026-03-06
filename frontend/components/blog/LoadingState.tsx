'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BlogLoadingStateProps {
  type?: 'list' | 'grid' | 'card' | 'skeleton';
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function BlogLoadingState({ type = 'list', count = 6, columns = 3, className }: BlogLoadingStateProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const SkeletonItem = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-card overflow-hidden">
      <div className="aspect-video bg-cyber-dark/50 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="p-6 space-y-4">
        <div className="h-6 w-20 bg-cyber-dark/50 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-cyber-dark/50 rounded animate-pulse" />
          <div className="h-6 w-1/2 bg-cyber-dark/50 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-cyber-dark/50 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-cyber-dark/50 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  );

  if (type === 'skeleton') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="h-8 w-48 bg-cyber-dark/50 rounded animate-pulse mb-8" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-24 bg-cyber-dark/30 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="cyber-card p-6 flex gap-6">
            <div className="w-48 h-32 bg-cyber-dark/50 rounded relative overflow-hidden flex-shrink-0">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-6 w-32 bg-cyber-dark/50 rounded animate-pulse" />
              <div className="h-7 w-full bg-cyber-dark/50 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-cyber-dark/50 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <SkeletonItem />
        </motion.div>
      ))}
    </div>
  );
}

export default BlogLoadingState;
