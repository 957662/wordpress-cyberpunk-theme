'use client';

/**
 * CyberIcon - 赛博朋克风格图标组件
 * 支持发光、动画等效果
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CyberIconProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Lucide 图标组件 */
  icon: LucideIcon;
  /** 图标大小 */
  size?: number;
  /** 颜色主题 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'custom';
  /** 自定义颜色 */
  customColor?: string;
  /** 是否发光 */
  glow?: boolean;
  /** 发光强度 */
  glowIntensity?: 'low' | 'medium' | 'high';
  /** 旋转动画 */
  spin?: boolean;
  /** 脉冲动画 */
  pulse?: boolean;
  /** 弹跳动画 */
  bounce?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

const colorMap = {
  cyan: 'text-cyber-cyan',
  purple: 'text-cyber-purple',
  pink: 'text-cyber-pink',
  yellow: 'text-cyber-yellow',
  green: 'text-green-400',
  custom: '',
};

const glowMap = {
  low: 'drop-shadow-[0_0_4px_currentColor]',
  medium: 'drop-shadow-[0_0_8px_currentColor]',
  high: 'drop-shadow-[0_0_16px_currentColor]',
};

export function CyberIcon({
  icon: Icon,
  size = 24,
  color = 'cyan',
  customColor,
  glow = false,
  glowIntensity = 'medium',
  spin = false,
  pulse = false,
  bounce = false,
  className = '',
  ...props
}: CyberIconProps) {
  const colorClass = color === 'custom' ? '' : colorMap[color];
  const style = customColor ? { color: customColor } : {};

  const animationClass = cn({
    'animate-spin-slow': spin,
    'animate-pulse': pulse,
    'animate-bounce': bounce,
  });

  const glowClass = glow ? glowMap[glowIntensity] : '';

  return (
    <motion.div
      className={cn('inline-flex', colorClass, glowClass, animationClass, className)}
      style={style}
      {...props}
    >
      <Icon
        size={size}
        className={cn({
          'animate-spin': spin,
          'animate-pulse': pulse,
          'animate-bounce': bounce,
        })}
      />
    </motion.div>
  );
}

export default CyberIcon;
