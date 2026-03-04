'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ArrowUpToLine } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  showPercent?: boolean;
  variant?: 'neon' | 'holographic' | 'minimal';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
  offset?: number;
}

const sizeStyles = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const iconSizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const colorStyles = {
  cyan: {
    bg: 'bg-cyber-cyan/20 hover:bg-cyber-cyan/30',
    border: 'border-cyber-cyan/50',
    text: 'text-cyber-cyan',
    shadow: 'shadow-lg shadow-cyber-cyan/20',
  },
  purple: {
    bg: 'bg-cyber-purple/20 hover:bg-cyber-purple/30',
    border: 'border-cyber-purple/50',
    text: 'text-cyber-purple',
    shadow: 'shadow-lg shadow-cyber-purple/20',
  },
  pink: {
    bg: 'bg-cyber-pink/20 hover:bg-cyber-pink/30',
    border: 'border-cyber-pink/50',
    text: 'text-cyber-pink',
    shadow: 'shadow-lg shadow-cyber-pink/20',
  },
  green: {
    bg: 'bg-cyber-green/20 hover:bg-cyber-green/30',
    border: 'border-cyber-green/50',
    text: 'text-cyber-green',
    shadow: 'shadow-lg shadow-cyber-green/20',
  },
};

const variantStyles = {
  neon: 'border-2 backdrop-blur-sm',
  holographic: 'border border-white/20 backdrop-blur-md',
  minimal: 'border border-gray-700',
};

const positionStyles = {
  'bottom-right': 'bottom-8 right-8',
  'bottom-left': 'bottom-8 left-8',
  'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
};

export function BackToTop({
  threshold = 300,
  smooth = true,
  showPercent = false,
  variant = 'neon',
  color = 'cyan',
  size = 'md',
  position = 'bottom-right',
  className,
  offset = 0,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsVisible(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    const scrollOptions: ScrollToOptions = {
      top: 0,
      behavior: smooth ? 'smooth' : 'instant',
    };
    window.scrollTo(scrollOptions);
  };

  const styles = colorStyles[color];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className={cn(
            'fixed z-50 flex items-center justify-center rounded-full transition-all duration-300',
            'hover:scale-110 active:scale-95',
            sizeStyles[size],
            variantStyles[variant],
            styles.bg,
            styles.border,
            styles.text,
            styles.shadow,
            positionStyles[position],
            className
          )}
          style={{ bottom: offset }}
          aria-label="Back to top"
        >
          {showPercent ? (
            <div className="flex flex-col items-center">
              <span className={cn('text-xs font-bold', styles.text)}>
                {Math.round(scrollProgress)}%
              </span>
              <ChevronUp className={cn(iconSizeStyles[size], styles.text)} />
            </div>
          ) : (
            <ChevronUp className={cn(iconSizeStyles[size], styles.text)} />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// 进度条样式回到顶部
export interface BackToTopWithProgressProps extends Omit<BackToTopProps, 'showPercent'> {}

export function BackToTopWithProgress(props: BackToTopWithProgressProps) {
  return <BackToTop {...props} showPercent />;
}

// 带圆形进度条的版本
export function BackToTopWithCircularProgress({
  threshold = 300,
  smooth = true,
  variant = 'neon',
  color = 'cyan',
  size = 'md',
  position = 'bottom-right',
  className,
  offset = 0,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsVisible(scrollTop > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    const scrollOptions: ScrollToOptions = {
      top: 0,
      behavior: smooth ? 'smooth' : 'instant',
    };
    window.scrollTo(scrollOptions);
  };

  const styles = colorStyles[color];
  const sizeValue = { sm: 40, md: 48, lg: 56 }[size];
  const strokeWidth = 3;
  const radius = (sizeValue - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            'fixed z-50 flex items-center justify-center rounded-full transition-all duration-300',
            'hover:scale-110 active:scale-95',
            variantStyles[variant],
            styles.bg,
            styles.border,
            styles.shadow,
            positionStyles[position],
            className
          )}
          style={{ bottom: offset, width: sizeValue, height: sizeValue }}
          aria-label="Back to top"
        >
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox={`0 0 ${sizeValue} ${sizeValue}`}
          >
            {/* 背景圆 */}
            <circle
              cx={sizeValue / 2}
              cy={sizeValue / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="opacity-20"
            />
            {/* 进度圆 */}
            <motion.circle
              cx={sizeValue / 2}
              cy={sizeValue / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn(styles.text)}
              initial={false}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.3 }}
            />
          </svg>
          <ArrowUpToLine
            className={cn(
              iconSizeStyles[size],
              styles.text,
              isHovered && 'scale-110'
            )}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// 默认导出
export default BackToTop;
