'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'neon' | 'minimal' | 'animated';
  size?: number;
  className?: string;
  onClick?: () => void;
}

const logoMap = {
  neon: '/assets/logo/cyberpress-logo-neon.svg',
  minimal: '/assets/logo/cyberpress-logo-minimal.svg',
  animated: '/assets/logo/cyberpress-logo-animated.svg',
};

export const CyberPressLogo: React.FC<LogoProps> = ({
  variant = 'neon',
  size = 200,
  className = '',
  onClick,
}) => {
  // Calculate height based on aspect ratio (200:60 = 10:3)
  const height = (size * 3) / 10;

  return (
    <div className={`inline-flex ${className}`} onClick={onClick}>
      <Image
        src={logoMap[variant]}
        alt="CyberPress Logo"
        width={size}
        height={height}
        className={variant === 'animated' ? 'animate-pulse' : ''}
      />
    </div>
  );
};

export default CyberPressLogo;
