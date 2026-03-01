'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface HolographicEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  colors?: string[];
}

const defaultColors = ['#00f0ff', '#9d00ff', '#ff0080', '#f0ff00'];

export function HolographicEffect({
  children,
  className,
  intensity = 'medium',
  colors = defaultColors,
}: HolographicEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const intensityMap = {
    low: { opacity: 0.1, blur: 20 },
    medium: { opacity: 0.2, blur: 30 },
    high: { opacity: 0.3, blur: 40 },
  };

  const { opacity: baseOpacity, blur } = intensityMap[intensity];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic Layers */}
      {colors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            backgroundColor: color,
            opacity: isHovered ? baseOpacity * (1 + index * 0.1) : 0,
            filter: `blur(${blur + index * 5}px)`,
          }}
          animate={
            isHovered
              ? {
                  background: [
                    `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${color}40, transparent 50%)`,
                    `radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, ${color}30, transparent 50%)`,
                  ],
                }
              : {}
          }
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      ))}

      {/* Scanline Effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.03) 2px, rgba(0, 240, 255, 0.03) 4px)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default HolographicEffect;
