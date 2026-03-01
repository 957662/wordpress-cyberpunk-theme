/**
 * CyberPress Logo Display Component
 *
 * Logo 展示组件，支持多种变体和尺寸
 *
 * @example
 * ```tsx
 * <LogoDisplay variant="main" size={200} />
 * <LogoDisplay variant="square" size={64} />
 * <LogoDisplay variant="favicon" size={32} />
 * ```
 */

import React from 'react';
import Image from 'next/image';

export interface LogoDisplayProps {
  /** Logo 变体 */
  variant?: 'main' | 'square' | 'favicon';
  /** Logo 尺寸 */
  size?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否使用动画 */
  animated?: boolean;
  /** 点击事件 */
  onClick?: () => void;
}

export const LogoDisplay: React.FC<LogoDisplayProps> = ({
  variant = 'main',
  size = 200,
  className = '',
  animated = false,
  onClick
}) => {
  const logoMap = {
    main: '/logo-main.svg',
    square: '/logo-square.svg',
    favicon: '/logo-favicon.svg'
  };

  const animationClasses = animated ? 'animate-glow' : '';

  return (
    <Image
      src={logoMap[variant]}
      alt="CyberPress Logo"
      width={size}
      height={size}
      className={`${animationClasses} ${className}`.trim()}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        maxWidth: '100%',
        height: 'auto'
      }}
      priority={variant === 'main'}
    />
  );
};

export default LogoDisplay;
