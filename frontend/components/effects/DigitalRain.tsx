'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DigitalRainProps {
  className?: string;
  density?: number;
  speed?: number;
  fontSize?: number;
  color?: 'matrix' | 'cyber' | 'fire';
}

/**
 * DigitalRain - 数字雨效果
 * 类似于 Matrix 的数字下落效果，支持多种配色方案
 */
export const DigitalRain: React.FC<DigitalRainProps> = ({
  className = '',
  density = 1,
  speed = 1,
  fontSize = 14,
  color = 'matrix'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const colorSchemes = {
    matrix: {
      primary: '#00ff41',
      secondary: '#008f11',
      bg: 'rgba(0, 0, 0, 0.05)'
    },
    cyber: {
      primary: '#00f0ff',
      secondary: '#0099aa',
      bg: 'rgba(10, 10, 15, 0.05)'
    },
    fire: {
      primary: '#ff4500',
      secondary: '#ff8c00',
      bg: 'rgba(0, 0, 0, 0.05)'
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const { primary, secondary, bg } = colorSchemes[color];
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const charArray = chars.split('');

    const columns = Math.floor(canvas.offsetWidth / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let lastTime = 0;
    const updateInterval = 50 / speed;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;

      if (deltaTime > updateInterval) {
        lastTime = currentTime;

        // 绘制半透明背景以创建拖尾效果
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          // 随机选择字符
          const char = charArray[Math.floor(Math.random() * charArray.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // 随机颜色（主要或次要）
          const isPrimary = Math.random() > 0.3;
          ctx.fillStyle = isPrimary ? primary : secondary;

          // 添加发光效果
          if (isPrimary) {
            ctx.shadowColor = primary;
            ctx.shadowBlur = 10;
          }

          ctx.fillText(char, x, y);
          ctx.shadowBlur = 0;

          // 重置或继续下落
          if (y > canvas.offsetHeight && Math.random() > 0.975 / density) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [density, speed, fontSize, color]);

  return (
    <motion.div
      className={`relative w-full h-full min-h-[400px] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'crisp-edges' }}
      />

      {/* 扫描线叠加 */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)'
        }} />
      </div>
    </motion.div>
  );
};

export default DigitalRain;
