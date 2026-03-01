/**
 * 全息卡片效果
 * 鼠标移动时产生 3D 倾斜效果
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface HologramCardProps {
  children: React.ReactNode;
  /** 倾斜强度 (0-1) */
  intensity?: number;
  /** 是否启用发光效果 */
  glow?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function HologramCard({
  children,
  intensity = 0.5,
  glow = true,
  className,
}: HologramCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${intensity * 15}deg`, `-${intensity * 15}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${intensity * 15}deg`, `${intensity * 15}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'relative transform-style-3d transition-transform duration-200 ease-out',
        glow && isHovered && 'shadow-neon-cyan',
        className
      )}
    >
      {/* 全息扫描效果 */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent"
          style={{ transform: 'translateZ(1px)' }}
        />
      )}

      {/* 内容 */}
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>

      {/* 底部光晕 */}
      {glow && isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          className="absolute -bottom-20 -left-20 -right-20 h-40 bg-cyber-cyan/20 blur-3xl rounded-full pointer-events-none"
        />
      )}
    </motion.div>
  );
}
