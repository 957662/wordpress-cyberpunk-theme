'use client';

/**
 * ScrollToTop - 滚动到顶部按钮
 * 当页面向下滚动一定距离后显示，点击平滑滚动到顶部
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
  smooth?: boolean;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 300,
  className,
  smooth = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > threshold);
    };

    // 初始检查
    handleScroll();

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
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
          className={cn(
            'fixed bottom-8 right-8 z-40',
            'w-12 h-12',
            'bg-gradient-to-r from-cyan-500 to-purple-500',
            'text-white',
            'rounded-full',
            'shadow-lg shadow-cyan-500/30',
            'flex items-center justify-center',
            'hover:shadow-xl hover:shadow-cyan-500/50',
            'hover:scale-110',
            'active:scale-95',
            'transition-all',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900',
            className
          )}
          aria-label="滚动到顶部"
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
