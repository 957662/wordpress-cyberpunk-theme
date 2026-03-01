/**
 * HolographicCard - 全息卡片效果
 * 3D 倾斜效果，鼠标跟随光效
 */

'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
  borderGlow?: boolean;
}

export default function HolographicCard({
  children,
  className = '',
  intensity = 1,
  glowColor = 'rgba(0, 240, 255, 0.3)',
  borderGlow = true,
}: HolographicCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setMousePosition({ x, y });
  };

  const transformStyle = {
    transform: isHovered
      ? `perspective(1000px) rotateX(${-mousePosition.y * 10 * intensity}deg) rotateY(${
          mousePosition.x * 10 * intensity
        }deg) scale3d(1.02, 1.02, 1.02)`
      : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
    transition: isHovered ? 'none' : 'transform 0.5s ease-out',
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn('relative', className)}
      style={transformStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 光效层 */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            background: `radial-gradient(
              circle at ${
                (mousePosition.x + 0.5) * 100
              }% ${(mousePosition.y + 0.5) * 100}%,
              ${glowColor},
              transparent 50%
            )`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* 边框发光 */}
      {borderGlow && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            boxShadow: `0 0 20px ${glowColor}, inset 0 0 20px ${glowColor}`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}

      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
