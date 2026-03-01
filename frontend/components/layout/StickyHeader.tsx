'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface StickyHeaderProps {
  children: ReactNode;
  threshold?: number;
  className?: string;
  stickyClassName?: string;
}

export function StickyHeader({
  children,
  threshold = 50,
  className = '',
  stickyClassName = '',
}: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, threshold], [0, 1]);
  const scale = useTransform(scrollY, [0, threshold], [0.95, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-cyan-500/30 ${stickyClassName}`}
        style={{ opacity, scale }}
      >
        {children}
      </motion.header>
      {!isSticky && (
        <header className={className}>
          {children}
        </header>
      )}
    </>
  );
}
