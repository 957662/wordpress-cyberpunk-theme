'use client';

/**
 * Countdown Timer Component
 * 倒计时组件 - 支持自定义格式、暂停/恢复、完成回调
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

type TimeUnit = 'days' | 'hours' | 'minutes' | 'seconds';
type TimerFormat = 'full' | 'short' | 'minimal';

interface CountdownTimerProps {
  targetDate: Date | string | number;
  format?: TimerFormat;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  labels?: {
    days?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
  };
  theme?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  autoStart?: boolean;
  onComplete?: () => void;
  onTick?: (timeLeft: number) => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function CountdownTimer({
  targetDate,
  format = 'full',
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  labels = {
    days: '天',
    hours: '时',
    minutes: '分',
    seconds: '秒',
  },
  theme = 'cyan',
  size = 'md',
  autoStart = true,
  onComplete,
  onTick,
  className = '',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  // 更新 ref
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  }, [onComplete, onTick]);

  // 计算剩余时间
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const target = typeof targetDate === 'string' || typeof targetDate === 'number'
      ? new Date(targetDate)
      : targetDate;

    const difference = target.getTime() - new Date().getTime();

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
    if (!isRunning || isCompleted) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // 触发 tick 回调
      if (onTickRef.current) {
        onTickRef.current(newTimeLeft.total);
      }

      // 检查是否完成
      if (newTimeLeft.total <= 0) {
        setIsCompleted(true);
        setIsRunning(false);

        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, isCompleted, calculateTimeLeft]);

  // 初始计算
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [calculateTimeLeft]);

  // 暂停/恢复
  const toggleTimer = useCallback(() => {
    if (!isCompleted) {
      setIsRunning(prev => !prev);
    }
  }, [isCompleted]);

  // 重置
  const resetTimer = useCallback(() => {
    setIsCompleted(false);
    setIsRunning(autoStart);
    setTimeLeft(calculateTimeLeft());
  }, [autoStart, calculateTimeLeft]);

  // 主题颜色
  const themeColors = {
    cyan: {
      primary: '#00f0ff',
      glow: 'rgba(0, 240, 255, 0.5)',
    },
    purple: {
      primary: '#9d00ff',
      glow: 'rgba(157, 0, 255, 0.5)',
    },
    pink: {
      primary: '#ff0080',
      glow: 'rgba(255, 0, 128, 0.5)',
    },
    yellow: {
      primary: '#f0ff00',
      glow: 'rgba(240, 255, 0, 0.5)',
    },
  };

  const colors = themeColors[theme];

  // 尺寸配置
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  // 渲染时间单位
  const renderTimeUnit = (value: number, unit: TimeUnit) => {
    if (value === 0 && !isCompleted) {
      return null;
    }

    const label = labels[unit];

    if (format === 'minimal') {
      return (
        <motion.span
          className="font-mono"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      );
    }

    return (
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`
            ${sizeClasses[size]} font-mono font-bold
            ${isCompleted ? 'text-green-500' : ''}
          `}
          style={{
            color: isCompleted ? undefined : colors.primary,
            textShadow: isCompleted ? undefined : `0 0 20px ${colors.glow}`,
          }}
        >
          {String(value).padStart(2, '0')}
        </div>
        {format === 'full' && (
          <div className="text-xs text-gray-400 mt-1">{label}</div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`inline-flex flex-col items-center gap-4 ${className}`}>
      {/* 时间显示 */}
      <div className="flex items-center gap-2">
        {showDays && renderTimeUnit(timeLeft.days, 'days')}
        {showDays && (showHours || showMinutes || showSeconds) && (
          <span className={`font-mono ${sizeClasses[size]} text-gray-500`}>:</span>
        )}
        {showHours && renderTimeUnit(timeLeft.hours, 'hours')}
        {showHours && (showMinutes || showSeconds) && (
          <span className={`font-mono ${sizeClasses[size]} text-gray-500`}>:</span>
        )}
        {showMinutes && renderTimeUnit(timeLeft.minutes, 'minutes')}
        {showMinutes && showSeconds && (
          <span className={`font-mono ${sizeClasses[size]} text-gray-500`}>:</span>
        )}
        {showSeconds && renderTimeUnit(timeLeft.seconds, 'seconds')}
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={toggleTimer}
          disabled={isCompleted}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
        </motion.button>

        <motion.button
          onClick={resetTimer}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={16} />
        </motion.button>
      </div>

      {/* 完成提示 */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-green-500 font-medium"
        >
          倒计时结束！
        </motion.div>
      )}
    </div>
  );
}

export default CountdownTimer;
