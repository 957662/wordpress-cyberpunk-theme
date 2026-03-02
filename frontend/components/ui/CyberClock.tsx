'use client';

/**
 * 赛博朋克风格时钟组件
 * 支持数字时钟和模拟时钟两种模式
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberClockProps {
  variant?: 'digital' | 'analog' | 'both';
  showSeconds?: boolean;
  showDate?: boolean;
  showDayOfWeek?: boolean;
  format?: '12h' | '24h';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
}

export function CyberClock({
  variant = 'digital',
  showSeconds = true,
  showDate = true,
  showDayOfWeek = true,
  format = '24h',
  size = 'md',
  theme = 'cyan',
  className,
}: CyberClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const themeColors = {
    cyan: {
      primary: '#00f0ff',
      secondary: 'rgba(0, 240, 255, 0.3)',
      glow: 'shadow-neon-cyan',
    },
    purple: {
      primary: '#9d00ff',
      secondary: 'rgba(157, 0, 255, 0.3)',
      glow: 'shadow-neon-purple',
    },
    pink: {
      primary: '#ff0080',
      secondary: 'rgba(255, 0, 128, 0.3)',
      glow: 'shadow-neon-pink',
    },
    yellow: {
      primary: '#f0ff00',
      secondary: 'rgba(240, 255, 0, 0.3)',
      glow: 'shadow-neon-yellow',
    },
  };

  const colors = themeColors[theme];
  const sizeMap = {
    sm: { text: 'text-2xl', analog: 'w-24 h-24' },
    md: { text: 'text-5xl', analog: 'w-40 h-40' },
    lg: { text: 'text-7xl', analog: 'w-56 h-56' },
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if (format === '12h') {
      hours = hours % 12;
      hours = hours ? hours : 12;
    }

    const hoursStr = hours.toString().padStart(2, '0');
    return {
      time: `${hoursStr}:${minutes}${showSeconds ? `:${seconds}` : ''}`,
      ampm: format === '12h' ? ampm : '',
    };
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDayOfWeek = (date: Date) => {
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return days[date.getDay()];
  };

  const getRotation = (value: number, max: number) => (value / max) * 360;

  const { time: timeStr, ampm } = formatTime(time);

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {variant === 'digital' || variant === 'both' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div
            className={cn(
              'absolute inset-0 blur-xl rounded-lg',
              colors.glow
            )}
            style={{ backgroundColor: colors.secondary }}
          />

          {/* Time Display */}
          <div className="relative bg-cyber-dark/80 backdrop-blur-sm border-2 rounded-lg p-6">
            <div className={cn('font-display font-bold text-center', sizeMap[size].text)} style={{ color: colors.primary }}>
              {timeStr}
              {ampm && (
                <span className="text-lg ml-2 opacity-80">{ampm}</span>
              )}
            </div>

            {/* Date and Day */}
            {(showDate || showDayOfWeek) && (
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-400">
                {showDayOfWeek && (
                  <span className="font-mono">{getDayOfWeek(time)}</span>
                )}
                {showDate && (
                  <span className="font-mono">{formatDate(time)}</span>
                )}
              </div>
            )}

            {/* Progress Bar for Seconds */}
            {showSeconds && (
              <div className="mt-4 h-1 bg-cyber-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(time.getSeconds() / 60) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        </motion.div>
      ) : null}

      {variant === 'analog' || variant === 'both' ? (
        <motion.div
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
          className={cn(
            'relative rounded-full border-4 flex items-center justify-center',
            sizeMap[size].analog
          )}
          style={{ borderColor: colors.primary, backgroundColor: 'rgba(10, 10, 15, 0.9)' }}
        >
          {/* Clock Markers */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-3 rounded-full"
              style={{
                backgroundColor: colors.primary,
                transform: `rotate(${i * 30}deg) translateY(-${size === 'sm' ? 40 : size === 'md' ? 65 : 90}px)`,
              }}
            />
          ))}

          {/* Hour Hand */}
          <motion.div
            className="absolute w-2 rounded-full origin-bottom"
            style={{
              backgroundColor: colors.primary,
              height: size === 'sm' ? '25%' : size === 'md' ? '30%' : '28%',
              rotate: getRotation(time.getHours() % 12 + time.getMinutes() / 60, 12),
              boxShadow: `0 0 10px ${colors.primary}`,
            }}
          />

          {/* Minute Hand */}
          <motion.div
            className="absolute w-1.5 rounded-full origin-bottom"
            style={{
              backgroundColor: colors.secondary,
              height: size === 'sm' ? '35%' : size === 'md' ? '40%' : '38%',
              rotate: getRotation(time.getMinutes(), 60),
            }}
          />

          {/* Second Hand */}
          {showSeconds && (
            <motion.div
              className="absolute w-1 rounded-full origin-bottom"
              style={{
                backgroundColor: colors.primary,
                height: size === 'sm' ? '40%' : size === 'md' ? '45%' : '43%',
                rotate: getRotation(time.getSeconds(), 60),
                boxShadow: `0 0 5px ${colors.primary}`,
              }}
            />
          )}

          {/* Center Dot */}
          <div
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        </motion.div>
      ) : null}
    </div>
  );
}

export default CyberClock;
