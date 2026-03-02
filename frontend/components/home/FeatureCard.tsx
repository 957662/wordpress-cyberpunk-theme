'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  delay?: number;
}

const colorConfig = {
  cyan: {
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'group-hover:shadow-cyan-500/20',
  },
  purple: {
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'group-hover:shadow-purple-500/20',
  },
  pink: {
    gradient: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    glow: 'group-hover:shadow-pink-500/20',
  },
  yellow: {
    gradient: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'group-hover:shadow-yellow-500/20',
  },
};

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  color = 'cyan',
  delay = 0,
}) => {
  const config = colorConfig[color];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ y: -8 }}
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-gradient-to-br p-6',
        'transition-all duration-300 hover:border-opacity-50',
        config.border,
        config.gradient,
        config.glow,
        'hover:shadow-xl'
      )}
    >
      {/* 背景动画 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* 图标 */}
      <div className={cn(
        'mb-4 inline-flex rounded-lg bg-gray-900/50 p-3',
        'transition-all duration-300 group-hover:scale-110 group-hover:rotate-3'
      )}>
        <Icon className={cn('h-6 w-6', config.text)} />
      </div>

      {/* 标题 */}
      <h3 className="mb-2 text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>

      {/* 描述 */}
      <p className="text-gray-400">
        {description}
      </p>

      {/* 装饰线 */}
      <div className={cn(
        'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r w-0',
        'transition-all duration-300 group-hover:w-full',
        color === 'cyan' && 'from-cyan-500 to-blue-500',
        color === 'purple' && 'from-purple-500 to-pink-500',
        color === 'pink' && 'from-pink-500 to-rose-500',
        color === 'yellow' && 'from-yellow-500 to-orange-500'
      )} />
    </motion.div>
  );
};

export default FeatureCard;
