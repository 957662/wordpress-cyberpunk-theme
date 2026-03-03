'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'neon' | 'holographic' | 'solid';
  hover3D?: boolean;
  glowOnHover?: boolean;
  scanlines?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  className,
  variant = 'glass',
  hover3D = true,
  glowOnHover = true,
  scanlines = false,
  clickable = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  const variantStyles = {
    glass: `
      bg-white/5
      backdrop-blur-xl
      border border-white/10
    `,
    neon: `
      bg-cyber-dark/80
      border-2 border-cyber-cyan
      shadow-[0_0_20px_rgba(0,240,255,0.3)]
    `,
    holographic: `
      bg-gradient-to-br from-cyber-purple/20 via-transparent to-cyber-cyan/20
      backdrop-blur-md
      border border-cyber-purple/50
    `,
    solid: `
      bg-cyber-dark
      border border-cyber-muted/50
    `,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl p-6 transition-all duration-300',
        variantStyles[variant],
        glowOnHover && isHovered && 'shadow-2xl',
        clickable && 'cursor-pointer',
        hover3D && 'perspective-1000',
        className
      )}
      style={{
        rotateX: hover3D ? rotateX : 0,
        rotateY: hover3D ? rotateY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={clickable ? { scale: 1.02 } : {}}
      whileTap={clickable ? { scale: 0.98 } : {}}
    >
      {/* 扫描线效果 */}
      {scanlines && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
            animate={{
              y: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      )}

      {/* 光晕效果 */}
      {glowOnHover && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 opacity-0 blur-2xl"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* 装饰角标 */}
      <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-cyber-cyan" />
      <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-cyber-purple" />
      <div className="absolute right-0 bottom-0 h-3 w-3 border-r-2 border-b-2 border-cyber-pink" />
      <div className="absolute left-0 bottom-0 h-3 w-3 border-l-2 border-b-2 border-cyber-cyan" />

      {/* 内容 */}
      <div className="relative z-10">{children}</div>

      {/* 悬浮时的边框动画 */}
      {isHovered && variant === 'neon' && (
        <>
          <motion.div
            className="absolute left-0 top-0 h-full w-[2px] bg-cyber-cyan"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute right-0 top-0 h-full w-[2px] bg-cyber-purple"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
        </>
      )}
    </motion.div>
  );
};

export default CyberCard;
