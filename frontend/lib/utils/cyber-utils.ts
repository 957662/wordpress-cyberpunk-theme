/**
 * 赛博朋克主题相关工具函数
 */

export const cyberColors = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
  orange: '#ff8800',
  dark: '#0a0a0f',
  darker: '#050508',
  light: '#1a1a2e',
} as const;

export type CyberColor = keyof typeof cyberColors;

/**
 * 获取赛博朋克颜色
 */
export function getCyberColor(color: CyberColor): string {
  return cyberColors[color];
}

/**
 * 获取赛博朋克渐变
 */
export function getCyberGradient(
  from: CyberColor = 'cyan',
  to: CyberColor = 'purple'
): string {
  return `linear-gradient(135deg, ${cyberColors[from]} 0%, ${cyberColors[to]} 100%)`;
}

/**
 * 获取赛博朋克发光效果
 */
export function getCyberGlow(color: CyberColor = 'cyan', intensity: number = 1): string {
  const colorValue = cyberColors[color];
  const alpha = 0.3 * intensity;
  return `0 0 ${20 * intensity}px ${colorValue}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, '0')}`;
}

/**
 * 获取赛博朋克阴影
 */
export function getCyberShadow(color: CyberColor = 'cyan'): string {
  const colorValue = cyberColors[color];
  return `0 0 10px ${colorValue}40, 0 0 20px ${colorValue}20, 0 0 30px ${colorValue}10`;
}

/**
 * 生成随机赛博朋克颜色
 */
export function getRandomCyberColor(): string {
  const colors = Object.values(cyberColors).filter(
    (c) => c !== cyberColors.dark && c !== cyberColors.darker && c !== cyberColors.light
  );
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 赛博朋克动画持续时间
 */
export const cyberAnimations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 1000,
} as const;

/**
 * 赛博朋克缓动函数
 */
export const cyberEasing = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

/**
 * 格式化为赛博朋克风格的时间显示
 */
export function formatCyberTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * 生成赛博朋克风格的随机字符串
 */
export function generateCyberString(length: number = 8): string {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 创建赛博朋克风格的脉冲动画
 */
export function createCyberPulse(
  color: CyberColor = 'cyan',
  duration: number = 1000
): Keyframe {
  return {
    boxShadow: [
      `0 0 0 0 ${cyberColors[color]}40`,
      `0 0 0 ${duration / 10}px ${cyberColors[color]}00`,
    ],
  };
}
