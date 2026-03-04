'use client';

/**
 * Countdown Timer Component
 * 倒计时组件 - 用于显示倒计时
 */

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface CountdownTimerProps {
  /** 目标日期 */
  targetDate: Date | string | number;
  /** 倒计时完成回调 */
  onComplete?: () => void;
  /** 显示格式 */
  format?: 'full' | 'short' | 'minimal';
  /** 自定义类名 */
  className?: string;
  /** 是否显示标签 */
  showLabels?: boolean;
  /** 样式变体 */
  variant?: 'default' | 'neon' | 'cyber';
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function CountdownTimer({
  targetDate,
  onComplete,
  format = 'full',
  className,
  showLabels = true,
  variant = 'default',
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  const [isComplete, setIsComplete] = useState(false);

  // 计算剩余时间
  const calculateTimeRemaining = useMemo(() => {
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const now = new Date().getTime();
    const difference = target.getTime() - now;

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

  useEffect(() => {
    setTimeRemaining(calculateTimeRemaining);

    if (calculateTimeRemaining.total <= 0 && !isComplete) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeRemaining, onComplete, isComplete]);

  // 格式化数字，补零
  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num.toString();
  };

  // 根据格式显示时间
  const renderTime = () => {
    const { days, hours, minutes, seconds } = timeRemaining;

    const timeUnits = [
      { value: days, label: '天', shortLabel: 'D' },
      { value: hours, label: '时', shortLabel: 'H' },
      { value: minutes, label: '分', shortLabel: 'M' },
      { value: seconds, label: '秒', shortLabel: 'S' },
    ];

    if (format === 'minimal') {
      return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    }

    return (
      <div className="flex items-center gap-2">
        {timeUnits.map((unit, index) => {
          if (format === 'short' && index === 0 && unit.value === 0) return null;

          const label = format === 'short' ? unit.shortLabel : unit.label;

          return (
            <div key={index} className="flex items-baseline gap-1">
              <span className="font-mono font-bold">{formatNumber(unit.value)}</span>
              {showLabels && <span className="text-xs opacity-70">{label}</span>}
            </div>
          );
        })}
      </div>
    );
  };

  const variants = {
    default: '',
    neon: 'text-cyan-400 text-shadow-glow',
    cyber: 'font-mono tracking-wider',
  };

  if (isComplete) {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-lg">倒计时已结束</p>
      </div>
    );
  }

  return (
    <div className={cn('countdown-timer', variants[variant], className)}>
      {renderTime()}
    </div>
  );
}
