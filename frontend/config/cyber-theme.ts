/**
 * Cyberpunk Theme Configuration
 * 赛博朋克主题配置文件
 */

export const cyberColors = {
  // 主色调
  dark: '#0a0a0f',        // 深空黑 - 主背景
  cyan: '#00f0ff',        // 霓虹青 - 主强调色
  purple: '#9d00ff',      // 赛博紫 - 次强调色
  pink: '#ff0080',        // 激光粉 - 警告/错误色

  // 辅助色
  green: '#00ff88',       // 赛博绿 - 成功色
  yellow: '#f0ff00',      // 电压黄 - 警告色
  muted: '#1a1a2e',       // 深空蓝 - 次背景
  gray: '#6b7280',        // 灰色 - 文本

  // 渐变色
  gradient: {
    primary: 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
    secondary: 'linear-gradient(135deg, #9d00ff 0%, #ff0080 100%)',
    dark: 'linear-gradient(135deg, #0a0a0f 0%, #16162a 100%)',
  },
} as const;

export const cyberShadows = {
  neon: '0 0 20px rgba(0, 240, 255, 0.5)',
  purple: '0 0 20px rgba(157, 0, 255, 0.5)',
  pink: '0 0 20px rgba(255, 0, 128, 0.5)',
  green: '0 0 20px rgba(0, 255, 136, 0.5)',
} as const;

export const cyberFonts = {
  display: "'Orbitron', sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const cyberSizes = {
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
} as const;

export const cyberBreakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const cyberAnimations = {
  fast: '0.15s',
  normal: '0.3s',
  slow: '0.5s',
} as const;

export const cyberBorderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

// 主题变量映射到CSS变量
export const cyberThemeVars = {
  '--cyber-dark': cyberColors.dark,
  '--cyber-cyan': cyberColors.cyan,
  '--cyber-purple': cyberColors.purple,
  '--cyber-pink': cyberColors.pink,
  '--cyber-green': cyberColors.green,
  '--cyber-yellow': cyberColors.yellow,
  '--cyber-muted': cyberColors.muted,
  '--cyber-gray': cyberColors.gray,
} as const;

// 生成Tailwind配置
export const cyberTailwindConfig = {
  theme: {
    extend: {
      colors: {
        'cyber-dark': cyberColors.dark,
        'cyber-cyan': cyberColors.cyan,
        'cyber-purple': cyberColors.purple,
        'cyber-pink': cyberColors.pink,
        'cyber-green': cyberColors.green,
        'cyber-yellow': cyberColors.yellow,
        'cyber-muted': cyberColors.muted,
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        neon: cyberShadows.neon,
        purple: cyberShadows.purple,
        pink: cyberShadows.pink,
        green: cyberShadows.green,
      },
      backgroundImage: {
        'cyber-gradient': cyberColors.gradient.primary,
        'cyber-gradient-secondary': cyberColors.gradient.secondary,
        'cyber-dark': cyberColors.gradient.dark,
      },
    },
  },
} as const;

// 主题类名生成器
export const cyberThemeClass = (variant: 'light' | 'dark' = 'dark') => {
  return variant === 'dark' ? 'dark' : '';
};

// 获取颜色工具函数
export const getCyberColor = (color: keyof typeof cyberColors) => {
  return cyberColors[color];
};

// 获取阴影工具函数
export const getCyberShadow = (shadow: keyof typeof cyberShadows) => {
  return cyberShadows[shadow];
};

// 主题切换配置
export const themeConfig = {
  defaultTheme: 'dark',
  themes: ['light', 'dark'] as const,
  enableSystem: true,
  storageKey: 'cyberpress-theme',
} as const;

export default {
  colors: cyberColors,
  shadows: cyberShadows,
  fonts: cyberFonts,
  sizes: cyberSizes,
  breakpoints: cyberBreakpoints,
  animations: cyberAnimations,
  borderRadius: cyberBorderRadius,
  themeVars: cyberThemeVars,
  tailwind: cyberTailwindConfig,
  themeConfig,
};
