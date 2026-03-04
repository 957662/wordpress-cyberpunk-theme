/**
 * CyberPress Platform - MatrixBackground Component
 * 黑客帝国风格背景动画
 */

'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface MatrixBackgroundProps {
  density?: number;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  speed?: number;
  className?: string;
}

export function MatrixBackground({
  density = 50,
  fontSize = 14,
  color = '#00f0ff',
  backgroundColor = '#0a0a0f',
  speed = 50,
  className,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

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

    // 字符集（混合拉丁字母、数字、片假名）
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    // 计算列数
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // 初始化每一列的y坐标
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // 随机起始位置，在屏幕上方
    }

    // 绘制函数
    const draw = () => {
      // 半透明背景，形成拖尾效果
      ctx.fillStyle = `${backgroundColor}05`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        // 随机字符
        const text = chars[Math.floor(Math.random() * chars.length)];

        // 绘制字符
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // 添加发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;

        // 重置或移动y坐标
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    // 动画循环
    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    // 启动动画
    const intervalId = setInterval(() => {
      // 控制速度
    }, speed);

    animate();

    // 窗口大小改变时重新设置画布
    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(intervalId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [density, fontSize, color, backgroundColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 pointer-events-none', className)}
      style={{ opacity: 0.3 }}
    />
  );
}

// 数字雨背景变体
export function DigitalRainBackground({
  color = '#00ff88',
  ...props
}: Omit<MatrixBackgroundProps, 'color'>) {
  return <MatrixBackground color={color} {...props} />;
}

// 紫色矩阵背景
export function PurpleMatrixBackground(props: Omit<MatrixBackgroundProps, 'color'>) {
  return <MatrixBackground color="#9d00ff" {...props} />;
}
