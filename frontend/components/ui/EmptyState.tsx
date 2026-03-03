/**
 * 空状态组件
 * 用于显示列表、搜索结果等为空时的状态
 */

'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: {
    icon: 'w-12 h-12',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    icon: 'w-16 h-16',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    icon: 'w-24 h-24',
    title: 'text-2xl',
    description: 'text-lg',
  },
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = 'md',
}: EmptyStateProps) {
  const styles = sizeStyles[size];

  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-8', className)}>
      {Icon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className={cn('mb-4 text-cyber-border', styles.icon)}
        >
          <Icon className="w-full h-full" />
        </motion.div>
      )}

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn('font-semibold text-white mb-2', styles.title)}
      >
        {title}
      </motion.h3>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn('text-gray-400 mb-6 max-w-md', styles.description)}
        >
          {description}
        </motion.p>
      )}

      {action && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-6 py-2 bg-cyber-cyan text-cyber-dark rounded-lg font-medium hover:bg-cyber-cyan/90 transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </div>
  );
}

export default EmptyState;
