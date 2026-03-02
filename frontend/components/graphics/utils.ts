/**
 * CyberPress Graphics Utilities
 *
 * 图形库的实用工具函数
 *
 * @example
 * ```tsx
 * import {
 *   hexToRgb,
 *   getContrastColor,
 *   generateUniqueId,
 *   downloadSVG
 * } from '@/components/graphics/utils';
 * ```
 */

// ==================== 颜色工具 ====================

/**
 * 将 HEX 颜色转换为 RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * 将 RGB 颜色转换为 HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * 计算颜色亮度
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * 计算对比度
 */
export function getContrastRatio(foreground: string, background: string): number {
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * 获取对比色（黑色或白色）
 */
export function getContrastColor(hex: string): string {
  const luminance = getLuminance(hex);
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * 调整颜色亮度
 */
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const { r, g, b } = rgb;
  const adjust = (value: number) => {
    const adjusted = Math.round(value * (1 + percent / 100));
    return Math.max(0, Math.min(255, adjusted));
  };

  return rgbToHex(adjust(r), adjust(g), adjust(b));
}

/**
 * 混合两种颜色
 */
export function blendColors(color1: string, color2: string, weight: number = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const w1 = weight;
  const w2 = 1 - w1;

  const r = Math.round(rgb1.r * w1 + rgb2.r * w2);
  const g = Math.round(rgb1.g * w1 + rgb2.g * w2);
  const b = Math.round(rgb1.b * w1 + rgb2.b * w2);

  return rgbToHex(r, g, b);
}

// ==================== SVG 工具 ====================

/**
 * 将 SVG 元素转换为字符串
 */
export function svgToString(svgElement: SVGElement): string {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgElement);
}

/**
 * 下载 SVG 文件
 */
export function downloadSVG(svgElement: SVGElement, filename: string = 'icon.svg'): void {
  const svgString = svgToString(svgElement);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 将 SVG 转换为 PNG
 */
export async function svgToPng(
  svgElement: SVGElement,
  width: number = 1024,
  height: number = 1024
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('无法创建 canvas 上下文');
  }

  const svgString = svgToString(svgElement);
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('PNG 转换失败'));
        }
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片加载失败'));
    };

    img.src = url;
  });
}

/**
 * 下载 PNG 文件
 */
export async function downloadPNG(
  svgElement: SVGElement,
  filename: string = 'icon.png',
  width: number = 1024,
  height: number = 1024
): Promise<void> {
  const blob = await svgToPng(svgElement, width, height);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==================== 尺寸工具 ====================

/**
 * 计算新的尺寸，保持宽高比
 */
export function calculateAspectRatio(
  originalWidth: number,
  originalHeight: number,
  newWidth?: number,
  newHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  if (newWidth) {
    return {
      width: newWidth,
      height: Math.round(newWidth / aspectRatio),
    };
  }

  if (newHeight) {
    return {
      width: Math.round(newHeight * aspectRatio),
      height: newHeight,
    };
  }

  return { width: originalWidth, height: originalHeight };
}

/**
 * 将尺寸转换为像素值
 */
export function sizeToPx(size: number | string): string {
  if (typeof size === 'number') {
    return `${size}px`;
  }
  return size;
}

// ==================== 字符串工具 ====================

/**
 * 生成唯一 ID
 */
export function generateUniqueId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 转换为 kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * 转换为 PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

// ==================== 验证工具 ====================

/**
 * 验证 HEX 颜色
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * 验证 SVG 元素
 */
export function isValidSvgElement(element: unknown): element is SVGElement {
  return element instanceof SVGElement;
}

/**
 * 验证尺寸值
 */
export function isValidSize(size: unknown): boolean {
  if (typeof size === 'number') {
    return size > 0 && Number.isFinite(size);
  }
  if (typeof size === 'string') {
    return /^\d+(\.\d+)?(px|em|rem|%|vh|vw)?$/.test(size);
  }
  return false;
}

// ==================== 浏览器工具 ====================

/**
 * 检测用户是否偏好减少动画
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 检测暗色模式
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * 检测高对比度模式
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// ==================== 性能工具 ====================

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== 导出所有工具 ====================

export const utils = {
  // 颜色工具
  hexToRgb,
  rgbToHex,
  getLuminance,
  getContrastRatio,
  getContrastColor,
  adjustBrightness,
  blendColors,

  // SVG 工具
  svgToString,
  downloadSVG,
  svgToPng,
  downloadPNG,

  // 尺寸工具
  calculateAspectRatio,
  sizeToPx,

  // 字符串工具
  generateUniqueId,
  toKebabCase,
  toPascalCase,

  // 验证工具
  isValidHexColor,
  isValidSvgElement,
  isValidSize,

  // 浏览器工具
  prefersReducedMotion,
  prefersDarkMode,
  prefersHighContrast,

  // 性能工具
  debounce,
  throttle,
  delay,
};

export default utils;
