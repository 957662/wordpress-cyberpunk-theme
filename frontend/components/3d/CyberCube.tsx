/**
 * 3D 赛博朋克立方体组件
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface CyberCubeProps {
  size?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  glowing?: boolean;
  rotating?: boolean;
  interactive?: boolean;
  className?: string;
}

export function CyberCube({
  size = 200,
  color = 'cyan',
  glowing = true,
  rotating = true,
  interactive = true,
  className,
}: CyberCubeProps) {
  const [rotation, setRotation] = useState({ x: -15, y: 30 });

  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  const glowColors = {
    cyan: 'rgba(0, 240, 255, 0.5)',
    purple: 'rgba(157, 0, 255, 0.5)',
    pink: 'rgba(255, 0, 128, 0.5)',
    yellow: 'rgba(240, 255, 0, 0.5)',
  };

  const faceColors = {
    front: colors[color],
    back: colors[color],
    right: colors[color],
    left: colors[color],
    top: colors[color],
    bottom: colors[color],
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 360;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 360;

    setRotation({ x: -y, y: x });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotation({ x: -15, y: 30 });
  };

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size, perspective: `${size * 2}px` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={
          rotating && !interactive
            ? { rotateX: 360, rotateY: 360 }
            : { rotateX: rotation.x, rotateY: rotation.y }
        }
        transition={
          rotating && !interactive
            ? { duration: 20, repeat: Infinity, ease: 'linear' }
            : { type: 'spring', stiffness: 100, damping: 20 }
        }
      >
        {/* 前面 */}
        <div
          className="absolute w-full h-full border-2 flex items-center justify-center"
          style={{
            backgroundColor: `${glowColors[color]}`,
            borderColor: faceColors.front,
            transform: `translateZ(${size / 2}px)`,
            boxShadow: glowing ? `0 0 ${size / 10}px ${glowColors[color]}` : 'none',
          }}
        />

        {/* 后面 */}
        <div
          className="absolute w-full h-full border-2 flex items-center justify-center"
          style={{
            backgroundColor: `${glowColors[color]}`,
            borderColor: faceColors.back,
            transform: `translateZ(-${size / 2}px) rotateY(180deg)`,
            boxShadow: glowing ? `0 0 ${size / 10}px ${glowColors[color]}` : 'none',
          }}
        />

        {/* 右面 */}
        <div
          className="absolute w-full h-full border-2 flex items-center justify-center"
          style={{
            backgroundColor: `${glowColors[color]}`,
            borderColor: faceColors.right,
            transform: `rotateY(90deg) translateZ(${size / 2}px)`,
            boxShadow: glowing ? `0 0 ${size / 10}px ${glowColors[color]}` : 'none',
          }}
        />

        {/* 左面 */}
        <div
          className="absolute w-full h-full border-2 flex items-center justify-center"
          style={{
            backgroundColor: `${glowColors[color]}`,
            borderColor: faceColors.left,
            transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
            boxShadow: glowing ? `0 0 ${size / 10}px ${glowColors[color]}` : 'none',
          }}
        />

        {/* 上面 */}
        <div
          className="absolute w-full h-full border-2 flex items-center justify-center"
          style={{
            backgroundColor: `${glowColors[color]}`,
            borderColor: faceColors.top,
            transform: `rotateX(90deg) translateZ(${size / 2}px)`,
            boxShadow: glowing ? `0 0 ${size / 10}px ${glowColors[color]}` : 'none',
          }}
        />

        {/* 下面 */}
        <div
          className="absolute w-full h-full border-2 flex items-center justify-center"
          style={{
            backgroundColor: `${glowColors[color]}`,
            borderColor: faceColors.bottom,
            transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
            boxShadow: glowing ? `0 0 ${size / 10}px ${glowColors[color]}` : 'none',
          }}
        />
      </motion.div>
    </div>
  );
}

export interface CyberSphereProps {
  size?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  rings?: number;
  rotating?: boolean;
  glowing?: boolean;
  className?: string;
}

export function CyberSphere({
  size = 200,
  color = 'cyan',
  rings = 5,
  rotating = true,
  glowing = true,
  className,
}: CyberSphereProps) {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  };

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={rotating ? { rotateY: 360 } : {}}
        transition={rotating ? { duration: 10, repeat: Infinity, ease: 'linear' } : {}}
      >
        {Array.from({ length: rings }).map((_, index) => {
          const angle = (index / rings) * 180;
          const scale = 1 - (index / rings) * 0.5;

          return (
            <motion.div
              key={index}
              className="absolute w-full h-full rounded-full border-2"
              style={{
                borderColor: colors[color],
                transform: `rotateX(${angle}deg) scale(${scale})`,
                boxShadow: glowing ? `0 0 ${size / 20}px ${colors[color]}` : 'none',
              }}
              animate={rotating ? { rotateZ: 360 } : {}}
              transition={
                rotating
                  ? { duration: 5 + index * 0.5, repeat: Infinity, ease: 'linear' }
                  : {}
              }
            />
          );
        })}
      </motion.div>
    </div>
  );
}
