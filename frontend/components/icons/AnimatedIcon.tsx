/**
 * AnimatedIcon - 赛博朋克动画图标组件
 *
 * 提供多种内置动画效果的图标组件
 *
 * @example
 * ```tsx
 * <AnimatedIcon type="pulse" variant="cyan">
 *   <HeartIcon />
 * </AnimatedIcon>
 * ```
 */

'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type AnimationType =
  | 'pulse'
  | 'spin'
  | 'bounce'
  | 'glow'
  | 'glitch'
  | 'float'
  | 'shimmer'
  | 'scan'
  | 'matrix'
  | 'hologram';

export type AnimationVariant = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange';

export interface AnimatedIconProps {
  /** 图标内容 */
  children: ReactNode;
  /** 动画类型 */
  type: AnimationType;
  /** 颜色变体 */
  variant?: AnimationVariant;
  /** 动画持续时间 (秒) */
  duration?: number;
  /** 是否延迟开始 */
  delay?: number;
  /** 动画迭代次数 */
  iterations?: number | 'infinite';
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否暂停动画 */
  paused?: boolean;
  /** 动画缓动函数 */
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
}

const variantColors: Record<AnimationVariant, string> = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
  orange: '#ff6600',
};

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  type,
  variant = 'cyan',
  duration = 2,
  delay = 0,
  iterations = 'infinite',
  className = '',
  paused = false,
  easing = 'ease-in-out',
}) => {
  const animationStyle = {
    '--animation-duration': `${duration}s`,
    '--animation-delay': `${delay}s`,
    '--animation-iterations': iterations === 'infinite' ? 'infinite' : iterations,
    '--animation-color': variantColors[variant],
    animationPlayState: paused ? 'paused' : 'running',
  } as React.CSSProperties;

  const animations: Record<AnimationType, string> = {
    pulse: 'cyber-pulse',
    spin: 'cyber-spin',
    bounce: 'cyber-bounce',
    glow: 'cyber-glow',
    glitch: 'cyber-glitch',
    float: 'cyber-float',
    shimmer: 'cyber-shimmer',
    scan: 'cyber-scan',
    matrix: 'cyber-matrix',
    hologram: 'cyber-hologram',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        `animate-${animations[type]}`,
        className
      )}
      style={animationStyle}
      data-variant={variant}
    >
      {children}
    </div>
  );
};

/**
 * PulseIcon - 脉冲动画图标
 */
export interface PulseIconProps extends Omit<AnimatedIconProps, 'type'> {
  /** 脉冲强度 */
  intensity?: 'low' | 'medium' | 'high';
}

export const PulseIcon: React.FC<PulseIconProps> = ({
  children,
  intensity = 'medium',
  ...props
}) => {
  return (
    <AnimatedIcon type="pulse" {...props} className={`pulse-${intensity} ${props.className || ''}`}>
      {children}
    </AnimatedIcon>
  );
};

/**
 * SpinIcon - 旋转动画图标
 */
export interface SpinIconProps extends Omit<AnimatedIconProps, 'type'> {
  /** 旋转方向 */
  direction?: 'clockwise' | 'counter-clockwise';
  /** 旋转速度 */
  speed?: 'slow' | 'normal' | 'fast';
}

export const SpinIcon: React.FC<SpinIconProps> = ({
  children,
  direction = 'clockwise',
  speed = 'normal',
  duration = 2,
  ...props
}) => {
  const speedMap = { slow: 3, normal: 2, fast: 1 };
  return (
    <AnimatedIcon
      type="spin"
      duration={duration * speedMap[speed] / 2}
      {...props}
      className={`spin-${direction} ${props.className || ''}`}
    >
      {children}
    </AnimatedIcon>
  );
};

/**
 * GlowIcon - 发光动画图标
 */
export interface GlowIconProps extends Omit<AnimatedIconProps, 'type'> {
  /** 发光强度 */
  intensity?: 'soft' | 'medium' | 'strong';
  /** 是否有脉冲效果 */
  pulsed?: boolean;
}

