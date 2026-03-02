'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface HoloBadgeProps {
  /**
   * 徽章文本
   */
  children: React.ReactNode;

  /**
   * 主题颜色
   */
  color?: 'cyan' | 'purple' | 'pink' | 'gold';

  /**
   * 尺寸
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * 是否启用 3D 效果
   */
  enable3D?: boolean;

  /**
   * 自定义类名
   */
  className?: string;
}

const colorStyles = {
  cyan: {
    border: 'border-cyber-cyan',
    text: 'text-cyber-cyan',
    glow: 'shadow-glow-cyan',
    gradient: 'from-cyber-cyan/20 via-cyber-cyan/10 to-cyber-cyan/20',
  },
  purple: {
    border: 'border-cyber-purple',
    text: 'text-cyber-purple',
    glow: 'shadow-glow-purple',
    gradient: 'from-cyber-purple/20 via-cyber-purple/10 to-cyber-purple/20',
  },
  pink: {
    border: 'border-cyber-pink',
    text: 'text-cyber-pink',
    glow: 'shadow-glow-pink',
    gradient: 'from-cyber-pink/20 via-cyber-pink/10 to-cyber-pink/20',
  },
  gold: {
    border: 'border-cyber-yellow',
    text: 'text-cyber-yellow',
    glow: 'shadow-neon-yellow',
    gradient: 'from-cyber-yellow/20 via-cyber-yellow/10 to-cyber-yellow/20',
  },
};

const sizeStyles = {
  sm: 'px-3 py-1 text-sm rounded',
  md: 'px-4 py-2 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-xl',
};

/**
 * HoloBadge - 全息徽章组件
 *
 * 提供赛博朋克风格的全息投影效果徽章
 *
 * @example
 * ```tsx
 * <HoloBadge color="cyan">新功能</HoloBadge>
 * <HoloBadge color="gold" size="lg" enable3D>高级会员</HoloBadge>
 * ```
 */
export const HoloBadge: React.FC<HoloBadgeProps> = ({
  children,
  color = 'cyan',
  size = 'md',
  enable3D = true,
  className = '',
}) => {
  const styles = colorStyles[color];

  if (enable3D) {
    return <HoloBadge3D color={color} size={size} className={className}>{children}</HoloBadge3D>;
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        'border-2',
        'font-mono font-semibold uppercase tracking-wider',
        'overflow-hidden',
        styles.border,
        styles.text,
        sizeStyles[size],
        'bg-cyber-darker/50',
        'backdrop-blur-sm',
        className
      )}
    >
      {/* 全息扫描效果 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 0%', '0% 100%', '0% 0%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${color === 'cyan' ? 'rgba(0, 240, 255, 0.1)' : color === 'purple' ? 'rgba(157, 0, 255, 0.1)' : color === 'pink' ? 'rgba(255, 0, 128, 0.1)' : 'rgba(240, 255, 0, 0.1)'} 50%, transparent 100%)`,
          backgroundSize: '100% 200%',
        }}
      />

      {/* 闪烁效果 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color === 'cyan' ? 'rgba(0, 240, 255, 0.2)' : color === 'purple' ? 'rgba(157, 0, 255, 0.2)' : color === 'pink' ? 'rgba(255, 0, 128, 0.2)' : 'rgba(240, 255, 0, 0.2)'}, transparent 70%)`,
        }}
      />

      {/* 内容 */}
      <span className="relative z-10">{children}</span>

      {/* 边角装饰 */}
      <div className={cn('absolute top-0 left-0 w-2 h-2 border-t border-l', styles.border)} />
      <div className={cn('absolute top-0 right-0 w-2 h-2 border-t border-r', styles.border)} />
      <div className={cn('absolute bottom-0 left-0 w-2 h-2 border-b border-l', styles.border)} />
      <div className={cn('absolute bottom-0 right-0 w-2 h-2 border-b border-r', styles.border)} />
    </div>
  );
};

/**
 * 3D 全息徽章内部组件
 */
const HoloBadge3D: React.FC<HoloBadgeProps> = ({
  children,
  color = 'cyan',
  size = 'md',
  className = '',
}) => {
  const styles = colorStyles[color];
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative inline-flex items-center justify-center',
        'border-2',
        'font-mono font-semibold uppercase tracking-wider',
        'overflow-hidden',
        styles.border,
        styles.text,
        sizeStyles[size],
        'bg-gradient-to-br',
        styles.gradient,
        'backdrop-blur-sm',
        styles.glow,
        'cursor-pointer',
        className
      )}
    >
      {/* 全息扫描线 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          y: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div
          className={cn(
            'w-full h-1/4 blur-sm',
            color === 'cyan' && 'bg-cyber-cyan/20',
            color === 'purple' && 'bg-cyber-purple/20',
            color === 'pink' && 'bg-cyber-pink/20',
            color === 'gold' && 'bg-cyber-yellow/20'
          )}
        />
      </motion.div>

      {/* 粒子效果 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute w-0.5 h-0.5 rounded-full',
              color === 'cyan' && 'bg-cyber-cyan',
              color === 'purple' && 'bg-cyber-purple',
              color === 'pink' && 'bg-cyber-pink',
              color === 'gold' && 'bg-cyber-yellow'
            )}
            animate={{
              y: ['0%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
            style={{
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* 内容 */}
      <span className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </span>

      {/* 全息边框 */}
      <div
        className={cn(
          'absolute inset-0 border-2 rounded-lg pointer-events-none',
          'bg-gradient-to-br from-white/10 via-transparent to-white/5'
        )}
        style={{ transform: 'translateZ(10px)' }}
      />
    </motion.div>
  );
};

export default HoloBadge;
