/**
 * QuantumCard - 量子动画卡片组件
 * 带有粒子效果和量子态动画的赛博朋克风格卡片
 */

'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export interface QuantumCardProps {
  /** 卡片内容 */
  children: React.ReactNode;
  /** 卡片标题 */
  title?: string;
  /** 量子态数量（粒子数量） */
  particleCount?: number;
  /** 粒子颜色 */
  particleColor?: string;
  /** 是否启用鼠标跟随效果 */
  mouseFollow?: boolean;
  /** 是否启用量子波动效果 */
  quantumFlux?: boolean;
  /** 卡片变体 */
  variant?: 'stable' | 'flux' | 'critical';
  /** 点击回调 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}

// 粒子组件
interface ParticleProps {
  x: number;
  y: number;
  delay: number;
  color: string;
}

function Particle({ x, y, delay, color }: ParticleProps) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`,
      }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        x: [0, (Math.random() - 0.5) * 50, 0],
        y: [0, (Math.random() - 0.5) * 50, 0],
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  );
}

export function QuantumCard({
  children,
  title,
  particleCount = 20,
  particleColor = '#00f0ff',
  mouseFollow = true,
  quantumFlux = true,
  variant = 'stable',
  onClick,
  className,
}: QuantumCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  // 初始化粒子
  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: i * 0.1,
      color: particleColor,
    }));
    setParticles(newParticles);
  }, [particleCount, particleColor]);

  // 鼠标跟随效果
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseFollow || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // 变体样式
  const getVariantStyles = () => {
    switch (variant) {
      case 'stable':
        return {
          border: 'border-cyber-cyan/30',
          glow: 'shadow-neon-cyan/20',
          bg: 'bg-cyber-cyan/5',
        };
      case 'flux':
        return {
          border: 'border-cyber-purple/50',
          glow: 'shadow-neon-purple/40',
          bg: 'bg-cyber-purple/10',
        };
      case 'critical':
        return {
          border: 'border-cyber-pink/60',
          glow: 'shadow-neon-pink/50',
          bg: 'bg-cyber-pink/15',
        };
      default:
        return {
          border: 'border-cyber-cyan/30',
          glow: 'shadow-neon-cyan/20',
          bg: 'bg-cyber-cyan/5',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'relative rounded-lg overflow-hidden',
        'border-2',
        styles.border,
        styles.glow,
        styles.bg,
        'cursor-pointer',
        className
      )}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 量子场背景 */}
      {quantumFlux && (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${particleColor}20, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* 粒子层 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, i) => (
          <Particle key={i} {...particle} />
        ))}
      </div>

      {/* 量子波纹效果 */}
      {quantumFlux && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              ${particleColor}05 10px,
              ${particleColor}05 20px
            )`,
          }}
        />
      )}

      {/* 扫描线效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={false}
      >
        <motion.div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(to right, transparent, ${particleColor}60, transparent)`,
          }}
          animate={{
            y: ['-100%', '300%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* 内容 */}
      <div className="relative z-10 p-6">
        {title && (
          <motion.h3
            className="text-lg font-display font-bold text-white mb-4"
            style={{
              textShadow: `0 0 10px ${particleColor}`,
            }}
            animate={
              quantumFlux
                ? {
                    textShadow: [
                      `0 0 10px ${particleColor}40`,
                      `0 0 20px ${particleColor}80`,
                      `0 0 10px ${particleColor}40`,
                    ],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {title}
          </motion.h3>
        )}
        {children}
      </div>

      {/* 量子态指示器 */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: particleColor }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <span className="text-xs text-gray-400 font-mono">Q-STATE</span>
      </div>

      {/* 装饰边角 */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/30" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/30" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/30" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/30" />
    </motion.div>
  );
}

// 预设变体
export function StableQuantumCard(props: QuantumCardProps) {
  return <QuantumCard {...props} variant="stable" particleColor="#00f0ff" />;
}

export function FluxQuantumCard(props: QuantumCardProps) {
  return <QuantumCard {...props} variant="flux" particleColor="#9d00ff" />;
}

export function CriticalQuantumCard(props: QuantumCardProps) {
  return <QuantumCard {...props} variant="critical" particleColor="#ff0080" />;
}
