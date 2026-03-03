/**
 * 全息投影展示组件
 */

'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface HologramDisplayProps {
  children: React.ReactNode;
  intensity?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'blue';
  scanlines?: boolean;
  glitch?: boolean;
  className?: string;
}

export function HologramDisplay({
  children,
  intensity = 0.5,
  color = 'cyan',
  scanlines = true,
  glitch = false,
  className,
}: HologramDisplayProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = {
    cyan: 'rgba(0, 240, 255,',
    purple: 'rgba(157, 0, 255,',
    pink: 'rgba(255, 0, 128,',
    blue: 'rgba(59, 130, 246,',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden rounded-xl', className)}
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle at ${50 + mousePos.x * 50}% ${50 + mousePos.y * 50}%, ${colors[color]}${intensity * 0.3}), transparent)`,
      }}
    >
      {/* 扫描线效果 */}
      {scanlines && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
              animation: 'scan 8s linear infinite',
            }}
          />
        </div>
      )}

      {/* 全息内容 */}
      <motion.div
        className="relative z-10"
        animate={
          glitch
            ? {
                x: [0, -2, 2, -1, 1, 0],
                opacity: [1, 0.8, 1, 0.9, 1],
              }
            : {}
        }
        transition={
          glitch
            ? {
                duration: 0.2,
                repeat: Infinity,
                repeatDelay: 3,
              }
            : {}
        }
        style={{
          transform: `perspective(1000px) rotateX(${mousePos.y * 10}deg) rotateY(${mousePos.x * 10}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>

      {/* 全息光晕 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x * 50}% ${50 + mousePos.y * 50}%, ${colors[color]}${intensity * 0.2}), transparent)`,
        }}
      />

      {/* 边框发光 */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          border: `1px solid ${colors[color]}${intensity})`,
          boxShadow: `0 0 ${20 * intensity}px ${colors[color]}${intensity * 0.5}), inset 0 0 ${20 * intensity}px ${colors[color]}${intensity * 0.3})`,
        }}
      />

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </div>
  );
}

export interface HologramCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  color?: 'cyan' | 'purple' | 'pink' | 'blue';
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function HologramCard({
  title,
  description,
  icon,
  color = 'cyan',
  interactive = true,
  className,
  children,
}: HologramCardProps) {
  const colors = {
    cyan: 'from-cyber-cyan',
    purple: 'from-cyber-purple',
    pink: 'from-cyber-pink',
    blue: 'from-blue-500',
  };

  return (
    <HologramDisplay color={color} intensity={0.3} className={className}>
      <div className="p-6 h-full flex flex-col">
        {icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`text-4xl mb-4 bg-gradient-to-br ${colors[color]} to-transparent bg-clip-text`}
          >
            {icon}
          </motion.div>
        )}

        {title && (
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        )}

        {description && (
          <p className="text-gray-400 text-sm mb-4">{description}</p>
        )}

        {children && <div className="flex-1">{children}</div>}

        {interactive && (
          <motion.div
            className="mt-4 pt-4 border-t border-cyber-border"
            whileHover={{ x: 5 }}
          >
            <span className={`text-sm bg-gradient-to-r ${colors[color]} to-transparent bg-clip-text`}>
              了解更多 →
            </span>
          </motion.div>
        )}
      </div>
    </HologramDisplay>
  );
}
