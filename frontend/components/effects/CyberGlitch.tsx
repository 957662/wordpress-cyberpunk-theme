/**
 * CyberGlitch - 赛博朋克故障效果组件
 *
 * 创建数字故障/信号干扰效果，适用于标题、图片或任何内容
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface CyberGlitchProps {
  children: React.ReactNode;
  /** 是否启用故障效果 */
  enabled?: boolean;
  /** 故障强度 (1-10) */
  intensity?: number;
  /** 故障频率 (ms) */
  interval?: number;
  /** 额外的类名 */
  className?: string;
  /** 触发故障的持续时间 (ms) */
  duration?: number;
}

export function CyberGlitch({
  children,
  enabled = true,
  intensity = 5,
  interval = 3000,
  className,
  duration = 200,
}: CyberGlitchProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const triggerGlitch = () => {
      // 随机偏移量，基于强度
      const maxOffset = intensity * 2;
      setGlitchOffset({
        x: (Math.random() - 0.5) * maxOffset,
        y: (Math.random() - 0.5) * maxOffset,
      });
      setIsGlitching(true);

      // 短暂延迟后重置
      setTimeout(() => {
        setIsGlitching(false);
        setGlitchOffset({ x: 0, y: 0 });
      }, duration);
    };

    // 定期触发故障
    const glitchInterval = setInterval(triggerGlitch, interval);

    // 初始延迟后第一次触发
    const initialTimeout = setTimeout(triggerGlitch, 500);

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(initialTimeout);
    };
  }, [enabled, intensity, interval, duration]);

  // RGB 分离效果的偏移
  const rgbOffset = intensity * 1.5;

  return (
    <div className={cn('relative inline-block', className)}>
      {/* 原始内容 */}
      <motion.div
        className="relative z-10"
        animate={{
          x: isGlitching ? glitchOffset.x : 0,
          y: isGlitching ? glitchOffset.y : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 50,
        }}
      >
        {children}
      </motion.div>

      {/* 红色通道偏移 */}
      {isGlitching && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            color: '#ff0000',
            mixBlendMode: 'screen',
          }}
          animate={{
            x: glitchOffset.x + rgbOffset,
            y: glitchOffset.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 1000,
            damping: 50,
          }}
          aria-hidden="true"
        >
          {children}
        </motion.div>
      )}

      {/* 蓝色通道偏移 */}
      {isGlitching && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            color: '#00ffff',
            mixBlendMode: 'screen',
          }}
          animate={{
            x: glitchOffset.x - rgbOffset,
            y: glitchOffset.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 1000,
            damping: 50,
          }}
          aria-hidden="true"
        >
          {children}
        </motion.div>
      )}

      {/* 扫描线效果 */}
      {isGlitching && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-cyber-cyan/10 to-transparent"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 0.1,
            repeat: 2,
            ease: 'linear',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/**
 * CyberGlitchText - 文字专用故障效果
 */
export interface CyberGlitchTextProps extends Omit<CyberGlitchProps, 'children'> {
  text: string;
  /** 文字大小 */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  /** 文字颜色 */
  color?: string;
}

export function CyberGlitchText({
  text,
  size = 'xl',
  color = 'text-cyber-cyan',
  ...glitchProps
}: CyberGlitchTextProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  return (
    <CyberGlitch {...glitchProps}>
      <span className={cn('font-display font-bold', sizeClasses[size], color)}>
        {text}
      </span>
    </CyberGlitch>
  );
}

/**
 * CyberGlitchImage - 图片专用故障效果
 */
export interface CyberGlitchImageProps extends Omit<CyberGlitchProps, 'children'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function CyberGlitchImage({
  src,
  alt,
  width,
  height,
  className,
  ...glitchProps
}: CyberGlitchImageProps) {
  return (
    <CyberGlitch {...glitchProps} className={cn('inline-block', className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="max-w-full h-auto"
      />
    </CyberGlitch>
  );
}
