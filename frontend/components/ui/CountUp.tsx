'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  separator?: string;
  onAnimationComplete?: () => void;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  separator = ',',
  onAnimationComplete,
}) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
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

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const animate = () => {
      const now = Date.now();
      const remaining = Math.max((endTime - now) / duration, 0);
      const progress = 1 - remaining;

      const currentCount = start + (end - start) * progress;
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onAnimationComplete?.();
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isVisible, start, end, duration, delay, onAnimationComplete]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  icon,
  description,
  trend,
  className,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'p-6 rounded-lg bg-dark-800 border border-dark-700 hover:border-cyber-cyan/30 transition-all',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <CountUp
              end={value}
              prefix={prefix}
              suffix={suffix}
              className="text-3xl font-bold text-white"
              delay={delay}
            />
            {trend && (
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-400' : 'text-red-400'
                )}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
    </motion.div>
  );
};

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  color = 'cyan',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses: Record<string, string> = {
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    pink: 'text-cyber-pink',
    yellow: 'text-cyber-yellow',
    green: 'text-green-400',
  };

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-dark-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: isVisible ? offset : circumference }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className={colorClasses[color]}
          strokeLinecap="round"
        />
      </svg>

      {children && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'cyan',
  size = 'md',
  className,
  animated = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses: Record<string, string> = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses: Record<string, string> = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    yellow: 'bg-cyber-yellow',
    green: 'bg-green-400',
  };

  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-gray-300">{label}</span>}
          {showValue && (
            <span className="text-gray-400">
              {value} / {max}
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full bg-dark-700 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isVisible ? percentage : 0 }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
          className={cn('h-full', colorClasses[color])}
        />
      </div>
    </div>
  );
};

export default CountUp;
