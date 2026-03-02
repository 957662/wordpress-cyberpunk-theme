'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberNoiseProps {
  className?: string;
  opacity?: number;
  speed?: number;
  grayscale?: boolean;
}

export const CyberNoise: React.FC<CyberNoiseProps> = ({
  className,
  opacity = 0.05,
  speed = 1,
  grayscale = false,
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

    let frame = 0;

    const animate = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        if (grayscale) {
          data[i] = value; // red
          data[i + 1] = value; // green
          data[i + 2] = value; // blue
        } else {
          data[i] = Math.random() * 255; // red
          data[i + 1] = Math.random() * 255; // green
          data[i + 2] = Math.random() * 255; // blue
        }
        data[i + 3] = opacity * 255; // alpha
      }

      ctx.putImageData(imageData, 0, 0);

      frame += speed;
      if (frame < 60) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Only animate occasionally for performance
        setTimeout(() => {
          frame = 0;
          animationRef.current = requestAnimationFrame(animate);
        }, 100);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [opacity, speed, grayscale]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      style={{ mixBlendMode: 'overlay' }}
    />
  );
};

export default CyberNoise;
