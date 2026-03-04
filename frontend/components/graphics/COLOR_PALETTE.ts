/**
 * CyberPress 完整配色参考
 *
 * 赛博朋克风格配色方案
 * @version 1.0.0
 * @date 2026-03-05
 */

// ============================================
// 颜色定义
// ============================================

export interface ColorScheme {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  description: string;
}

export interface GradientScheme {
  name: string;
  colors: string[];
  css: string;
  description: string;
}

// ============================================
// 基础色系 - 深空色
// ============================================

export const darkColors: Record<string, ColorScheme> = {
  darker: {
    name: 'Deep Space Black',
    hex: '#050508',
    rgb: 'rgb(5, 5, 8)',
    hsl: 'hsl(240, 23%, 3%)',
    description: '最深背景色，用于特殊区域',
  },
  dark: {
    name: 'Space Black',
    hex: '#0a0a0f',
    rgb: 'rgb(10, 10, 15)',
    hsl: 'hsl(240, 20%, 5%)',
    description: '主背景色',
  },
  muted: {
    name: 'Deep Navy',
    hex: '#1a1a2e',
    rgb: 'rgb(26, 26, 46)',
    hsl: 'hsl(240, 28%, 14%)',
    description: '次要背景色',
  },
  card: {
    name: 'Card Background',
    hex: '#16162a',
    rgb: 'rgb(22, 22, 42)',
    hsl: 'hsl(240, 32%, 13%)',
    description: '卡片背景色',
  },
  border: {
    name: 'Border Color',
    hex: '#2a2a4a',
    rgb: 'rgb(42, 42, 74)',
    hsl: 'hsl(240, 28%, 23%)',
    description: '边框色',
  },
  surface: {
    name: 'Surface Color',
    hex: '#0f0f1a',
    rgb: 'rgb(15, 15, 26)',
    hsl: 'hsl(240, 27%, 8%)',
    description: '表面颜色',
  },
};

// ============================================
// 霓虹色系 - 主题色
// ============================================

export const neonColors: Record<string, ColorScheme> = {
  cyan: {
    name: 'Neon Cyan',
    hex: '#00f0ff',
    rgb: 'rgb(0, 240, 255)',
    hsl: 'hsl(182, 100%, 50%)',
    description: '主要强调色 - 科技感、未来感',
  },
  purple: {
    name: 'Cyber Purple',
    hex: '#9d00ff',
    rgb: 'rgb(157, 0, 255)',
    hsl: 'hsl(277, 100%, 50%)',
    description: '次要强调色 - 神秘、创新',
  },
  pink: {
    name: 'Laser Pink',
    hex: '#ff0080',
    rgb: 'rgb(255, 0, 128)',
    hsl: 'hsl(330, 100%, 50%)',
    description: '特殊强调色 - 活力、冲击',
  },
  yellow: {
    name: 'Voltage Yellow',
    hex: '#f0ff00',
    rgb: 'rgb(240, 255, 0)',
    hsl: 'hsl(63, 100%, 50%)',
    description: '警告色 - 注意、高亮',
  },
  green: {
    name: 'Matrix Green',
    hex: '#00ff88',
    rgb: 'rgb(0, 255, 136)',
    hsl: 'hsl(152, 100%, 50%)',
    description: '成功色 - 通过、正常',
  },
  orange: {
    name: 'Plasma Orange',
    hex: '#ff8000',
    rgb: 'rgb(255, 128, 0)',
    hsl: 'hsl(30, 100%, 50%)',
    description: '注意色 - 警告、待定',
  },
  red: {
    name: 'Alert Red',
    hex: '#ff0040',
    rgb: 'rgb(255, 0, 64)',
    hsl: 'hsl(345, 100%, 50%)',
    description: '危险色 - 错误、禁止',
  },
  blue: {
    name: 'Electric Blue',
    hex: '#0080ff',
    rgb: 'rgb(0, 128, 255)',
    hsl: 'hsl(210, 100%, 50%)',
    description: '信息色 - 链接、信息',
  },
};

// ============================================
// 渐变色系
// ============================================

export const gradients: Record<string, GradientScheme> = {
  primary: {
    name: 'Primary Gradient',
    colors: ['#00f0ff', '#9d00ff'],
    css: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
    description: '主渐变 - 用于标题、按钮',
  },
  secondary: {
    name: 'Secondary Gradient',
    colors: ['#ff0080', '#f0ff00'],
    css: 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)',
    description: '次渐变 - 用于装饰、高亮',
  },
  dark: {
    name: 'Dark Gradient',
    colors: ['#0a0a0f', '#1a1a2e'],
    css: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
    description: '暗色渐变 - 用于背景',
  },
  cyber: {
    name: 'Cyber Rainbow',
    colors: ['#00f0ff', '#9d00ff', '#ff0080', '#f0ff00'],
    css: 'linear-gradient(45deg, #00f0ff, #9d00ff, #ff0080, #f0ff00)',
    description: '彩虹渐变 - 用于特殊效果',
  },
  matrix: {
    name: 'Matrix Gradient',
    colors: ['#000000', '#001a00'],
    css: 'linear-gradient(180deg, #000000 0%, #001a00 100%)',
    description: '矩阵渐变 - 用于代码区域',
  },
  neon: {
    name: 'Neon Gradient',
    colors: ['#00f0ff', '#ff0080', '#f0ff00'],
    css: 'linear-gradient(90deg, #00f0ff, #ff0080, #f0ff00)',
    description: '霓虹渐变 - 用于边框、线条',
  },
  sunset: {
    name: 'Sunset Gradient',
    colors: ['#9d00ff', '#ff0080', '#ff8000'],
    css: 'linear-gradient(135deg, #9d00ff 0%, #ff0080 50%, #ff8000 100%)',
    description: '日落渐变 - 用于卡片',
  },
  ocean: {
    name: 'Ocean Gradient',
    colors: ['#00f0ff', '#0080ff', '#00ff88'],
    css: 'linear-gradient(135deg, #00f0ff 0%, #0080ff 50%, #00ff88 100%)',
    description: '海洋渐变 - 用于背景',
  },
};

