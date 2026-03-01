'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

export interface ClockWidgetProps {
  /**
   * 时区
   */
  timezone?: string;

  /**
   * 时间格式
   */
  format?: '12h' | '24h';

  /**
   * 是否显示日期
   */
  showDate?: boolean;

  /**
   * 是否显示星期
   */
  showWeekday?: boolean;

  /**
   * 是否显示秒
   */
  showSeconds?: boolean;

  /**
   * 颜色主题
   */
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';

  /**
   * 样式变体
   */
  variant?: 'digital' | 'analog' | 'minimal' | 'neon';

  /**
   * 是否显示发光效果
   */
  glow?: boolean;

  /**
   * 自定义类名
   */
  className?: string;
}

const colorMap = {
  cyan: { primary: '#00f0ff', secondary: '#00a0aa', glow: 'rgba(0, 240, 255, 0.5)' },
  purple: { primary: '#9d00ff', secondary: '#6a00aa', glow: 'rgba(157, 0, 255, 0.5)' },
  pink: { primary: '#ff0080', secondary: '#aa0055', glow: 'rgba(255, 0, 128, 0.5)' },
  green: { primary: '#00ff41', secondary: '#00aa2b', glow: 'rgba(0, 255, 65, 0.5)' },
  yellow: { primary: '#f0ff00', secondary: '#a0aa00', glow: 'rgba(240, 255, 0, 0.5)' },
};

/**
 * ClockWidget - 时钟小部件
 *
 * 显示当前时间，支持多种样式和时区
 *
 * @example
 * ```tsx
 * <ClockWidget variant="neon" color="cyan" showDate showSeconds glow />
 * <ClockWidget variant="analog" timezone="America/New_York" />
 * <ClockWidget variant="minimal" format="12h" />
 * ```
 */
