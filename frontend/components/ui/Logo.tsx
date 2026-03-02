'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'main' | 'horizontal' | 'icon' | 'square';
  size?: number;
  className?: string;
  priority?: boolean;
  animated?: boolean;
}

export function Logo({
  variant = 'main',
  size = 200,
  className = '',
  priority = false,
  animated = false,
}: LogoProps) {
  const logoMap = {
    main: '/logo-main.svg',
    horizontal: '/logo.svg',
    icon: '/logo-icon.svg',
    square: '/logo-square.svg',
  };

  const sizeMap = {
    main: { width: size, height: size },
    horizontal: { width: size * 2, height: size * 0.4 },
    icon: { width: size, height: size },
    square: { width: size, height: size },
  };

  const dimensions = sizeMap[variant];
  const logoSrc = logoMap[variant];

  const logoImage = (
    <Image
      src={logoSrc}
      alt="CyberPress Logo"
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={`transition-all duration-300 ${className}`}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        {logoImage}
      </motion.div>
    );
  }

  return logoImage;
}
