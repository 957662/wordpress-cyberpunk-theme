'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

/**
 * 赛博朋克风格粒子背景
 */
export function CyberBackground({
  density = 50,
  color = 'cyan',
  speed = 1,
}: {
  density?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const colors = {
    cyan: 'rgba(0, 240, 255',
    purple: 'rgba(157, 0, 255',
    pink: 'rgba(255, 0, 128',
    green: 'rgba(0, 255, 136',
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化粒子
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < density; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    initParticles();

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const baseColor = colors[color];

      // 更新和绘制粒子
      particlesRef.current.forEach((particle, index) => {
        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${baseColor}, ${particle.opacity})`;
        ctx.fill();

        // 绘制连线
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex) return;

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${baseColor}, ${0.2 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [density, color, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}

/**
 * 网格背景
 */
export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <div className="absolute inset-0 bg-cyber-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-dark/50 to-cyber-dark" />
    </div>
  );
}

/**
 * 扫描线背景
 */
export function ScanlineBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <div className="absolute inset-0 bg-cyber-dark" />
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0px 0px', '0px 4px'],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 240, 255, 0.02) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
    </div>
  );
}

/**
 * 渐变背景
 */
export function GradientBackground({
  colors = ['from-cyber-dark', 'via-cyber-purple/20', 'to-cyber-dark'],
  animated = true,
}: {
  colors?: string[];
  animated?: boolean;
}) {
  const gradientClass = `bg-gradient-to-br ${colors.join(' ')}`;

  return (
    <div
      className={`fixed inset-0 pointer-events-none ${gradientClass}`}
      style={{ zIndex: -1 }}
    >
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/10 via-transparent to-cyber-pink/10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}

/**
 * 组合背景组件
 */
export function CyberBackgrounds({
  showGrid = true,
  showParticles = true,
  showScanlines = false,
}: {
  showGrid?: boolean;
  showParticles?: boolean;
  showScanlines?: boolean;
}) {
  return (
    <>
      {showGrid && <GridBackground />}
      {showParticles && <CyberBackground density={30} color="cyan" speed={0.5} />}
      {showScanlines && <ScanlineBackground />}
    </>
  );
}
