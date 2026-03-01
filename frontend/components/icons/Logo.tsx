/**
 * CyberPress Logo Component
 *
 * Usage:
 * <Logo size={200} variant="main" />
 * <Logo size={64} variant="icon" />
 * <Logo size={512} variant="square" />
 */

import React from 'react';

interface LogoProps {
  size?: number;
  variant?: 'main' | 'icon' | 'square';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 200,
  variant = 'main',
  className = ''
}) => {
  const src = variant === 'icon' ? '/logo-favicon.svg'
    : variant === 'square' ? '/logo-square.svg'
    : '/logo-main.svg';

  return (
    <img
      src={src}
      alt="CyberPress Logo"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
};

export default Logo;
