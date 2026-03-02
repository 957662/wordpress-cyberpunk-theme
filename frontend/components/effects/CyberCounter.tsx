'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface CyberCounterProps {
  /**
   * 目标数值
   */
  value: number;

  /**
   * 初始数值
   */
  start?: number;

  /**
   * 小数位数
   */
  decimals?: number;

  /**
   * 动画持续时间（秒）
   */
  duration?: number;

  /**
   * 是否使用缓动效果
   */
  easing?: boolean;

  /**
   * 前缀
   */
  prefix?: string;

  /**
   * 后缀
   */
  suffix?: string;

  /**
   * 是否显示千分位分隔符
   */
  separator?: boolean;

  /**
   * 主题颜色
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green';

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * 是否发光
   */
  glow?: boolean;

  /**
   * 自定义类名
   */
  className?: string;
}

const colorStyles = {
  cyan: {
    primary: 'text-cyber-cyan',
    glow: 'text-glow-cyan',
  },
  purple: {
    primary: 'text-cyber-purple',
    glow: 'text-glow-purple',
  },
  pink: {
    primary: 'text-cyber-pink',
    glow: 'text-glow-pink',
  },
  green: {
    primary: 'text-cyber-green',
    glow: '',
  },
};

const sizeStyles = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-8xl',
};

/**
 * 缓动函数 - easeOutExpo
 */
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

/**
 * 格式化数字 - 添加千分位分隔符
 */
const formatNumber = (num: number, decimals: number, separator: boolean): string => {
  const fixed = num.toFixed(decimals);
  if (separator) {
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  return fixed;
};

/**
 * CyberCounter - 赛博朋克风格计数器组件
 *
 * 提供流畅的数字动画效果
 *
 * @example
 * ```tsx
 * <CyberCounter value={1000} suffix="+" color="cyan" />
 * <CyberCounter value={99.9} decimals={1} suffix="%" color="purple" size="xl" />
 * <CyberCounter value={50000} prefix="$" separator color="pink" glow />
 * ```
 */
export const CyberCounter: React.FC<CyberCounterProps> = ({
  value,
  start = 0,
  decimals = 0,
  duration = 2,
  easing = true,
  prefix = '',
  suffix = '',
  separator = false,
  color = 'cyan',
  size = 'md',
  glow = false,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const styles = colorStyles[color];

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    setHasAnimated(true);
    const startTime = Date.now();
    const difference = value - start;

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easing ? easeOutExpo(progress) : progress;
      const currentValue = start + difference * easedProgress;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, hasAnimated, value, start, duration, easing]);

  const formattedValue = formatNumber(displayValue, decimals, separator);

  return (
    <div ref={ref} className={cn('inline-block', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* 发光效果 */}
        {glow && (
          <motion.div
            className={cn(
              'absolute inset-0 blur-xl opacity-30',
              color === 'cyan' && 'bg-cyber-cyan',
              color === 'purple' && 'bg-cyber-purple',
              color === 'pink' && 'bg-cyber-pink',
              color === 'green' && 'bg-cyber-green'
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* 主数值 */}
        <span
          className={cn(
            'font-mono font-bold tabular-nums relative z-10',
            styles.primary,
            glow && styles.glow,
            sizeStyles[size]
          )}
        >
          {prefix}
          {formattedValue}
          {suffix}
        </span>

        {/* 装饰线条 */}
        <motion.div
          className={cn(
            'h-0.5 mt-2 bg-gradient-to-r from-transparent via-current to-transparent',
            styles.primary
          )}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: duration }}
        />
      </motion.div>
    </div>
  );
};

export default CyberCounter;
