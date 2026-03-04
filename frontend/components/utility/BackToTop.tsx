/**
 * 返回顶部组件
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  className?: string;
  showDuration?: number;
}

export function BackToTop({
  threshold = 300,
  smooth = true,
  className,
  showDuration = 300,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    setIsAnimating(true);

    const scrollTo = () => {
      if (smooth) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo(0, 0);
      }
    };

    scrollTo();

    setTimeout(() => {
      setIsAnimating(false);
    }, showDuration);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          disabled={isAnimating}
          className={cn(
            'fixed bottom-8 right-8 z-50',
            'flex items-center justify-center',
            'w-12 h-12 rounded-full',
            'bg-cyber-cyan text-cyber-dark',
            'border-2 border-cyber-cyan',
            'shadow-neon-cyan',
            'hover:scale-110 active:scale-95',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          aria-label="返回顶部"
        >
          <motion.div
            animate={isAnimating ? { y: [-5, 0, -5] } : {}}
            transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.div>

          {/* 霓虹发光效果 */}
          <div className="absolute inset-0 rounded-full bg-cyber-cyan opacity-30 blur-md animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
