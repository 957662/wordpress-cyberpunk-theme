/**
 * useCyberTheme - 赛博朋克主题管理 Hook
 * 管理赛博朋克风格的颜色主题和特效设置
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';

// 主题颜色配置
export type CyberColor = 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'orange' | 'red' | 'blue';

export interface CyberTheme {
  primary: CyberColor;
  secondary: CyberColor;
  accent: CyberColor;
  intensity: number; // 特效强度 (1-10)
  enableGlitch: boolean;
  enableParticles: boolean;
  enableScanlines: boolean;
  enableGlow: boolean;
}

const defaultTheme: CyberTheme = {
  primary: 'cyan',
  secondary: 'purple',
  accent: 'pink',
  intensity: 5,
  enableGlitch: true,
  enableParticles: true,
  enableScanlines: true,
  enableGlow: true,
};

// 颜色映射
const colorMap: Record<CyberColor, string> = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  green: '#00ff88',
  yellow: '#f0ff00',
  orange: '#ff6600',
  red: '#ff0044',
  blue: '#0066ff',
};

// Zustand store
interface ThemeStore {
  theme: CyberTheme;
  setTheme: (theme: Partial<CyberTheme>) => void;
  resetTheme: () => void;
  setColor: (key: keyof CyberTheme, color: CyberColor) => void;
  toggleEffect: (effect: keyof Omit<CyberTheme, 'primary' | 'secondary' | 'accent' | 'intensity'>) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: defaultTheme,
  setTheme: (newTheme) =>
    set((state) => ({
      theme: { ...state.theme, ...newTheme },
    })),
  resetTheme: () => set({ theme: defaultTheme }),
  setColor: (key, color) =>
    set((state) => ({
      theme: { ...state.theme, [key]: color },
    })),
  toggleEffect: (effect) =>
    set((state) => ({
      theme: {
        ...state.theme,
        [effect]: !state.theme[effect as keyof CyberTheme],
      },
    })),
}));

/**
 * Hook: 使用赛博朋克主题
 */
export function useCyberTheme() {
  const { theme, setTheme, resetTheme, setColor, toggleEffect } = useThemeStore();

  // 从 localStorage 加载主题
  useEffect(() => {
    const saved = localStorage.getItem('cyber-theme');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Partial<CyberTheme>;
        setTheme(parsed);
      } catch (e) {
        console.error('Failed to parse saved theme:', e);
      }
    }
  }, [setTheme]);

  // 保存主题到 localStorage
  useEffect(() => {
    localStorage.setItem('cyber-theme', JSON.stringify(theme));
  }, [theme]);

  // 应用主题到 CSS 变量
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--cyber-primary', colorMap[theme.primary]);
    root.style.setProperty('--cyber-secondary', colorMap[theme.secondary]);
    root.style.setProperty('--cyber-accent', colorMap[theme.accent]);
    root.style.setProperty('--cyber-intensity', String(theme.intensity));
  }, [theme]);

  // 获取当前颜色值
  const getColor = useCallback(
    (colorName: CyberColor): string => {
      return colorMap[colorName];
    },
    []
  );

  // 生成渐变色
  const getGradient = useCallback(
    (from: CyberColor, to: CyberColor, angle = 135): string => {
      return `linear-gradient(${angle}deg, ${colorMap[from]}, ${colorMap[to]})`;
    },
    []
  );

  // 生成发光效果
  const getGlow = useCallback(
    (color: CyberColor, intensity = theme.intensity): string => {
      const alpha = intensity / 10;
      return `0 0 ${intensity * 3}px ${colorMap[color]}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
    },
    [theme.intensity]
  );

  // 生成文本发光
  const getTextGlow = useCallback(
    (color: CyberColor, layers = 3): string => {
      const colorValue = colorMap[color];
      const glows = Array.from({ length: layers }, (_, i) => {
        const spread = (i + 1) * 5;
        return `0 0 ${spread}px ${colorValue}`;
      });
      return glows.join(', ');
    },
    []
  );

  return {
    theme,
    setTheme,
    resetTheme,
    setColor,
    toggleEffect,
    getColor,
    getGradient,
    getGlow,
    getTextGlow,
  };
}

/**
 * Hook: 使用动态颜色变化
 */
export function useColorCycle(
  colors: CyberColor[],
  interval = 3000
): CyberColor {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (colors.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % colors.length);
    }, interval);

    return () => clearInterval(timer);
  }, [colors, interval]);

  return colors[currentIndex] || 'cyan';
}

/**
 * Hook: 使用响应式主题强度
 */
export function useResponsiveIntensity(): number {
  const [intensity, setIntensity] = useState(5);

  useEffect(() => {
    const updateIntensity = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setIntensity(3); // 移动端降低强度
      } else if (width < 1024) {
        setIntensity(4); // 平板中等强度
      } else {
        setIntensity(5); // 桌面正常强度
      }
    };

    updateIntensity();
    window.addEventListener('resize', updateIntensity);
    return () => window.removeEventListener('resize', updateIntensity);
  }, []);

  return intensity;
}

/**
 * Hook: 使用主题动画
 */
export function useThemeAnimation() {
  const { theme } = useCyberTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
  }, []);

  return {
    isAnimating,
    triggerAnimation,
    theme,
  };
}

/**
 * Hook: 使用夜间模式检测
 */
export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // 检测系统偏好
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDark;
}

/**
 * Hook: 使用性能优化的主题
 */
export function useOptimizedTheme() {
  const { theme, ...rest } = useCyberTheme();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 根据系统设置调整主题
  const optimizedTheme = {
    ...theme,
    enableGlitch: theme.enableGlitch && !reduceMotion,
    enableParticles: theme.enableParticles && !reduceMotion,
    intensity: reduceMotion ? Math.min(theme.intensity, 3) : theme.intensity,
  };

  return {
    theme: optimizedTheme,
    ...rest,
    reduceMotion,
  };
}
