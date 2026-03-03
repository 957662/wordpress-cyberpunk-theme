'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

const themes = [
  { value: 'light' as Theme, icon: Sun, label: '浅色' },
  { value: 'dark' as Theme, icon: Moon, label: '深色' },
  { value: 'system' as Theme, icon: Monitor, label: '跟随系统' }
];

export function ThemeSwitcher({ className, showLabel = false }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取主题
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  const getCurrentThemeIcon = () => {
    return themes.find(t => t.value === currentTheme)?.icon || Monitor;
  };

  const CurrentIcon = getCurrentThemeIcon();

  return (
    <div className={cn('relative', className)}>
      {/* 主题切换按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          'bg-gray-900/50 border border-cyan-500/30',
          'text-white hover:border-cyan-500/50',
          'transition-all duration-200'
        )}
      >
        <CurrentIcon size={18} className="text-cyan-400" />
        {showLabel && (
          <span className="text-sm">
            {themes.find(t => t.value === currentTheme)?.label}
          </span>
        )}
      </motion.button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩 */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* 菜单 */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-50 mt-2 w-48 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-xl shadow-cyan-500/20 overflow-hidden"
            >
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isActive = currentTheme === theme.value;

                return (
                  <motion.button
                    key={theme.value}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange(theme.value)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3',
                      'transition-all duration-200',
                      isActive ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    )}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{theme.label}</span>
                    
                    {isActive && (
                      <motion.div
                        layoutId="activeTheme"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"
                      />
                    )}
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

// 主题颜色选择器
export interface ThemeColorProps {
  colors: string[];
  currentColor: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ThemeColorSelector({ colors, currentColor, onChange, className }: ThemeColorProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {colors.map((color) => (
        <motion.button
          key={color}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(color)}
          className={cn(
            'w-8 h-8 rounded-full border-2 transition-all duration-200',
            currentColor === color ? 'border-white scale-110' : 'border-transparent'
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

// 字体大小选择器
export interface FontSizeSelectorProps {
  currentSize: 'sm' | 'md' | 'lg';
  onChange: (size: 'sm' | 'md' | 'lg') => void;
  className?: string;
}

export function FontSizeSelector({ currentSize, onChange, className }: FontSizeSelectorProps) {
  const sizes = [
    { value: 'sm' as const, label: '小', size: 'text-sm' },
    { value: 'md' as const, label: '中', size: 'text-base' },
    { value: 'lg' as const, label: '大', size: 'text-lg' }
  ];

  return (
    <div className={cn('flex items-center gap-2 p-1 bg-gray-900/50 rounded-lg', className)}>
      {sizes.map((size) => (
        <motion.button
          key={size.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(size.value)}
          className={cn(
            'px-4 py-2 rounded-md font-medium transition-all duration-200',
            currentSize === size.value
              ? 'bg-cyan-500 text-white'
              : 'text-gray-400 hover:text-white'
          )}
        >
          {size.label}
        </motion.button>
      ))}
    </div>
  );
}
