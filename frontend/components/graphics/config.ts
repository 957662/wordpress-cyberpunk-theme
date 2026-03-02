/**
 * CyberPress Graphics Configuration
 *
 * 图形库的全局配置文件
 *
 * @example
 * ```tsx
 * import { GRAPHICS_CONFIG, getIconConfig, getLogoConfig } from '@/components/graphics/config';
 *
 * console.log(GRAPHICS_CONFIG.colors.cyan); // #00f0ff
 * const iconConfig = getIconConfig('home');
 * ```
 */

// ==================== 颜色配置 ====================

export const CYBER_COLORS = {
  // 深空色系
  dark: '#0a0a0f',
  darker: '#050508',
  muted: '#1a1a2e',
  card: '#16162a',
  border: '#2a2a4a',

  // 霓虹色系
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  green: '#00ff88',
  yellow: '#f0ff00',
  orange: '#ff8000',
  red: '#ff0040',
  blue: '#0080ff',
} as const;

export type CyberColor = keyof typeof CYBER_COLORS;

// ==================== 渐变配置 ====================

export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
  secondary: 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)',
  dark: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
  cyber: 'linear-gradient(45deg, #00f0ff, #9d00ff, #ff0080, #f0ff00)',
  matrix: 'linear-gradient(180deg, #000000 0%, #001a00 100%)',
  neon: 'linear-gradient(90deg, #00f0ff, #ff0080, #f0ff00)',
} as const;

export type GradientType = keyof typeof GRADIENTS;

// ==================== 阴影配置 ====================

export const SHADOWS = {
  'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.5)',
  'glow-purple': '0 0 20px rgba(157, 0, 255, 0.5)',
  'glow-pink': '0 0 20px rgba(255, 0, 128, 0.5)',
  'glow-green': '0 0 20px rgba(0, 255, 136, 0.5)',
  'glow-yellow': '0 0 20px rgba(240, 255, 0, 0.5)',
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  dialog: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
} as const;

// ==================== 尺寸配置 ====================

export const SIZES = {
  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  },
  logo: {
    sm: 64,
    md: 100,
    lg: 150,
    xl: 200,
  },
  illustration: {
    sm: 200,
    md: 300,
    lg: 400,
    xl: 600,
  },
} as const;

// ==================== 动画配置 ====================

export const ANIMATIONS = {
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 1000,
  },
  easings: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
    'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    cyber: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ==================== 图标配置 ====================

export const ICON_CONFIG: Record<string, {
  defaultProps: Partial<{ size: number; variant: CyberColor; glow: boolean }>;
  variants: CyberColor[];
}> = {
  home: {
    defaultProps: { size: 24, variant: 'cyan' },
    variants: ['cyan', 'purple', 'pink', 'green'],
  },
  github: {
    defaultProps: { size: 24, variant: 'purple' },
    variants: ['cyan', 'purple', 'pink'],
  },
  search: {
    defaultProps: { size: 24, variant: 'cyan' },
    variants: ['cyan', 'purple', 'pink'],
  },
  // ... 更多图标配置
};

// ==================== Logo 配置 ====================

export const LOGO_CONFIG = {
  main: {
    width: 200,
    height: 60,
    aspectRatio: 200 / 60,
  },
  square: {
    width: 64,
    height: 64,
  },
  favicon: {
    width: 32,
    height: 32,
  },
  minimal: {
    width: 100,
    height: 100,
  },
} as const;

// ==================== 插画配置 ====================

export const ILLUSTRATION_CONFIG = {
  'cyber-city': {
    width: 400,
    height: 300,
    aspectRatio: 400 / 300,
  },
  'code-screen': {
    width: 300,
    height: 250,
    aspectRatio: 300 / 250,
  },
  network: {
    width: 300,
    height: 300,
    aspectRatio: 1,
  },
  'server-rack': {
    width: 200,
    height: 300,
    aspectRatio: 200 / 300,
  },
  'circuit-board': {
    width: 300,
    height: 300,
    aspectRatio: 1,
  },
  workspace: {
    width: 350,
    height: 250,
    aspectRatio: 350 / 250,
  },
} as const;

// ==================== 主题配置 ====================

export const THEME_CONFIG = {
  dark: {
    background: CYBER_COLORS.dark,
    foreground: '#ffffff',
    primary: CYBER_COLORS.cyan,
    secondary: CYBER_COLORS.purple,
    accent: CYBER_COLORS.pink,
  },
  light: {
    background: '#ffffff',
    foreground: CYBER_COLORS.dark,
    primary: '#0066ff',
    secondary: '#6600cc',
    accent: '#ff0066',
  },
} as const;

// ==================== 辅助函数 ====================

/**
 * 获取颜色值
 */
export function getColor(color: CyberColor): string {
  return CYBER_COLORS[color];
}

/**
 * 获取渐变值
 */
export function getGradient(type: GradientType): string {
  return GRADIENTS[type];
}

/**
 * 获取阴影值
 */
export function getShadow(type: keyof typeof SHADOWS): string {
  return SHADOWS[type];
}

/**
 * 获取图标配置
 */
export function getIconConfig(name: string) {
  return ICON_CONFIG[name] || {
    defaultProps: { size: 24, variant: 'cyan' as CyberColor },
    variants: ['cyan', 'purple', 'pink'],
  };
}

/**
 * 获取 Logo 配置
 */
export function getLogoConfig(type: keyof typeof LOGO_CONFIG) {
  return LOGO_CONFIG[type];
}

/**
 * 获取插画配置
 */
export function getIllustrationConfig(name: keyof typeof ILLUSTRATION_CONFIG) {
  return ILLUSTRATION_CONFIG[name];
}

/**
 * 获取主题配置
 */
export function getThemeConfig(theme: 'dark' | 'light') {
  return THEME_CONFIG[theme];
}

// ==================== 主配置对象 ====================

export const GRAPHICS_CONFIG = {
  colors: CYBER_COLORS,
  gradients: GRADIENTS,
  shadows: SHADOWS,
  sizes: SIZES,
  animations: ANIMATIONS,
  icons: ICON_CONFIG,
  logos: LOGO_CONFIG,
  illustrations: ILLUSTRATION_CONFIG,
  themes: THEME_CONFIG,
} as const;

export default GRAPHICS_CONFIG;
