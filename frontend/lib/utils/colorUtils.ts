/**
 * CyberPress 颜色工具库
 *
 * 提供颜色相关的工具函数和常量
 *
 * @example
 * ```tsx
 * import { getColor, getGradient, hexToRgba } from '@/lib/utils/colorUtils';
 *
 * const color = getColor('cyan');
 * const gradient = getGradient('neon');
 * const rgba = hexToRgba('#00f0ff', 0.5);
 * ```
 */

// ==================== 颜色常量 ====================

/**
 * 核心颜色定义
 */
export const coreColors = {
  // 主色调
  cyberBlack: '#0a0a0f',
  cyberDarker: '#050508',
  cyberDark: '#12121a',
  cyberMuted: '#1a1a2e',
  cyberCard: '#16162a',
  cyberBorder: '#2a2a4a',

  // 强调色
  cyberCyan: '#00f0ff',
  cyberPurple: '#9d00ff',
  cyberPink: '#ff0080',
  cyberYellow: '#f0ff00',
  cyberGreen: '#00ff88',

  // 浅色变体
  cyberCyanLight: '#4df4ff',
  cyberPurpleLight: '#b34dff',
  cyberPinkLight: '#ff33aa',

  // 深色变体
  cyberCyanDark: '#00a0aa',
  cyberPurpleDark: '#6600aa',
  cyberPinkDark: '#aa0055',

  // 灰度
  cyberGray100: '#e0e0e0',
  cyberGray200: '#a0a0b0',
  cyberGray300: '#606070',
  cyberGray400: '#303040',
} as const;

/**
 * 颜色别名 - 用于简化访问
 */
export const colors = {
  // 背景
  bgPrimary: coreColors.cyberBlack,
  bgSecondary: coreColors.cyberDark,
  bgCard: coreColors.cyberCard,
  bgMuted: coreColors.cyberMuted,

  // 文字
  textPrimary: coreColors.cyberGray100,
  textSecondary: coreColors.cyberGray200,
  textMuted: coreColors.cyberGray300,

  // 强调色
  accentCyan: coreColors.cyberCyan,
  accentPurple: coreColors.cyberPurple,
  accentPink: coreColors.cyberPink,
  accentYellow: coreColors.cyberYellow,
  accentGreen: coreColors.cyberGreen,

  // 边框
  border: coreColors.cyberBorder,
} as const;

/**
 * 颜色类型
 */
export type ColorName = keyof typeof coreColors;
export type VariantName = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
export type GradientName = 'neon' | 'heat' | 'cyber' | 'deep';

// ==================== 颜色映射 ====================

/**
 * 变体名称到颜色值的映射
 */
export const variantColors: Record<VariantName, string> = {
  cyan: coreColors.cyberCyan,
  purple: coreColors.cyberPurple,
  pink: coreColors.cyberPink,
  yellow: coreColors.cyberYellow,
  green: coreColors.cyberGreen,
};

/**
 * 渐变定义
 */
export const gradients: Record<GradientName, string> = {
  neon: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
  heat: 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)',
  cyber: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
  deep: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)',
};

// ==================== 工具函数 ====================

/**
 * 获取颜色值
 *
 * @param name - 颜色名称或变体名称
 * @returns 颜色值 (HEX)
 *
 * @example
 * ```tsx
 * getColor('cyan')        // '#00f0ff'
 * getColor('cyberCyan')   // '#00f0ff'
 * getColor('purple')      // '#9d00ff'
 * ```
 */
export function getColor(name: VariantName | ColorName): string {
  if (name in variantColors) {
    return variantColors[name as VariantName];
  }
  if (name in coreColors) {
    return coreColors[name as ColorName];
  }
  return coreColors.cyberCyan; // 默认颜色
}

/**
 * 获取渐变值
 *
 * @param name - 渐变名称
 * @returns CSS 渐变字符串
 *
 * @example
 * ```tsx
 * getGradient('neon')  // 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)'
 * getGradient('heat')  // 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)'
 * ```
 */
export function getGradient(name: GradientName): string {
  return gradients[name] || gradients.neon;
}

