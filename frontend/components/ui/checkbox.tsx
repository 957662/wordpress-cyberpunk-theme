'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/clsx';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<HTMLMotionProps<'input'>, 'type'> {
  label?: string;
  variant?: 'default' | 'neon' | 'cyber';
  glowColor?: 'cyan' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}

export const Checkbox = ({
  label,
  variant = 'default',
  glowColor = 'cyan',
  size = 'md',
  error = false,
  className,
  checked,
  ...props
}: CheckboxProps) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantStyles = {
    default: 'border-cyber-border checked:border-cyber-cyan',
    neon: `border-cyber-${glowColor} checked:border-cyber-${glowColor}`,
    cyber: 'border-cyber-border checked:border-cyber-cyan checked:shadow-neon-cyan',
  };

  const errorStyles = error ? 'border-cyber-pink' : '';

  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <motion.input
          type="checkbox"
          checked={checked}
          className={cn(
            'peer appearance-none rounded bg-cyber-card border-2 transition-all duration-300 cursor-pointer',
            sizeStyles[size],
            variantStyles[variant],
            errorStyles,
            className
          )}
          whileTap={{ scale: 0.95 }}
          {...props}
        />
        <motion.div
          className={cn(
            'absolute inset-0 flex items-center justify-center pointer-events-none text-cyber-cyan',
            sizeStyles[size]
          )}
          initial={{ scale: 0 }}
          animate={{ scale: checked ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Check className="w-full h-full p-0.5" />
        </motion.div>
      </div>
      {label && <span className="text-gray-300 select-none">{label}</span>}
    </label>
  );
};

export interface RadioProps extends Omit<HTMLMotionProps<'input'>, 'type'> {
  label?: string;
  variant?: 'default' | 'neon' | 'cyber';
  glowColor?: 'cyan' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
}

export const Radio = ({
  label,
  variant = 'default',
  glowColor = 'cyan',
  size = 'md',
  className,
  ...props
}: RadioProps) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantStyles = {
    default: 'border-cyber-border checked:border-cyber-cyan',
    neon: `border-cyber-${glowColor} checked:border-cyber-${glowColor}`,
    cyber: 'border-cyber-border checked:border-cyber-cyan checked:shadow-neon-cyan',
  };

  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <motion.input
          type="radio"
          className={cn(
            'peer appearance-none rounded-full bg-cyber-card border-2 transition-all duration-300 cursor-pointer',
            sizeStyles[size],
            variantStyles[variant],
            className
          )}
          whileTap={{ scale: 0.95 }}
          {...props}
        />
        <motion.div
          className={cn(
            'absolute inset-0 m-auto rounded-full pointer-events-none',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-2.5 h-2.5' : 'w-3 h-3',
            `bg-cyber-${glowColor}`
          )}
          initial={{ scale: 0 }}
          animate={{ scale: props.checked ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>
      {label && <span className="text-gray-300 select-none">{label}</span>}
    </label>
  );
};

export interface SwitchProps extends Omit<HTMLMotionProps<'input'>, 'type'> {
  label?: string;
  variant?: 'default' | 'neon' | 'cyber';
  glowColor?: 'cyan' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = ({
  label,
  variant = 'default',
  glowColor = 'cyan',
  size = 'md',
  className,
  checked,
  ...props
}: SwitchProps) => {
  const sizeStyles = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8',
  };

  const thumbSizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantStyles = {
    default: 'peer-checked:bg-cyber-cyan peer-checked:border-cyber-cyan',
    neon: `peer-checked:bg-cyber-${glowColor} peer-checked:border-cyber-${glowColor}`,
    cyber: 'peer-checked:bg-cyber-cyan peer-checked:border-cyber-cyan peer-checked:shadow-neon-cyan',
  };

  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <motion.input
          type="checkbox"
          checked={checked}
          className={cn(
            'peer appearance-none rounded-full bg-cyber-card border-2 border-cyber-border transition-all duration-300 cursor-pointer',
            sizeStyles[size],
            variantStyles[variant],
            className
          )}
          whileTap={{ scale: 0.95 }}
          {...props}
        />
        <motion.div
          className={cn(
            'absolute top-0.5 left-0.5 bg-white rounded-full shadow-md pointer-events-none',
            thumbSizeStyles[size]
          )}
          animate={{ x: checked ? (size === 'sm' ? 16 : size === 'md' ? 20 : 24) : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </div>
      {label && <span className="text-gray-300 select-none">{label}</span>}
    </label>
  );
};
