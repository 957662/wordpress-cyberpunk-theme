/**
 * GlitchText Component
 * 故障效果文本组件
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 故障强度
 */
export type GlitchIntensity = 'low' | 'medium' | 'high';

/**
 * GlitchText 属性
 */
export interface GlitchTextProps extends HTMLMotionProps<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'> {
  text: string;
  intensity?: GlitchIntensity;
  speed?: 'slow' | 'medium' | 'fast';
  color?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  onHover?: boolean;
}

/**
 * 强度配置
 */
const intensityConfig = {
  low: {
    offset: 2,
    slices: 2,
  },
  medium: {
    offset: 4,
    slices: 3,
  },
  high: {
    offset: 6,
    slices: 5,
  },
};

/**
 * 速度配置
 */
const speedConfig = {
  slow: 3,
  medium: 2,
  fast: 1,
};

/**
 * GlitchText 组件
 */
export function GlitchText({
  text,
  intensity = 'medium',
  speed = 'medium',
  color = '#00f0ff',
  as = 'h1',
  className,
  onHover = true,
  ...props
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const config = intensityConfig[intensity];
  const duration = speedConfig[speed];

  // 自动故障效果
  useEffect(() => {
    if (!onHover) {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), duration * 100);
      }, duration * 2000);

      return () => clearInterval(interval);
    }
  }, [onHover, duration]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (onHover) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const baseStyles = cn(
    'relative',
    'inline-block',
    'font-bold',
    'uppercase',
    'tracking-wider',
    className
  );

  const MotionComponent = motion[as] as any;

  return (
    <MotionComponent
      className={baseStyles}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover && setIsGlitching(true)}
      onMouseLeave={() => onHover && setIsGlitching(false)}
      {...props}
    >
      {/* 主文本 */}
      <motion.span
        className="relative z-10"
        animate={
          isGlitching
            ? {
                x: [0, -config.offset, config.offset, 0],
                opacity: [1, 0.8, 0.6, 1],
              }
            : {}
        }
        transition={{
          duration: duration * 0.1,
          times: [0, 0.3, 0.6, 1],
        }}
      >
        {text}
      </motion.span>

      {/* 故障层 1 - 红色 */}
      {isGlitching && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{ color: '#ff0080', mixBlendMode: 'screen' }}
          animate={{
            x: [0, -config.offset, config.offset, -config.offset * 0.5, 0],
            y: [0, 0, 0, -config.offset * 0.5, 0],
            clipPath: [
              'inset(0 0 0 0)',
              `inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0)`,
              `inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0)`,
              'inset(0 0 0 0)',
            ],
          }}
          transition={{
            duration: duration * 0.15,
            times: [0, 0.25, 0.75, 1],
          }}
          aria-hidden="true"
        >
          {text}
        </motion.span>
      )}

      {/* 故障层 2 - 青色 */}
      {isGlitching && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{ color, mixBlendMode: 'screen' }}
          animate={{
            x: [0, config.offset, -config.offset, config.offset * 0.5, 0],
            y: [0, 0, 0, config.offset * 0.5, 0],
            clipPath: [
              'inset(0 0 0 0)',
              `inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0)`,
              `inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0)`,
              'inset(0 0 0 0)',
            ],
          }}
          transition={{
            duration: duration * 0.15,
            times: [0, 0.25, 0.75, 1],
          }}
          aria-hidden="true"
        >
          {text}
        </motion.span>
      )}

      {/* 扫描线 */}
      {isGlitching && (
        <motion.div
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white to-transparent"
          style={{ opacity: 0.1 }}
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: duration * 0.5,
            ease: 'linear',
          }}
        />
      )}

      {/* 闪烁效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: color }}
        animate={isGlitching ? { opacity: [0, 0.1, 0, 0.05, 0] } : { opacity: 0 }}
        transition={{ duration: duration * 0.1 }}
      />
    </MotionComponent>
  );
}

/**
 * GlitchTitle 组件 - 预设的标题组件
 */
export interface GlitchTitleProps extends Omit<GlitchTextProps, 'as'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function GlitchTitle({ level = 1, ...props }: GlitchTitleProps) {
  const Tag = `h${level}` as const;
  const sizeStyles = {
    1: 'text-5xl md:text-7xl',
    2: 'text-4xl md:text-6xl',
    3: 'text-3xl md:text-5xl',
    4: 'text-2xl md:text-4xl',
    5: 'text-xl md:text-3xl',
    6: 'text-lg md:text-2xl',
  };

  return (
    <GlitchText
      {...props}
      as={Tag}
      className={cn(sizeStyles[level], props.className)}
    />
  );
}
