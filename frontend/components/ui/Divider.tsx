/**
 * 赛博朋克风格分割线组件
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'dashed' | 'dotted' | 'neon' | 'hologram' | 'gradient';
  color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  thickness?: 'thin' | 'medium' | 'thick';
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  animated?: boolean;
  glow?: boolean;
}

export function Divider({
  variant = 'solid',
  color = 'cyan',
  thickness = 'thin',
  orientation = 'horizontal',
  label,
  animated = false,
  glow = false,
  className,
  ...props
}: DividerProps) {
  const baseStyles = 'relative overflow-hidden';

  const thicknesses = {
    thin: orientation === 'horizontal' ? 'h-px' : 'w-px',
    medium: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
    thick: orientation === 'horizontal' ? 'h-1' : 'w-1',
  };

  const variants = {
    solid: `bg-cyber-border`,
    dashed: `border-cyber-border border-${orientation === 'horizontal' ? 't' : 'l'} border-dashed`,
    dotted: `border-cyber-border border-${orientation === 'horizontal' ? 't' : 'l'} border-dotted`,
    neon: `bg-cyber-${color} ${glow && `shadow-neon-${color}`}`,
    hologram: 'bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink',
    gradient: `bg-gradient-to-r from-transparent via-cyber-${color} to-transparent`,
  };

  const dividerLine = (
    <motion.div
      className={cn(
        baseStyles,
        thicknesses[thickness],
        variants[variant],
        orientation === 'horizontal' ? 'w-full' : 'h-full',
        animated && variant === 'hologram' && 'animate-gradient',
        className
      )}
      {...props}
    >
      {/* 扫描线动画 */}
      {animated && variant !== 'solid' && (
        <motion.div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent',
            orientation === 'horizontal' ? 'w-full h-full' : 'h-full w-full'
          )}
          animate={{
            [orientation === 'horizontal' ? 'x' : 'y']: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      {/* 粒子效果 */}
      {variant === 'neon' && glow && (
        <motion.div
          className={`absolute inset-0 bg-cyber-${color} opacity-30 blur-sm`}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  );

  if (label) {
    return (
      <div className={cn(
        'flex items-center gap-4',
        orientation === 'horizontal' ? 'w-full' : 'h-full flex-col'
      )}>
        {dividerLine}
        <span className={cn(
          'font-display font-medium text-gray-400 whitespace-nowrap px-2',
          variant === 'neon' && `text-cyber-${color}`
        )}>
          {label}
        </span>
        {dividerLine}
      </div>
    );
  }

  return dividerLine;
}
