'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IntervalTimerProps {
  title?: string;
  defaultWorkTime?: number;
  defaultRestTime?: number;
  defaultRounds?: number;
  className?: string;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
}

type TimerPhase = 'idle' | 'work' | 'rest' | 'complete';

const colorSchemes = {
  cyan: {
    work: 'from-cyan-500 to-blue-500',
    rest: 'from-purple-500 to-pink-500',
    complete: 'from-green-500 to-emerald-500',
    workText: 'text-cyan-400',
    restText: 'text-purple-400',
    completeText: 'text-green-400',
  },
  purple: {
    work: 'from-purple-500 to-pink-500',
    rest: 'from-blue-500 to-cyan-500',
    complete: 'from-green-500 to-emerald-500',
    workText: 'text-purple-400',
    restText: 'text-blue-400',
    completeText: 'text-green-400',
  },
  pink: {
    work: 'from-pink-500 to-rose-500',
    rest: 'from-cyan-500 to-blue-500',
    complete: 'from-green-500 to-emerald-500',
    workText: 'text-pink-400',
    restText: 'text-cyan-400',
    completeText: 'text-green-400',
  },
  green: {
    work: 'from-green-500 to-emerald-500',
    rest: 'from-blue-500 to-cyan-500',
    complete: 'from-purple-500 to-pink-500',
    workText: 'text-green-400',
    restText: 'text-blue-400',
    completeText: 'text-purple-400',
  },
  orange: {
    work: 'from-orange-500 to-amber-500',
    rest: 'from-cyan-500 to-blue-500',
    complete: 'from-green-500 to-emerald-500',
    workText: 'text-orange-400',
    restText: 'text-cyan-400',
    completeText: 'text-green-400',
  },
};

