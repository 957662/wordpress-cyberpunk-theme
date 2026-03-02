/**
 * Timeline - 时间轴组件
 */

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  icon?: ReactNode;
  status?: 'completed' | 'current' | 'pending' | 'error';
  content?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  variant?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Timeline({ items, variant = 'vertical', size = 'md', className }: TimelineProps) {
  const sizeStyles = {
    sm: {
      dot: 'w-3 h-3',
      line: 'w-0.5',
    },
    md: {
      dot: 'w-4 h-4',
      line: 'w-0.5',
    },
    lg: {
      dot: 'w-5 h-5',
      line: 'w-1',
    },
  };

  const getStatusColor = (status?: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-cyber-cyan';
      case 'current':
        return 'bg-cyber-purple';
      case 'error':
        return 'bg-cyber-pink';
      default:
        return 'bg-gray-600';
    }
  };

  if (variant === 'horizontal') {
    return (
      <div className={cn('relative', className)}>
        <div className="flex items-center justify-between">
          {items.map((item, index) => (
            <div key={item.id} className="flex-1 flex flex-col items-center">
              {/* 时间点 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'relative z-10 rounded-full border-2 border-cyber-dark',
                  sizeStyles[size].dot,
                  getStatusColor(item.status),
                  item.status === 'current' && 'shadow-lg shadow-cyber-purple/50'
                )}
              >
                {item.icon}
              </motion.div>

              {/* 连接线 */}
              {index < items.length - 1 && (
                <div
                  className={cn(
                    'absolute top-1/2 left-1/2 h-0.5 bg-cyber-cyan/30',
                    'transform -translate-y-1/2'
                  )}
                  style={{ right: '-50%', width: 'calc(100% - 1rem)' }}
                />
              )}

              {/* 标题 */}
              <div className="mt-2 text-center">
                <p className="text-sm font-medium text-white">{item.title}</p>
                {item.date && <p className="text-xs text-gray-400">{item.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-cyber-cyan/30" />

      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-10"
          >
            {/* 时间点 */}
            <div
              className={cn(
                'absolute left-2.5 top-1.5 rounded-full border-2 border-cyber-dark',
                sizeStyles[size].dot,
                getStatusColor(item.status),
                item.status === 'current' && 'shadow-lg shadow-cyber-purple/50'
              )}
            >
              {item.icon}
            </div>

            {/* 内容 */}
            <div className="bg-cyber-dark/50 border border-cyber-cyan/20 rounded-lg p-4 hover:border-cyber-cyan/40 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                {item.date && <span className="text-sm text-gray-400">{item.date}</span>}
              </div>

              {item.description && (
                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
              )}

              {item.content && <div className="mt-3">{item.content}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