export const ClockWidget: React.FC<ClockWidgetProps> = ({
  timezone,
  format = '24h',
  showDate = true,
  showWeekday = true,
  showSeconds = true,
  color = 'cyan',
  variant = 'digital',
  glow = false,
  className = '',
}) => {
  const colors = colorMap[color];
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeInTimezone = (date: Date): Date => {
    if (!timezone) return date;

    try {
      const tzTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      const diff = date.getTime() - tzTime.getTime();
      return new Date(date.getTime() + diff);
    } catch {
      return date;
    }
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (format === '12h') {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return showSeconds
        ? `${displayHours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`
        : `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
    }

    return showSeconds
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getWeekday = (date: Date): string => {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  };

  const renderDigital = () => {
    const localTime = getTimeInTimezone(time);

    return (
      <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-lg border-2 backdrop-blur-sm" style={{ borderColor: colors.primary, boxShadow: glow ? `0 0 30px ${colors.glow}` : undefined }}>
        {/* 日期和星期 */}
        {showDate && (
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} style={{ color: colors.primary }} />
            <span className="text-sm font-mono" style={{ color: colors.secondary }}>
              {formatDate(localTime)}
            </span>
            {showWeekday && (
              <span className="text-sm font-medium ml-2" style={{ color: colors.primary }}>
                {getWeekday(localTime)}
              </span>
            )}
          </div>
        )}

        {/* 时间 */}
        <motion.div
          className="text-5xl font-bold font-mono tabular-nums"
          style={{
            color: colors.primary,
            textShadow: glow ? `0 0 20px ${colors.glow}` : undefined,
          }}
          key={formatTime(localTime)}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatTime(localTime)}
        </motion.div>

        {/* 时区标识 */}
        {timezone && (
          <div className="mt-2 text-xs font-mono opacity-60" style={{ color: colors.secondary }}>
            {timezone}
          </div>
        )}
      </div>
    );
  };

  const renderMinimal = () => {
    const localTime = getTimeInTimezone(time);
    const hours = localTime.getHours();
    const minutes = localTime.getMinutes();
    const seconds = localTime.getSeconds();

    return (
      <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-white/10 backdrop-blur-sm">
        <Clock size={24} style={{ color: colors.primary }} />

        <div className="flex flex-col">
          <div
            className="text-3xl font-bold font-mono tabular-nums"
            style={{
              color: colors.primary,
              textShadow: glow ? `0 0 15px ${colors.glow}` : undefined,
            }}
          >
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
          </div>

          {showSeconds && (
            <div className="text-sm font-mono" style={{ color: colors.secondary }}>
              :{String(seconds).padStart(2, '0')}
            </div>
          )}
        </div>

        {showDate && (
          <div className="ml-auto text-sm font-mono" style={{ color: colors.secondary }}>
            {formatDate(localTime)}
          </div>
        )}
      </div>
    );
  };

  const renderNeon = () => {
    const localTime = getTimeInTimezone(time);

    return (
      <div className="relative p-8 bg-black/60 rounded-lg overflow-hidden">
        {/* 扫描线效果 */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              ${colors.primary} 2px,
              ${colors.primary} 4px
            )`,
          }}
        />

        <div className="relative">
          {/* 发光边框 */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              border: `2px solid ${colors.primary}`,
              boxShadow: `0 0 20px ${colors.glow}, inset 0 0 20px ${colors.glow}`,
            }}
          />

          <div className="relative p-6">
            {/* 日期 */}
            {showDate && (
              <div className="text-center mb-4">
                <span
                  className="text-sm font-mono tracking-widest"
                  style={{ color: colors.secondary }}
                >
                  {formatDate(localTime)}
                </span>
                {showWeekday && (
                  <>
                    <span className="mx-2" style={{ color: colors.primary }}>
                      /
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.primary }}
                    >
                      {getWeekday(localTime)}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* 时间 */}
            <motion.div
              className="text-6xl font-bold font-mono text-center tabular-nums"
              style={{
                color: colors.primary,
                textShadow: `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}, 0 0 30px ${colors.primary}`,
              }}
              key={formatTime(localTime)}
              animate={{
                textShadow: [
                  `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}, 0 0 30px ${colors.primary}`,
                  `0 0 20px ${colors.glow}, 0 0 30px ${colors.glow}, 0 0 40px ${colors.primary}`,
                  `0 0 10px ${colors.glow}, 0 0 20px ${colors.glow}, 0 0 30px ${colors.primary}`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formatTime(localTime)}
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalog = () => {
    const localTime = getTimeInTimezone(time);
    const hours = localTime.getHours() % 12;
    const minutes = localTime.getMinutes();
    const seconds = localTime.getSeconds();

    const hourRotation = (hours * 30) + (minutes * 0.5);
    const minuteRotation = minutes * 6;
    const secondRotation = seconds * 6;

    return (
      <div className="flex flex-col items-center">
        {/* 表盘 */}
        <div className="relative w-48 h-48 rounded-full bg-black/40 border-2 backdrop-blur-sm" style={{ borderColor: colors.primary, boxShadow: glow ? `0 0 30px ${colors.glow}` : undefined }}>
          {/* 刻度 */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const x1 = 96 + 80 * Math.cos(angle);
            const y1 = 96 + 80 * Math.sin(angle);
            const x2 = 96 + 90 * Math.cos(angle);
            const y2 = 96 + 90 * Math.sin(angle);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={colors.primary}
                strokeWidth={i % 3 === 0 ? 3 : 1}
                style={{ filter: glow ? `drop-shadow(0 0 3px ${colors.glow})` : undefined }}
              />
            );
          })}

          {/* 数字 */}
          {[...Array(12)].map((_, i) => {
            const num = i === 0 ? 12 : i;
            const angle = ((i - 3) * 30) * (Math.PI / 180);
            const x = 96 + 70 * Math.cos(angle);
            const y = 96 + 70 * Math.sin(angle);

            return (
              <text
                key={i}
                x={x}
                y={y + 6}
                textAnchor="middle"
                className="text-sm font-bold font-mono"
                style={{ fill: colors.primary, filter: glow ? `drop-shadow(0 0 3px ${colors.glow})` : undefined }}
              >
                {num}
              </text>
            );
          })}

          {/* 中心点 */}
          <circle cx={96} cy={96} r={4} fill={colors.primary} style={{ filter: glow ? `drop-shadow(0 0 5px ${colors.glow})` : undefined }} />

          {/* 时针 */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-1 h-16 origin-bottom"
            style={{
              backgroundColor: colors.primary,
              boxShadow: glow ? `0 0 10px ${colors.glow}` : undefined,
              transformOrigin: 'bottom center',
            }}
            animate={{ rotate: hourRotation }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* 分针 */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-0.5 h-24 origin-bottom"
            style={{
              backgroundColor: colors.secondary,
              boxShadow: glow ? `0 0 10px ${colors.glow}` : undefined,
              transformOrigin: 'bottom center',
            }}
            animate={{ rotate: minuteRotation }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />

          {/* 秒针 */}
          {showSeconds && (
            <motion.div
              className="absolute top-1/2 left-1/2 w-0.5 h-28 origin-bottom"
              style={{
                backgroundColor: colors.primary,
                boxShadow: glow ? `0 0 8px ${colors.glow}` : undefined,
                transformOrigin: 'bottom center',
              }}
              animate={{ rotate: secondRotation }}
              transition={{ ease: 'linear' }}
            />
          )}
        </div>

        {/* 数字时间 */}
        <div className="mt-4 text-2xl font-mono" style={{ color: colors.primary }}>
          {formatTime(localTime)}
        </div>

        {/* 日期 */}
        {showDate && (
          <div className="text-sm font-mono mt-2" style={{ color: colors.secondary }}>
            {formatDate(localTime)}
            {showWeekday && <span className="ml-2">{getWeekday(localTime)}</span>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {variant === 'digital' && renderDigital()}
      {variant === 'minimal' && renderMinimal()}
      {variant === 'neon' && renderNeon()}
      {variant === 'analog' && renderAnalog()}
    </div>
  );
};

export default ClockWidget;
