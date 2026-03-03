'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MatrixRainProps {
  className?: string;
  color?: string;
  fontSize?: number;
  density?: number;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  className,
  color = '#00f0ff',
  fontSize = 14,
  density = 0.05,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 字符集（包含片假名、拉丁字母和数字）
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');

    // 计算列数
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    // 初始化每一列的 y 坐标
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // 随机起始位置
    }

    // 动画循环
    const draw = () => {
      // 半透明黑色背景，创建拖尾效果
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // 随机字符
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        
        // 绘制字符
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // 添加发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;

        // 随机重置或继续下落
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33); // ~30 FPS

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [color, fontSize, density]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 pointer-events-none', className)}
      style={{ opacity: density * 20 }}
    />
  );
};

export default MatrixRain;