export const GlowIcon: React.FC<GlowIconProps> = ({
  children,
  intensity = 'medium',
  pulsed = true,
  ...props
}) => {
  const type: AnimationType = pulsed ? 'glow' : 'pulse';
  return (
    <AnimatedIcon
      type={type}
      {...props}
      className={`glow-${intensity} ${props.className || ''}`}
    >
      {children}
    </AnimatedIcon>
  );
};

/**
 * GlitchIcon - 故障效果图标
 */
export interface GlitchIconProps extends Omit<AnimatedIconProps, 'type'> {
  /** 故障频率 */
  frequency?: 'low' | 'medium' | 'high';
  /** 是否有颜色分离 */
  colorSplit?: boolean;
}

export const GlitchIcon: React.FC<GlitchIconProps> = ({
  children,
  frequency = 'medium',
  colorSplit = true,
  duration = 3,
  ...props
}) => {
  const freqMap = { low: 5, medium: 3, high: 1.5 };
  return (
    <AnimatedIcon
      type="glitch"
      duration={freqMap[frequency]}
      {...props}
      className={`glitch-${frequency} ${colorSplit ? 'color-split' : ''} ${props.className || ''}`}
    >
      {children}
    </AnimatedIcon>
  );
};

/**
 * FloatIcon - 悬浮动画图标
 */
export interface FloatIconProps extends Omit<AnimatedIconProps, 'type'> {
  /** 悬浮距离 */
  distance?: 'short' | 'medium' | 'long';
}

export const FloatIcon: React.FC<FloatIconProps> = ({
  children,
  distance = 'medium',
  ...props
}) => {
  return (
    <AnimatedIcon
      type="float"
      {...props}
      className={`float-${distance} ${props.className || ''}`}
    >
      {children}
    </AnimatedIcon>
  );
};

/**
 * ShimmerIcon - 闪光动画图标
 */
export interface ShimmerIconProps extends Omit<AnimatedIconProps, 'type'> {
  /** 闪光角度 */
  angle?: number;
}

export const ShimmerIcon: React.FC<ShimmerIconProps> = ({
  children,
  angle = 45,
  ...props
}) => {
  return (
    <AnimatedIcon
      type="shimmer"
      {...props}
      className={`shimmer-${angle} ${props.className || ''}`}
      style={{ '--shimmer-angle': `${angle}deg` } as React.CSSProperties}
    >
      {children}
    </AnimatedIcon>
  );
};

/**
 * ScanIcon - 扫描线动画图标
 */
export interface ScanIconProps extends Omit<AnimatedIconProps, 'type'> {
  /** 扫描方向 */
  direction?: 'vertical' | 'horizontal';
  /** 扫描速度 */
  speed?: 'slow' | 'normal' | 'fast';
}

export const ScanIcon: React.FC<ScanIconProps> = ({
  children,
  direction = 'vertical',
  speed = 'normal',
  ...props
}) => {
  const speedMap = { slow: 4, normal: 2, fast: 1 };
  return (
    <AnimatedIcon
      type="scan"
      duration={speedMap[speed]}
      {...props}
      className={`scan-${direction} ${props.className || ''}`}
    >
      {children}
    </AnimatedIcon>
  );
};

/**
 * MatrixIcon - 矩阵雨动画图标
 */
export const MatrixIcon: React.FC<AnimatedIconProps> = ({ children, ...props }) => {
  return (
    <AnimatedIcon type="matrix" {...props} className="matrix-effect">
      {children}
    </AnimatedIcon>
  );
};

/**
 * HologramIcon - 全息投影动画图标
 */
export interface HologramProps extends Omit<AnimatedIconProps, 'type'> {
  /** 全息强度 */
  intensity?: 'subtle' | 'medium' | 'strong';
  /** 是否有干扰效果 */
  interference?: boolean;
}

export const HologramIcon: React.FC<HologramProps> = ({
  children,
  intensity = 'medium',
  interference = false,
  ...props
}) => {
  return (
    <AnimatedIcon
      type="hologram"
      {...props}
      className={`hologram-${intensity} ${interference ? 'hologram-interference' : ''} ${props.className || ''}`}
    >
      {children}
    </AnimatedIcon>
  );
};

export default AnimatedIcon;