/**
 * HEX 转 RGBA
 *
 * @param hex - HEX 颜色值
 * @param alpha - 透明度 (0-1)
 * @returns RGBA 颜色值
 *
 * @example
 * ```tsx
 * hexToRgba('#00f0ff', 0.5)  // 'rgba(0, 240, 255, 0.5)'
 * ```
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 获取带透明度的颜色
 *
 * @param name - 颜色名称
 * @param alpha - 透明度 (0-1)
 * @returns RGBA 颜色值
 *
 * @example
 * ```tsx
 * getColorWithOpacity('cyan', 0.5)  // 'rgba(0, 240, 255, 0.5)'
 * ```
 */
export function getColorWithOpacity(name: VariantName | ColorName, alpha: number): string {
  const hex = getColor(name);
  return hexToRgba(hex, alpha);
}

/**
 * 获取发光颜色
 *
 * @param variant - 颜色变体
 * @param intensity - 发光强度 (1-3)
 * @returns 发光效果的 box-shadow 值
 *
 * @example
 * ```tsx
 * getGlowColor('cyan', 2)  // '0 0 10px #00f0ff, 0 0 20px #00f0ff'
 * ```
 */
export function getGlowColor(variant: VariantName, intensity: number = 2): string {
  const color = getColor(variant);
  const shadows: string[] = [];

  for (let i = 1; i <= intensity; i++) {
    shadows.push(`0 0 ${i * 5}px ${color}`);
  }

  return shadows.join(', ');
}

/**
 * 生成颜色渐变数组
 *
 * @param variant - 起始颜色变体
 * @param steps - 渐变步数
 * @returns 颜色值数组
 *
 * @example
 * ```tsx
 * generateColorGradient('cyan', 5)
 * // ['#00f0ff', '#00c0cc', '#009099', '#006066', '#003033']
 * ```
 */
export function generateColorGradient(variant: VariantName, steps: number): string[] {
  const color = getColor(variant);
  const result: string[] = [];

  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    result.push(adjustColorBrightness(color, -ratio * 50));
  }

  return result;
}

/**
 * 调整颜色亮度
 *
 * @param hex - HEX 颜色值
 * @param amount - 调整量 (-100 到 100)
 * @returns 调整后的 HEX 颜色值
 *
 * @example
 * ```tsx
 * adjustColorBrightness('#00f0ff', -20)  // 变暗
 * adjustColorBrightness('#00f0ff', 20)   // 变亮
 * ```
 */
export function adjustColorBrightness(hex: string, amount: number): string {
  let color = hex.replace('#', '');

  if (color.length === 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }

  const num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;

  return '#' + (
    (g | (b << 8) | (r << 16))
      .toString(16)
      .padStart(6, '0')
  );
}

/**
 * 判断颜色是否为深色
 *
 * @param hex - HEX 颜色值
 * @returns 是否为深色
 *
 * @example
 * ```tsx
 * isDarkColor('#00f0ff')  // false
 * isDarkColor('#0a0a0f')  // true
 * ```
 */
