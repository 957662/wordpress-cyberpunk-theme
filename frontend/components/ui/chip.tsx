'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/clsx';
import { X } from 'lucide-react';

export interface ChipProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'neon' | 'cyber' | 'glass';
  glowColor?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  onClose?: () => void;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  clickable?: boolean;
  selected?: boolean;
}

export const Chip = ({
  children,
  className,
  variant = 'default',
  glowColor = 'cyan',
  size = 'md',
  closable = false,
  onClose,
  avatar,
  icon,
  clickable = false,
  selected = false,
  ...props
}: ChipProps) => {
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2.5',
  };

  const variantStyles = {
    default: `bg-cyber-card border border-cyber-border hover:border-cyber-${glowColor}`,
    neon: `bg-cyber-${glowColor}/10 border border-cyber-${glowColor}/30 hover:border-cyber-${glowColor} hover:bg-cyber-${glowColor}/20`,
    cyber: `bg-gradient-to-r from-cyber-card to-cyber-muted border border-cyber-${glowColor}/30 hover:border-cyber-${glowColor}`,
    glass: `bg-cyber-card/30 backdrop-blur-md border border-cyber-border/50 hover:border-cyber-${glowColor}/50 hover:bg-cyber-card/50`,
  };

  const selectedStyles = selected
    ? `bg-cyber-${glowColor}/20 border-cyber-${glowColor}`
    : '';

  return (
    <motion.div
      className={cn(
        'inline-flex items-center rounded-full font-medium transition-all duration-300',
        sizeStyles[size],
        variantStyles[variant],
        selectedStyles,
        clickable && 'cursor-pointer',
        className
      )}
      whileHover={clickable ? { scale: 1.05 } : {}}
      whileTap={clickable ? { scale: 0.95 } : {}}
      {...props}
    >
      {avatar && <span className="flex-shrink-0">{avatar}</span>}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {closable && (
        <motion.button
          onClick={onClose}
          className="flex-shrink-0 p-0.5 hover:bg-cyber-muted rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </motion.div>
  );
};

export interface ChipGroupProps {
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'default' | 'neon' | 'cyber';
  glowColor?: 'cyan' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ChipGroup = ({
  children,
  value,
  onChange,
  variant = 'default',
  glowColor = 'cyan',
  size = 'md',
  className,
}: ChipGroupProps) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {Array.isArray(children)
        ? children.map((child) => {
            if (typeof child === 'object' && 'props' in child) {
              const childValue = child.props.value;
              const isSelected = value === childValue;
              return {
                ...child,
                props: {
                  ...child.props,
                  selected: isSelected,
                  clickable: !!onChange,
                  onClick: () => onChange?.(childValue),
                  variant,
                  glowColor,
                  size,
                },
              };
            }
            return child;
          })
        : children}
    </div>
  );
};
