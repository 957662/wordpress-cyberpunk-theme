/**
 * CyberPress Animated Backgrounds
 *
 * 赛博朋克风格动画背景组件
 *
 * @example
 * ```tsx
 * import { MatrixRain, ParticleField, CyberWaves } from '@/components/graphics/AnimatedBackgrounds';
 *
 * <MatrixRain />
 * <ParticleField />
 * <CyberWaves />
 * ```
 */

import React, { useEffect, useRef, useState } from 'react';

// ==================== 基础属性 ====================

export interface AnimatedBackgroundProps {
  /** 容器宽度 */
  width?: number | string;
  /** 容器高度 */
  height?: number | string;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否循环动画 */
  loop?: boolean;
  /** 动画速度 (1-10) */
  speed?: number;
}

// ==================== 矩阵雨背景 ====================

export interface MatrixRainProps extends AnimatedBackgroundProps {
  /** 雨滴颜色 */
  color?: string;
  /** 字体大小 */
  fontSize?: number;
  /** 雨滴密度 */
  density?: number;
}

/**
 * 矩阵雨动画背景
 */
export const MatrixRain: React.FC<MatrixRainProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  color = '#00ff00',
  fontSize = 14,
  density = 30,
  speed = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化雨滴
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // 从上方不同位置开始
    }

    // 矩阵字符
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const charArray = chars.split('');

    // 动画循环
    let animationId: number;
    const draw = () => {
      // 半透明黑色背景，形成拖尾效果
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // 随机字符
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // 重置雨滴到顶部
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      const delay = Math.max(16, 100 - speed * 8);
      animationId = setTimeout(() => {
        animationId = requestAnimationFrame(draw);
      }, delay);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [color, fontSize, density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: 'block' }}
    />
  );
};

// ==================== 粒子场背景 ====================

export interface ParticleFieldProps extends AnimatedBackgroundProps {
  /** 粒子数量 */
  particleCount?: number;
  /** 粒子颜色 */
  colors?: string[];
  /** 粒子大小 */
  particleSize?: number;
  /** 连线距离 */
  connectionDistance?: number;
  /** 粒子速度 */
  velocity?: number;
}

/**
 * 粒子网络动画背景
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  particleCount = 80,
  colors = ['#00f0ff', '#9d00ff', '#ff0080'],
  particleSize = 2,
  connectionDistance = 120,
  velocity = 0.5,
  speed = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子类
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * velocity;
        this.vy = (Math.random() - 0.5) * velocity;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * particleSize + 1;
      }

      update() {
        this.x += this.vx * (speed / 5);
        this.y += this.vy * (speed / 5);

        // 边界反弹
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // 创建粒子
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制粒子
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // 绘制连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [particleCount, colors, particleSize, connectionDistance, velocity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: 'block' }}
    />
  );
};

// ==================== 赛博波浪背景 ====================

export interface CyberWavesProps extends AnimatedBackgroundProps {
  /** 波浪颜色 */
  colors?: string[];
  /** 波浪数量 */
  waveCount?: number;
  /** 波浪振幅 */
  amplitude?: number;
  /** 波浪频率 */
  frequency?: number;
}

/**
 * 赛博朋克波浪动画背景
 */
export const CyberWaves: React.FC<CyberWavesProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  colors = ['#00f0ff', '#9d00ff', '#ff0080'],
  waveCount = 3,
  amplitude = 50,
  frequency = 0.01,
  speed = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let phase = 0;

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const color = colors[w % colors.length];
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 +
            Math.sin(x * frequency + phase + w * 0.5) * amplitude +
            Math.sin(x * frequency * 0.5 + phase * 1.5 + w) * (amplitude / 2);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();

        // 添加发光效果
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      phase += 0.02 * (speed / 5);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [colors, waveCount, amplitude, frequency, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: 'block' }}
    />
  );
};

// ==================== 霓虹网格背景 ====================

export interface NeonGridProps extends AnimatedBackgroundProps {
  /** 网格颜色 */
  color?: string;
  /** 网格大小 */
  gridSize?: number;
  /** 透视强度 */
  perspective?: number;
}

