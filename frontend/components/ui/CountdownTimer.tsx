/**
 * CountdownTimer Component - 倒计时组件
 * 支持多种倒计时显示格式和样式
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock, Calendar, Timer } from 'lucide-react';

export interface CountdownTimerProps {
  targetDate: Date | string | number;
  onComplete?: () => void;
  format?: 'full' | 'short' | 'compact' | 'minimal';
  showLabels?: boolean;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'neon' | 'glass';
}

export function CountdownTimer({
  targetDate,
  onComplete,
  format = 'full',
  showLabels = true,
  showIcon = false,
  className,
  size = 'md',
  variant = 'default',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  // 计算剩余时间
  const calculateTimeLeft = useCallback(() => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  }, [targetDate]);

  // 更新时间
  useEffect(() => {
    const updateTime = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0 && !isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, isComplete, onComplete]);

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  const variants = {
    default: 'bg-cyber-card border border-cyber-border',
    neon: 'bg-cyber-card border-2 border-cyber-cyan shadow-neon-cyan',
    glass: 'bg-cyber-card/50 backdrop-blur-md border border-cyber-border/50',
  };

  // 格式化数字（补零）
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  // 时间单位标签
  const labels = {
    days: '天',
    hours: '时',
    minutes: '分',
    seconds: '秒',
  };

  // 渲染时间块
  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center"
    >
      <div className={cn(
        "font-mono font-bold tabular-nums",
        sizes[size]
      )}>
        {formatNumber(value)}
      </div>
      {showLabels && (
        <div className="text-xs text-cyber-text-secondary mt-1">
          {label}
        </div>
      )}
    </motion.div>
  );

  if (isComplete) {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        variants[variant],
        className
      )}>
        {showIcon && <Timer className="w-5 h-5 text-cyber-cyan" />}
        <span className={cn("font-semibold", sizes[size])}>时间到</span>
      </div>
    );
  }

  // 完整格式
  if (format === 'full') {
    return (
      <div className={cn(
        "inline-flex items-center gap-4 px-6 py-3 rounded-lg",
        variants[variant],
        className
      )}>
        {showIcon && <Clock className="w-5 h-5 text-cyber-cyan" />}
        <div className="flex items-center gap-4">
          <TimeBlock value={timeLeft.days} label={labels.days} />
          <span className="text-cyber-cyan">:</span>
          <TimeBlock value={timeLeft.hours} label={labels.hours} />
          <span className="text-cyber-cyan">:</span>
          <TimeBlock value={timeLeft.minutes} label={labels.minutes} />
          <span className="text-cyber-cyan">:</span>
          <TimeBlock value={timeLeft.seconds} label={labels.seconds} />
        </div>
      </div>
    );
  }

  // 短格式（不显示天）
  if (format === 'short') {
    const totalHours = timeLeft.days * 24 + timeLeft.hours;
    return (
      <div className={cn(
        "inline-flex items-center gap-3 px-5 py-2 rounded-lg",
        variants[variant],
        className
      )}>
        {showIcon && <Timer className="w-4 h-4 text-cyber-cyan" />}
        <div className="flex items-center gap-2">
          <TimeBlock value={totalHours} label={labels.hours} />
          <span className="text-cyber-cyan">:</span>
          <TimeBlock value={timeLeft.minutes} label={labels.minutes} />
          <span className="text-cyber-cyan">:</span>
          <TimeBlock value={timeLeft.seconds} label={labels.seconds} />
        </div>
      </div>
    );
  }

  // 紧凑格式
  if (format === 'compact') {
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        variants[variant],
        className
      )}>
        {showIcon && <Clock className="w-4 h-4 text-cyber-cyan" />}
        <span className={cn("font-mono font-bold tabular-nums", sizes[size])}>
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  // 最小格式
  return (
    <div className={cn("inline-flex", className)}>
      <span className={cn("font-mono font-bold tabular-nums text-cyber-cyan", sizes[size])}>
        {timeLeft.days > 0 && `${timeLeft.days}:`}
        {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
      </span>
    </div>
  );
}

/**
 * CountdownCircle Component - 圆形倒计时
 */
export interface CountdownCircleProps {
  targetDate: Date | string | number;
  size?: number;
  strokeWidth?: number;
  onComplete?: () => void;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

export function CountdownCircle({
  targetDate,
  size = 200,
  strokeWidth = 8,
  onComplete,
  className,
  color = 'cyan',
}: CountdownCircleProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const total = target - now;

    if (total > 0) {
      setTotalTime(total);
      setTimeLeft(total);
    }

    const timer = setInterval(() => {
      const current = new Date().getTime();
      const remaining = target - current;

      if (remaining <= 0) {
        setTimeLeft(0);
        onComplete?.();
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  const progress = totalTime > 0 ? (timeLeft / totalTime) * circumference : 0;
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  const colorClasses = {
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    pink: 'text-cyber-pink',
    yellow: 'text-cyber-yellow',
  };

  // 格式化时间显示
  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-cyber-muted"
        />
        {/* 进度圆 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={colorClasses[color]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      {/* 中心文字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-cyber-text tabular-nums">
          {Math.ceil(percentage)}%
        </span>
        <span className="text-sm text-cyber-text-secondary mt-1">
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
}
