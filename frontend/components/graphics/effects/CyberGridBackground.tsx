'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberGridBackgroundProps {
  gridSize?: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
  showGlow?: boolean;
  className?: string;
}

export const CyberGridBackground: React.FC<CyberGridBackgroundProps> = ({
  gridSize = 50,
  color = '#06b6d4',
  opacity = 0.1,
  animated = true,
  showGlow = true,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

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

    let offset = 0;

    const drawGrid = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw vertical lines
      for (let x = offset % gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add glow effect
        if (showGlow) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Draw horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (showGlow) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // Draw intersection points
      for (let x = offset % gridSize; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity * 2;
          ctx.fill();
        }
      }

      if (animated) {
        offset += 0.5;
      }
    };

    const animate = () => {
      drawGrid();
      if (animated) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gridSize, color, opacity, animated, showGlow]);

  return (
    <div className={cn('fixed inset-0 -z-10 overflow-hidden', className)}>
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.8) 100%)' }}
      />
    </div>
  );
};

export default CyberGridBackground;
