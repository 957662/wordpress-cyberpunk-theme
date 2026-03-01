/**
 * 颜色常量
 * 赛博朋克主题颜色系统
 */

// 主色调
export const cyberColors = {
  dark: '#0a0a0f',      // 深空黑
  cyan: '#00f0ff',      // 霓虹青
  purple: '#9d00ff',    // 赛博紫
  pink: '#ff0080',      // 激光粉
  green: '#00ff88',     // 赛博绿
  yellow: '#f0ff00',    // 电压黄
  orange: '#ff8000',    // 等离子橙
  red: '#ff0040',       // 警告红
  blue: '#0080ff',      // 电光蓝
  muted: '#1a1a2e',     // 深空蓝
} as const;

// 灰度
export const grayColors = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  950: '#030712',
} as const;

// 渐变
export const gradients = {
  primary: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
  secondary: 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)',
  dark: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
  cyber: 'linear-gradient(45deg, #00f0ff, #9d00ff, #ff0080, #f0ff00)',
  matrix: 'linear-gradient(180deg, #000000 0%, #001a00 100%)',
  neon: 'linear-gradient(90deg, #00f0ff, #ff0080, #f0ff00)',
} as const;

// 阴影
export const shadows = {
  glow: {
    cyan: '0 0 20px rgba(0, 240, 255, 0.5)',
    purple: '0 0 20px rgba(157, 0, 255, 0.5)',
    pink: '0 0 20px rgba(255, 0, 128, 0.5)',
    green: '0 0 20px rgba(0, 255, 136, 0.5)',
    yellow: '0 0 20px rgba(240, 255, 0, 0.5)',
  },
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  dialog: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
} as const;

// 语义化颜色
export const semanticColors = {
  success: cyberColors.green,
  warning: cyberColors.yellow,
  error: cyberColors.red,
  info: cyberColors.blue,
} as const;

// Tailwind 扩展配置
export const tailwindColors = {
  cyber: cyberColors,
  gray: grayColors,
};

// CSS 变量
export const cssVariables = {
  '--cyber-dark': cyberColors.dark,
  '--cyber-cyan': cyberColors.cyan,
  '--cyber-purple': cyberColors.purple,
  '--cyber-pink': cyberColors.pink,
  '--cyber-green': cyberColors.green,
  '--cyber-yellow': cyberColors.yellow,
  '--cyber-muted': cyberColors.muted,
} as const;
