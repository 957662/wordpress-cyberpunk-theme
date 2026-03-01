/**
 * 颜色工具函数
 */

/**
 * RGB 颜色
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * HSL 颜色
 */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Hex 转 RGB
 */
export function hexToRgb(hex: string): RGB | null {
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
 * RGB 转 Hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * RGB 转 HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * HSL 转 RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

/**
 * 调整颜色亮度
 */
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (value: number): number => {
    const adjusted = value + (255 - value) * percent;
    return Math.round(Math.max(0, Math.min(255, adjusted)));
  };

  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
}

/**
 * 调整颜色透明度
 */
export function adjustOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, Math.min(1, opacity))})`;
}

/**
 * 生成颜色渐变
 */
export function generateGradient(colors: string[], direction: string = 'to right'): string {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
}

/**
 * 混合两种颜色
 */
export function blendColors(color1: string, color2: string, ratio: number = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

  return rgbToHex(r, g, b);
}

/**
 * 生成随机颜色
 */
export function randomColor(saturation: number = 70, lightness: number = 50): string {
  const h = Math.random() * 360;
  const rgb = hslToRgb(h, saturation, lightness);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * 获取对比色
 */
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';

  // 计算亮度
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * 颜色变体
 */
export function generateColorVariants(baseColor: string): {
  lighter: string;
  light: string;
  base: string;
  dark: string;
  darker: string;
} {
  return {
    lighter: adjustBrightness(baseColor, 0.4),
    light: adjustBrightness(baseColor, 0.2),
    base: baseColor,
    dark: adjustBrightness(baseColor, -0.2),
    darker: adjustBrightness(baseColor, -0.4),
  };
}
