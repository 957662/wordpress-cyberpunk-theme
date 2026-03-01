/**
 * 主题上下文
 */

'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/lib/hooks';
import { ThemeMode } from '@/types';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: ThemeMode[] = ['dark', 'neon', 'matrix'];

const themeClasses = {
  dark: '',
  neon: 'theme-neon',
  matrix: 'theme-matrix',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<ThemeMode>('cyberpress-theme', 'dark');

  useEffect(() => {
    const root = document.documentElement;

    // 移除所有主题类
    themes.forEach((t) => {
      root.classList.remove(themeClasses[t]);
    });

    // 添加当前主题类
    if (theme !== 'dark') {
      root.classList.add(themeClasses[theme]);
    }
  }, [theme]);

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
