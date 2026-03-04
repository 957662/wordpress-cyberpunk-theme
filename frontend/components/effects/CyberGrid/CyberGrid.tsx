/**
 * CyberPress Platform - CyberGrid Component
 * 赛博朋克风格网格背景
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export interface CyberGridProps {
  size?: number;
  color?: string;
  opacity?: number;
  animated?: boolean;
  perspective?: boolean;
  className?: string;
}

export function CyberGrid({
  size = 50,
  color = '#00f0ff',
  opacity = 0.1,
  animated = true,
  perspective = false,
  className,
}: CyberGridProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!perspective) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [perspective]);

  const gridStyle = {
    backgroundImage: `
      linear-gradient(to right, ${color} ${opacity}px, transparent ${opacity}px),
      linear-gradient(to bottom, ${color} ${opacity}px, transparent ${opacity}px)
    `,
    backgroundSize: `${size}px ${size}px`,
  };

  const transformStyle = perspective
    ? {
        transform: `perspective(500px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`,
        transformOrigin: 'center center',
      }
    : {};

  return (
    <motion.div
      className={cn(
        'absolute inset-0 pointer-events-none',
        perspective && 'transition-transform duration-300 ease-out',
        className
      )}
      style={gridStyle}
      animate={
        animated
          ? {
              backgroundPosition: ['0 0', `${size}px ${size}px`],
            }
          : {}
      }
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// 3D 透视网格
export function PerspectiveGrid(props: CyberGridProps) {
  return <CyberGrid {...props} perspective />;
}

// 发光网格
export function GlowGrid({
  glowColor = '#00f0ff',
  ...props
}: CyberGridProps & { glowColor?: string }) {
  return (
    <div className="relative">
      <CyberGrid {...props} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}10, transparent 70%)`,
        }}
      />
    </div>
  );
}

// 双层网格
export function DoubleGrid({
  frontColor = '#00f0ff',
  backColor = '#9d00ff',
  ...props
}: CyberGridProps & { frontColor?: string; backColor?: string }) {
  return (
    <div className="relative">
      <CyberGrid {...props} color={backColor} opacity={0.05} />
      <CyberGrid {...props} color={frontColor} size={props.size ? props.size * 0.5 : 25} />
    </div>
  );
}
