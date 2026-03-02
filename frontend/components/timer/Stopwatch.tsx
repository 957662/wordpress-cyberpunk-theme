'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Lap } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StopwatchProps {
  title?: string;
  showLaps?: boolean;
  className?: string;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green';
}

interface LapTime {
  id: number;
  time: number;
  label: string;
}

const colorSchemes = {
  cyan: {
    primary: 'text-cyan-400',
    bg: 'bg-cyan-500',
    border: 'border-cyan-500/30',
    button: 'bg-cyan-500 hover:bg-cyan-400',
  },
  purple: {
    primary: 'text-purple-400',
    bg: 'bg-purple-500',
    border: 'border-purple-500/30',
    button: 'bg-purple-500 hover:bg-purple-400',
  },
  pink: {
    primary: 'text-pink-400',
    bg: 'bg-pink-500',
    border: 'border-pink-500/30',
    button: 'bg-pink-500 hover:bg-pink-400',
  },
  green: {
    primary: 'text-green-400',
    bg: 'bg-green-500',
    border: 'border-green-500/30',
    button: 'bg-green-500 hover:bg-green-400',
  },
};

const Stopwatch: React.FC<StopwatchProps> = ({
  title = '秒表',
  showLaps = true,
  className,
  colorScheme = 'cyan',
}) => {
  const colors = colorSchemes[colorScheme];
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const elapsedTimeRef = useRef<number>(0);

  const formatTime = useCallback((ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  }, []);

  const animate = useCallback((currentTime: number) => {
    if (startTimeRef.current === undefined) return;

    const elapsed = currentTime - startTimeRef.current + elapsedTimeRef.current;
    setTime(elapsed);

    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - elapsedTimeRef.current;
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, animate]);

  const handleStart = () => {
    if (isRunning) {
      setIsRunning(false);
      elapsedTimeRef.current = time;
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    elapsedTimeRef.current = 0;
    startTimeRef.current = undefined;
    setLaps([]);
  };

  const handleLap = () => {
    if (time > 0) {
      const newLap: LapTime = {
        id: Date.now(),
        time,
        label: `Lap ${laps.length + 1}`,
      };
      setLaps((prev) => [newLap, ...prev]);
    }
  };

  const bestLap = laps.length > 0 ? Math.min(...laps.map((l) => l.time)) : null;
  const worstLap = laps.length > 0 ? Math.max(...laps.map((l) => l.time)) : null;

  return (
    <div
      className={cn(
        'rounded-xl border bg-gray-900/50 p-6 backdrop-blur-sm',
        colors.border,
        className
      )}
    >
      {title && (
        <h3 className={cn('text-lg font-bold mb-4', colors.primary)}>{title}</h3>
      )}

      {/* 时间显示 */}
      <div className="relative mb-8 overflow-hidden rounded-lg bg-gray-800/50 p-8">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className={cn('absolute -right-8 -top-8 h-32 w-32 rounded-full', colors.bg)} />
          <div className={cn('absolute -bottom-8 -left-8 h-32 w-32 rounded-full', colors.bg)} />
        </div>

        {/* 时间数字 */}
        <motion.div
          key={time}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          className={cn(
            'relative z-10 text-center text-5xl font-mono font-bold tabular-nums',
            colors.primary
          )}
        >
          {formatTime(time)}
        </motion.div>

        {/* 状态指示器 */}
        {isRunning && (
          <motion.div
            className={cn('absolute top-4 right-4 h-2 w-2 rounded-full', colors.bg)}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* 控制按钮 */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <button
          onClick={handleStart}
          className={cn(
            'flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-all',
            isRunning ? 'bg-orange-500 hover:bg-orange-400' : colors.button
          )}
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5" />
              暂停
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              {time > 0 ? '继续' : '开始'}
            </>
          )}
        </button>

        <button
          onClick={handleLap}
          disabled={!isRunning || !showLaps}
          className={cn(
            'flex items-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed',
            colors.button
          )}
        >
          <Lap className="h-5 w-5" />
          计次
        </button>

        <button
          onClick={handleReset}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-gray-600 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-700',
            colors.border
          )}
        >
          <RotateCcw className="h-5 w-5" />
          重置
        </button>
      </div>

      {/* 计次列表 */}
      {showLaps && laps.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>计次记录</span>
            <span>共 {laps.length} 次</span>
          </div>

          <div className="max-h-48 space-y-2 overflow-y-auto">
            {laps.map((lap, index) => {
              const isBest = bestLap !== null && lap.time === bestLap;
              const isWorst = worstLap !== null && lap.time === worstLap;

              return (
                <motion.div
                  key={lap.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    'flex items-center justify-between rounded-lg bg-gray-800/50 px-4 py-2',
                    isBest && 'border-l-2 border-green-500',
                    isWorst && !isBest && 'border-l-2 border-red-500'
                  )}
                >
                  <span className="text-sm text-gray-400">
                    {lap.label}
                    {isBest && <span className="ml-2 text-xs text-green-400">最快</span>}
                    {isWorst && !isBest && (
                      <span className="ml-2 text-xs text-red-400">最慢</span>
                    )}
                  </span>
                  <span className={cn('font-mono font-semibold', colors.primary)}>
                    {formatTime(lap.time)}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* 统计信息 */}
          {laps.length >= 2 && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-800/30 px-4 py-3">
              <div className="text-center">
                <div className="text-xs text-gray-400">平均</div>
                <div className={cn('font-mono font-semibold', colors.primary)}>
                  {formatTime(
                    laps.reduce((sum, lap) => sum + lap.time, 0) / laps.length
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">总时长</div>
                <div className={cn('font-mono font-semibold', colors.primary)}>
                  {formatTime(laps.reduce((sum, lap) => sum + lap.time, 0))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Stopwatch;
