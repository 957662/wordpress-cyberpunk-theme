'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface DataStreamProps {
  /**
   * 数据流方向
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * 数据速度
   */
  speed?: 'slow' | 'normal' | 'fast';

  /**
   * 数据密度
   */
  density?: 'sparse' | 'normal' | 'dense';

  /**
   * 主题颜色
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green';

  /**
   * 是否显示字符
   */
  showCharacters?: boolean;

  /**
   * 字符集类型
   */
  charset?: 'binary' | 'hex' | 'matrix' | 'custom';

  /**
   * 自定义字符集
   */
  customCharset?: string;

  /**
   * 容器高度（垂直方向）或宽度（水平方向）
   */
  size?: number;

  /**
   * 是否暂停动画
   */
  paused?: boolean;

  /**
   * 自定义类名
   */
  className?: string;
}

const charsets = {
  binary: '01',
  hex: '0123456789ABCDEF',
  matrix: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  custom: '',
};

const colorStyles = {
  cyan: 'text-cyber-cyan drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]',
  purple: 'text-cyber-purple drop-shadow-[0_0_5px_rgba(157,0,255,0.8)]',
  pink: 'text-cyber-pink drop-shadow-[0_0_5px_rgba(255,0,128,0.8)]',
  green: 'text-cyber-green drop-shadow-[0_0_5px_rgba(0,255,136,0.8)]',
};

/**
 * 数据流粒子组件
 */
interface DataParticleProps {
  char: string;
  color: string;
  delay: number;
  duration: number;
  vertical: boolean;
}

const DataParticle: React.FC<DataParticleProps> = ({
  char,
  color,
  delay,
  duration,
  vertical,
}) => {
  return (
    <motion.span
      className={cn('absolute font-mono text-xs', color)}
      initial={{
        opacity: 0,
        [vertical ? 'y' : 'x']: -50,
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        [vertical ? 'y' : 'x']: [vertical ? '-50px' : '-50px', vertical ? '100%' : '100%'],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {char}
    </motion.span>
  );
};

/**
 * DataStream - 赛博朋克风格数据流组件
 *
 * 创建类似《黑客帝国》中的数据流效果
 *
 * @example
 * ```tsx
 * <DataStream direction="vertical" color="cyan" />
 * <DataStream direction="horizontal" color="purple" charset="binary" />
 * <DataStream color="green" density="dense" showCharacters />
 * ```
 */
export const DataStream: React.FC<DataStreamProps> = ({
  direction = 'vertical',
  speed = 'normal',
  density = 'normal',
  color = 'cyan',
  showCharacters = true,
  charset = 'matrix',
  customCharset = '',
  size = 100,
  paused = false,
  className = '',
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; char: string }>>([]);

  const isVertical = direction === 'vertical';
  const styles = colorStyles[color];

  // 根据密度计算粒子数量
  const getParticleCount = () => {
    switch (density) {
      case 'sparse':
        return isVertical ? 10 : 20;
      case 'normal':
        return isVertical ? 20 : 40;
      case 'dense':
        return isVertical ? 40 : 80;
    }
  };

  // 根据速度计算动画持续时间
  const getDuration = () => {
    switch (speed) {
      case 'slow':
        return { min: 8, max: 15 };
      case 'normal':
        return { min: 4, max: 8 };
      case 'fast':
        return { min: 2, max: 4 };
    }
  };

  useEffect(() => {
    // 生成初始粒子
    const chars = charset === 'custom' ? customCharset : charsets[charset];
    const count = getParticleCount();

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));

    setParticles(newParticles);

    // 定期更新字符
    const interval = setInterval(() => {
      if (!paused) {
        setParticles((prev) =>
          prev.map((particle) => ({
            ...particle,
            char: chars[Math.floor(Math.random() * chars.length)],
          }))
        );
      }
    }, 100);

    return () => clearInterval(interval);
  }, [charset, customCharset, density, paused]);

  const { min: minDuration, max: maxDuration } = getDuration();

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        isVertical ? 'h-full w-full' : 'h-full w-full',
        className
      )}
      style={
        isVertical
          ? { height: `${size}px` }
          : { width: `${size}px` }
      }
    >
      <AnimatePresence>
        {particles.map((particle) => {
          const duration = minDuration + Math.random() * (maxDuration - minDuration);
          const delay = Math.random() * 2;

          return showCharacters ? (
            <DataParticle
              key={particle.id}
              char={particle.char}
              color={styles}
              delay={delay}
              duration={duration}
              vertical={isVertical}
            />
          ) : (
            <motion.div
              key={particle.id}
              className={cn(
                'absolute rounded-full',
                color === 'cyan' && 'bg-cyber-cyan',
                color === 'purple' && 'bg-cyber-purple',
                color === 'pink' && 'bg-cyber-pink',
                color === 'green' && 'bg-cyber-green'
              )}
              style={{
                width: '2px',
                height: isVertical ? '20px' : '2px',
              }}
              initial={{
                opacity: 0,
                [isVertical ? 'y' : 'x']: isVertical ? '-20px' : '-20px',
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                [isVertical ? 'y' : 'x']: [isVertical ? '-20px' : '-20px', isVertical ? '100%' : '100%'],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* 背景渐变 */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          'bg-gradient-to-b from-transparent via-cyber-dark/50 to-transparent'
        )}
      />
    </div>
  );
};

export default DataStream;
