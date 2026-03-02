/**
 * 数据流组件
 * 模拟赛博朋克风格的数据流动画
 */

'use client';

import { useEffect, useRef } from 'react';

export interface DataStreamProps {
  direction?: 'down' | 'up' | 'left' | 'right';
  speed?: number;
  density?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

export function DataStream({
  direction = 'down',
  speed = 2,
  density = 20,
  color = 'cyan',
  className = '',
}: DataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = {
    cyan: ['#00f0ff', '#00a8b3', '#005f66'],
    purple: ['#9d00ff', '#6b00b3', '#3a0066'],
    pink: ['#ff0080', '#b30059', '#660033'],
    green: ['#00ff88', '#00b360', '#006638'],
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

    // 数据流粒子
    interface DataParticle {
      x: number;
      y: number;
      speed: number;
      size: number;
      color: string;
      opacity: number;
      trail: Array<{ x: number; y: number }>;
    }

    const particles: DataParticle[] = [];

    // 初始化粒子
    for (let i = 0; i < density; i++) {
      const colorSet = colors[color];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * speed + 1,
        size: Math.random() * 2 + 1,
        color: colorSet[Math.floor(Math.random() * colorSet.length)],
        opacity: Math.random() * 0.5 + 0.3,
        trail: [],
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // 保存当前位置到轨迹
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > 20) {
          particle.trail.shift();
        }

        // 更新位置
        switch (direction) {
          case 'down':
            particle.y += particle.speed;
            if (particle.y > canvas.height) {
              particle.y = 0;
              particle.x = Math.random() * canvas.width;
            }
            break;
          case 'up':
            particle.y -= particle.speed;
            if (particle.y < 0) {
              particle.y = canvas.height;
              particle.x = Math.random() * canvas.width;
            }
            break;
          case 'left':
            particle.x -= particle.speed;
            if (particle.x < 0) {
              particle.x = canvas.width;
              particle.y = Math.random() * canvas.height;
            }
            break;
          case 'right':
            particle.x += particle.speed;
            if (particle.x > canvas.width) {
              particle.x = 0;
              particle.y = Math.random() * canvas.height;
            }
            break;
        }

        // 绘制轨迹
        particle.trail.forEach((pos, index) => {
          const trailOpacity = (index / particle.trail.length) * particle.opacity;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = particle.color.replace(')', `, ${trailOpacity})`).replace('rgb', 'rgba');
          ctx.fill();
        });

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba');
        ctx.fill();

        // 添加发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [direction, speed, density, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}

export default DataStream;
