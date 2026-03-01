/**
 * BackToTop Component
 * 返回顶部组件
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useScroll } from '@/lib/hooks';

/**
 * BackToTop 组件属性
 */
export interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  className?: string;
  variant?: 'default' | 'cyber' | 'minimal';
}

/**
 * BackToTop 组件
 */
export function BackToTop({
  threshold = 300,
  smooth = true,
  className,
  variant = 'cyber'
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setIsVisible(scrollY > threshold);
  }, [scrollY, threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className={cn(
            'fixed bottom-8 right-8 z-50',
            'flex items-center justify-center',
            'w-12 h-12 rounded-full',
            'shadow-lg',
            'transition-all duration-200',
            'hover:scale-110',
            variant === 'cyber' && 'bg-cyber-cyan text-black hover:bg-cyber-pink shadow-neon',
            variant === 'default' && 'bg-gray-800 text-white hover:bg-gray-700',
            variant === 'minimal' && 'bg-white/80 backdrop-blur text-gray-800 hover:bg-white',
            className
          )}
          aria-label="返回顶部"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * 进度指示器版本
 */
export interface BackToTopWithProgressProps extends BackToTopProps {
  showProgress?: boolean;
  progressColor?: string;
}

export function BackToTopWithProgress({
  showProgress = true,
  progressColor = '#00f0ff',
  ...props
}: BackToTopWithProgressProps) {
  const { scrollY, scrollDirection } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;
    const progress = (scrollY / maxScroll) * 100;
    setScrollProgress(Math.min(progress, 100));
  }, [scrollY]);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* 环形进度条 */}
      {showProgress && (
        <svg className="absolute w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={progressColor}
            strokeWidth="3"
            strokeDasharray={125.6}
            strokeDashoffset={125.6 - (125.6 * scrollProgress) / 100}
            strokeLinecap="round"
            className="transition-all duration-150"
          />
        </svg>
      )}

      <BackToTop {...props} />
    </div>
  );
}
