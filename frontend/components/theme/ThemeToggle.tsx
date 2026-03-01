'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export type Theme = 'dark' | 'neon' | 'cyber' | 'matrix';

interface ThemeOption {
  value: Theme;
  name: string;
  icon: string;
  preview: string;
}

const themes: ThemeOption[] = [
  {
    value: 'dark',
    name: 'Dark',
    icon: '🌙',
    preview: 'from-gray-900 to-gray-800',
  },
  {
    value: 'neon',
    name: 'Neon',
    icon: '💡',
    preview: 'from-cyan-500 to-purple-500',
  },
  {
    value: 'cyber',
    name: 'Cyber',
    icon: '🤖',
    preview: 'from-pink-500 to-yellow-500',
  },
  {
    value: 'matrix',
    name: 'Matrix',
    icon: '💊',
    preview: 'from-green-500 to-green-700',
  },
];

interface ThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  className?: string;
}

export function ThemeToggle({
  currentTheme,
  onThemeChange,
  className = '',
}: ThemeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentThemeObj = themes.find((t) => t.value === currentTheme) || themes[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-theme-toggle]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} data-theme-toggle>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-cyan-500/20 rounded-lg hover:border-cyan-500/50 transition-colors"
      >
        <span className="text-xl">{currentThemeObj.icon}</span>
        <span className="text-cyan-300 text-sm font-medium hidden sm:inline">
          {currentThemeObj.name}
        </span>
        <svg
          className={`w-4 h-4 text-cyan-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full mt-2 right-0 w-56 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden z-50"
        >
          <div className="p-2">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => {
                  onThemeChange(theme.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cyan-500/10 transition-all mb-1 last:mb-0 ${
                  theme.value === currentTheme ? 'bg-cyan-500/20' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.preview}`}
                />
                <div className="flex-1 text-left">
                  <div className="text-cyan-100 text-sm font-medium">
                    {theme.name}
                  </div>
                </div>
                <span className="text-xl">{theme.icon}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
