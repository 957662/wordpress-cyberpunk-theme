/**
 * 赛博网格背景
 * 透视效果的动态网格
 */

'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberGridProps {
  /** 网格颜色 */
  color?: string;
  /** 网格间距 */
  spacing?: number;
  /** 是否动画 */
  animated?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function CyberGrid({
  color = 'rgba(0, 240, 255, 0.1)',
  spacing = 40,
  animated = true,
  className,
}: CyberGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;

      // 垂直线
      for (let x = 0; x <= canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // 水平线（带动画）
      for (let y = offset % spacing; y <= canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (animated) {
        offset += 0.5;
      }

      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [color, spacing, animated]);

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
