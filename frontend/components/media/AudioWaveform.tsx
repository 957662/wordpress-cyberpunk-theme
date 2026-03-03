/**
 * AudioWaveform - 音频波形组件
 * 赛博朋克风格的音频可视化波形组件
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export interface AudioWaveformProps {
  /** 音频URL */
  audioUrl: string;
  /** 波形条数量 */
  barCount?: number;
  /** 波形颜色 */
  color?: string;
  /** 是否显示控制按钮 */
  showControls?: boolean;
  /** 是否自动播放 */
  autoPlay?: boolean;
  /** 播放完成回调 */
  onEnded?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 高度 */
  height?: number;
}

interface BarData {
  height: number;
  velocity: number;
}

export function AudioWaveform({
  audioUrl,
  barCount = 32,
  color = '#00f0ff',
  showControls = true,
  autoPlay = false,
  onEnded,
  className,
  height = 60,
}: AudioWaveformProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [bars, setBars] = useState<BarData[]>(
    Array.from({ length: barCount }, () => ({
      height: Math.random() * 0.3 + 0.1,
      velocity: 0,
    }))
  );
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  // 初始化音频
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (autoPlay) {
      audio.play().catch(() => {
        console.warn('Auto-play prevented by browser policy');
      });
    }

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      onEnded?.();
    };

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [autoPlay, onEnded]);

  // 动画循环
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBars((prevBars) =>
        prevBars.map((bar) => {
          const targetHeight = Math.random() * 0.8 + 0.2;
          const newVelocity = (targetHeight - bar.height) * 0.3 + bar.velocity * 0.7;
          const newHeight = Math.max(0.1, Math.min(1, bar.height + newVelocity));
          return { height: newHeight, velocity: newVelocity };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    audio.currentTime = (percentage / 100) * audio.duration;
  };

  return (
    <div
      className={cn('relative bg-cyber-dark/50 rounded-lg overflow-hidden border border-white/10', className)}
      style={{ height: `${height + (showControls ? 40 : 0)}px` }}
    >
      {/* 音频元素 */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* 进度条背景 */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/10 cursor-pointer transition-colors hover:bg-white/20"
        style={{ top: `${height}px`, width: '100%' }}
        onClick={handleSeek}
      >
        {/* 进度 */}
        <motion.div
          className="h-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>

      {/* 波形区域 */}
      <div
        className="absolute inset-0 flex items-center justify-center gap-1 px-2"
        style={{ height: `${height}px` }}
      >
        <AnimatePresence>
          {bars.map((bar, index) => {
            const barWidth = Math.max(2, Math.floor(100 / barCount) - 2);
            const isActive = isPlaying || index / barCount < progress / 100;

            return (
              <motion.div
                key={index}
                className="rounded-full"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: isActive ? color : '#333',
                  boxShadow: isActive ? `0 0 ${bar.height * 10}px ${color}` : 'none',
                }}
                initial={{ height: '10%' }}
                animate={{
                  height: isPlaying ? `${bar.height * 100}%` : '30%',
                }}
                exit={{ height: '10%', opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* 控制按钮 */}
      {showControls && (
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4"
          style={{ height: '40px', top: `${height}px` }}
        >
          {/* 播放/暂停按钮 */}
          <motion.button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            style={{ color }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </motion.button>

          {/* 时间显示 */}
          <div className="text-xs text-gray-400 font-mono">
            {audioRef.current && (
              <>
                {Math.floor((audioRef.current.currentTime / 60) % 60)}:
                {Math.floor(audioRef.current.currentTime % 60)
                  .toString()
                  .padStart(2, '0')}{' '}
                /{' '}
                {audioRef.current.duration &&
                  `${Math.floor((audioRef.current.duration / 60) % 60)}:${Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0')}`}
              </>
            )}
          </div>

          {/* 静音按钮 */}
          <motion.button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            style={{ color }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </motion.button>
        </div>
      )}

      {/* 装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

// 简化的预设组件
export interface SimpleWaveformProps {
  /** 是否激活（动画） */
  active?: boolean;
  /** 波形数量 */
  count?: number;
  /** 颜色 */
  color?: string;
  /** 高度 */
  height?: number;
  /** 自定义类名 */
  className?: string;
}

export function SimpleWaveform({
  active = true,
  count = 20,
  color = '#00f0ff',
  height = 40,
  className,
}: SimpleWaveformProps) {
  const [bars, setBars] = useState(
    Array.from({ length: count }, () => Math.random() * 0.5 + 0.25)
  );

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((h) => {
          const delta = (Math.random() - 0.5) * 0.3;
          return Math.max(0.1, Math.min(1, h + delta));
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [active]);

  const barWidth = Math.max(3, Math.floor(100 / count) - 2);

  return (
    <div
      className={cn('flex items-center justify-center gap-1', className)}
      style={{ height: `${height}px` }}
    >
      {bars.map((heightRatio, index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{
            width: `${barWidth}%`,
            backgroundColor: color,
            boxShadow: `0 0 ${heightRatio * 8}px ${color}`,
          }}
          animate={{
            height: active ? `${heightRatio * 100}%` : '20%',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      ))}
    </div>
  );
}

// 循环波形（无限动画）
export function InfiniteWaveform({
  color = '#00f0ff',
  barCount = 30,
  height = 50,
  className,
}: {
  color?: string;
  barCount?: number;
  height?: number;
  className?: string;
}) {
  return (
    <SimpleWaveform
      active={true}
      count={barCount}
      color={color}
      height={height}
      className={className}
    />
  );
}
