/**
 * CyberPress 颜色系统
 * 赛博朋克风格配色方案
 */

// CSS 变量映射
export const cyberColors = {
  // 主色调
  'deep-black': '#0a0a0f',
  'cyber-cyan': '#00f0ff',
  'cyber-purple': '#9d00ff',
  'cyber-pink': '#ff0080',
  'cyber-yellow': '#f0ff00',

  // 辅助色
  'neon-blue': '#00d4ff',
  'neon-green': '#39ff14',
  'neon-red': '#ff3131',
  'neon-orange': '#ff6600',

  // 中性色
  'gray-100': '#f3f4f6',
  'gray-200': '#e5e7eb',
  'gray-300': '#d1d5db',
  'gray-400': '#9ca3af',
  'gray-500': '#6b7280',
  'gray-600': '#4b5563',
  'gray-700': '#374151',
  'gray-800': '#1f2937',
  'gray-900': '#111827',

  // 语义色
  'success': '#39ff14',
  'warning': '#f0ff00',
  'error': '#ff3131',
  'info': '#00d4ff',
} as const;

// 渐变色方案
export const cyberGradients = {
  'neon': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
  'plasma': 'linear-gradient(135deg, #ff0080 0%, #f0ff00 50%, #00f0ff 100%)',
  'holographic': 'linear-gradient(135deg, rgba(0,240,255,0.5) 0%, rgba(157,0,255,0.5) 50%, rgba(255,0,128,0.5) 100%)',
  'sunset': 'linear-gradient(135deg, #ff0080 0%, #9d00ff 100%)',
  'matrix': 'linear-gradient(135deg, #39ff14 0%, #00f0ff 100%)',
} as const;

// 阴影效果
export const cyberShadows = {
  'neon': '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.3)',
  'purple': '0 0 20px rgba(157, 0, 255, 0.5), 0 0 40px rgba(157, 0, 255, 0.3)',
  'pink': '0 0 20px rgba(255, 0, 128, 0.5), 0 0 40px rgba(255, 0, 128, 0.3)',
  'yellow': '0 0 20px rgba(240, 255, 0, 0.5), 0 0 40px rgba(240, 255, 0, 0.3)',
  'combined': '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(157, 0, 255, 0.2), 0 0 60px rgba(255, 0, 128, 0.1)',
} as const;

// Tailwind 配置
export const tailwindColors = {
  deep: {
    black: '#0a0a0f',
  },
  cyber: {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
    yellow: '#f0ff00',
  },
  neon: {
    blue: '#00d4ff',
    green: '#39ff14',
    red: '#ff3131',
    orange: '#ff6600',
  },
};

// 类型导出
export type CyberColor = keyof typeof cyberColors;
export type CyberGradient = keyof typeof cyberGradients;
export type CyberShadow = keyof typeof cyberShadows;