export function isDarkColor(hex: string): boolean {
  const color = hex.replace('#', '');
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

/**
 * 获取对比色
 *
 * @param hex - HEX 颜色值
 * @returns 对比色 (黑色或白色)
 *
 * @example
 * ```tsx
 * getContrastColor('#00f0ff')  // '#000000'
 * getContrastColor('#9d00ff')  // '#ffffff'
 * ```
 */
export function getContrastColor(hex: string): string {
  return isDarkColor(hex) ? '#ffffff' : '#000000';
}

/**
 * 获取 Tailwind 类名
 *
 * @param variant - 颜色变体
 * @param type - 类名类型
 * @returns Tailwind 类名
 *
 * @example
 * ```tsx
 * getTailwindClass('cyan', 'text')     // 'text-cyber-cyan'
 * getTailwindClass('purple', 'bg')     // 'bg-cyber-purple'
 * getTailwindClass('pink', 'border')   // 'border-cyber-pink'
 * ```
 */
export function getTailwindClass(
  variant: VariantName,
  type: 'text' | 'bg' | 'border' | 'shadow' | 'ring'
): string {
  const typePrefix = {
    text: 'text',
    bg: 'bg',
    border: 'border',
    shadow: 'shadow',
    ring: 'ring',
  };

  const variantSuffix: Record<VariantName, string> = {
    cyan: 'cyber-cyan',
    purple: 'cyber-purple',
    pink: 'cyber-pink',
    yellow: 'cyber-yellow',
    green: 'cyber-green',
  };

  return `${typePrefix[type]}-${variantSuffix[variant]}`;
}

/**
 * 获取完整的 Tailwind 类名组合
 *
 * @param variant - 颜色变体
 * @returns 包含文本、背景、边框的类名对象
 *
 * @example
 * ```tsx
 * const classes = getTailwindClasses('cyan');
 * // { text: 'text-cyber-cyan', bg: 'bg-cyber-cyan', ... }
 * ```
 */
export function getTailwindClasses(variant: VariantName) {
  return {
    text: getTailwindClass(variant, 'text'),
    bg: getTailwindClass(variant, 'bg'),
    border: getTailwindClass(variant, 'border'),
    shadow: getTailwindClass(variant, 'shadow'),
    ring: getTailwindClass(variant, 'ring'),
  };
}

// ==================== CSS 变量生成 ====================

/**
 * 生成 CSS 变量字符串
 *
 * @returns CSS 变量定义
 *
 * @example
 * ```tsx
 * const cssVars = getCssVariables();
 * // ':root { --cyber-black: #0a0a0f; --cyber-cyan: #00f0ff; ... }'
 * ```
 */
export function getCssVariables(): string {
  let css = ':root {\n';

  Object.entries(coreColors).forEach(([name, value]) => {
    const cssName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
    css += `  --${cssName}: ${value};\n`;
  });

  css += '}';
  return css;
}

/**
 * 获取 CSS 变量值
 *
 * @param name - 颜色名称
 * @returns CSS 变量引用
 *
 * @example
 * ```tsx
 * getCssVar('cyberCyan')  // 'var(--cyber-cyan)'
 * ```
 */
export function getCssVar(name: ColorName): string {
  const cssName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `var(--${cssName})`;
}

// ==================== 颜色主题 ====================

/**
 * 主题配置
 */
export const themes = {
  dark: {
    background: coreColors.cyberBlack,
    foreground: coreColors.cyberGray100,
    card: coreColors.cyberCard,
    'card-foreground': coreColors.cyberGray100,
    primary: coreColors.cyberCyan,
    'primary-foreground': coreColors.cyberBlack,
    secondary: coreColors.cyberPurple,
    'secondary-foreground': coreColors.cyberGray100,
    accent: coreColors.cyberPink,
    'accent-foreground': coreColors.cyberGray100,
    muted: coreColors.cyberMuted,
    'muted-foreground': coreColors.cyberGray200,
    border: coreColors.cyberBorder,
  },
  light: {
    background: '#f0f0f5',
    foreground: coreColors.cyberDark,
    card: '#e0e0e8',
    'card-foreground': coreColors.cyberDark,
    primary: coreColors.cyberCyanDark,
    'primary-foreground': '#ffffff',
    secondary: coreColors.cyberPurpleDark,
    'secondary-foreground': coreColors.cyberDark,
    accent: coreColors.cyberPinkDark,
    'accent-foreground': coreColors.cyberDark,
    muted: '#d0d0d8',
    'muted-foreground': coreColors.cyberGray300,
    border: '#c0c0c8',
  },
} as const;

/**
 * 主题类型
 */
export type ThemeName = keyof typeof themes;

/**
 * 获取主题颜色
 *
 * @param theme - 主题名称
 * @param colorKey - 颜色键
 * @returns 颜色值
 *
 * @example
 * ```tsx
 * getThemeColor('dark', 'background')  // '#0a0a0f'
 * getThemeColor('light', 'primary')   // '#00a0aa'
 * ```
 */
export function getThemeColor(
  theme: ThemeName,
  colorKey: keyof typeof themes.dark
): string {
  return themes[theme][colorKey];
}

// ==================== 默认导出 ====================

export default {
  // 颜色常量
  coreColors,
  colors,
  variantColors,
  gradients,

  // 工具函数
  getColor,
  getGradient,
  hexToRgba,
  getColorWithOpacity,
  getGlowColor,
  generateColorGradient,
  adjustColorBrightness,
  isDarkColor,
  getContrastColor,
  getTailwindClass,
  getTailwindClasses,
  getCssVariables,
  getCssVar,
  getThemeColor,

  // 主题
  themes,
};
