'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface DigitalClockProps {
  /**
   * 是否显示秒数
   */
  showSeconds?: boolean;

  /**
   * 是否显示日期
   */
  showDate?: boolean;

  /**
   * 时间格式
   */
  format?: '12h' | '24h';

  /**
   * 主题颜色
   */
  theme?: 'cyan' | 'purple' | 'pink' | 'green';

  /**
   * 是否显示星期
   */
  showDay?: boolean;

  /**
   * 自定义类名
   */
  className?: string;
}

const themeStyles = {
  cyan: {
    primary: 'text-cyber-cyan',
    glow: 'text-glow-cyan',
    border: 'border-cyber-cyan',
    bg: 'bg-cyber-cyan',
  },
  purple: {
    primary: 'text-cyber-purple',
    glow: 'text-glow-purple',
    border: 'border-cyber-purple',
    bg: 'bg-cyber-purple',
  },
  pink: {
    primary: 'text-cyber-pink',
    glow: 'text-glow-pink',
    border: 'border-cyber-pink',
    bg: 'bg-cyber-pink',
  },
  green: {
    primary: 'text-cyber-green',
    glow: '',
    border: 'border-cyber-green',
    bg: 'bg-cyber-green',
  },
};

/**
 * DigitalClock - 赛博朋克风格数字时钟组件
 *
 * @example
 * ```tsx
 * <DigitalClock showSeconds showDate format="24h" theme="cyan" />
 * <DigitalClock format="12h" theme="purple" />
 * ```
 */
export const DigitalClock: React.FC<DigitalClockProps> = ({
  showSeconds = true,
  showDate = false,
  format = '24h',
  theme = 'cyan',
  showDay = false,
  className = '',
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const styles = themeStyles[theme];

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    if (format === '12h') {
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return {
        time: `${hours.toString().padStart(2, '0')}:${minutes}${showSeconds ? `:${seconds}` : ''}`,
        period,
      };
    }

    return {
      time: `${hours.toString().padStart(2, '0')}:${minutes}${showSeconds ? `:${seconds}` : ''}`,
      period: '',
    };
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    if (showDay) {
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const dayName = days[date.getDay()];
      return `${year}-${month}-${day} ${dayName}`;
    }

    return `${year}-${month}-${day}`;
  };

  const { time: timeString, period } = formatTime(time);

  return (
    <div className={cn('inline-block', className)}>
      <div
        className={cn(
          'font-mono font-bold',
          'bg-cyber-darker',
          'border-2',
          styles.border,
          'rounded-lg',
          'p-4 md:p-6',
          'shadow-lg',
          'relative',
          'overflow-hidden'
        )}
      >
        {/* 背景网格效果 */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(${styles.bg} 1px, transparent 1px),
                linear-gradient(90deg, ${styles.bg} 1px, transparent 1px)
              `,
              backgroundSize: '10px 10px',
            }}
          />
        </div>

        {/* 扫描线效果 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className={cn('w-full h-1', styles.bg, 'opacity-10 blur-sm')}
          />
        </motion.div>

        {/* 时间显示 */}
        <div className="relative z-10 text-center">
          <motion.div
            key={timeString}
            initial={{ scale: 1.05, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-2"
          >
            <span className={cn('text-4xl md:text-6xl lg:text-7xl', styles.glow)}>
              {timeString}
            </span>
            {period && (
              <span
                className={cn(
                  'text-lg md:text-2xl lg:text-3xl',
                  styles.primary,
                  'mt-2'
                )}
              >
                {period}
              </span>
            )}
          </motion.div>

          {/* 日期显示 */}
          {showDate && (
            <motion.div
              key={formatDate(time)}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={cn(
                'mt-4 text-sm md:text-base',
                styles.primary,
                'font-mono'
              )}
            >
              {formatDate(time)}
            </motion.div>
          )}

          {/* 装饰元素 */}
          <div className="flex justify-between mt-4">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                styles.bg,
                'animate-pulse'
              )}
            />
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                styles.bg,
                'animate-pulse',
                'delay-75'
              )}
            />
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                styles.bg,
                'animate-pulse',
                'delay-150'
              )}
            />
          </div>
        </div>

        {/* 角落装饰 */}
        <div className={cn('absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2', styles.border)} />
        <div className={cn('absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2', styles.border)} />
        <div className={cn('absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2', styles.border)} />
        <div className={cn('absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2', styles.border)} />
      </div>
    </div>
  );
};

export default DigitalClock;
