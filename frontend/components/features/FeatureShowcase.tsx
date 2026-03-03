/**
 * 功能展示组件
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
}

export interface FeatureShowcaseProps {
  features: Feature[];
  layout?: 'grid' | 'list' | 'masonry';
  columns?: 2 | 3 | 4;
  animated?: boolean;
  className?: string;
}

export function FeatureShowcase({
  features,
  layout = 'grid',
  columns = 3,
  animated = true,
  className,
}: FeatureShowcaseProps) {
  const layouts = {
    grid: 'grid',
    list: 'flex flex-col',
    masonry: 'columns-1 md:columns-2 lg:columns-3',
  };

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  const colorClasses = {
    cyan: 'text-cyber-cyan border-cyber-cyan',
    purple: 'text-cyber-purple border-cyber-purple',
    pink: 'text-cyber-pink border-cyber-pink',
    yellow: 'text-cyber-yellow border-cyber-yellow',
    green: 'text-cyber-green border-cyber-green',
  };

  return (
    <div className={cn(layouts[layout], layout === 'grid' && gridCols[columns], 'gap-6', className)}>
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={animated ? { opacity: 0, y: 20 } : false}
          whileInView={animated ? { opacity: 1, y: 0 } : false}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className={cn(
            'group p-6 rounded-xl border bg-cyber-card/50 backdrop-blur-sm hover:border-cyber-cyan/50 transition-all',
            feature.color ? colorClasses[feature.color] : 'border-cyber-border'
          )}
        >
          {/* 图标 */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center mb-4 border-2',
              feature.color ? colorClasses[feature.color] : 'border-cyber-cyan text-cyber-cyan'
            )}
          >
            {feature.icon}
          </motion.div>

          {/* 标题 */}
          <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>

          {/* 描述 */}
          <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

export interface FeatureHeroProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function FeatureHero({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  className,
}: FeatureHeroProps) {
  return (
    <div className={cn('text-center py-16', className)}>
      {/* 图标 */}
      {icon && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-block mb-6"
        >
          {icon}
        </motion.div>
      )}

      {/* 标题 */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-6xl font-display font-bold text-white mb-6"
      >
        {title}
      </motion.h1>

      {/* 描述 */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8"
      >
        {description}
      </motion.p>

      {/* 操作按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        {primaryAction && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={primaryAction.onClick}
            className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg font-semibold text-cyber-dark shadow-lg shadow-cyber-cyan/20"
          >
            {primaryAction.label}
          </motion.button>
        )}
        {secondaryAction && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={secondaryAction.onClick}
            className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan rounded-lg font-semibold hover:bg-cyber-cyan/10 transition-colors"
          >
            {secondaryAction.label}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
