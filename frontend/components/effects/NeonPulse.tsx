/**
 * NeonPulse - 霓虹脉冲效果组件
 *
 * 创建呼吸式霓虹发光效果，适用于卡片、按钮或任何容器
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface NeonPulseProps {
  children: React.ReactNode;
  /** 脉冲颜色 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';
  /** 脉冲速度 (秒) */
  speed?: number;
  /** 脉冲强度 */
  intensity?: 'low' | 'medium' | 'high';
  /** 是否启用边框效果 */
  border?: boolean;
  /** 额外的类名 */
  className?: string;
  /** 自定义颜色值 */
  customColor?: string;
}

const colorMap = {
  cyan: {
    light: 'rgba(0, 240, 255, 0.6)',
    main: 'rgba(0, 240, 255, 0.3)',
    dark: 'rgba(0, 240, 255, 0.1)',
    shadow: '0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.2)',
    border: 'border-cyber-cyan',
  },
  purple: {
    light: 'rgba(157, 0, 255, 0.6)',
    main: 'rgba(157, 0, 255, 0.3)',
    dark: 'rgba(157, 0, 255, 0.1)',
    shadow: '0 0 20px rgba(157, 0, 255, 0.4), 0 0 40px rgba(157, 0, 255, 0.2)',
    border: 'border-cyber-purple',
  },
  pink: {
    light: 'rgba(255, 0, 128, 0.6)',
    main: 'rgba(255, 0, 128, 0.3)',
    dark: 'rgba(255, 0, 128, 0.1)',
    shadow: '0 0 20px rgba(255, 0, 128, 0.4), 0 0 40px rgba(255, 0, 128, 0.2)',
    border: 'border-cyber-pink',
  },
  yellow: {
    light: 'rgba(240, 255, 0, 0.6)',
    main: 'rgba(240, 255, 0, 0.3)',
    dark: 'rgba(240, 255, 0, 0.1)',
    shadow: '0 0 20px rgba(240, 255, 0, 0.4), 0 0 40px rgba(240, 255, 0, 0.2)',
    border: 'border-cyber-yellow',
  },
  green: {
    light: 'rgba(0, 255, 136, 0.6)',
    main: 'rgba(0, 255, 136, 0.3)',
    dark: 'rgba(0, 255, 136, 0.1)',
    shadow: '0 0 20px rgba(0, 255, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.2)',
    border: 'border-cyber-green',
  },
  orange: {
    light: 'rgba(255, 102, 0, 0.6)',
    main: 'rgba(255, 102, 0, 0.3)',
    dark: 'rgba(255, 102, 0, 0.1)',
    shadow: '0 0 20px rgba(255, 102, 0, 0.4), 0 0 40px rgba(255, 102, 0, 0.2)',
    border: 'border-cyber-orange',
  },
};

const intensityMap = {
  low: { opacity: [0.3, 0.6, 0.3], scale: [1, 1.02, 1] },
  medium: { opacity: [0.4, 0.8, 0.4], scale: [1, 1.03, 1] },
  high: { opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] },
};

export function NeonPulse({
  children,
  color = 'cyan',
  speed = 2,
  intensity = 'medium',
  border = true,
  className,
  customColor,
}: NeonPulseProps) {
  const colors = customColor
    ? {
        light: customColor,
        main: customColor,
        dark: customColor,
        shadow: `0 0 20px ${customColor}, 0 0 40px ${customColor}`,
        border: '',
      }
    : colorMap[color];

  const intensityValues = intensityMap[intensity];

  return (
    <div className={cn('relative', className)}>
      {/* 背景发光层 */}
      <motion.div
        className="absolute inset-0 rounded-lg blur-xl"
        style={{
          background: colors.main,
        }}
        animate={{
          opacity: intensityValues.opacity,
          scale: intensityValues.scale,
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 主内容层 */}
      <motion.div
        className={cn(
          'relative rounded-lg transition-all',
          border && 'border-2',
          border && colors.border
        )}
        style={{
          boxShadow: colors.shadow,
        }}
        animate={{
          boxShadow: [
            colors.shadow,
            `0 0 ${30 + intensity === 'high' ? 20 : 0}px ${colors.light}, 0 0 ${60 + intensity === 'high' ? 30 : 0}px ${colors.main}`,
            colors.shadow,
          ],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>

      {/* 边框流动效果 */}
      {border && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.light}, transparent)`,
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0'],
          }}
          transition={{
            duration: speed * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}

/**
 * NeonPulseText - 文字专用脉冲效果
 */
export interface NeonPulseTextProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';
  speed?: number;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function NeonPulseText({
  children,
  color = 'cyan',
  speed = 2,
  intensity = 'medium',
  className,
}: NeonPulseTextProps) {
  const colors = colorMap[color];
  const intensityValues = intensityMap[intensity];

  return (
    <motion.span
      className={cn('inline-block font-display', className)}
      style={{
        color: color === 'cyan' ? '#00f0ff' :
               color === 'purple' ? '#9d00ff' :
               color === 'pink' ? '#ff0080' :
               color === 'yellow' ? '#f0ff00' :
               color === 'green' ? '#00ff88' :
               '#ff6600',
        textShadow: colors.shadow,
      }}
      animate={{
        textShadow: [
          colors.shadow,
          `0 0 ${30 + intensity === 'high' ? 20 : 0}px ${colors.light}, 0 0 ${60 + intensity === 'high' ? 30 : 0}px ${colors.main}`,
          colors.shadow,
        ],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.span  >
  );
}

/**
 * NeonPulseBorder - 边框专用脉冲效果
 */
export interface NeonPulseBorderProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';
  speed?: number;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  borderWidth?: number;
}

export function NeonPulseBorder({
  children,
  color = 'cyan',
  speed = 2,
  intensity = 'medium',
  className,
  borderWidth = 2,
}: NeonPulseBorderProps) {
  const colors = colorMap[color];
  const intensityValues = intensityMap[intensity];

  return (
    <motion.div
      className={cn('relative rounded-lg', className)}
      style={{
        padding: borderWidth,
      }}
    >
      {/* 动态边框 */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: colors.main,
        }}
        animate={{
          opacity: intensityValues.opacity,
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 内容容器 */}
      <div className="relative bg-cyber-dark rounded-lg overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}