/**
 * 3D 霓虹网格动画背景
 */
export const NeonGrid: React.FC<NeonGridProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  color = '#00f0ff',
  gridSize = 40,
  perspective = 500,
  speed = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let offset = 0;

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const centerX = canvas.width / 2;

      // 绘制垂直线
      for (let x = -canvas.width; x < canvas.width * 2; x += gridSize) {
        const dx = x - centerX;
        const perspectiveX = (dx * perspective) / (perspective + offset);
        const screenX = centerX + perspectiveX;

        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = Math.max(0.1, 1 - Math.abs(dx) / canvas.width);
        ctx.stroke();
      }

      // 绘制水平线
      for (let z = 0; z < perspective; z += gridSize) {
        const perspectiveZ = (z * perspective) / (perspective + (offset % perspective) + z);
        const screenY = centerY + perspectiveZ;

        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(canvas.width, screenY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = Math.max(0.1, 1 - z / perspective);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      offset += speed * 2;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [color, gridSize, perspective, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: 'block' }}
    />
  );
};

// ==================== 星空背景 ====================

export interface StarfieldProps extends AnimatedBackgroundProps {
  /** 星星数量 */
  starCount?: number;
  /** 星星颜色 */
  colors?: string[];
  /** 星星速度 */
  starSpeed?: number;
}

/**
 * 星空穿越动画背景
 */
export const Starfield: React.FC<StarfieldProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  starCount = 200,
  colors = ['#ffffff', '#00f0ff', '#9d00ff'],
  starSpeed = 2,
  speed = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 星星类
    class Star {
      x: number;
      y: number;
      z: number;
      color: string;

      constructor() {
        this.x = (Math.random() - 0.5) * canvas.width * 2;
        this.y = (Math.random() - 0.5) * canvas.height * 2;
        this.z = Math.random() * canvas.width;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.z -= starSpeed * (speed / 5);
        if (this.z <= 0) {
          this.x = (Math.random() - 0.5) * canvas.width * 2;
          this.y = (Math.random() - 0.5) * canvas.height * 2;
          this.z = canvas.width;
        }
      }

      draw() {
        const perspective = this.z / canvas.width;
        const screenX = centerX + (this.x / perspective) * 0.5;
        const screenY = centerY + (this.y / perspective) * 0.5;
        const size = (1 - perspective) * 3;

        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 1 - perspective;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // 创建星星
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.update();
        star.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [starCount, colors, starSpeed, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: 'block' }}
    />
  );
};

// ==================== 故障效果背景 ====================

export interface GlitchBackgroundProps extends AnimatedBackgroundProps {
  /** 故障强度 */
  intensity?: number;
  /** 主色调 */
  primaryColor?: string;
  /** 次色调 */
  secondaryColor?: string;
}

/**
 * 故障效果动画背景
 */
export const GlitchBackground: React.FC<GlitchBackgroundProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  intensity = 5,
  primaryColor = '#00f0ff',
  secondaryColor = '#ff0080',
  speed = 5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布尺寸
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 随机故障块
      for (let i = 0; i < intensity; i++) {
        if (Math.random() > 0.95) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const w = Math.random() * 100 + 20;
          const h = Math.random() * 5 + 2;

          ctx.fillStyle = Math.random() > 0.5 ? primaryColor : secondaryColor;
          ctx.globalAlpha = Math.random() * 0.3;
          ctx.fillRect(x, y, w, h);
        }
      }

      // 水平错位
      if (Math.random() > 0.98) {
        const offset = (Math.random() - 0.5) * intensity * 2;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, offset, 0);
      }

      ctx.globalAlpha = 1;
      time += 0.016 * (speed / 5);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [intensity, primaryColor, secondaryColor, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: 'block' }}
    />
  );
};

export default {
  MatrixRain,
  ParticleField,
  CyberWaves,
  NeonGrid,
  Starfield,
  GlitchBackground
};
