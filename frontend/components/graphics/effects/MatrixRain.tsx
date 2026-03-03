'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MatrixRainProps {
  color?: string;
  fontSize?: number;
  speed?: number;
  opacity?: number;
  className?: string;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  color = '#00ff41',
  fontSize = 14,
  speed = 50,
  opacity = 0.8,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const charArray = chars.split('');

    const fontSizeNum = fontSize;
    const columns = canvas.width / fontSizeNum;

    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSizeNum}px monospace`;
      ctx.globalAlpha = opacity;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSizeNum;
        const y = drops[i] * fontSizeNum;

        ctx.fillText(text, x, y);

        // Add glow effect to some characters
        if (Math.random() > 0.98) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0;
        }

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, speed);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(interval);
    };
  }, [color, fontSize, speed, opacity]);

  return (
    <div className={cn('fixed inset-0 -z-10', className)}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default MatrixRain;
