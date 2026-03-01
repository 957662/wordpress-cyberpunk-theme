/**
 * Matrix 代码雨效果
 * 黑客帝国风格的数字雨背景
 */

'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface MatrixRainProps {
  /** 字符集 */
  chars?: string;
  /** 字体大小 */
  fontSize?: number;
  /** 下落速度 */
  speed?: number;
  /** 颜色 */
  color?: string;
  /** 不透明度 */
  opacity?: number;
  /** 自定义类名 */
  className?: string;
}

export function MatrixRain({
  chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()',
  fontSize = 14,
  speed = 50,
  color = '#00f0ff',
  opacity = 0.3,
  className,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let columns: number[];
    let drops: number[];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const columnCount = Math.floor(canvas.width / fontSize);
      columns = Array.from({ length: columnCount }, (_, i) => i);
      drops = Array.from({ length: columnCount }, () => Math.random() * -100);
    };

    const draw = () => {
      // 半透明黑色背景，产生拖尾效果
      ctx.fillStyle = `rgba(10, 10, 15, 0.05)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = color;

      for (const i of columns) {
        const text = chars[Math.floor(Math.random() * chars.length)];

        // 绘制字符
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // 随机重置
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = setTimeout(() => {
        draw();
      }, speed);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(animationFrameId);
    };
  }, [chars, fontSize, speed, color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'fixed inset-0 pointer-events-none z-0',
        className
      )}
      style={{ opacity }}
    />
  );
}
