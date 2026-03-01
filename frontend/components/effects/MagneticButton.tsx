'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  variant?: 'primary' | 'secondary' | 'ghost' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glow?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  strength = 0.3,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  glow = false,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const variantClasses: Record<string, string> = {
    primary: 'bg-cyber-cyan text-dark-900 hover:bg-cyber-cyan/90',
    secondary: 'bg-cyber-purple text-white hover:bg-cyber-purple/90',
    ghost: 'bg-transparent border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10',
    cyber:
      'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink text-white hover:opacity-90',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        glow && 'shadow-lg hover:shadow-cyber-cyan/50 transition-shadow',
        className
      )}
      {...props}
    >
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-cyber-cyan/20 blur-xl"
          animate={{
            opacity: isHovered ? 0.5 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {icon && iconPosition === 'left' && (
        <motion.span
          animate={{ x: isHovered ? -3 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          {icon}
        </motion.span>
      )}

      <span className="relative z-10">{children}</span>

      {icon && iconPosition === 'right' && (
        <motion.span
          animate={{ x: isHovered ? 3 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};

interface MorphingShapeProps {
  className?: string;
  color?: string;
  size?: number;
  speed?: number;
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  className,
  color = '#00f0ff',
  size = 200,
  speed = 5,
}) => {
  return (
    <motion.div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '60% 40% 30% 70% / 60% 30% 70% 40%',
          ],
        }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );
};

interface NeonGlowProps {
  children: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

export const NeonGlow: React.FC<NeonGlowProps> = ({
  children,
  className,
  color = 'cyan',
  intensity = 'medium',
  animated = true,
}) => {
  const colorClasses: Record<string, string> = {
    cyan: 'shadow-cyber-cyan/50',
    purple: 'shadow-cyber-purple/50',
    pink: 'shadow-cyber-pink/50',
    yellow: 'shadow-cyber-yellow/50',
  };

  const intensityClasses: Record<string, string> = {
    low: 'shadow-lg',
    medium: 'shadow-2xl',
    high: 'shadow-[0_0_30px]',
  };

  const glowClass = `${colorClasses[color]} ${intensityClasses[intensity]}`;

  return (
    <motion.div
      className={cn('relative', className)}
      animate={
        animated
          ? {
              boxShadow: [
                `0 0 10px currentColor, 0 0 20px currentColor`,
                `0 0 20px currentColor, 0 0 40px currentColor`,
                `0 0 10px currentColor, 0 0 20px currentColor`,
              ],
            }
          : {}
      }
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        color: `var(--color-${color}, #00f0ff)`,
      }}
    >
      <div className={cn('relative z-10', glowClass)}>{children}</div>
      {animated && (
        <motion.div
          className="absolute inset-0 blur-xl opacity-50 -z-10"
          style={{ backgroundColor: `var(--color-${color}, #00f0ff)` }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

interface HoverRevealProps {
  children: React.ReactNode;
  reveal: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const HoverReveal: React.FC<HoverRevealProps> = ({
  children,
  reveal,
  className,
  direction = 'up',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const directionClasses: Record<string, string> = {
    up: 'bottom-full left-0 mb-2',
    down: 'top-full left-0 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <motion.div
        className={cn('absolute z-50', directionClasses[direction])}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.9,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-3 rounded-lg bg-dark-800 border border-dark-700 shadow-xl">
          {reveal}
        </div>
      </motion.div>
    </div>
  );
};

export default MagneticButton;
