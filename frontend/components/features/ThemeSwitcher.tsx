'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const themeConfig = {
  light: {
    icon: Sun,
    label: '浅色',
    description: '明亮主题',
  },
  dark: {
    icon: Moon,
    label: '深色',
    description: '暗黑主题',
  },
  system: {
    icon: Monitor,
    label: '系统',
    description: '跟随系统',
  },
};

export function ThemeSwitcher({ className, showLabel = false }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme>('system');
  const [isOpen, setIsOpen] = useState(false);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // 检测系统主题
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 从 localStorage 加载保存的主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // 应用主题到 document
  useEffect(() => {
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme);
    localStorage.setItem('theme', theme);
  }, [theme, systemTheme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const CurrentIcon = themeConfig[currentTheme].icon;

  return (
    <div className={cn('relative', className)}>
      {/* 主按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-cyber-card border border-cyber-border hover:border-cyber-cyan transition-colors"
        aria-label="切换主题"
      >
        <motion.div
          key={currentTheme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentIcon className="w-5 h-5 text-cyber-cyan" />
        </motion.div>

        {showLabel && (
          <span className="text-sm text-gray-300">
            {themeConfig[theme].label}
          </span>
        )}

        {/* 霓虹发光效果 */}
        <div className="absolute inset-0 rounded-lg bg-cyber-cyan/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 菜单 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 z-50 w-48 bg-cyber-card border border-cyber-border rounded-lg shadow-xl shadow-cyber-cyan/10 overflow-hidden"
            >
              <div className="p-1">
                {(Object.keys(themeConfig) as Theme[]).map((themeKey) => {
                  const { icon: Icon, label, description } = themeConfig[themeKey];
                  const isActive = theme === themeKey;

                  return (
                    <motion.button
                      key={themeKey}
                      whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeChange(themeKey)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all',
                        isActive && 'bg-cyber-cyan/10'
                      )}
                    >
                      <div
                        className={cn(
                          'p-1.5 rounded-md',
                          isActive
                            ? 'bg-cyber-cyan/20 text-cyber-cyan'
                            : 'bg-cyber-muted text-gray-400'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 text-left">
                        <div
                          className={cn(
                            'text-sm font-medium',
                            isActive ? 'text-white' : 'text-gray-300'
                          )}
                        >
                          {label}
                        </div>
                        <div className="text-xs text-gray-500">{description}</div>
                      </div>

                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-1.5 h-1.5 rounded-full bg-cyber-cyan"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* 底部装饰 */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// 主题切换器 Hook
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    const effectiveTheme = newTheme === 'system' ? systemTheme : newTheme;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(effectiveTheme);
  };

  return {
    theme,
    effectiveTheme,
    setTheme: changeTheme,
    systemTheme,
  };
}

// 紧凑版主题切换器
export function CompactThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes: Theme[] = ['light', 'dark', 'system'];
  const currentIndex = themes.indexOf(theme);

  const cycleTheme = () => {
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (effectiveTheme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9, rotate: -15 }}
      onClick={cycleTheme}
      className={cn(
        'p-2 rounded-lg bg-cyber-card border border-cyber-border',
        'hover:border-cyber-cyan hover:bg-cyber-cyan/10',
        'transition-all duration-300',
        className
      )}
      aria-label="切换主题"
    >
      <motion.div
        key={effectiveTheme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-cyber-cyan"
      >
        {getIcon()}
      </motion.div>
    </motion.button>
  );
}

// 主题状态指示器
export function ThemeIndicator({ className }: { className?: string }) {
  const { effectiveTheme } = useTheme();

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2 py-1 rounded-md',
        'bg-cyber-card border border-cyber-border',
        className
      )}
    >
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          effectiveTheme === 'dark'
            ? 'bg-cyber-purple animate-pulse'
            : 'bg-cyber-cyan animate-pulse'
        )}
      />
      <span className="text-xs text-gray-400">
        {effectiveTheme === 'dark' ? '暗黑' : '明亮'}
      </span>
    </div>
  );
}
