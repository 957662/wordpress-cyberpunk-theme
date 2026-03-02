/**
 * 赛博朋克主题颜色常量
 */

// 主色调
export const CYBER_COLORS = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff41',
  orange: '#ff6b00',
  red: '#ff003c',
} as const;

// 背景色
export const BACKGROUND_COLORS = {
  dark: '#0a0a0f',
  darker: '#050508',
  darkest: '#000000',
  card: '#12121a',
  surface: '#1a1a24',
} as const;

// 文字颜色
export const TEXT_COLORS = {
  primary: '#ffffff',
  secondary: '#b0b0b0',
  muted: '#6b7280',
  disabled: '#4b5563',
} as const;

// 边框颜色
export const BORDER_COLORS = {
  default: '#2a2a3a',
  light: '#3a3a4a',
  dark: '#1a1a2a',
} as const;

// 渐变色
export const GRADIENTS = {
  cyber: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
  sunset: 'linear-gradient(135deg, #ff0080 0%, #ff6b00 100%)',
  ocean: 'linear-gradient(135deg, #00f0ff 0%, #00ff41 100%)',
  purple: 'linear-gradient(135deg, #9d00ff 0%, #ff0080 100%)',
  matrix: 'linear-gradient(135deg, #00ff41 0%, #00f0ff 100%)',
} as const;

// 阴影效果
export const SHADOWS = {
  glow: {
    cyan: '0 0 20px rgba(0, 240, 255, 0.5)',
    purple: '0 0 20px rgba(157, 0, 255, 0.5)',
    pink: '0 0 20px rgba(255, 0, 128, 0.5)',
  },
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  neon: '0 0 5px rgba(0, 240, 255, 0.8), 0 0 10px rgba(0, 240, 255, 0.5)',
} as const;

// 主题变体
export const THEME_VARIANTS = {
  cyber: {
    primary: CYBER_COLORS.cyan,
    secondary: CYBER_COLORS.purple,
    accent: CYBER_COLORS.pink,
    background: BACKGROUND_COLORS.dark,
  },
  neon: {
    primary: CYBER_COLORS.pink,
    secondary: CYBER_COLORS.yellow,
    accent: CYBER_COLORS.cyan,
    background: BACKGROUND_COLORS.dark,
  },
  matrix: {
    primary: CYBER_COLORS.green,
    secondary: CYBER_COLORS.cyan,
    accent: CYBER_COLORS.yellow,
    background: BACKGROUND_COLORS.darkest,
  },
} as const;

// 颜色工具函数
export function getColorOpacity(color: string, opacity: number): string {
  // 简单的透明度处理，实际应用中可能需要更复杂的逻辑
  return color;
}

export function getContrastColor(backgroundColor: string): string {
  // 返回与背景色对比度高的文字颜色
  return BACKGROUND_COLORS.darkest === backgroundColor ? '#ffffff' : '#000000';
}
