'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ParticleBackgroundProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  mouseInteraction?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'mixed';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  className,
  particleCount = 80,
  connectionDistance = 120,
  mouseInteraction = true,
  color = 'cyan',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  const colors = {
    cyan: 'rgba(0, 240, 255, 0.8)',
    purple: 'rgba(157, 0, 255, 0.8)',
    pink: 'rgba(255, 0, 128, 0.8)',
    mixed: ['rgba(0, 240, 255, 0.8)', 'rgba(157, 0, 255, 0.8)', 'rgba(255, 0, 128, 0.8)'],
  };

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

    // 初始化粒子
    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      }));
    };

    initParticles();

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const particleColor = colors[color];

      particles.forEach((particle, i) => {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 鼠标交互
        if (mouseInteraction) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.vx -= (dx / distance) * force * 0.02;
            particle.vy -= (dy / distance) * force * 0.02;
          }
        }

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

        if (color === 'mixed') {
          const mixedColors = colors.mixed as string[];
          ctx.fillStyle = mixedColors[i % mixedColors.length];
        } else {
          ctx.fillStyle = particleColor;
        }

        ctx.fill();

        // 绘制连接线
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);

            if (color === 'mixed') {
              const mixedColors = colors.mixed as string[];
              ctx.strokeStyle = mixedColors[i % mixedColors.length].replace('0.8', `${opacity * 0.3}`);
            } else {
              ctx.strokeStyle = particleColor.replace('0.8', `${opacity * 0.3}`);
            }

            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, connectionDistance, mouseInteraction, color]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mouseInteraction) {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  };

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onMouseMove={handleMouseMove}
      />
    </div>
  );
};

export default ParticleBackground;
