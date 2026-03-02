'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DataStream {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

/**
 * 数据流背景效果
 * 创建类似《黑客帝国》数字雨的赛博朋克效果
 */
export function DataStreamBackground({
  charCount = 50,
  speed = 1,
  color = '#00f0ff',
  enabled = true,
}: {
  charCount?: number;
  speed?: number;
  color?: string;
  enabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamsRef = useRef<DataStream[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStreams = () => {
      const columnCount = Math.floor(canvas.width / 20);
      streamsRef.current = Array.from({ length: columnCount }, (_, i) => ({
        x: i * 20,
        y: Math.random() * canvas.height,
        speed: (Math.random() * 0.5 + 0.5) * speed,
        length: Math.random() * 20 + 10,
        opacity: Math.random() * 0.5 + 0.5,
      }));
    };

    const updateStreams = () => {
      streamsRef.current.forEach((stream) => {
        stream.y += stream.speed;

        if (stream.y > canvas.height + stream.length * 20) {
          stream.y = -stream.length * 20;
          stream.speed = (Math.random() * 0.5 + 0.5) * speed;
        }
      });
    };

    const drawStreams = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      streamsRef.current.forEach((stream) => {
        for (let i = 0; i < stream.length; i++) {
          const y = stream.y - i * 20;
          if (y < 0 || y > canvas.height) continue;

          const char = String.fromCharCode(0x30A0 + Math.random() * 96);
          const opacity = (1 - i / stream.length) * stream.opacity;

          ctx.fillStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
          ctx.font = '14px monospace';
          ctx.fillText(char, stream.x, y);
        }
      });
    };

    const animate = () => {
      updateStreams();
      drawStreams();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initStreams();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initStreams();
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [charCount, speed, color, enabled]);

  if (!enabled) return null;

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
