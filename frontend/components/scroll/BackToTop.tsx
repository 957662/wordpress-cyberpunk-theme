/**
 * BackToTop Component
 *
 * Scroll-to-top button with cyberpunk styling.
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export interface BackToTopProps {
  /** Minimum scroll distance before showing button (in pixels) */
  showAt?: number;
  /** Scroll behavior when clicking the button */
  behavior?: ScrollBehavior;
  /** Position of the button */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const positionClasses = {
  'bottom-right': 'bottom-8 right-8',
  'bottom-left': 'bottom-8 left-8',
  'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
};

export function BackToTop({
  showAt = 300,
  behavior = 'smooth',
  position = 'bottom-right',
  size = 'md',
  className = '',
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAt);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAt]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior,
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className={`
            fixed ${positionClasses[position]}
            ${sizeClasses[size]}
            z-50
            flex items-center justify-center
            rounded-full
            bg-gradient-to-r from-cyber-cyan to-cyber-purple
            text-white
            shadow-lg shadow-cyber-cyan/20
            hover:shadow-xl hover:shadow-cyber-cyan/40
            transition-all duration-300
            hover:scale-110
            active:scale-95
            ${className}
          `}
        >
          <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default BackToTop;
