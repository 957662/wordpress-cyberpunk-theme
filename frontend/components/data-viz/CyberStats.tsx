/**
 * 赛博朋克风格统计数字组件
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface CyberStatsProps {
  value: number;
  label?: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
  className?: string;
}

export function CyberStats({
  value,
  label,
  suffix = '',
  prefix = '',
  duration = 2000,
  color = 'cyan',
  size = 'md',
  showGlow = true,
  className,
}: CyberStatsProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  const colors = {
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    pink: 'text-cyber-pink',
    yellow: 'text-cyber-yellow',
    green: 'text-cyber-green',
  };

  const glowColors = {
    cyan: 'shadow-neon-cyan',
    purple: 'shadow-neon-purple',
    pink: 'shadow-neon-pink',
    yellow: 'shadow-neon-yellow',
    green: 'shadow-neon-green',
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toString();
  };

  return (
    <div ref={ref} className={cn('text-center', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className={cn(
          'font-display font-bold',
          sizes[size],
          colors[color],
          showGlow && glowColors[color]
        )}
      >
        {prefix}
        {formatNumber(displayValue)}
        {suffix}
      </motion.div>
      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 mt-2 text-sm"
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}

export interface CyberStatsGridProps {
  stats: Array<{
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
    color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  }>;
  columns?: 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CyberStatsGrid({
  stats,
  columns = 4,
  size = 'md',
  className,
}: CyberStatsGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={cn('grid gap-8', gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-cyber-card/50 rounded-xl border border-cyber-border p-6 hover:border-cyber-cyan/50 transition-all"
        >
          <CyberStats
            {...stat}
            size={size}
            showGlow={false}
            className="mb-2"
          />
        </motion.div>
      ))}
    </div>
  );
}
