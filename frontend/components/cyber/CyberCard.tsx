/**
 * CyberCard - 赛博朋克风格卡片组件
 * 带有发光边框和悬浮效果
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: 'cyan' | 'purple' | 'pink' | 'yellow';
  hover?: boolean;
  bordered?: boolean;
  variant?: 'default' | 'neon' | 'glass' | 'holographic';
  onClick?: () => void;
}

export function CyberCard({
  children,
  className,
  glow = true,
  glowColor = 'cyan',
  hover = true,
  bordered = true,
  variant = 'default',
  onClick,
}: CyberCardProps) {
  const glowColors = {
    cyan: 'shadow-cyber-cyan/50',
    purple: 'shadow-cyber-purple/50',
    pink: 'shadow-cyber-pink/50',
    yellow: 'shadow-cyber-yellow/50',
  };

  const baseStyles = 'relative overflow-hidden rounded-lg bg-cyber-dark/80 backdrop-blur-sm';

  const variantStyles = {
    default: cn(
      'border border-cyber-cyan/30',
      glow && `shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)]`,
      bordered && 'border-2'
    ),
    neon: cn(
      'border-2 border-cyber-cyan',
      `shadow-[0_0_20px_rgba(0,240,255,0.5)]`,
      'hover:shadow-[0_0_40px_rgba(0,240,255,0.8)]'
    ),
    glass: cn(
      'bg-white/5 backdrop-blur-md',
      'border border-white/10',
      'shadow-[0_8px_32px_rgba(0,0,0,0.37)]'
    ),
    holographic: cn(
      'bg-gradient-to-br from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20',
      'border border-white/20',
      'shadow-[0_0_30px_rgba(157,0,255,0.4)]'
    ),
  };

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
    whileHover: hover
      ? {
          scale: 1.02,
          transition: { duration: 0.2 },
        }
      : undefined,
    whileTap: onClick ? { scale: 0.98 } : undefined,
    onClick,
  };

  return (
    <motion.div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...motionProps}
    >
      {/* 扫描线效果 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%]" />
      </div>

      {/* 内容 */}
      <div className="relative z-10">{children}</div>

      {/* 装饰性角标 */}
      {variant === 'neon' && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyber-cyan" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyber-cyan" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyber-cyan" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyber-cyan" />
        </>
      )}
    </motion.div>
  );
}

// 导出特定变体的快捷组件
export function NeonCard(props: Omit<CyberCardProps, 'variant'>) {
  return <CyberCard {...props} variant="neon" />;
}

export function GlassCard(props: Omit<CyberCardProps, 'variant'>) {
  return <CyberCard {...props} variant="glass" />;
}

export function HoloCard(props: Omit<CyberCardProps, 'variant'>) {
  return <CyberCard {...props} variant="holographic" />;
}
