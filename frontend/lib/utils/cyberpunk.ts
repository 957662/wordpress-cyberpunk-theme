/**
 * 赛博朋克风格工具函数
 * 提供赛博朋克主题相关的实用工具
 */

/**
 * 赛博朋克颜色调色板
 */
export const CyberColors = {
  // 主色调
  cyan: {
    50: '#e0faff',
    100: '#b3f5ff',
    200: '#81efff',
    300: '#4fe9ff',
    400: '#1de3ff',
    500: '#00f0ff', // 主色
    600: '#00c0cc',
    700: '#009099',
    800: '#006066',
    900: '#003033',
  },
  purple: {
    50: '#f5e0ff',
    100: '#e8b3ff',
    200: '#db86ff',
    300: '#ce59ff',
    400: '#c12cff',
    500: '#9d00ff', // 主色
    600: '#7e00cc',
    700: '#5e0099',
    800: '#3f0066',
    900: '#1f0033',
  },
  pink: {
    50: '#ffe0f5',
    100: '#ffb3e0',
    200: '#ff86cc',
    300: '#ff59b8',
    400: '#ff2ca3',
    500: '#ff0080', // 主色
    600: '#cc0066',
    700: '#99004d',
    800: '#660033',
    900: '#33001a',
  },
  yellow: {
    50: '#ffffe0',
    100: '#ffffb3',
    200: '#ffff86',
    300: '#ffff59',
    400: '#ffff2c',
    500: '#f0ff00', // 主色
    600: '#c0cc00',
    700: '#909900',
    800: '#606600',
    900: '#303300',
  },
  green: {
    50: '#e0ffe5',
    100: '#b3ffcc',
    200: '#86ffb3',
    300: '#59ff99',
    400: '#2cff80',
    500: '#00ff66', // 主色
    600: '#00cc52',
    700: '#00993d',
    800: '#006629',
    900: '#003314',
  },
} as const;

/**
 * 赛博朋克主题配置
 */
export const CyberThemes = {
  light: {
    background: '#ffffff',
    foreground: '#0a0a0f',
    card: '#f5f5f5',
    'card-foreground': '#0a0a0f',
    popover: '#ffffff',
    'popover-foreground': '#0a0a0f',
    primary: '#00f0ff',
    'primary-foreground': '#0a0a0f',
    secondary: '#9d00ff',
    'secondary-foreground': '#ffffff',
    muted: '#f5f5f5',
    'muted-foreground': '#666666',
    accent: '#ff0080',
    'accent-foreground': '#ffffff',
    destructive: '#ff0000',
    'destructive-foreground': '#ffffff',
    border: '#e0e0e0',
    input: '#e0e0e0',
    ring: '#00f0ff',
  },
  dark: {
    background: '#0a0a0f',
    foreground: '#ffffff',
    card: '#1a1a2e',
    'card-foreground': '#ffffff',
    popover: '#1a1a2e',
    'popover-foreground': '#ffffff',
    primary: '#00f0ff',
    'primary-foreground': '#0a0a0f',
    secondary: '#9d00ff',
    'secondary-foreground': '#ffffff',
    muted: '#2a2a3e',
    'muted-foreground': '#a0a0a0',
    accent: '#ff0080',
    'accent-foreground': '#ffffff',
    destructive: '#ff4444',
    'destructive-foreground': '#ffffff',
    border: '#2a2a3e',
    input: '#2a2a3e',
    ring: '#00f0ff',
  },
} as const;

/**
 * 生成赛博朋克渐变
 */
export function getCyberGradient(
  colors: keyof typeof CyberColors = 'cyan',
  direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-tr' | 'to-bl' | 'to-tl' = 'to-r'
): string {
  const colorMap = CyberColors[colors];
  const stops = [
    colorMap[500],
    colorMap[400],
    colorMap[600],
  ];
  return `bg-gradient-${direction} from-${stops[0]} via-${stops[1]} to-${stops[2]}`;
}

/**
 * 生成赛博朋克阴影（发光效果）
 */
export function getCyberGlow(
  color: keyof typeof CyberColors = 'cyan',
  intensity: 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string {
  const colorValue = CyberColors[color][500];
  const intensityMap = {
    sm: `0 0 10px ${colorValue}40`,
    md: `0 0 20px ${colorValue}60`,
    lg: `0 0 30px ${colorValue}80`,
    xl: `0 0 40px ${colorValue}A0`,
  };
  return intensityMap[intensity];
}

/**
 * 生成赛博朋克边框颜色
 */
export function getCyberBorder(
  color: keyof typeof CyberColors = 'cyan',
  opacity: number = 1
): string {
  const colorValue = CyberColors[color][500];
  const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
  return `${colorValue}${alpha}`;
}

/**
 * 生成赛博朋克文本颜色
 */
export function getCyberTextColor(
  color: keyof typeof CyberColors = 'cyan',
  shade: 400 | 500 | 600 = 500
): string {
  return CyberColors[color][shade];
}

/**
 * 生成随机赛博朋克颜色
 */
export function getRandomCyberColor(): keyof typeof CyberColors {
  const colors = Object.keys(CyberColors) as Array<keyof typeof CyberColors>;
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * 生成赛博朋克动画时长
 */
export function getCyberDuration(
  speed: 'slow' | 'normal' | 'fast' = 'normal'
): string {
  const durationMap = {
    slow: '0.5s',
    normal: '0.3s',
    fast: '0.15s',
  };
  return durationMap[speed];
}

/**
 * 生成赛博朋克缓动函数
 */
export function getCyberEasing(
  type: 'smooth' | 'bouncy' | 'sharp' = 'smooth'
): string {
  const easingMap = {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  };
  return easingMap[type];
}

/**
 * 检查颜色是否为赛博朋克颜色
 */
export function isCyberColor(color: string): color is keyof typeof CyberColors {
  return color in CyberColors;
}

/**
 * 获取赛博朋克颜色值的 RGB
 */
export function getCyberColorRGB(
  color: keyof typeof CyberColors,
  shade: 400 | 500 | 600 = 500
): { r: number; g: number; b: number } {
  const hex = CyberColors[color][shade].replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

/**
 * 生成赛博朋克调色板 CSS 变量
 */
export function getCyberCSSVariables(): Record<string, string> {
  return {
    '--cyber-cyan': CyberColors.cyan[500],
    '--cyber-purple': CyberColors.purple[500],
    '--cyber-pink': CyberColors.pink[500],
    '--cyber-yellow': CyberColors.yellow[500],
    '--cyber-green': CyberColors.green[500],
    '--cyber-dark': '#0a0a0f',
    '--cyber-darker': '#050508',
    '--cyber-card': '#1a1a2e',
    '--cyber-muted': '#2a2a3e',
    '--cyber-border': '#2a2a3e',
  };
}

/**
 * 应用赛博朋克主题到 DOM
 */
export function applyCyberTheme(color: keyof typeof CyberColors = 'cyan') {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const colors = CyberColors[color];

  root.style.setProperty('--theme-primary', colors[500]);
  root.style.setProperty('--theme-secondary', colors[400]);
  root.style.setProperty('--theme-accent', colors[600]);
}
