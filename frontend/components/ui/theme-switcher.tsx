'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Check, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export interface ThemeOption {
  value: string;
  name: string;
  icon: React.ReactNode;
  description?: string;
  preview?: string;
}

export interface ThemeSwitcherProps {
  themes?: ThemeOption[];
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
  variant?: 'neon' | 'holographic' | 'minimal';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  displayType?: 'dropdown' | 'buttons' | 'list' | 'toggle';
  showDescriptions?: boolean;
  className?: string;
}

const defaultThemes: ThemeOption[] = [
  {
    value: 'light',
    name: 'Light',
    icon: <Sun className="w-4 h-4" />,
    description: '明亮模式',
  },
  {
    value: 'dark',
    name: 'Dark',
    icon: <Moon className="w-4 h-4" />,
    description: '深色模式',
  },
  {
    value: 'cyber',
    name: 'Cyber',
    icon: <Palette className="w-4 h-4" />,
    description: '赛博朋克',
  },
];

const colorStyles = {
  cyan: {
    border: 'border-cyber-cyan/50',
    text: 'text-cyber-cyan',
    bg: 'bg-cyber-cyan/20',
    hover: 'hover:bg-cyber-cyan/30',
    glow: 'shadow-lg shadow-cyber-cyan/20',
  },
  purple: {
    border: 'border-cyber-purple/50',
    text: 'text-cyber-purple',
    bg: 'bg-cyber-purple/20',
    hover: 'hover:bg-cyber-purple/30',
    glow: 'shadow-lg shadow-cyber-purple/20',
  },
  pink: {
    border: 'border-cyber-pink/50',
    text: 'text-cyber-pink',
    bg: 'bg-cyber-pink/20',
    hover: 'hover:bg-cyber-pink/30',
    glow: 'shadow-lg shadow-cyber-pink/20',
  },
  green: {
    border: 'border-cyber-green/50',
    text: 'text-cyber-green',
    bg: 'bg-cyber-green/20',
    hover: 'hover:bg-cyber-green/30',
    glow: 'shadow-lg shadow-cyber-green/20',
  },
};

const variantStyles = {
  neon: 'border-2 bg-cyber-dark/80 backdrop-blur-sm',
  holographic: 'border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md',
  minimal: 'border border-gray-700 bg-gray-900/50',
};

