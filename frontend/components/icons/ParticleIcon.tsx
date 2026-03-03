/**
 * ParticleIcon - 粒子效果图标组件
 *
 * 提供粒子特效的图标组件
 *
 * @example
 * ```tsx
 * <ParticleIcon variant="cyan" density="medium">
 *   <StarIcon />
 * </ParticleIcon>
 * ```
 */

'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type ParticleDensity = 'low' | 'medium' | 'high' | 'extreme';

export type ParticleBehavior = 'orbit' | 'explode' | 'implode' | 'float' | 'attract' | 'repel';

export type ParticleVariant = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'orange' | 'rainbow';

export interface ParticleIconProps {
  /** 图标内容 */
  children: ReactNode;
  /** 粒子颜色变体 */
  variant?: ParticleVariant;
  /** 粒子密度 */
  density?: ParticleDensity;
  /** 粒子行为 */
  behavior?: ParticleBehavior;
  /** 粒子大小 */
  particleSize?: number;
  /** 粒子速度 */
  speed?: 'slow' | 'normal' | 'fast';
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否启用鼠标交互 */
  interactive?: boolean;
  /** 动画持续时间 (秒) */
  duration?: number;
}

const particleColors: Record<ParticleVariant, string[]> = {
  cyan: ['#00f0ff', '#00ccff', '#00aaff', '#0088ff'],
  purple: ['#9d00ff', '#aa00ff', '#b700ff', '#c400ff'],
  pink: ['#ff0080', '#ff2090', '#ff40a0', '#ff60b0'],
  yellow: ['#f0ff00', '#e0ff00', '#d0ff00', '#c0ff00'],
  green: ['#00ff88', '#00ff99', '#00ffaa', '#00ffbb'],
  orange: ['#ff6600', '#ff7700', '#ff8800', '#ff9900'],
  rainbow: ['#00f0ff', '#9d00ff', '#ff0080', '#f0ff00', '#00ff88'],
};

const densityMap: Record<ParticleDensity, number> = {
  low: 10,
  medium: 20,
  high: 40,
  extreme: 80,
};

const speedMap: Record<'slow' | 'normal' | 'fast', number> = {
  slow: 3,
  normal: 2,
  fast: 1,
};

export const ParticleIcon: React.FC<ParticleIconProps> = ({
  children,
  variant = 'cyan',
  density = 'medium',
  behavior = 'orbit',
  particleSize = 3,
  speed = 'normal',
  className = '',
  interactive = false,
  duration = 10,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  const particleCount = densityMap[density];
  const colors = particleColors[variant];
  const animDuration = duration * speedMap[speed];

  useEffect(() => {
    if (!containerRef.current) return;

    // 清除旧粒子
    particlesRef.current.forEach(p => p.remove());
    particlesRef.current = [];

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = `particle-icon-particle particle-${behavior}`;
      particle.style.cssText = `
        position: absolute;
        width: ${particleSize}px;
        height: ${particleSize}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        animation: particle-${behavior}-${i} ${animDuration + Math.random() * 2}s linear infinite;
        animation-delay: ${Math.random() * 2}s;
        opacity: ${0.3 + Math.random() * 0.7};
      `;

      containerRef.current.appendChild(particle);
      particlesRef.current.push(particle);
    }

    return () => {
      particlesRef.current.forEach(p => p.remove());
    };
  }, [particleCount, colors, behavior, animDuration, particleSize]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'particle-icon-container',
        `particle-${variant}`,
        `particle-${behavior}`,
        `particle-${density}`,
        interactive && 'particle-interactive',
        className
      )}
      style={{
        '--particle-size': `${particleSize}px`,
        '--particle-duration': `${animDuration}s`,
      } as React.CSSProperties}
    >
      <div className="particle-icon-content">
        {children}
      </div>
    </div>
  );
};

/**
 * OrbitIcon - 轨道粒子图标
 */
export const OrbitIcon: React.FC<Omit<ParticleIconProps, 'behavior'>> = (props) => {
  return <ParticleIcon behavior="orbit" {...props} />;
};

/**
 * ExplodeIcon - 爆炸粒子图标
 */
export const ExplodeIcon: React.FC<Omit<ParticleIconProps, 'behavior'>> = (props) => {
  return <ParticleIcon behavior="explode" {...props} />;
};

/**
 * FloatIcon - 漂浮粒子图标
 */
export const FloatingIcon: React.FC<Omit<ParticleIconProps, 'behavior'>> = (props) => {
  return <ParticleIcon behavior="float" {...props} />;
};

/**
 * RainbowParticleIcon - 彩虹粒子图标
 */
export const RainbowParticleIcon: React.FC<Omit<ParticleIconProps, 'variant'>> = (props) => {
  return <ParticleIcon variant="rainbow" {...props} />;
};

export default ParticleIcon;
