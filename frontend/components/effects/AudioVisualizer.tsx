/**
 * AudioVisualizer - 音频可视化效果
 * 使用 Web Audio API 分析音频并生成动态波形可视化
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AudioVisualizerProps {
  audioSrc?: string;
  type?: 'bars' | 'wave' | 'circular' | 'particles';
  color?: 'cyan' | 'purple' | 'pink' | 'rainbow';
  barCount?: number;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export function AudioVisualizer({
  audioSrc,
  type = 'bars',
  color = 'cyan',
  barCount = 64,
  className,
  autoPlay = false,
  showControls = true,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const colors = {
    cyan: ['#00f0ff', '#00c0cc', '#0090aa'],
    purple: ['#9d00ff', '#7d00cc', '#5d0099'],
    pink: ['#ff0080', '#cc0066', '#99004d'],
    rainbow: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8b00ff'],
  };

  const initializeAudio = async () => {
    if (!audioSrc || isInitialized) return;

    try {
      // 创建音频元素
      const audio = new Audio(audioSrc);
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;

      // 创建音频上下文
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // 创建分析器
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = type === 'circular' ? 256 : 512;
      analyserRef.current = analyser;

      // 连接音频源
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      sourceRef.current = source;

      setIsInitialized(true);

      if (autoPlay) {
        await audio.play();
        setIsPlaying(true);
      }

      startVisualization();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  const startVisualization = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (type === 'bars') {
        drawBars(ctx, dataArray, bufferLength);
      } else if (type === 'wave') {
        drawWave(ctx, dataArray, bufferLength);
      } else if (type === 'circular') {
        drawCircular(ctx, dataArray, bufferLength);
      } else if (type === 'particles') {
        drawParticles(ctx, dataArray, bufferLength);
      }
    };

    draw();
  };

  const drawBars = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number
  ) => {
    const canvas = canvasRef.current!;
    const barWidth = canvas.width / barCount;
    const colorPalette = colors[color];

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * bufferLength);
      const value = dataArray[dataIndex];
      const barHeight = (value / 255) * canvas.height * 0.8;

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      colorPalette.forEach((c, index) => {
        gradient.addColorStop(index / (colorPalette.length - 1), c);
      });

      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(
        i * barWidth,
        canvas.height - barHeight,
        barWidth - 2,
        barHeight
      );
    }
  };

  const drawWave = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number
  ) => {
    const canvas = canvasRef.current!;
    const colorPalette = colors[color];

    ctx.lineWidth = 3;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    colorPalette.forEach((c, index) => {
      gradient.addColorStop(index / (colorPalette.length - 1), c);
    });
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 255;
      const y = canvas.height / 2 + (v - 0.5) * canvas.height * 0.8;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.stroke();
  };

  const drawCircular = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number
  ) => {
    const canvas = canvasRef.current!;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 4;
    const colorPalette = colors[color];

    for (let i = 0; i < bufferLength; i++) {
      const value = dataArray[i];
      const barHeight = (value / 255) * radius;
      const angle = (i / bufferLength) * Math.PI * 2;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      const colorIndex = Math.floor((i / bufferLength) * colorPalette.length);
      ctx.strokeStyle = colorPalette[colorIndex % colorPalette.length];
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  };

  const drawParticles = (
    ctx: CanvasRenderingContext2D,
    dataArray: Uint8Array,
    bufferLength: number
  ) => {
    const canvas = canvasRef.current!;
    const colorPalette = colors[color];

    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * bufferLength);
      const value = dataArray[dataIndex];
      const size = (value / 255) * 20 + 2;

      const x = (i / barCount) * canvas.width;
      const y = canvas.height / 2 + (Math.random() - 0.5) * canvas.height * 0.5;

      const colorIndex = Math.floor((i / barCount) * colorPalette.length);
      ctx.fillStyle = colorPalette[colorIndex % colorPalette.length];
      ctx.globalAlpha = value / 255;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) {
      await initializeAudio();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: '200px' }}
      />

      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="px-6 py-2 bg-cyber-dark/80 border border-cyber-cyan/50 rounded-full text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
          >
            {isPlaying ? '暂停' : '播放'}
          </motion.button>

          {!audioSrc && (
            <p className="text-sm text-gray-400">
              需要提供 audioSrc 属性
            </p>
          )}
        </div>
      )}
    </div>
  );
}
