'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  children,
  className,
  intensity = 'medium',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const intensityValues = {
    low: { rotate: 5, shine: 0.3 },
    medium: { rotate: 10, shine: 0.5 },
    high: { rotate: 15, shine: 0.7 },
  };

  const values = intensityValues[intensity];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-lg',
        'border border-cyber-purple/50 bg-deep-black/80 backdrop-blur-sm',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: `${(mousePosition.y / 300) * values.rotate}deg`,
        rotateY: `${-(mousePosition.x / 300) * values.rotate}deg`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* 全息光效 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: `radial-gradient(
            circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(0, 240, 255, ${values.shine}) 0%,
            rgba(157, 0, 255, ${values.shine * 0.5}) 50%,
            transparent 100%
          )`,
        }}
      />

      {/* 扫描线 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent animate-scanline" />
      </div>

      {/* 内容 */}
      <div className="relative z-10">{children}</div>

      {/* 边框光效 */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `linear-gradient(
            ${mousePosition.x * 0.5}deg,
            rgba(0, 240, 255, 0.3),
            rgba(157, 0, 255, 0.3),
            rgba(255, 0, 128, 0.3),
            rgba(0, 240, 255, 0.3)
          )`,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default HolographicCard;
