/**
 * 赛博朋克主题 Hook
 */

'use client';

import { useEffect, useState } from 'react';

export type CyberTheme = 'cyber-dark' | 'cyber-light' | 'cyber-matrix';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

const themeConfigs: Record<CyberTheme, ThemeColors> = {
  'cyber-dark': {
    primary: '#00f0ff',
    secondary: '#9d00ff',
    accent: '#ff0080',
    background: '#0a0a0f',
    surface: '#16162a',
    text: '#ffffff',
    border: '#2a2a4a',
  },
  'cyber-light': {
    primary: '#0066ff',
    secondary: '#7c00ff',
    accent: '#ff0066',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#1a1a1a',
    border: '#e0e0e0',
  },
  'cyber-matrix': {
    primary: '#00ff00',
    secondary: '#00cc00',
    accent: '#00ff88',
    background: '#000000',
    surface: '#001100',
    text: '#00ff00',
    border: '#003300',
  },
};

export function useCyberTheme() {
  const [theme, setThemeState] = useState<CyberTheme>('cyber-dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('cyber-theme') as CyberTheme;
    if (savedTheme && themeConfigs[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const colors = themeConfigs[theme];

    // 设置 CSS 变量
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // 保存到 localStorage
    localStorage.setItem('cyber-theme', theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: CyberTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const themes: CyberTheme[] = ['cyber-dark', 'cyber-light', 'cyber-matrix'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    colors: themeConfigs[theme],
    mounted,
  };
}
