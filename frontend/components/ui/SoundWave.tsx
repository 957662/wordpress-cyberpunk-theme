/**
 * SoundWave Component - 声波动画组件
 * 显示音频波形动画效果
 */

'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SoundWaveProps {
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'bars' | 'wave' | 'circular';
}

export function SoundWave({
  isPlaying = true,
  barCount = 20,
  className,
  color = 'cyan',
  size = 'md',
  variant = 'bars',
}: SoundWaveProps) {
  const colors = {
    cyan: 'bg-cyber-cyan',
    purple: 'bg-cyber-purple',
    pink: 'bg-cyber-pink',
    yellow: 'bg-cyber-yellow',
  };

  const sizes = {
    sm: { width: 3, height: 20, gap: 2 },
    md: { width: 4, height: 32, gap: 3 },
    lg: { width: 6, height: 48, gap: 4 },
  };

  const currentSize = sizes[size];
  const currentColor = colors[color];

  // 条形波形
  if (variant === 'bars') {
    return (
      <div className={cn("flex items-center justify-center gap-1", className)}>
        {Array.from({ length: barCount }).map((_, i) => (
          <motion.div
            key={i}
            className={cn("rounded-full", currentColor)}
            style={{
              width: currentSize.width,
              height: isPlaying ? currentSize.height : currentSize.height * 0.3,
            }}
            animate={
              isPlaying
                ? {
                    height: [
                      currentSize.height * 0.3,
                      currentSize.height * Math.random(),
                      currentSize.height * 0.3,
                    ],
                  }
                : { height: currentSize.height * 0.3 }
            }
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.05,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    );
  }

  // 波浪波形
  if (variant === 'wave') {
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 50"
          className="overflow-visible"
        >
          <motion.path
            d="M0,25 Q50,25 100,25 T200,25"
            stroke={color === 'cyan' ? '#00f0ff' : color === 'purple' ? '#9d00ff' : color === 'pink' ? '#ff0080' : '#eab308'}
            strokeWidth="2"
            fill="none"
            animate={
              isPlaying
                ? {
                    d: [
                      'M0,25 Q50,25 100,25 T200,25',
                      'M0,25 Q50,10 100,25 T200,25',
                      'M0,25 Q50,40 100,25 T200,25',
                      'M0,25 Q50,25 100,25 T200,25',
                    ],
                  }
                : { d: 'M0,25 Q50,25 100,25 T200,25' }
            }
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </div>
    );
  }

  // 圆形波形
  if (variant === 'circular') {
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            const radius = 40;
            const x = 60 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 60 + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={color === 'cyan' ? '#00f0ff' : color === 'purple' ? '#9d00ff' : color === 'pink' ? '#ff0080' : '#eab308'}
                animate={
                  isPlaying
                    ? {
                        r: [3, 6, 3],
                        opacity: [0.5, 1, 0.5],
                      }
                    : { r: 3, opacity: 0.5 }
                }
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return null;
}

/**
 * AudioVisualizer Component - 音频可视化组件
 * 使用 Web Audio API 进行实时音频分析
 */
export interface AudioVisualizerProps {
  audioElement?: HTMLAudioElement;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  fftSize?: number;
}

export function AudioVisualizer({
  audioElement,
  className,
  color = 'cyan',
  fftSize = 256,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 创建音频上下文
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = fftSize;

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
        gradient.addColorStop(0, color === 'cyan' ? '#00f0ff' : color === 'purple' ? '#9d00ff' : color === 'pink' ? '#ff0080' : '#eab308');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioElement, fftSize, color]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={100}
      className={cn("w-full h-full", className)}
    />
  );
}

/**
 * PulseRing Component - 脉冲环组件
 * 声音激活时的脉冲动画效果
 */
export interface PulseRingProps {
  isActive?: boolean;
  size?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
}

export function PulseRing({
  isActive = true,
  size = 80,
  color = 'cyan',
  className,
}: PulseRingProps) {
  const colors = {
    cyan: 'border-cyber-cyan',
    purple: 'border-cyber-purple',
    pink: 'border-cyber-pink',
    yellow: 'border-cyber-yellow',
  };

  const currentColor = colors[color];

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      {/* 中心点 */}
      <div
        className={cn(
          "absolute rounded-full",
          currentColor,
          isActive && "animate-pulse"
        )}
        style={{ width: size * 0.2, height: size * 0.2, borderWidth: 2 }}
      />

      {/* 脉冲环 */}
      {isActive && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn("absolute rounded-full border-2", currentColor)}
          style={{ width: size * 0.2, height: size * 0.2 }}
          animate={{
            scale: [1, 3],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
