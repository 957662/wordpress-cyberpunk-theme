'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { forwardRef } from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glowEffect?: boolean;
}

const variantStyles = {
  primary: 'bg-cyber-cyan/10 border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black',
  secondary: 'bg-cyber-purple/10 border-2 border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-white',
  ghost: 'bg-transparent border-2 border-transparent text-gray-400 hover:border-gray-600 hover:text-white',
  danger: 'bg-cyber-pink/10 border-2 border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-white',
  success: 'bg-green-500/10 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'p-2',
};

const glowStyles = {
  primary: 'shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]',
  secondary: 'shadow-[0_0_20px_rgba(157,0,255,0.3)] hover:shadow-[0_0_30px_rgba(157,0,255,0.6)]',
  ghost: '',
  danger: 'shadow-[0_0_20px_rgba(255,0,128,0.3)] hover:shadow-[0_0_30px_rgba(255,0,128,0.6)]',
  success: 'shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      disabled = false,
      leftIcon,
      rightIcon,
      glowEffect = true,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'relative inline-flex items-center justify-center gap-2',
          'font-bold uppercase tracking-wider',
          'transition-all duration-300',
          'rounded-lg backdrop-blur-sm',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantStyles[variant],
          sizeStyles[size],
          glowEffect && glowStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// Legacy TestButton export for backwards compatibility
export const TestButton = Button;
export default Button;

// Card Component
export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'neon' | 'holographic';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
}

const variantCardStyles = {
  default: 'bg-card border border-gray-800',
  glass: 'bg-white/5 backdrop-blur-lg border border-white/10',
  neon: 'bg-transparent border-2',
  holographic: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20',
};

const paddingCardStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const glowCardStyles = {
  cyan: 'border-cyber-cyan shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)]',
  purple: 'border-cyber-purple shadow-[0_0_30px_rgba(157,0,255,0.3)] hover:shadow-[0_0_50px_rgba(157,0,255,0.5)]',
  pink: 'border-cyber-pink shadow-[0_0_30px_rgba(255,0,128,0.3)] hover:shadow-[0_0_50px_rgba(255,0,128,0.5)]',
  green: 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)]',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = true,
      glowColor = 'cyan',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses = cn(
      'rounded-xl',
      'transition-all duration-300',
      variantCardStyles[variant],
      paddingCardStyles[padding],
      variant === 'neon' && glowCardStyles[glowColor],
      hover && 'hover:scale-[1.02] hover:translate-y-[-4px]',
      className
    );

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={hover ? { scale: 1.02 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
export const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('mb-4', className)}>{children}</div>
);

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={cn('text-xl font-bold text-glow-cyan', className)}>{children}</h3>
);

export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <p className={cn('text-gray-400 mt-1', className)}>{children}</p>
);

export const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('space-y-4', className)}>{children}</div>
);

export const CardFooter = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn('mt-6 pt-4 border-t border-gray-800', className)}>{children}</div>
);

// Input Component
export interface InputProps extends Omit<HTMLMotionProps<'input'>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'neon' | 'minimal';
  icon?: 'search' | 'email' | 'lock' | React.ReactNode;
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'url';
  showPasswordToggle?: boolean;
}

const inputVariantStyles = {
  default: 'bg-gray-900/50 border-2 border-gray-700 focus:border-cyber-cyan',
  neon: 'bg-transparent border-2 border-cyber-cyan/50 focus:border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)]',
  minimal: 'bg-transparent border-b-2 border-gray-700 focus:border-cyber-cyan rounded-none px-0',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      variant = 'default',
      icon,
      type = 'text',
      showPasswordToggle = false,
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const renderIcon = () => {
      if (icon === 'search') return <motion.svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></motion.svg>;
      if (icon === 'email') return <motion.svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></motion.svg>;
      if (React.isValidElement(icon)) return icon;
      return null;
    };

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">{renderIcon()}</div>
          )}
          <motion.input
            ref={ref}
            type={showPasswordToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type}
            className={cn(
              'w-full px-4 py-3',
              'rounded-lg',
              'text-white placeholder-gray-500',
              'transition-all duration-300',
              'outline-none',
              'focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              inputVariantStyles[variant],
              error && 'border-cyber-pink focus:border-cyber-pink',
              icon && 'pl-11',
              showPasswordToggle && 'pr-11',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
            {...props}
          />
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <motion.svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></motion.svg>
              ) : (
                <motion.svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></motion.svg>
              )}
            </button>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-cyber-pink"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Badge Component
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
}

const badgeVariantStyles = {
  default: 'bg-gray-800/50 text-gray-300 border border-gray-700',
  primary: 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30',
  secondary: 'bg-cyber-purple/10 text-cyber-purple border border-cyber-purple/30',
  success: 'bg-green-500/10 text-green-500 border border-green-500/30',
  warning: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30',
  danger: 'bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/30',
};

const badgeSizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const badgeGlowStyles = {
  default: '',
  primary: 'shadow-[0_0_10px_rgba(0,240,255,0.3)]',
  secondary: 'shadow-[0_0_10px_rgba(157,0,255,0.3)]',
  success: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
  warning: 'shadow-[0_0_10px_rgba(234,179,8,0.3)]',
  danger: 'shadow-[0_0_10px_rgba(255,0,128,0.3)]',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  glow = false,
  className,
}: BadgeProps) {
  return (
    <motion.span
      className={cn(
        'inline-flex items-center',
        'rounded-full font-medium',
        'backdrop-blur-sm',
        badgeVariantStyles[variant],
        badgeSizeStyles[size],
        glow && badgeGlowStyles[variant],
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.span  >
  );
}

// Skeleton Component
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const skeletonVariantStyles = {
  text: 'rounded max-w-sm',
  circular: 'rounded-full',
  rectangular: 'rounded-none',
  rounded: 'rounded-lg',
};

export function Skeleton({
  className,
  variant = 'rounded',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  return (
    <motion.div
      className={cn(
        'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800',
        skeletonVariantStyles[variant],
        className
      )}
      style={{ width, height }}
      animate={
        animation === 'pulse'
          ? { opacity: [0.5, 1, 0.5] }
          : animation === 'wave'
          ? { x: ['-100%', '100%'] }
          : {}
      }
      transition={
        animation === 'pulse'
          ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          : animation === 'wave'
          ? { duration: 1.5, repeat: Infinity, ease: 'linear' }
          : {}
      }
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-gray-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="80%" height={16} />
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
      <Skeleton variant="rectangular" width="100%" height={200} />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </div>
        <Skeleton variant="text" width="100%" height={28} />
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="70%" height={16} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Export cn for use in other components
export { cn };

// Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const modalSizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, children, title, size = 'md', className }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        className={cn(
          'relative bg-card border border-cyber-cyan/30 rounded-xl',
          'shadow-[0_0_50px_rgba(0,240,255,0.3)]',
          modalSizeStyles[size],
          'w-full max-h-[90vh] overflow-auto',
          className
        )}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-glow-cyan">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <motion.svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></motion.svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// Tooltip Component
export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({ content, children, position = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionStyles = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <motion.div
        className={cn(
          'absolute z-50 px-3 py-2',
          'bg-gray-900 border border-cyber-cyan/30',
          'text-white text-sm rounded-lg',
          'whitespace-nowrap',
          'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
          positionStyles[position],
          className
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    </div>
  );
}

// Progress Bar Component
export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const progressVariantStyles = {
  cyan: 'shadow-[0_0_10px_rgba(0,240,255,0.5)]',
  purple: 'shadow-[0_0_10px_rgba(157,0,255,0.5)]',
  pink: 'shadow-[0_0_10px_rgba(255,0,128,0.5)]',
  green: 'shadow-[0_0_10px_rgba(34,197,94,0.5)]',
};

const progressColorStyles = {
  cyan: 'bg-cyber-cyan',
  purple: 'bg-cyber-purple',
  pink: 'bg-cyber-pink',
  green: 'bg-green-500',
};

const progressSizeStyles = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'cyan',
  size = 'md',
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn('space-y-2', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-gray-400">{label}</span>}
          {showLabel && <span className="text-white">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={cn(
        'w-full bg-gray-800 rounded-full overflow-hidden',
        progressSizeStyles[size]
      )}>
        <motion.div
          className={cn(
            'h-full rounded-full',
            progressColorStyles[variant],
            progressVariantStyles[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Tabs Component
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  variant?: 'default' | 'neon' | 'pill';
  className?: string;
}

export function Tabs({ tabs, defaultTab, variant = 'default', className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id);

  const tabVariantStyles = {
    default: 'border-b-2 border-transparent data-[active=true]:border-cyber-cyan data-[active=true]:text-cyber-cyan',
    neon: 'border data-[active=true]:border-cyber-cyan data-[active=true]:bg-cyber-cyan/10',
    pill: 'rounded-lg data-[active=true]:bg-cyber-cyan data-[active=true]:text-black',
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Tab Headers */}
      <div className={cn(
        'flex gap-2',
        variant === 'default' ? 'border-b border-gray-800' : ''
      )}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-active={activeTab === tab.id}
            className={cn(
              'flex items-center gap-2 px-4 py-2',
              'text-sm font-medium',
              'transition-all duration-200',
              'text-gray-400 hover:text-white',
              tabVariantStyles[variant]
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </motion.div>
    </div>
  );
}

// Divider Component
export interface DividerProps {
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: 'cyan' | 'purple' | 'pink' | 'gray';
  label?: string;
  className?: string;
}

const dividerVariantStyles = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

const dividerColorStyles = {
  cyan: 'border-cyber-cyan/30',
  purple: 'border-cyber-purple/30',
  pink: 'border-cyber-pink/30',
  gray: 'border-gray-800',
};

export function Divider({ variant = 'solid', color = 'gray', label, className }: DividerProps) {
  return (
    <div className={cn('relative my-6', className)}>
      <div className={cn(
        'border-t',
        dividerVariantStyles[variant],
        dividerColorStyles[color]
      )} />
      {label && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-4 text-sm text-gray-400">
          {label}
        </span>
      )}
    </div>
  );
}
