'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  className,
}: StatsCardProps) {
  const trendColors = {
    up: 'text-cyber-green',
    down: 'text-cyber-pink',
    neutral: 'text-gray-500',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn('cyber-card', className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-cyber-cyan/10 rounded-lg">
          <Icon className="w-6 h-6 text-cyber-cyan" />
        </div>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 text-sm', trendColors[trend])}>
            <span>{trendIcons[trend]}</span>
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

export default StatsCard;
