'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberGridBackgroundProps {
  className?: string;
  gridSize?: number;
  color?: string;
  speed?: number;
  perspective?: boolean;
  children?: React.ReactNode;
}

export const CyberGridBackground: React.FC<CyberGridBackgroundProps> = ({
  className,
  gridSize = 50,
  color = '#00f0ff',
  speed = 1,
  perspective = true,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const offsetRef = useRef(0);

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

    const animate = () => {
      offsetRef.current = (offsetRef.current + speed * 0.5) % gridSize;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vertical lines
      for (let x = offsetRef.current; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = `${color}20`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = offsetRef.current; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `${color}20`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Add glow effect at intersections
      if (perspective) {
        for (let x = offsetRef.current; x < canvas.width; x += gridSize) {
          for (let y = offsetRef.current; y < canvas.height; y += gridSize) {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
            gradient.addColorStop(0, `${color}40`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(x - 10, y - 10, 20, 20);
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gridSize, color, speed, perspective]);

  return (
    <div className={cn('relative min-h-screen overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CyberGridBackground;
