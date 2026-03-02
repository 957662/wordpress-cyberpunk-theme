'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, TrendingUp, Zap, Flame, Crown } from 'lucide-react';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neon' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  icon?: 'award' | 'star' | 'trending' | 'zap' | 'flame' | 'crown' | 'none';
  label: string;
  count?: number;
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Badge - 徽章组件
 *
 * 显示状态、数量、等级等信息
 *
 * @example
 * ```tsx
 * <Badge variant="success" label="Completed" count={5} />
 * <Badge variant="cyber" icon="zap" label="Pro" pulse />
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon = 'none',
  label,
  count,
  pulse = false,
  className = '',
  onClick,
}) => {
  const variants = {
    default: {
      bg: 'bg-gray-800',
      text: 'text-gray-300',
      border: 'border-gray-700',
      icon: 'text-gray-400',
      count: 'bg-gray-700 text-gray-300',
    },
    success: {
      bg: 'bg-green-900/50',
      text: 'text-green-400',
      border: 'border-green-700',
      icon: 'text-green-400',
      count: 'bg-green-700 text-green-300',
    },
    warning: {
      bg: 'bg-yellow-900/50',
      text: 'text-yellow-400',
      border: 'border-yellow-700',
      icon: 'text-yellow-400',
      count: 'bg-yellow-700 text-yellow-300',
    },
    error: {
      bg: 'bg-red-900/50',
      text: 'text-red-400',
      border: 'border-red-700',
      icon: 'text-red-400',
      count: 'bg-red-700 text-red-300',
    },
    info: {
      bg: 'bg-blue-900/50',
      text: 'text-blue-400',
      border: 'border-blue-700',
      icon: 'text-blue-400',
      count: 'bg-blue-700 text-blue-300',
    },
    neon: {
      bg: 'bg-[#0a0a0f]',
      text: 'text-cyber-cyan',
      border: 'border-cyber-cyan',
      icon: 'text-cyber-cyan',
      count: 'bg-cyber-cyan text-black',
    },
    cyber: {
      bg: 'bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20',
      text: 'text-cyber-pink',
      border: 'border-cyber-pink/50',
      icon: 'text-cyber-pink',
      count: 'bg-cyber-pink text-black',
    },
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];
  const iconSize = iconSizes[size];

  const icons = {
    award: Award,
    star: Star,
    trending: TrendingUp,
    zap: Zap,
    flame: Flame,
    crown: Crown,
    none: () => null,
  };

  const IconComponent = icons[icon];

  return (
    <motion.span
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`inline-flex items-center border rounded-full ${currentSize} ${currentVariant.bg} ${currentVariant.text} ${currentVariant.border} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      animate={pulse ? {
        boxShadow: [
          '0 0 0 0 rgba(0, 240, 255, 0.4)',
          '0 0 0 8px rgba(0, 240, 255, 0)',
        ],
      } : {}}
      transition={pulse ? {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeOut',
      } : {}}
    >
      {icon !== 'none' && <IconComponent className={`${iconSize} ${currentVariant.icon}`} />}
      <span className="font-medium">{label}</span>
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 rounded-full text-xs ${currentVariant.count}`}>
          {count}
        </span>
      )}
    </motion.span>
  );
};

/**
 * StatusBadge - 状态徽章
 */
export const StatusBadge: React.FC<{
  status: 'online' | 'offline' | 'busy' | 'away' | 'dnd';
  label?: string;
  showDot?: boolean;
  className?: string;
}> = ({ status, label, showDot = true, className = '' }) => {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      label: 'Online',
      glow: 'shadow-[0_0_8px_rgba(34,197,94,0.6)]',
    },
    offline: {
      color: 'bg-gray-500',
      label: 'Offline',
      glow: '',
    },
    busy: {
      color: 'bg-red-500',
      label: 'Busy',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]',
    },
    away: {
      color: 'bg-yellow-500',
      label: 'Away',
      glow: 'shadow-[0_0_8px_rgba(234,179,8,0.6)]',
    },
    dnd: {
      color: 'bg-purple-500',
      label: 'Do Not Disturb',
      glow: 'shadow-[0_0_8px_rgba(168,85,247,0.6)]',
    },
  };

  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {showDot && (
        <span
          className={`relative flex h-3 w-3`}
        >
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${config.color} ${config.glow}`}
          />
          <span
            className={`relative inline-flex rounded-full h-3 w-3 ${config.color} animate-ping`}
          />
        </span>
      )}
      <span className="text-sm text-gray-400">{displayLabel}</span>
    </span>
  );
};

/**
 * LevelBadge - 等级徽章
 */
export const LevelBadge: React.FC<{
  level: number;
  maxLevel?: number;
  showProgress?: boolean;
  className?: string;
}> = ({ level, maxLevel = 100, showProgress = false, className = '' }) => {
  const getLevelColor = (lvl: number) => {
    if (lvl >= 80) return 'text-cyber-cyan border-cyber-cyan';
    if (lvl >= 60) return 'text-cyber-purple border-cyber-purple';
    if (lvl >= 40) return 'text-cyber-pink border-cyber-pink';
    return 'text-gray-400 border-gray-600';
  };

  const colorClass = getLevelColor(level);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`px-3 py-1 text-sm font-bold border-2 rounded-lg ${colorClass} bg-[#0a0a0f]`}
      >
        LVL {level}
      </span>
      {showProgress && (
        <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(level / maxLevel) * 100}%` }}
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
            transition={{ duration: 0.5 }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * NotificationBadge - 通知徽章
 */
export const NotificationBadge: React.FC<{
  count: number;
  maxCount?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  children: React.ReactNode;
  showZero?: boolean;
  className?: string;
}> = ({
  count,
  maxCount = 99,
  position = 'top-right',
  children,
  showZero = false,
  className = '',
}) => {
  const positions = {
    'top-right': '-top-2 -right-2',
    'top-left': '-top-2 -left-2',
    'bottom-right': '-bottom-2 -right-2',
    'bottom-left': '-bottom-2 -left-2',
  };

  const displayCount = count > maxCount ? `${maxCount}+` : count;

  if (!showZero && count === 0) {
    return <>{children}</>;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <span
        className={`absolute ${positions[position]} flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-cyber-pink px-1.5 text-xs font-bold text-white`}
      >
        {displayCount}
      </span>
    </span>
  );
};

export default Badge;
