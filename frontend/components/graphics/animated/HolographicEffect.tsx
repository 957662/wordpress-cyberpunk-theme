'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HolographicEffectProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  color?: 'cyan' | 'magenta' | 'rainbow';
  className?: string;
}

export const HolographicEffect: React.FC<HolographicEffectProps> = ({
  children,
  intensity = 'medium',
  color = 'cyan',
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const intensityConfig = {
    low: { opacity: 0.1, blur: 2, speed: 3 },
    medium: { opacity: 0.2, blur: 4, speed: 2 },
    high: { opacity: 0.4, blur: 8, speed: 1 },
  };

  const config = intensityConfig[intensity];

  const colorSchemes = {
    cyan: ['from-cyan-400', 'via-blue-500', 'to-purple-500'],
    magenta: ['from-fuchsia-400', 'via-pink-500', 'to-red-500'],
    rainbow: ['from-cyan-400', 'via-fuchsia-500', 'to-yellow-400'],
  };

  const [from, via, to] = colorSchemes[color];

  useEffect(() => {
    const container = containerRef.current;
    const glare = glareRef.current;

    if (!container || !glare) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      glare.style.background = `radial-gradient(
        circle at ${x}% ${y}%,
        rgba(6, 182, 212, ${config.opacity}) 0%,
        transparent 50%
      )`;
    };

    const handleMouseLeave = () => {
      glare.style.background = 'transparent';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [config.opacity]);

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Holographic gradient overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-20 pointer-events-none',
          from,
          via,
          to
        )}
        style={{ filter: `blur(${config.blur}px)` }}
      />

      {/* Glare effect */}
      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ filter: `blur(${config.blur * 2}px)` }}
      />

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: config.speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ height: '10%' }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Border glow */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-lg bg-gradient-to-r opacity-30 pointer-events-none',
          from,
          via,
          to
        )}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: config.speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default HolographicEffect;
