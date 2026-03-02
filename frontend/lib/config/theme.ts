/**
 * 主题配置
 */

export const themeConfig = {
  // 亮色主题
  light: {
    background: '#ffffff',
    foreground: '#0a0a0f',
    primary: '#00f0ff',
    secondary: '#9d00ff',
    accent: '#ff0080',
    muted: '#f1f5f9',
    border: '#e2e8f0',
    card: '#ffffff',
    cardForeground: '#0a0a0f',
    popover: '#ffffff',
    popoverForeground: '#0a0a0f',
  },

  // 暗色主题（赛博朋克默认）
  dark: {
    background: '#0a0a0f',
    foreground: '#e2e8f0',
    primary: '#00f0ff',
    secondary: '#9d00ff',
    accent: '#ff0080',
    muted: '#1a1a2e',
    border: '#2d2d44',
    card: '#16162a',
    cardForeground: '#e2e8f0',
    popover: '#16162a',
    popoverForeground: '#e2e8f0',
  },

  // 霓虹主题
  neon: {
    background: '#050508',
    foreground: '#ffffff',
    primary: '#00f0ff',
    secondary: '#9d00ff',
    accent: '#f0ff00',
    muted: '#0f0f1a',
    border: '#1f1f33',
    card: '#0a0a14',
    cardForeground: '#ffffff',
    popover: '#0a0a14',
    popoverForeground: '#ffffff',
  },
};

/**
 * 颜色映射
 */
export const colors = {
  // 赛博朋克色系
  cyber: {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
    green: '#00ff88',
    orange: '#ff8800',
    red: '#ff0044',
    blue: '#0088ff',
  },

  // 中性色
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
  },

  // 语义色
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

/**
 * 字体配置
 */
export const fontConfig = {
  families: {
    display: ['Orbitron', 'system-ui', 'sans-serif'],
    body: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },

  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },

  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
};

/**
 * 间距配置
 */
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
  '5xl': '8rem',
};

/**
 * 圆角配置
 */
export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

/**
 * 阴影配置
 */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // 赛博朋克发光效果
  glow: {
    cyan: '0 0 20px rgba(0, 240, 255, 0.5)',
    purple: '0 0 20px rgba(157, 0, 255, 0.5)',
    pink: '0 0 20px rgba(255, 0, 128, 0.5)',
    yellow: '0 0 20px rgba(240, 255, 0, 0.5)',
  },
};

/**
 * 动画配置
 */
export const animations = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',

  easings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // 自定义缓动
    cyber: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

/**
 * 断点配置
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Z-index 层级配置
 */
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
};

/**
 * 过渡配置
 */
export const transitions = {
  default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  dimensions: 'width 200ms cubic-bezier(0.4, 0, 0.2, 1), height 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
};
