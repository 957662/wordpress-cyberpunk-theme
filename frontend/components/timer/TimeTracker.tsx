'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TimeEntry {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  category?: string;
  tags?: string[];
}

interface TimeTrackerProps {
  /**
   * 存储键名（用于localStorage）
   */
  storageKey?: string;

  /**
   * 是否显示分类
   */
  showCategory?: boolean;

  /**
   * 是否显示标签
   */
  showTags?: boolean;

  /**
   * 时间变化回调
   */
  onTimeEntryChange?: (entry: TimeEntry | null) => void;

  /**
   * 最大显示条目数
   */
  maxEntries?: number;
}

export function TimeTracker({
  storageKey = 'cyberpress-time-tracker',
  showCategory = true,
  showTags = true,
  onTimeEntryChange,
  maxEntries = 10,
}: TimeTrackerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentEntry, setCurrentEntry] = useState<Partial<TimeEntry>>({});
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 从localStorage加载条目
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsedEntries = JSON.parse(saved);
          const entriesWithDates = parsedEntries.map((entry: TimeEntry) => ({
            ...entry,
            startTime: new Date(entry.startTime),
            endTime: entry.endTime ? new Date(entry.endTime) : undefined,
          }));
          setEntries(entriesWithDates);
        }
      } catch (error) {
        console.error('Failed to load time entries:', error);
      }
    }
  }, [storageKey]);

  // 保存条目到localStorage
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined' && entries.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(entries));
      } catch (error) {
        console.error('Failed to save time entries:', error);
      }
    }
  }, [entries, storageKey]);

  // 计时器逻辑
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // 通知父组件当前条目变化
  useEffect(() => {
    if (isRunning && currentEntry.title) {
      onTimeEntryChange?.({
        id: Date.now().toString(),
        title: currentEntry.title,
        description: currentEntry.description,
        startTime: new Date(),
        duration: elapsed,
        category: currentEntry.category,
        tags: currentEntry.tags,
      } as TimeEntry);
    } else {
      onTimeEntryChange?.(null);
    }
  }, [isRunning, currentEntry, elapsed, onTimeEntryChange]);

  const startTimer = useCallback(() => {
    if (!currentEntry.title) {
      setIsEditing(true);
      return;
    }
    setIsRunning(true);
  }, [currentEntry.title]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const stopTimer = useCallback(() => {
    if (!currentEntry.title || elapsed === 0) return;

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      title: currentEntry.title,
      description: currentEntry.description,
      startTime: new Date(Date.now() - elapsed * 1000),
      endTime: new Date(),
      duration: elapsed,
      category: currentEntry.category,
      tags: currentEntry.tags,
    };

    setEntries([newEntry, ...entries]);
    setIsRunning(false);
    setElapsed(0);
    setCurrentEntry({});
  }, [currentEntry, elapsed, entries]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    setCurrentEntry({});
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  }, [entries]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // 计算今日总时间
  const todayTotal = entries
    .filter((entry) => {
      const today = new Date();
      return (
        entry.startTime.getDate() === today.getDate() &&
        entry.startTime.getMonth() === today.getMonth() &&
        entry.startTime.getFullYear() === today.getFullYear()
      );
    })
    .reduce((total, entry) => total + entry.duration, 0);

  return (
    <div className="bg-cyber-dark/50 border border-cyber-cyan/20 rounded-xl p-4 space-y-4">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="text-cyber-cyan" size={20} />
          时间追踪器
        </h3>
        <div className="text-sm text-gray-400">
          今日: {formatDuration(todayTotal)}
        </div>
      </div>

      {/* 当前计时器 */}
      <div className="bg-cyber-muted/30 border border-cyber-cyan/30 rounded-lg p-4">
        {/* 时间显示 */}
        <div className="text-center mb-4">
          <motion.div
            key={elapsed}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-4xl font-mono font-bold text-cyber-cyan"
          >
            {formatTime(elapsed)}
          </motion.div>
        </div>

        {/* 任务标题 */}
        <div className="mb-4">
          {isEditing || !currentEntry.title ? (
            <input
              type="text"
              placeholder="正在做什么？"
              value={currentEntry.title || ''}
              onChange={(e) =>
                setCurrentEntry({ ...currentEntry, title: e.target.value })
              }
              onBlur={() => setIsEditing(false)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setIsEditing(false);
                  if (!isRunning) startTimer();
                }
              }}
              className="w-full bg-cyber-dark border border-gray-700 rounded-lg px-3 py-2 text-white text-center focus:border-cyber-cyan focus:outline-none"
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="text-center text-white cursor-pointer hover:text-cyber-cyan transition-colors"
            >
              {currentEntry.title}
            </div>
          )}
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-2">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex items-center gap-2 bg-cyber-cyan hover:bg-cyber-cyan/80 text-black px-6 py-2 rounded-lg transition-colors"
            >
              <Play size={18} />
              {elapsed === 0 ? '开始' : '继续'}
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg transition-colors"
            >
              <Pause size={18} />
              暂停
            </button>
          )}

          {elapsed > 0 && (
            <>
              <button
                onClick={stopTimer}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-lg transition-colors"
              >
                <Clock size={18} />
                完成
              </button>
              <button
                onClick={resetTimer}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                title="重置"
              >
                <RotateCcw size={18} />
              </button>
            </>
          )}
        </div>

        {/* 分类和标签 */}
        {(showCategory || showTags) && elapsed > 0 && (
          <div className="mt-4 space-y-2">
            {showCategory && (
              <input
                type="text"
                placeholder="分类（可选）"
                value={currentEntry.category || ''}
                onChange={(e) =>
                  setCurrentEntry({ ...currentEntry, category: e.target.value })
                }
                className="w-full bg-cyber-dark border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyber-cyan focus:outline-none"
              />
            )}
            {showTags && (
              <input
                type="text"
                placeholder="标签（逗号分隔）"
                value={currentEntry.tags?.join(', ') || ''}
                onChange={(e) =>
                  setCurrentEntry({
                    ...currentEntry,
                    tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                className="w-full bg-cyber-dark border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-cyber-cyan focus:outline-none"
              />
            )}
          </div>
        )}
      </div>

      {/* 历史记录 */}
      {entries.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
            <Calendar size={16} />
            最近记录
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {entries.slice(0, maxEntries).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-cyber-muted/20 border border-gray-800 rounded-lg hover:border-cyber-cyan/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {entry.title}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                    <span>{formatTime(entry.duration)}</span>
                    {entry.category && (
                      <span className="px-2 py-0.5 bg-cyber-purple/20 text-cyber-purple rounded">
                        {entry.category}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-400 transition-colors"
                  title="删除"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 使用时间追踪的 Hook
 */
export function useTimeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setIsTracking(true);
  }, []);

  const stop = useCallback(() => {
    setIsTracking(false);
  }, []);

  const reset = useCallback(() => {
    setIsTracking(false);
    setElapsed(0);
  }, []);

  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTracking]);

  return {
    isTracking,
    elapsed,
    start,
    stop,
    reset,
    formatTime: (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
  };
}

export default TimeTracker;
