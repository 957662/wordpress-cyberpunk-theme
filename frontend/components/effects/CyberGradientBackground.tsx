'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/classname';

export interface CyberGradientBackgroundProps {
  className?: string;
  colors?: string[];
  speed?: number;
  intensity?: number;
  children?: React.ReactNode;
}

export const CyberGradientBackground: React.FC<CyberGradientBackgroundProps> = ({
  className,
  colors = ['#00f0ff', '#9d00ff', '#ff0080', '#f0ff00'],
  speed = 1,
  intensity = 0.5,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    const blobs = colors.map((color, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 300 + 200,
      color,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));

    const animate = () => {
      timeRef.current += 0.01 * speed;

      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((blob, i) => {
        // Update position
        blob.x += blob.vx * speed;
        blob.y += blob.vy * speed;

        // Bounce off walls
        if (blob.x < -blob.radius) blob.vx = Math.abs(blob.vx);
        if (blob.x > canvas.width + blob.radius) blob.vx = -Math.abs(blob.vx);
        if (blob.y < -blob.radius) blob.vy = Math.abs(blob.vy);
        if (blob.y > canvas.height + blob.radius) blob.vy = -Math.abs(blob.vy);

        // Mouse influence
        const dx = mouseRef.current.x * canvas.width - blob.x;
        const dy = mouseRef.current.y * canvas.height - blob.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 500) {
          blob.x += dx * 0.02 * intensity;
          blob.y += dy * 0.02 * intensity;
        }

        // Pulse effect
        const pulse = Math.sin(timeRef.current + i) * 50;
        const radius = blob.radius + pulse;

        // Draw gradient
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          radius
        );

        gradient.addColorStop(0, `${blob.color}40`);
        gradient.addColorStop(0.5, `${blob.color}20`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 2);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, speed, intensity]);

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

export default CyberGradientBackground;
