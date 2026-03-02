'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react'

interface TimerProps {
  className?: string
  initialTime?: number // 初始时间（秒）
  mode?: 'countdown' | 'stopwatch'
  onFinish?: () => void
  onTick?: (time: number) => void
}

export function Timer({
  className,
  initialTime = 0,
  mode = 'stopwatch',
  onFinish,
  onTick,
}: TimerProps) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 格式化时间显示
  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  // 开始/暂停
  const toggleTimer = useCallback(() => {
    if (isFinished) {
      // 重置并开始
      setTime(initialTime)
      setIsFinished(false)
      setIsRunning(true)
    } else {
      setIsRunning((prev) => !prev)
    }
  }, [isFinished, initialTime])

  // 重置
  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTime(initialTime)
    setIsFinished(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [initialTime])

  // 计时逻辑
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          let newTime: number

          if (mode === 'countdown') {
            newTime = prevTime - 1
            if (newTime <= 0) {
              setIsRunning(false)
              setIsFinished(true)
              onFinish?.()
              return 0
            }
          } else {
            newTime = prevTime + 1
          }

          onTick?.(newTime)
          return newTime
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, mode, onFinish, onTick])

  return (
    <div className={cn('p-6 bg-cyber-card border border-cyber-border rounded-lg', className)}>
      <div className="flex items-center justify-center space-x-2 mb-6">
        <TimerIcon className="w-8 h-8 text-cyber-cyan" />
        <span className="text-sm text-gray-400 uppercase tracking-wider">
          {mode === 'countdown' ? 'Countdown' : 'Stopwatch'}
        </span>
      </div>

      {/* 时间显示 */}
      <div className={cn(
        'text-6xl font-mono font-bold text-center mb-6 transition-all duration-300',
        isFinished && 'text-cyber-pink animate-pulse',
        !isFinished && 'text-cyber-cyan',
      )}>
        {formatTime(time)}
      </div>

      {/* 进度条（仅倒计时模式） */}
      {mode === 'countdown' && initialTime > 0 && (
        <div className="mb-6">
          <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-1000',
                isFinished ? 'bg-cyber-pink' : 'bg-cyber-cyan',
              )}
              style={{ width: `${(time / initialTime) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>{Math.round((time / initialTime) * 100)}%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={toggleTimer}
          className={cn(
            'flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all',
            'bg-cyber-cyan text-cyber-black',
            'hover:bg-cyber-cyan/80 hover:scale-105',
          )}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>{isFinished ? 'Restart' : 'Start'}</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className={cn(
            'flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all',
            'bg-cyber-purple text-white',
            'hover:bg-cyber-purple/80 hover:scale-105',
          )}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}

// 多段计时器
interface Segment {
  name: string
  duration: number // 秒
}

interface SegmentedTimerProps {
  segments: Segment[]
  className?: string
  onSegmentComplete?: (segmentIndex: number) => void
  onComplete?: () => void
}

export function SegmentedTimer({
  segments,
  className,
  onSegmentComplete,
  onComplete,
}: SegmentedTimerProps) {
  const [currentSegment, setCurrentSegment] = useState(0)
  const [segmentTime, setSegmentTime] = useState(segments[0]?.duration || 0)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSegments, setCompletedSegments] = useState<number[]>([])

  const totalDuration = segments.reduce((sum, seg) => sum + seg.duration, 0)
  const elapsedTime = segments
    .slice(0, currentSegment)
    .reduce((sum, seg) => sum + seg.duration, 0) + (segments[currentSegment]?.duration - segmentTime || 0)

  const toggleTimer = () => setIsRunning((prev) => !prev)

  const resetTimer = () => {
    setCurrentSegment(0)
    setSegmentTime(segments[0]?.duration || 0)
    setIsRunning(false)
    setCompletedSegments([])
  }

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSegmentTime((prev) => {
        if (prev <= 1) {
          // 当前段完成
          const completedIndex = currentSegment
          onSegmentComplete?.(completedIndex)

          if (currentSegment < segments.length - 1) {
            // 进入下一段
            setCurrentSegment((prev) => prev + 1)
            setCompletedSegments((prev) => [...prev, completedIndex])
            return segments[currentSegment + 1].duration
          } else {
            // 全部完成
            setIsRunning(false)
            setCompletedSegments((prev) => [...prev, completedIndex])
            onComplete?.()
            return 0
          }
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, currentSegment, segments, onSegmentComplete, onComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn('p-6 bg-cyber-card border border-cyber-border rounded-lg', className)}>
      <h3 className="text-xl font-semibold text-cyber-cyan mb-6 text-center">
        Segmented Timer
      </h3>

      {/* 当前段信息 */}
      <div className="text-center mb-6">
        <p className="text-4xl font-mono font-bold text-cyber-purple mb-2">
          {segments[currentSegment]?.name || 'Complete'}
        </p>
        <p className="text-6xl font-mono font-bold text-cyber-cyan">
          {formatTime(segmentTime)}
        </p>
      </div>

      {/* 总进度 */}
      <div className="mb-6">
        <div className="h-3 bg-cyber-darker rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-1000"
            style={{ width: `${(elapsedTime / totalDuration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Progress</span>
          <span>{Math.round((elapsedTime / totalDuration) * 100)}%</span>
        </div>
      </div>

      {/* 段列表 */}
      <div className="space-y-2 mb-6">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg border transition-all',
              index === currentSegment && 'border-cyber-cyan bg-cyber-cyan/10',
              completedSegments.includes(index) && 'border-cyber-green bg-cyber-green/10',
              index !== currentSegment && !completedSegments.includes(index) && 'border-cyber-border',
            )}
          >
            <span className={cn(
              'font-semibold',
              index === currentSegment && 'text-cyber-cyan',
              completedSegments.includes(index) && 'text-cyber-green line-through',
            )}>
              {segment.name}
            </span>
            <span className="font-mono text-sm text-gray-400">
              {formatTime(segment.duration)}
            </span>
          </div>
        ))}
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={toggleTimer}
          disabled={currentSegment >= segments.length}
          className={cn(
            'flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all',
            'bg-cyber-cyan text-cyber-black',
            'hover:bg-cyber-cyan/80 hover:scale-105',
            currentSegment >= segments.length && 'opacity-50 cursor-not-allowed',
          )}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className={cn(
            'flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all',
            'bg-cyber-purple text-white',
            'hover:bg-cyber-purple/80 hover:scale-105',
          )}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}

// 使用示例
export function TimerExample() {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-cyber-cyan">Timer Demo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 秒表 */}
        <div>
          <h3 className="text-lg font-semibold text-cyber-purple mb-4">
            Stopwatch
          </h3>
          <Timer mode="stopwatch" />
        </div>

        {/* 倒计时 */}
        <div>
          <h3 className="text-lg font-semibold text-cyber-purple mb-4">
            Countdown (5 minutes)
          </h3>
          <Timer mode="countdown" initialTime={300} />
        </div>
      </div>

      {/* 分段计时器 */}
      <div>
        <h3 className="text-lg font-semibold text-cyber-purple mb-4">
          Segmented Timer (Pomodoro)
        </h3>
        <SegmentedTimer
          segments={[
            { name: 'Work', duration: 25 * 60 },
            { name: 'Short Break', duration: 5 * 60 },
            { name: 'Work', duration: 25 * 60 },
            { name: 'Long Break', duration: 15 * 60 },
          ]}
        />
      </div>
    </div>
  )
}
