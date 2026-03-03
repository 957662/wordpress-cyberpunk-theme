'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'glitch' | 'holographic' | 'plasma';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  glowEffect?: boolean;
  scanEffect?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  variant = 'neon',
  size = 'md',
  children,
  className,
  glowEffect = true,
  scanEffect = false,
  disabled,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantStyles = {
    neon: `
      border-2 border-cyber-cyan
      bg-transparent
      text-cyber-cyan
      hover:bg-cyber-cyan/10
      hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]
    `,
    glitch: `
      border-2 border-cyber-pink
      bg-cyber-pink/5
      text-cyber-pink
      hover:bg-cyber-pink/20
      hover:shadow-[0_0_20px_rgba(255,0,128,0.5)]
    `,
    holographic: `
      border-2 border-cyber-purple
      bg-gradient-to-r from-cyber-purple/20 to-cyber-cyan/20
      text-white
      hover:from-cyber-purple/40
      hover:to-cyber-cyan/40
      hover:shadow-[0_0_30px_rgba(157,0,255,0.6)]
    `,
    plasma: `
      border-2 border-cyber-yellow
      bg-gradient-to-r from-cyber-pink/20 via-cyber-yellow/20 to-cyber-cyan/20
      bg-[length:200%_200%]
      text-white
      animate-plasma-shift
      hover:shadow-[0_0_40px_rgba(240,255,0,0.7)]
    `,
  };

  return (
    <motion.button
      className={cn(
        'relative overflow-hidden rounded font-bold uppercase tracking-wider transition-all duration-300',
        sizeStyles[size],
        variantStyles[variant],
        glowEffect && 'hover:scale-105',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
      {...props}
    >
      {/* 扫描线效果 */}
      {scanEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"
          animate={{
            y: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* 光晕效果 */}
      {glowEffect && isHovered && (
        <motion.div
          className="absolute inset-0 bg-current opacity-20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* 故障效果 */}
      {variant === 'glitch' && isHovered && (
        <>
          <span className="absolute left-0.5 top-0.5 text-cyber-cyan opacity-70">
            {children}
          </span>
          <span className="absolute -left-0.5 -top-0.5 text-cyber-yellow opacity-70">
            {children}
          </span>
        </>
      )}

      {/* 主内容 */}
      <span className="relative z-10">{children}</span>

      {/* 装饰线 */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-current opacity-50" />
    </motion.button>
  );
};

export default CyberButton;
