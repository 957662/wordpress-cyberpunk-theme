/**
 * Breakpoint Constants
 * 响应式断点常量
 */

// 断点值（像素）
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// 媒体查询
export const MEDIA_QUERIES = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',

  // 最大宽度
  'max-sm': '(max-width: 639px)',
  'max-md': '(max-width: 767px)',
  'max-lg': '(max-width: 1023px)',
  'max-xl': '(max-width: 1279px)',
  'max-2xl': '(max-width: 1535px)',

  // 范围
  'sm-md': '(min-width: 640px) and (max-width: 767px)',
  'md-lg': '(min-width: 768px) and (max-width: 1023px)',
  'lg-xl': '(min-width: 1024px) and (max-width: 1279px)',
} as const;

// 设备类型
export const DEVICE_TYPES = {
  mobile: 'mobile',
  tablet: 'tablet',
  desktop: 'desktop',
} as const;

// 屏幕尺寸分类
export function getScreenSize(width: number): keyof typeof BREAKPOINTS {
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS['2xl']) return 'xl';
  return '2xl';
}

// 设备类型判断
export function getDeviceType(width: number): keyof typeof DEVICE_TYPES {
  if (width < BREAKPOINTS.md) return 'mobile';
  if (width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
}

// 响应式值映射
export const RESPONSIVE_VALUES = {
  columns: {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    '2xl': 4,
  },
  fontSize: {
    xs: '0.875rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1rem',
    xl: '1.125rem',
    '2xl': '1.125rem',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
    '2xl': '3rem',
  },
} as const;
