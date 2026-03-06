'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Grid, List, Rows3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlogViewMode } from '@/types/blog';

export interface BlogViewToggleProps {
  viewMode: BlogViewMode;
  onViewModeChange: (mode: BlogViewMode) => void;
  className?: string;
}

const viewModes: Array<{
  value: BlogViewMode;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: 'grid', label: '网格', icon: <Grid className="w-4 h-4" /> },
  { value: 'list', label: '列表', icon: <List className="w-4 h-4" /> },
  { value: 'compact', label: '紧凑', icon: <Rows3 className="w-4 h-4" /> },
];

export function BlogViewToggle({
  viewMode,
  onViewModeChange,
  className,
}: BlogViewToggleProps) {
  return (
    <div className={cn('cyber-card p-1 inline-flex', className)}>
      {viewModes.map((mode) => (
        <motion.button
          key={mode.value}
          onClick={() => onViewModeChange(mode.value)}
          className={cn(
            'px-3 py-2 rounded-md flex items-center gap-2 transition-all duration-200',
            viewMode === mode.value
              ? 'bg-cyber-cyan text-cyber-dark shadow-lg'
              : 'text-gray-400 hover:text-cyber-cyan hover:bg-cyber-cyan/10'
          )}
          whileHover={{ scale: viewMode === mode.value ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
          title={mode.label}
        >
          {mode.icon}
          <span className="text-sm font-medium hidden sm:inline">
            {mode.label}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export default BlogViewToggle;
