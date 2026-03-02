/**
 * EmptyState - 空状态组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'minimal' | 'illustrated';
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center',
        'text-center p-8',
        variant === 'default' && 'min-h-[400px]',
        variant === 'minimal' && 'py-12',
        className
      )}
    >
      {Icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="mb-4"
        >
          <div
            className={cn(
              'flex items-center justify-center rounded-full',
              variant === 'illustrated'
                ? 'w-24 h-24 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20'
                : 'w-16 h-16 bg-cyber-dark/50 border border-cyber-cyan/30'
            )}
          >
            <Icon
              className={cn(
                'text-cyber-cyan',
                variant === 'illustrated' ? 'w-12 h-12' : 'w-8 h-8'
              )}
            />
          </div>
        </motion.div>
      )}

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-white mb-2"
      >
        {title}
      </motion.h3>

      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 max-w-md mb-6"
        >
          {description}
        </motion.p>
      )}

      {action && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={action.onClick}
          className={cn(
            'px-6 py-2.5 rounded-lg font-medium',
            'bg-cyber-purple text-white',
            'hover:bg-cyber-purple/90',
            'shadow-lg shadow-cyber-purple/50',
            'transition-all hover:scale-105 active:scale-95'
          )}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

// 加载状态组件
export interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingState({ title = '加载中...', description, className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="flex space-x-2 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-cyber-cyan rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      {title && <p className="text-white font-medium mb-1">{title}</p>}
      {description && <p className="text-gray-400 text-sm">{description}</p>}
    </div>
  );
}

// 错误状态组件
export interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function ErrorState({
  title = '出错了',
  description = '抱歉，加载内容时出现错误',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <div className="w-16 h-16 bg-cyber-pink/10 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-cyber-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 bg-cyber-cyan text-cyber-dark rounded-lg font-medium hover:bg-cyber-cyan/90 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
