/**
 * ViewToggle - 视图切换组件
 * 切换博客列表的显示模式（网格/列表/紧凑）
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, List, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { BlogViewType } from '@/types/models/blog';

interface ViewToggleProps {
  value: BlogViewType;
  onChange: (value: BlogViewType) => void;
  className?: string;
}

const VIEW_OPTIONS = [
  { value: 'grid' as const, icon: Grid3X3, label: '网格视图' },
  { value: 'list' as const, icon: List, label: '列表视图' },
  { value: 'compact' as const, icon: Maximize2, label: '紧凑视图' },
];

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn('inline-flex items-center gap-1 p-1 rounded-lg bg-slate-800', className)}>
      {VIEW_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;

        return (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative px-3 py-2 rounded-md transition-all duration-200',
              isActive
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            )}
            title={option.label}
            aria-label={option.label}
            aria-pressed={isActive}
          >
            <Icon className="w-4 h-4" />
          </motion.button>
        );
      })}
    </div>
  );
}

export default ViewToggle;
