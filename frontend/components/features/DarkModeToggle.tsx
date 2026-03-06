/**
 * Dark Mode Toggle 组件
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DarkModeToggleProps {
  className?: string;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center justify-center',
        'w-14 h-7 rounded-full',
        'bg-cyber-muted/20 border border-cyber-cyan/30',
        'hover:border-cyber-cyan/60 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
    >
      <motion.div
        className="absolute w-5 h-5 rounded-full bg-cyber-cyan shadow-lg"
        animate={{ left: isDark ? 'calc(100% - 24px)' : '4px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-between px-2"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1 }}
      >
        <Sun className="w-3 h-3 text-yellow-400 ml-1" />
        <div className="w-5" />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-between px-2"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
      >
        <div className="w-5" />
        <Moon className="w-3 h-3 text-blue-300 mr-1" />
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