// ============================================
// 语义色系
// ============================================

export const semanticColors: Record<string, ColorScheme> = {
  success: {
    name: 'Success',
    hex: '#00ff88',
    rgb: 'rgb(0, 255, 136)',
    hsl: 'hsl(152, 100%, 50%)',
    description: '成功状态',
  },
  warning: {
    name: 'Warning',
    hex: '#f0ff00',
    rgb: 'rgb(240, 255, 0)',
    hsl: 'hsl(63, 100%, 50%)',
    description: '警告状态',
  },
  error: {
    name: 'Error',
    hex: '#ff0040',
    rgb: 'rgb(255, 0, 64)',
    hsl: 'hsl(345, 100%, 50%)',
    description: '错误状态',
  },
  info: {
    name: 'Info',
    hex: '#0080ff',
    rgb: 'rgb(0, 128, 255)',
    hsl: 'hsl(210, 100%, 50%)',
    description: '信息状态',
  },
};

// ============================================
// 文字色系
// ============================================

export const textColors: Record<string, ColorScheme> = {
  primary: {
    name: 'Primary Text',
    hex: '#e0e0e0',
    rgb: 'rgb(224, 224, 224)',
    hsl: 'hsl(0, 0%, 88%)',
    description: '主要文字',
  },
  secondary: {
    name: 'Secondary Text',
    hex: '#a0a0b0',
    rgb: 'rgb(160, 160, 176)',
    hsl: 'hsl(240, 9%, 66%)',
    description: '次要文字',
  },
  disabled: {
    name: 'Disabled Text',
    hex: '#606070',
    rgb: 'rgb(96, 96, 112)',
    hsl: 'hsl(240, 8%, 41%)',
    description: '禁用文字',
  },
  inverse: {
    name: 'Inverse Text',
    hex: '#0a0a0f',
    rgb: 'rgb(10, 10, 15)',
    hsl: 'hsl(240, 20%, 5%)',
    description: '反转文字',
  },
};

// ============================================
// 阴影色系
// ============================================

export const shadowColors: Record<string, { color: string; description: string }> = {
  glowCyan: {
    color: '0 0 20px rgba(0, 240, 255, 0.5)',
    description: '青色发光',
  },
  glowPurple: {
    color: '0 0 20px rgba(157, 0, 255, 0.5)',
    description: '紫色发光',
  },
  glowPink: {
    color: '0 0 20px rgba(255, 0, 128, 0.5)',
    description: '粉色发光',
  },
  glowGreen: {
    color: '0 0 20px rgba(0, 255, 136, 0.5)',
    description: '绿色发光',
  },
  glowYellow: {
    color: '0 0 20px rgba(240, 255, 0, 0.5)',
    description: '黄色发光',
  },
  card: {
    color: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
    description: '卡片阴影',
  },
  dialog: {
    color: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
    description: '对话框阴影',
  },
};

// ============================================
// 实用工具函数
// ============================================

/**
 * 获取颜色十六进制值
 */
export const getColor = (colorName: keyof typeof neonColors): string => {
  return neonColors[colorName]?.hex || neonColors.cyan.hex;
};

/**
 * 获取渐变 CSS
 */
export const getGradient = (gradientName: keyof typeof gradients): string => {
  return gradients[gradientName]?.css || gradients.primary.css;
};

/**
 * 获取阴影 CSS
 */
export const getShadow = (shadowName: keyof typeof shadowColors): string => {
  return shadowColors[shadowName]?.color || shadowColors.glowCyan.color;
};

/**
 * 颜色变体生成器
 */
export const getColorVariant = (
  baseColor: string,
  variant: 'lighter' | 'light' | 'dark' | 'darker'
): string => {
  const opacity = {
    lighter: 0.1,
    light: 0.3,
    dark: 0.7,
    darker: 0.9,
  }[variant];

  return `${baseColor}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')}`;
};

/**
 * 生成 Tailwind 配置
 */
export const generateTailwindConfig = () => {
  return {
    theme: {
      extend: {
        colors: {
          cyber: {
            ...Object.fromEntries(
              Object.entries(darkColors).map(([key, value]) => [key, value.hex])
            ),
            ...Object.fromEntries(
              Object.entries(neonColors).map(([key, value]) => [key, value.hex])
            ),
          },
          semantic: {
            ...Object.fromEntries(
              Object.entries(semanticColors).map(([key, value]) => [key, value.hex])
            ),
          },
          text: {
            ...Object.fromEntries(
              Object.entries(textColors).map(([key, value]) => [key, value.hex])
            ),
          },
        },
        backgroundImage: {
          ...Object.fromEntries(
            Object.entries(gradients).map(([key, value]) => [`gradient-${key}`, value.css])
          ),
        },
        boxShadow: {
          ...Object.fromEntries(
            Object.entries(shadowColors).map(([key, value]) => [
              `glow-${key}`,
              value.color,
            ])
          ),
        },
      },
    },
  };
};

// ============================================
// 导出默认配色
// ============================================

export const defaultPalette = {
  dark: darkColors,
  neon: neonColors,
  gradients,
  semantic: semanticColors,
  text: textColors,
  shadows: shadowColors,
};

export default defaultPalette;
