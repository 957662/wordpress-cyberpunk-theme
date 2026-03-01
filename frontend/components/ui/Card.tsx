/**
 * 赛博朋克风格卡片组件
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'neon' | 'glass' | 'hologram';
  hover?: boolean;
  glowColor?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

export function Card({
  children,
  variant = 'default',
  hover = true,
  glowColor = 'cyan',
  className,
  ...props
}: CardProps) {
  const baseStyles = 'relative rounded-lg p-6 overflow-hidden';

  const variants = {
    default: 'bg-cyber-card border border-cyber-border',
    neon: `bg-cyber-card border-2 border-cyber-${glowColor} shadow-neon-${glowColor}`,
    glass: 'bg-cyber-card/50 backdrop-blur-md border border-cyber-border/50',
    hologram: 'bg-gradient-to-br from-cyber-card to-cyber-muted border border-cyber-border',
  };

  const hoverEffect = hover
    ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-lg'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        baseStyles,
        variants[variant],
        hoverEffect,
        className
      )}
      {...props}
    >
      {/* 装饰线 */}
      {variant === 'neon' && (
        <>
          <div className={`absolute top-0 left-0 right-0 h-0.5 bg-cyber-${glowColor} shadow-neon-${glowColor}`} />
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-${glowColor} shadow-neon-${glowColor}`} />
        </>
      )}

      {/* 扫描线效果 */}
      {variant === 'hologram' && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/5 to-transparent animate-scan pointer-events-none" />
      )}

      {children}
    </motion.div>
  );
}
