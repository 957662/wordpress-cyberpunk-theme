/**
 * Advanced Icons - 高级图标组件统一导出
 *
 * 导出所有高级图标组件，包括动画、3D、粒子效果
 *
 * @example
 * ```tsx
 * import { PulseIcon, CubeIcon, OrbitIcon } from '@/components/icons/AdvancedIcons';
 * ```
 */

// ===== 动画图标 =====
export {
  AnimatedIcon,
  PulseIcon,
  SpinIcon,
  GlowIcon,
  GlitchIcon,
  FloatIcon,
  ShimmerIcon,
  ScanIcon,
  MatrixIcon,
  HologramIcon,
} from './AnimatedIcon';

export type {
  AnimationType,
  AnimationVariant,
  AnimatedIconProps,
  PulseIconProps,
  SpinIconProps,
  GlowIconProps,
  GlitchIconProps,
  FloatIconProps,
  ShimmerIconProps,
  ScanIconProps,
  HologramProps,
} from './AnimatedIcon';

// ===== 3D 图标 =====
export {
  Icon3D,
  CubeIcon,
  SphereIcon,
  ExtrudedIcon,
  PerspectiveIcon,
  DepthIcon,
  LayeredIcon,
} from './Icon3D';

export type {
  Icon3DType,
  Icon3DVariant,
  Icon3DProps,
} from './Icon3D';

// ===== 粒子图标 =====
export {
  ParticleIcon,
  OrbitIcon,
  ExplodeIcon,
  FloatingIcon,
  RainbowParticleIcon,
} from './ParticleIcon';

export type {
  ParticleDensity,
  ParticleBehavior,
  ParticleVariant,
  ParticleIconProps,
} from './ParticleIcon';

// ===== 组合组件 =====

/**
 * CyberIcon - 终极赛博朋克图标
 * 结合动画、3D 和粒子效果
 *
 * @example
 * ```tsx
 * <CyberIcon
 *   animation="glitch"
 *   effect3d="cube"
 *   particles="orbit"
 *   variant="cyan"
 * >
 *   <StarIcon />
 * </CyberIcon>
 * ```
 */
import React, { ReactNode } from 'react';
import { AnimatedIcon, AnimationType, AnimationVariant } from './AnimatedIcon';
import { Icon3D, Icon3DType, Icon3DVariant } from './Icon3D';
import { ParticleIcon, ParticleBehavior, ParticleDensity, ParticleVariant } from './ParticleIcon';

