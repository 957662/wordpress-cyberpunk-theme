/**
 * CyberPress Icon System - Type Definitions
 * 图标系统类型定义
 */

// ============================================
// 基础图标属性
// ============================================

/**
 * 所有图标的基础属性接口
 */
export interface BaseIconProps {
  /** 图标尺寸 */
  size?: number;
  /** 自定义类名 */
  className?: string;
  /** 图标颜色 */
  color?: string;
}

/**
 * 带变体的图标属性
 */
export interface VariantIconProps extends BaseIconProps {
  /** 图标变体 */
  variant?: 'solid' | 'outline';
}

/**
 * 带动画的图标属性
 */
export interface AnimatedIconProps extends BaseIconProps {
  /** 是否启用动画 */
  animating?: boolean;
  /** 动画速度 */
  speed?: 'slow' | 'normal' | 'fast';
}

// ============================================
// 特殊图标属性
// ============================================

/**
 * 霓虹图标属性
 */
export interface NeonIconProps extends BaseIconProps {
  /** 霓虹颜色 */
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

/**
 * 箭头图标属性
 */
export interface ArrowIconProps extends BaseIconProps {
  /** 箭头方向 */
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * 主题图标属性
 */
export interface ThemeIconProps extends BaseIconProps {
  /** 主题模式 */
  mode?: 'light' | 'dark';
}

/**
 * 菜单图标属性
 */
export interface MenuIconProps extends BaseIconProps {
  /** 是否打开 */
  isOpen?: boolean;
}

/**
 * 排序图标属性
 */
export interface SortIconProps extends BaseIconProps {
  /** 排序方向 */
  direction?: 'asc' | 'desc' | 'none';
}

/**
 * 加载图标属性
 */
export interface LoadingIconProps extends AnimatedIconProps {
  /** 加载文本 */
  text?: string;
}

// ============================================
// 图标颜色类型
// ============================================

/**
 * 预定义的图标颜色
 */
export type IconColor =
  | 'cyber-cyan'
  | 'cyber-purple'
  | 'cyber-pink'
  | 'cyber-yellow'
  | 'cyber-green'
  | 'cyber-orange'
  | 'gray-100'
  | 'gray-200'
  | 'gray-300';

/**
 * 图标尺寸类型
 */
export type IconSize = 16 | 20 | 24 | 32 | 48 | 64 | 128;

/**
 * 图标类别
 */
export type IconCategory =
  | 'navigation'
  | 'functional'
  | 'social'
  | 'media'
  | 'status'
  | 'cyber'
  | 'decorative';

// ============================================
// 图标元数据
// ============================================

/**
 * 图标信息
 */
export interface IconMetadata {
  /** 图标名称 */
  name: string;
  /** 图标组件 */
  component: React.ComponentType<BaseIconProps>;
  /** 图标描述 */
  description: string;
  /** 图标类别 */
  category: IconCategory;
  /** 支持的尺寸 */
  sizes: IconSize[];
  /** 支持的颜色 */
  colors?: IconColor[];
  /** 是否支持动画 */
  animated?: boolean;
  /** 标签 */
  tags?: string[];
}

/**
 * 图标集合
 */
export interface IconCollection {
  /** 集合名称 */
  name: string;
  /** 集合描述 */
  description: string;
  /** 图标列表 */
  icons: IconMetadata[];
}

// ============================================
// 配色系统类型
// ============================================

/**
 * 核心颜色
 */
export interface CoreColors {
  cyberCyan: string;
  cyberPurple: string;
  cyberPink: string;
  cyberYellow: string;
  cyberGreen: string;
  cyberOrange: string;
}

/**
 * 背景颜色
 */
export interface BackgroundColors {
  cyberDark: string;
  cyberDarker: string;
  cyberCard: string;
  cyberMuted: string;
  cyberBorder: string;
}

/**
 * 文字颜色
 */
export interface TextColors {
  primary: string;
  secondary: string;
  muted: string;
}

/**
 * 完整配色系统
 */
export interface ColorSystem {
  core: CoreColors;
  background: BackgroundColors;
  text: TextColors;
}

// ============================================
// 工具类类型
// ============================================

/**
 * 霓虹发光效果
 */
export type NeonGlowClass =
  | 'neon-glow-cyan'
  | 'neon-glow-purple'
  | 'neon-glow-pink'
  | 'neon-glow-yellow'
  | 'neon-glow-green'
  | 'neon-glow-cyan-subtle';

/**
 * 盒子发光效果
 */
export type BoxGlowClass =
  | 'box-glow-cyan'
  | 'box-glow-purple'
  | 'box-glow-pink'
  | 'box-glow-yellow'
  | 'box-glow-green';

/**
 * 边框发光效果
 */
export type BorderGlowClass =
  | 'border-glow-cyan'
  | 'border-glow-purple';

/**
 * 渐变背景类
 */
export type GradientClass =
  | 'bg-gradient-neon'
  | 'bg-gradient-heat'
  | 'bg-gradient-cyber'
  | 'bg-gradient-deep'
  | 'bg-gradient-matrix'
  | 'bg-gradient-sunset';

/**
 * 文字渐变类
 */
export type TextGradientClass =
  | 'text-gradient-neon'
  | 'text-gradient-heat'
  | 'text-gradient-cyber';

/**
 * 背景图案类
 */
export type PatternClass =
  | 'bg-grid-cyber'
  | 'bg-grid-purple'
  | 'bg-scanlines'
  | 'bg-scanlines-cyan'
  | 'bg-dots'
  | 'bg-hexagon';

/**
 * 动画类
 */
export type AnimationClass =
  | 'animate-neon-pulse'
  | 'animate-glitch'
  | 'animate-scan'
  | 'animate-data-flow'
  | 'animate-spin'
  | 'animate-pulse';

// ============================================
// 图标使用上下文
// ============================================

/**
 * 图标使用场景
 */
export type IconContext =
  | 'navigation'
  | 'button'
  | 'card'
  | 'list'
  | 'form'
  | 'notification'
  | 'status'
  | 'decoration';

/**
 * 图标使用规则
 */
export interface IconUsageRule {
  /** 上下文 */
  context: IconContext;
  /** 推荐尺寸 */
  recommendedSize: IconSize;
  /** 推荐颜色 */
  recommendedColor?: IconColor;
  /** 是否需要发光效果 */
  glow?: boolean;
  /** 说明 */
  notes?: string;
}

// ============================================
// 图标配置
// ============================================

/**
 * 图标系统配置
 */
export interface IconSystemConfig {
  /** 默认尺寸 */
  defaultSize: IconSize;
  /** 默认颜色 */
  defaultColor: string;
  /** 启用动画 */
  enableAnimations: boolean;
  /** 启用发光效果 */
  enableGlow: boolean;
  /** 压缩 SVG */
  compressSvg: boolean;
  /** 懒加载 */
  lazyLoad: boolean;
}

// ============================================
// 默认配置
// ============================================

/**
 * 默认图标配置
 */
export const defaultIconConfig: IconSystemConfig = {
  defaultSize: 24,
  defaultColor: '#00f0ff',
  enableAnimations: true,
  enableGlow: true,
  compressSvg: true,
  lazyLoad: false,
};

/**
 * 默认图标尺寸
 */
export const iconSizes: Record<string, IconSize> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
  '3xl': 128,
};

/**
 * 默认图标颜色映射
 */
export const iconColorMap: Record<IconColor, string> = {
  'cyber-cyan': '#00f0ff',
  'cyber-purple': '#9d00ff',
  'cyber-pink': '#ff0080',
  'cyber-yellow': '#f0ff00',
  'cyber-green': '#00ff88',
  'cyber-orange': '#ff6600',
  'gray-100': '#e0e0e0',
  'gray-200': '#a0a0b0',
  'gray-300': '#606070',
};
