/**
 * CyberPress Graphics - 完整导出文件
 *
 * 统一导出所有图形组件，便于使用
 *
 * @example
 * ```tsx
 * import {
 *   MainLogo,
 *   SquareLogo,
 *   WatermarkLogo,
 *   AnimatedLogo,
 *   LoadingRing,
 *   PulseLoader,
 *   TechBorder,
 *   CornerBracket,
 *   DividerLine
 * } from '@/components/graphics';
 * ```
 */

// ============================================
// Logo 组件
// ============================================

export {
  MainLogo,
  SquareLogo,
  FaviconLogo,
  MinimalLogo,
  TextLogo,
  WatermarkLogo,
  AnimatedLogo
} from './Logos';
export type { LogoProps } from './Logos';

// ============================================
// 霓虹文字组件
// ============================================

export { NeonText } from './NeonText';
export type { NeonTextProps } from './NeonText';

// ============================================
// 发光效果组件
// ============================================

export {
  CyberGlow,
  CyberBorderGlow,
  HolographicEffect
} from './CyberGlow';
export type {
  CyberGlowProps,
  CyberBorderGlowProps,
  HolographicEffectProps
} from './CyberGlow';

// ============================================
// 装饰图案组件
// ============================================

export {
  DecorativePattern,
  Scanlines,
  GlitchEffect
} from './DecorativePattern';
export type {
  DecorativePatternProps,
  ScanlinesProps,
  GlitchEffectProps
} from './DecorativePattern';

// ============================================
// 加载和装饰组件
// ============================================

export {
  LoadingRing,
  PulseLoader,
  TechBorder,
  CornerBracket,
  DividerLine
} from './decorations/LoadingRing';
export type {
  LoadingRingProps,
  PulseLoaderProps,
  TechBorderProps,
  CornerBracketProps,
  DividerLineProps
} from './decorations/LoadingRing';

// ============================================
// 状态插画组件
// ============================================

export {
  NotFoundIllustration,
  ServerErrorIllustration,
  AccessDeniedIllustration,
  MaintenanceIllustration,
  EmptyStateIllustration
} from './illustrations/StatusIllustrations';
export type { IllustrationProps } from './illustrations/StatusIllustrations';

// ============================================
// Logo 组件（从 Logos.tsx 导出）
// ============================================

export const Logos = {
  Main: MainLogo,
  Square: SquareLogo,
  Favicon: FaviconLogo,
  Minimal: MinimalLogo,
  Text: TextLogo,
  Watermark: WatermarkLogo,
  Animated: AnimatedLogo
};

// ============================================
// 装饰组件集合
// ============================================

export const Decorations = {
  LoadingRing,
  PulseLoader,
  TechBorder,
  CornerBracket,
  DividerLine
};

// ============================================
// 插画组件集合
// ============================================

export const Illustrations = {
  NotFound: NotFoundIllustration,
  ServerError: ServerErrorIllustration,
  AccessDenied: AccessDeniedIllustration,
  Maintenance: MaintenanceIllustration,
  EmptyState: EmptyStateIllustration
};

// ============================================
// 默认导出
// ============================================

export default {
  Logos,
  Decorations,
  Illustrations,
  NeonText,
  CyberGlow,
  CyberBorderGlow,
  HolographicEffect,
  DecorativePattern,
  Scanlines,
  GlitchEffect
};
