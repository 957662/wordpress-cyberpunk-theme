/**
 * CyberPress Icon Component
 *
 * 统一的图标组件，支持所有图标
 *
 * @example
 * ```tsx
 * <Icon name="home" size={24} color="cyber-cyan" />
 * <Icon name="github" size={20} variant="social" />
 * ```
 */

import React from 'react';
import Image from 'next/image';

export interface IconProps {
  /** 图标名称 (不含 .svg 扩展名) */
  name: string;
  /** 图标尺寸 */
  size?: number;
  /** 颜色变体 */
  variant?: 'default' | 'social' | 'action' | 'status';
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否使用发光效果 */
  glow?: boolean;
  /** 动画效果 */
  animation?: 'none' | 'pulse' | 'spin' | 'bounce';
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  variant = 'default',
  className = '',
  glow = false,
  animation = 'none'
}) => {
  // 基础类名
  const baseClasses = 'inline-block transition-all duration-300';

  // 变体类名
  const variantClasses: Record<string, string> = {
    default: 'text-cyber-cyan',
    social: 'text-cyber-gray-200 hover:text-cyber-cyan',
    action: 'text-cyber-purple hover:text-cyber-pink',
    status: 'text-cyber-yellow'
  };

  // 发光类名
  const glowClasses = glow ? 'drop-shadow-[0_0_3px_rgba(0,240,255,0.5)]' : '';

  // 动画类名
  const animationClasses: Record<string, string> = {
    none: '',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce'
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${glowClasses}
    ${animationClasses[animation]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Image
      src={`/icons/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={combinedClasses}
      style={{
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );
};

export default Icon;