export interface CyberIconProps {
  /** 图标内容 */
  children: ReactNode;
  /** 动画类型 */
  animation?: AnimationType | 'none';
  /** 3D 效果 */
  effect3D?: Icon3DType | 'none';
  /** 粒子效果 */
  particles?: ParticleBehavior | 'none';
  /** 颜色变体 */
  variant?: AnimationVariant | Icon3DVariant | ParticleVariant;
  /** 粒子密度 */
  particleDensity?: ParticleDensity;
  /** 动画持续时间 */
  duration?: number;
  /** 是否启用交互 */
  interactive?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

export const CyberIcon: React.FC<CyberIconProps> = ({
  children,
  animation = 'none',
  effect3D = 'none',
  particles = 'none',
  variant = 'cyan',
  particleDensity = 'medium',
  duration = 3,
  interactive = true,
  className = '',
}) => {
  let content = children;

  // 应用粒子效果
  if (particles !== 'none') {
    content = (
      <ParticleIcon
        behavior={particles as ParticleBehavior}
        variant={variant as ParticleVariant}
        density={particleDensity}
        interactive={interactive}
        duration={duration}
      >
        {content}
      </ParticleIcon>
    );
  }

  // 应用 3D 效果
  if (effect3D !== 'none') {
    content = (
      <Icon3D
        type={effect3D as Icon3DType}
        variant={variant as Icon3DVariant}
        interactive={interactive}
        autoRotate={!interactive}
        rotationSpeed={duration}
      >
        {content}
      </Icon3D>
    );
  }

  // 应用动画
  if (animation !== 'none') {
    content = (
      <AnimatedIcon
        type={animation as AnimationType}
        variant={variant as AnimationVariant}
        duration={duration}
        className={className}
      >
        {content}
      </AnimatedIcon>
    );
  }

  return <>{content}</>;
};

// ===== 预设组合 =====

/**
 * NeoPulseIcon - 霓虹脉冲图标
 */
export interface NeoPulseIconProps {
  children: ReactNode;
  variant?: AnimationVariant;
  size?: number;
}

export const NeoPulseIcon: React.FC<NeoPulseIconProps> = ({
  children,
  variant = 'cyan',
  size,
}) => {
  return (
    <CyberIcon
      animation="pulse"
      effect3D="depth"
      particles="none"
      variant={variant}
      duration={2}
    >
      {children}
    </CyberIcon>
  );
};

/**
 * GlitchCubeIcon - 故障立方图标
 */
export interface GlitchCubeIconProps {
  children: ReactNode;
  variant?: AnimationVariant;
}

export const GlitchCubeIcon: React.FC<GlitchCubeIconProps> = ({
  children,
  variant = 'pink',
}) => {
  return (
    <CyberIcon
      animation="glitch"
      effect3D="cube"
      particles="explode"
      variant={variant}
      particleDensity="high"
      duration={2.5}
    >
      {children}
    </CyberIcon>
  );
};

/**
 * OrbitHologramIcon - 轨道全息图标
 */
export interface OrbitHologramIconProps {
  children: ReactNode;
  variant?: AnimationVariant;
}

export const OrbitHologramIcon: React.FC<OrbitHologramIconProps> = ({
  children,
  variant = 'purple',
}) => {
  return (
    <CyberIcon
      animation="hologram"
      effect3D="sphere"
      particles="orbit"
      variant={variant}
      particleDensity="medium"
      duration={4}
    >
      {children}
    </CyberIcon>
  );
};

/**
 * MatrixRainIcon - 矩阵雨图标
 */
export const MatrixRainIcon: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CyberIcon
      animation="matrix"
      effect3D="none"
      particles="float"
      variant="green"
      particleDensity="high"
      duration={3}
    >
      {children}
    </CyberIcon>
  );
};

/**
 * FireGlowIcon - 火焰发光图标
 */
export const FireGlowIcon: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CyberIcon
      animation="glow"
      effect3D="extrusion"
      particles="attract"
      variant="orange"
      particleDensity="medium"
      duration={1.5}
    >
      {children}
    </CyberIcon>
  );
};

/**
 * ElectricStormIcon - 电气风暴图标
 */
export const ElectricStormIcon: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CyberIcon
      animation="glitch"
      effect3D="perspective"
      particles="repel"
      variant="yellow"
      particleDensity="high"
      duration={2}
    >
      {children}
    </CyberIcon>
  );
};

// ===== 默认导出 =====

export default {
  // 动画图标
  AnimatedIcon,
  PulseIcon,
  SpinIcon,
  GlowIcon,
  GlitchIcon,
  FloatIcon,
  ShimmerIcon,
  ScanIcon,
  MatrixIcon,
  HologramIcon,

  // 3D 图标
  Icon3D,
  CubeIcon,
  SphereIcon,
  ExtrudedIcon,
  PerspectiveIcon,
  DepthIcon,
  LayeredIcon,

  // 粒子图标
  ParticleIcon,
  OrbitIcon,
  ExplodeIcon,
  FloatingIcon,
  RainbowParticleIcon,

  // 组合图标
  CyberIcon,
  NeoPulseIcon,
  GlitchCubeIcon,
  OrbitHologramIcon,
  MatrixRainIcon,
  FireGlowIcon,
  ElectricStormIcon,
};
