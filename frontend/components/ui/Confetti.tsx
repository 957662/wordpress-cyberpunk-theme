/**
 * Confetti - 彩纸特效组件
 * 用于庆祝、成功等场景
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ConfettiProps {
  /**
   * 是否显示
   */
  show: boolean;
  /**
   * 彩纸数量
   */
  count?: number;
  /**
   * 颜色数组
   */
  colors?: string[];
  /**
   * 持续时间 (ms)
   */
  duration?: number;
  /**
   * 完成回调
   */
  onComplete?: () => void;
  /**
   * 自定义样式
   */
  className?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
}

export const Confetti: React.FC<ConfettiProps> = ({
  show,
  count = 100,
  colors = ['#00f0ff', '#9d00ff', '#ff0080', '#f0ff00', '#00ff88'],
  duration = 3000,
  onComplete,
  className,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }

    // 生成粒子
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -20,
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      velocityX: (Math.random() - 0.5) * 2,
      velocityY: Math.random() * 3 + 2,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }));

    setParticles(newParticles);
    startTimeRef.current = Date.now();

    // 动画循环
    const animate = () => {
      const elapsed = Date.now() - (startTimeRef.current || Date.now());
      
      if (elapsed >= duration) {
        onComplete?.();
        setParticles([]);
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.velocityX,
          y: p.y + p.velocityY,
          rotation: p.rotation + p.rotationSpeed,
          velocityY: p.velocityY + 0.1, // 重力
        }))
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [show, count, colors, duration, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'fixed inset-0 pointer-events-none z-50 overflow-hidden',
            className
          )}
        >
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                borderRadius: '2px',
                transform: `rotate(${particle.rotation}deg)`,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 简化的彩纸爆炸效果
 */
export interface ConfettiExplosionProps {
  x: number;
  y: number;
  show: boolean;
  colors?: string[];
  count?: number;
}

export const ConfettiExplosion: React.FC<ConfettiExplosionProps> = ({
  x,
  y,
  show,
  colors = ['#00f0ff', '#9d00ff', '#ff0080'],
  count = 30,
}) => {
  const [particles, setParticles] = useState<
    Array<{ id: number; angle: number; distance: number; color: string; size: number }>
  >([]);

  useEffect(() => {
    if (!show) return;

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (Math.PI * 2 * i) / count,
      distance: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));

    setParticles(newParticles);

    let animationFrame: number;
    let progress = 0;

    const animate = () => {
      progress += 0.02;

      if (progress >= 1) {
        setParticles([]);
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          distance: p.distance + 5 * (1 - progress),
        }))
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [show, count, colors]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => {
        const px = x + Math.cos(particle.angle) * particle.distance;
        const py = y + Math.sin(particle.angle) * particle.distance;

        return (
          <motion.div
            key={particle.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: 1,
              opacity: 0,
            }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '2px',
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * 彩纸发射器 (从底部发射)
 */
export interface ConfettiCannonProps {
  show: boolean;
  position?: 'left' | 'center' | 'right';
  colors?: string[];
  count?: number;
}

export const ConfettiCannon: React.FC<ConfettiCannonProps> = ({
  show,
  position = 'center',
  colors = ['#00f0ff', '#9d00ff', '#ff0080'],
  count = 50,
}) => {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      rotation: number;
      color: string;
      size: number;
    }>
  >([]);

  useEffect(() => {
    if (!show) return;

    const startX = position === 'left' ? 10 : position === 'right' ? 90 : 50;

    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (-Math.PI / 4) + (Math.random() * Math.PI / 2);
      const velocity = 15 + Math.random() * 10;

      return {
        id: i,
        x: startX,
        y: 100,
        vx: Math.cos(angle) * velocity * (position === 'right' ? -1 : 1),
        vy: -Math.sin(angle) * velocity,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
      };
    });

    setParticles(newParticles);

    let animationFrame: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed > 3000) {
        setParticles([]);
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx * 0.1,
          y: p.y + p.vy * 0.1,
          vy: p.vy + 0.5, // 重力
          rotation: p.rotation + 5,
        }))
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [show, position, colors, count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '2px',
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
