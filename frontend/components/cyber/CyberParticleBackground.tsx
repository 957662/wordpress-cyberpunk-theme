'use client';

/**
 * CyberParticleBackground - 赛博朋克风格粒子背景
 * 高性能 Canvas 粒子动画系统
 */

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// 类型定义
// ============================================================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface ParticleConfig {
  count: number; // 粒子数量
  minSize: number; // 最小尺寸
  maxSize: number; // 最大尺寸
  minSpeed: number; // 最小速度
  maxSpeed: number; // 最大速度
  colors: string[]; // 颜色数组
  connections: boolean; // 是否显示连线
  connectionDistance: number; // 连线距离
  mouseInteraction: boolean; // 鼠标交互
  mouseRepelRadius: number; // 鼠标排斥半径
}

interface CyberParticleBackgroundProps {
  className?: string;
  config?: Partial<ParticleConfig>;
}

// ============================================================================
// 默认配置
// ============================================================================

const defaultConfig: ParticleConfig = {
  count: 100,
  minSize: 1,
  maxSize: 3,
  minSpeed: 0.1,
  maxSpeed: 0.5,
  colors: [
    'rgba(0, 240, 255,',  // cyan
    'rgba(157, 0, 255,',  // purple
    'rgba(255, 0, 128,',  // pink
    'rgba(0, 255, 136,',  // green
  ],
  connections: true,
  connectionDistance: 100,
  mouseInteraction: true,
  mouseRepelRadius: 100,
};

// ============================================================================
// 工具函数
// ============================================================================

function randomRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomColor(colors: string[]): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

// ============================================================================
// 组件实现
// ============================================================================

export function CyberParticleBackground({
  className,
  config: customConfig,
}: CyberParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const config = { ...defaultConfig, ...customConfig };

  // 初始化粒子
  const initParticles = (width: number, height: number): Particle[] => {
    const particles: Particle[] = [];

    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: randomRange(-config.maxSpeed, config.maxSpeed),
        vy: randomRange(-config.maxSpeed, config.maxSpeed),
        size: randomRange(config.minSize, config.maxSize),
        color: randomColor(config.colors),
        alpha: Math.random(),
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
      });
    }

    return particles;
  };

  // 更新粒子位置
  const updateParticles = (width: number, height: number) => {
    const particles = particlesRef.current;

    particles.forEach((particle) => {
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 更新生命周期
      particle.life++;
      if (particle.life > particle.maxLife) {
        particle.life = 0;
        particle.alpha = 0;
      } else if (particle.life < 50) {
        particle.alpha = particle.life / 50;
      } else if (particle.life > particle.maxLife - 50) {
        particle.alpha = (particle.maxLife - particle.life) / 50;
      } else {
        particle.alpha = 1;
      }

      // 边界检查
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      // 鼠标交互
      if (config.mouseInteraction) {
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.mouseRepelRadius) {
          const force = (config.mouseRepelRadius - distance) / config.mouseRepelRadius;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.5;
          particle.vy += Math.sin(angle) * force * 0.5;
        }
      }

      // 速度限制
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > config.maxSpeed) {
        particle.vx = (particle.vx / speed) * config.maxSpeed;
        particle.vy = (particle.vy / speed) * config.maxSpeed;
      }
    });
  };

  // 绘制粒子
  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    const particles = particlesRef.current;

    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `${particle.color} ${particle.alpha * 0.6})`;
      ctx.fill();

      // 粒子光晕
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 2
      );
      gradient.addColorStop(0, `${particle.color} ${particle.alpha * 0.3})`);
      gradient.addColorStop(1, `${particle.color} 0)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  };

  // 绘制连线
  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    if (!config.connections) return;

    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          const alpha =
            (1 - distance / config.connectionDistance) *
            particles[i].alpha *
            particles[j].alpha *
            0.3;

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  // 动画循环
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制
    updateParticles(canvas.width, canvas.height);
    drawConnections(ctx);
    drawParticles(ctx);

    // 继续动画
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // 调整画布大小
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    // 重新初始化粒子
    particlesRef.current = initParticles(canvas.width, canvas.height);
  };

  // 鼠标移动处理
  const handleMouseMove = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // 初始化
  useEffect(() => {
    resizeCanvas();

    // 开始动画
    animate();

    // 事件监听
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    // 清理
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 pointer-events-none', className)}
      style={{ zIndex: -1 }}
    />
  );
}

// ============================================================================
// 预设变体
// ============================================================================

interface PresetConfig {
  count: number;
  colors: string[];
}

const presets: Record<string, PresetConfig> = {
  minimal: {
    count: 50,
    colors: ['rgba(0, 240, 255,'],
  },
  default: {
    count: 100,
    colors: [
      'rgba(0, 240, 255,',
      'rgba(157, 0, 255,',
      'rgba(255, 0, 128,',
    ],
  },
  intensive: {
    count: 200,
    colors: [
      'rgba(0, 240, 255,',
      'rgba(157, 0, 255,',
      'rgba(255, 0, 128,',
      'rgba(0, 255, 136,',
      'rgba(240, 255, 0,',
    ],
  },
};

export function CyberParticleBackgroundMinimal(props: Omit<CyberParticleBackgroundProps, 'config'>) {
  return <CyberParticleBackground {...props} config={presets.minimal} />;
}

export function CyberParticleBackgroundDefault(props: Omit<CyberParticleBackgroundProps, 'config'>) {
  return <CyberParticleBackground {...props} config={presets.default} />;
}

export function CyberParticleBackgroundIntensive(props: Omit<CyberParticleBackgroundProps, 'config'>) {
  return <CyberParticleBackground {...props} config={presets.intensive} />;
}

// ============================================================================
// 导出
// ============================================================================

export default CyberParticleBackground;
