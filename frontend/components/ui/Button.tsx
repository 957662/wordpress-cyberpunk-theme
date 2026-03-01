/**
 * 赛博朋克风格按钮组件
 */

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LoaderIcon } from '@/components/icons';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = '加载中...',
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-display font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90 shadow-neon-cyan hover:shadow-neon-cyan',
    secondary: 'bg-cyber-purple text-white hover:bg-cyber-purple/90 shadow-neon-purple hover:shadow-neon-purple',
    outline: 'border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10',
    ghost: 'text-cyber-cyan hover:bg-cyber-cyan/10',
    danger: 'bg-cyber-pink text-white hover:bg-cyber-pink/90 shadow-neon-pink hover:shadow-neon-pink',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-5 py-2.5 text-base rounded-md',
    lg: 'px-7 py-3 text-lg rounded-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <LoaderIcon className="animate-spin mr-2" />
          {loadingText}
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}
