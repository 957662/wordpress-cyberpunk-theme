/**
 * CursorGlow - 鼠标跟随光效
 * 创建跟随鼠标移动的发光效果
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CursorGlowProps {
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  size?: number;
  blur?: number;
  intensity?: number;
  className?: string;
  disabled?: boolean; // 禁用效果（移动端）
}

export function CursorGlow({
  color = 'cyan',
  size = 400,
  blur = 100,
  intensity = 0.15,
  className,
  disabled = false,
}: CursorGlowProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = {
    cyan: 'rgba(0, 240, 255,',
    purple: 'rgba(157, 0, 255,',
    pink: 'rgba(255, 0, 128,',
    yellow: 'rgba(240, 255, 0,',
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (disabled || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isActive) setIsActive(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [disabled, isMobile, isActive]);

  if (disabled || isMobile) return null;

  return (
    <div
      ref={containerRef}
      className={cn('fixed inset-0 pointer-events-none z-0', className)}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          background: `radial-gradient(circle, ${colors[color]}${intensity}) 0%, ${colors[color]}0) 70%)`,
          filter: `blur(${blur}px)`,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0,
        }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 0.3, type: 'spring', stiffness: 100 },
        }}
      />
    </div>
  );
}

// 磁性按钮效果
export interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  strength = 20,
  className,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // 限制移动范围
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = strength;

    if (distance > maxDistance) {
      const angle = Math.atan2(y, x);
      setPosition({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance,
      });
    } else {
      setPosition({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