const IntervalTimer: React.FC<IntervalTimerProps> = ({
  title = '间歇训练计时器',
  defaultWorkTime = 30,
  defaultRestTime = 10,
  defaultRounds = 8,
  className,
  colorScheme = 'cyan',
}) => {
  const colors = colorSchemes[colorScheme];

  const [workTime, setWorkTime] = useState(defaultWorkTime);
  const [restTime, setRestTime] = useState(defaultRestTime);
  const [rounds, setRounds] = useState(defaultRounds);
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // 格式化时间显示
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }, []);

  // 计时器逻辑
  useEffect(() => {
    if (!isRunning || phase === 'idle' || phase === 'complete') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 时间到，切换阶段
          if (phase === 'work') {
            if (currentRound >= rounds) {
              // 所有轮次完成
              setPhase('complete');
              setIsRunning(false);
              return 0;
            }
            // 切换到休息
            setPhase('rest');
            return restTime;
          } else {
            // 休息结束，开始下一轮工作
            setCurrentRound((prev) => prev + 1);
            setPhase('work');
            return workTime;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, phase, currentRound, rounds, workTime, restTime]);

  // 开始/暂停
  const handleStart = () => {
    if (phase === 'idle' || phase === 'complete') {
      setCurrentRound(1);
      setPhase('work');
      setTimeLeft(workTime);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  // 重置
  const handleReset = () => {
    setIsRunning(false);
    setPhase('idle');
    setCurrentRound(0);
    setTimeLeft(0);
  };

  // 调整时间
  const adjustTime = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number,
    delta: number,
    min: number = 5,
    max: number = 300
  ) => {
    if (!isRunning && phase === 'idle') {
      setter(Math.max(min, Math.min(max, current + delta)));
    }
  };

  // 获取当前颜色方案
  const getCurrentColors = () => {
    switch (phase) {
      case 'work':
        return { gradient: colors.work, text: colors.workText, label: '训练中' };
      case 'rest':
        return { gradient: colors.rest, text: colors.restText, label: '休息中' };
      case 'complete':
        return { gradient: colors.complete, text: colors.completeText, label: '完成' };
      default:
        return { gradient: colors.work, text: colors.workText, label: '准备开始' };
    }
  };

  const currentColors = getCurrentColors();
  const progress = phase !== 'idle' && phase !== 'complete' ? ((phase === 'work' ? workTime : restTime) - timeLeft) / (phase === 'work' ? workTime : restTime) * 100 : 0;

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-700 bg-gray-900/50 p-6 backdrop-blur-sm',
        className
      )}
    >
      {title && (
        <h3 className="mb-6 text-lg font-bold text-white">{title}</h3>
      )}

      {/* 时间设置 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">训练时间 (秒)</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustTime(setWorkTime, workTime, -5)}
              disabled={isRunning}
              className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex-1 rounded-lg bg-gray-800 py-2 text-center font-mono text-lg text-white">
              {workTime}
            </span>
            <button
              onClick={() => adjustTime(setWorkTime, workTime, 5)}
              disabled={isRunning}
              className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">休息时间 (秒)</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustTime(setRestTime, restTime, -5)}
              disabled={isRunning}
              className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex-1 rounded-lg bg-gray-800 py-2 text-center font-mono text-lg text-white">
              {restTime}
            </span>
            <button
              onClick={() => adjustTime(setRestTime, restTime, 5)}
              disabled={isRunning}
              className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 轮次设置 */}
      <div className="mb-6 space-y-2">
        <label className="text-sm text-gray-400">轮次</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustTime(setRounds, rounds, -1, 1, 50)}
            disabled={isRunning}
            className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex-1 rounded-lg bg-gray-800 py-2 text-center font-mono text-lg text-white">
            {rounds}
          </span>
          <button
            onClick={() => adjustTime(setRounds, rounds, 1, 1, 50)}
            disabled={isRunning}
            className="rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 计时器显示 */}
      <div className="relative mb-6 overflow-hidden rounded-xl bg-gray-800/50">
        {/* 进度条背景 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5 }}
            className={cn('absolute inset-0 bg-gradient-to-r opacity-20', currentColors.gradient)}
          />
        </AnimatePresence>

        {/* 进度条 */}
        {phase !== 'idle' && phase !== 'complete' && (
          <motion.div
            className={cn('absolute top-0 left-0 h-full bg-gradient-to-r', currentColors.gradient)}
            style={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        )}

        {/* 内容 */}
        <div className="relative z-10 p-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${phase}-${timeLeft}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className={cn('text-sm font-semibold uppercase tracking-wider', currentColors.text)}>
                {currentColors.label}
              </div>
              <div className="text-6xl font-mono font-bold text-white tabular-nums">
                {formatTime(timeLeft)}
              </div>
              {phase !== 'idle' && phase !== 'complete' && (
                <div className="text-sm text-gray-400">
                  第 {currentRound} / {rounds} 轮
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleStart}
          className={cn(
            'flex items-center gap-2 rounded-lg px-8 py-3 font-semibold text-white transition-all',
            phase === 'complete'
              ? 'bg-green-500 hover:bg-green-400'
              : phase === 'idle'
              ? 'bg-gradient-to-r ' + colors.work
              : isRunning
              ? 'bg-orange-500 hover:bg-orange-400'
              : 'bg-cyan-500 hover:bg-cyan-400'
          )}
        >
          {phase === 'complete' ? (
            <>
              <RotateCcw className="h-5 w-5" />
              重新开始
            </>
          ) : phase === 'idle' ? (
            <>
              <Play className="h-5 w-5" />
              开始训练
            </>
          ) : isRunning ? (
            <>
              <Pause className="h-5 w-5" />
              暂停
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              继续
            </>
          )}
        </button>

        {(phase !== 'idle' || currentRound > 0) && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-gray-600 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-700"
          >
            <RotateCcw className="h-5 w-5" />
            重置
          </button>
        )}
      </div>

      {/* 完成状态 */}
      {phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-lg bg-gray-800/50 p-4 text-center"
        >
          <div className="text-2xl font-bold text-white mb-2">🎉 训练完成！</div>
          <div className="text-gray-400">
            完成了 {rounds} 轮训练，总时长{' '}
            <span className="font-mono font-semibold text-white">
              {formatTime(rounds * (workTime + restTime) - restTime)}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IntervalTimer;