export function ThemeSwitcher({
  themes = defaultThemes,
  currentTheme: controlledTheme,
  onThemeChange,
  variant = 'neon',
  color = 'cyan',
  displayType = 'dropdown',
  showDescriptions = false,
  className,
}: ThemeSwitcherProps) {
  const { theme: contextTheme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = controlledTheme ?? contextTheme ?? resolvedTheme ?? 'dark';
  const styles = colorStyles[color];
  const currentThemeOption = themes.find((t) => t.value === currentTheme) || themes[0];

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
    setIsOpen(false);
  };

  // Toggle 模式
  if (displayType === 'toggle') {
    return (
      <motion.button
        onClick={() => handleThemeChange(currentTheme === 'dark' ? 'light' : 'dark')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative w-16 h-8 rounded-full p-1 transition-colors duration-300',
          'border-2',
          styles.border,
          currentTheme === 'dark' ? styles.bg : 'bg-gray-700'
        )}
        aria-label="Toggle theme"
      >
        <motion.div
          className={cn('w-6 h-6 rounded-full flex items-center justify-center', styles.text)}
          animate={{ x: currentTheme === 'dark' ? 32 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {currentTheme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </motion.div>
      </motion.button>
    );
  }

  // Buttons 模式
  if (displayType === 'buttons') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {themes.map((theme) => {
          const isActive = theme.value === currentTheme;
          return (
            <motion.button
              key={theme.value}
              onClick={() => handleThemeChange(theme.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2',
                'border-2',
                isActive
                  ? `${styles.bg} ${styles.text} ${styles.glow} ${styles.border}`
                  : 'bg-cyber-dark/50 text-gray-400 hover:text-white hover:bg-cyber-dark/80 border-gray-700'
              )}
            >
              {theme.icon}
              <span>{theme.name}</span>
              {isActive && <Check className="w-4 h-4" />}
            </motion.button>
          );
        })}
      </div>
    );
  }

  // List 模式
  if (displayType === 'list') {
    return (
      <div className={cn('space-y-2', className)}>
        {themes.map((theme) => {
          const isActive = theme.value === currentTheme;
          return (
            <motion.button
              key={theme.value}
              onClick={() => handleThemeChange(theme.value)}
              whileHover={{ x: 5 }}
              className={cn(
                'w-full px-4 py-3 rounded-lg font-medium transition-all duration-300',
                'flex items-center justify-between border-2',
                isActive
                  ? `${styles.bg} ${styles.text} ${styles.glow} ${styles.border}`
                  : 'bg-cyber-dark/50 text-gray-400 hover:text-white hover:bg-cyber-dark/80 border-gray-700'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', isActive && styles.bg)}>
                  {theme.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{theme.name}</div>
                  {showDescriptions && theme.description && (
                    <div className="text-xs opacity-70">{theme.description}</div>
                  )}
                </div>
              </div>
              {isActive && <Check className="w-4 h-4" />}
            </motion.button>
          );
        })}
      </div>
    );
  }

  // Dropdown (default)
  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300',
          variantStyles[variant],
          styles.border,
          styles.text,
          isOpen && styles.glow
        )}
      >
        <Palette className="w-4 h-4" />
        <span>{currentThemeOption.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute z-20 mt-2 py-2 rounded-lg border-2 min-w-[200px]',
                variantStyles[variant],
                styles.border,
                styles.glow
              )}
            >
              {themes.map((theme) => {
                const isActive = theme.value === currentTheme;
                return (
                  <motion.button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    whileHover={{ x: 5 }}
                    className={cn(
                      'w-full px-4 py-2 flex items-center gap-3 transition-colors duration-200',
                      isActive ? styles.text : 'text-gray-400 hover:text-white'
                    )}
                  >
                    <div className={cn('p-1 rounded', isActive && styles.bg)}>
                      {theme.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div>{theme.name}</div>
                      {showDescriptions && theme.description && (
                        <div className="text-xs opacity-70">{theme.description}</div>
                      )}
                    </div>
                    {isActive && <Check className="w-4 h-4" />}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// 简单的明暗切换按钮
export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
}

const sizeStyles = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function ThemeToggle({
  className,
  size = 'md',
  color = 'cyan',
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const styles = colorStyles[color];

  const toggleTheme = () => {
    setIsAnimating(true);
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'flex items-center justify-center rounded-lg transition-all duration-300',
        'border-2',
        variantStyles.neon,
        styles.border,
        styles.text,
        styles.glow,
        sizeStyles[size],
        className
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// 系统主题检测 + 自动切换
export function AutoThemeSwitcher({
  className,
  color = 'cyan',
}: {
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
}) {
  const { theme, systemTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const styles = colorStyles[color];

  const themes: ThemeOption[] = [
    {
      value: 'system',
      name: 'System',
      icon: <Monitor className="w-4 h-4" />,
      description: `跟随系统 (${systemTheme})`,
    },
    {
      value: 'light',
      name: 'Light',
      icon: <Sun className="w-4 h-4" />,
      description: '明亮模式',
    },
    {
      value: 'dark',
      name: 'Dark',
      icon: <Moon className="w-4 h-4" />,
      description: '深色模式',
    },
  ];

  const displayTheme = theme === 'system' ? systemTheme : theme;
  const currentThemeOption = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className={cn('relative', className)}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300',
          variantStyles[variant],
          styles.border,
          styles.text,
          isOpen && styles.glow
        )}
      >
        {currentThemeOption.icon}
        <span>{currentThemeOption.name}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={cn(
                'absolute z-20 mt-2 py-2 rounded-lg border-2 min-w-[200px]',
                variantStyles[variant],
                styles.border,
                styles.glow
              )}
            >
              {themes.map((themeOption) => {
                const isActive = themeOption.value === theme;
                return (
                  <motion.button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setIsOpen(false);
                    }}
                    whileHover={{ x: 5 }}
                    className={cn(
                      'w-full px-4 py-2 flex items-center gap-3 transition-colors duration-200',
                      isActive ? styles.text : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {themeOption.icon}
                    <div className="flex-1 text-left">
                      <div>{themeOption.name}</div>
                      {themeOption.description && (
                        <div className="text-xs opacity-70">{themeOption.description}</div>
                      )}
                    </div>
                    {isActive && <Check className="w-4 h-4" />}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThemeSwitcher;
