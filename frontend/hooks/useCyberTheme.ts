/**
 * useCyberTheme - 赛博朋克主题管理 Hook
 * 管理赛博朋克主题的颜色、模式等
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCyberColor, type CyberColor } from '@/lib/utils/cyber-helpers';

export interface CyberThemeConfig {
  color: CyberColor;
  darkMode: boolean;
  neonEffects: boolean;
  scanlines: boolean;
  particles: boolean;
}

const DEFAULT_THEME: CyberThemeConfig = {
  color: 'cyan',
  darkMode: true,
  neonEffects: true,
  scanlines: true,
  particles: true,
};

const STORAGE_KEY = 'cyber-theme';

export function useCyberTheme() {
  const [theme, setTheme] = useState<CyberThemeConfig>(DEFAULT_THEME);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载主题配置
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTheme(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 保存主题配置到 localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    }
  }, [theme, isLoaded]);

  // 应用主题到 DOM
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;

    // 应用暗色模式
    if (theme.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 应用效果类
    if (theme.neonEffects) {
      root.classList.add('neon-effects');
    } else {
      root.classList.remove('neon-effects');
    }

    if (theme.scanlines) {
      root.classList.add('scanlines');
    } else {
      root.classList.remove('scanlines');
    }

    if (theme.particles) {
      root.classList.add('particles');
    } else {
      root.classList.remove('particles');
    }
  }, [theme, isLoaded]);

  // 更新主题颜色
  const setColor = useCallback((color: CyberColor) => {
    setTheme(prev => ({ ...prev, color }));
  }, []);

  // 切换暗色模式
  const toggleDarkMode = useCallback(() => {
    setTheme(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  // 切换霓虹效果
  const toggleNeonEffects = useCallback(() => {
    setTheme(prev => ({ ...prev, neonEffects: !prev.neonEffects }));
  }, []);

  // 切换扫描线效果
  const toggleScanlines = useCallback(() => {
    setTheme(prev => ({ ...prev, scanlines: !prev.scanlines }));
  }, []);

  // 切换粒子效果
  const toggleParticles = useCallback(() => {
    setTheme(prev => ({ ...prev, particles: !prev.particles }));
  }, []);

  // 重置主题
  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME);
  }, []);

  // 获取当前颜色样式
  const colorStyles = getCyberColor(theme.color);

  return {
    theme,
    colorStyles,
    setColor,
    toggleDarkMode,
    toggleNeonEffects,
    toggleScanlines,
    toggleParticles,
    resetTheme,
    isLoaded,
  };
}

export default useCyberTheme;
