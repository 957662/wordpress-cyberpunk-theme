/**
 * useTheme Hook
 * 用于管理主题切换
 */

import { useEffect } from 'react';
import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark' | 'neon';
  primaryColor: 'cyan' | 'purple' | 'pink' | 'yellow';
  setTheme: (theme: 'light' | 'dark' | 'neon') => void;
  setPrimaryColor: (color: 'cyan' | 'purple' | 'pink' | 'yellow') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: (typeof window !== 'undefined' ? (localStorage.getItem('theme') as any) : null) || 'dark',
  primaryColor:
    (typeof window !== 'undefined' ? (localStorage.getItem('primaryColor') as any) : null) ||
    'cyan',
  setTheme: theme => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.remove('light', 'dark', 'neon');
      document.documentElement.classList.add(theme);
    }
  },
  setPrimaryColor: color => {
    set({ primaryColor: color });
    if (typeof window !== 'undefined') {
      localStorage.setItem('primaryColor', color);
      document.documentElement.setAttribute('data-primary', color);
    }
  },
  toggleTheme: () => {
    const themes: Array<'light' | 'dark' | 'neon'> = ['light', 'dark', 'neon'];
    const currentIndex = themes.indexOf(get().theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    get().setTheme(nextTheme);
  },
}));

export function useTheme() {
  const { theme, primaryColor, setTheme, setPrimaryColor, toggleTheme } = useThemeStore();

  useEffect(() => {
    // 初始化主题
    document.documentElement.classList.remove('light', 'dark', 'neon');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-primary', primaryColor);

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, primaryColor, setTheme]);

  return {
    theme,
    primaryColor,
    setTheme,
    setPrimaryColor,
    toggleTheme,
    isDark: theme === 'dark' || theme === 'neon',
  };
}
