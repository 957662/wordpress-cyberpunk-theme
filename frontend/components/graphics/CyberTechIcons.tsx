'use client';

import React from 'react';
import Image from 'next/image';

interface CyberTechIconProps {
  name: 'cpu' | 'neural' | 'dataflow' | 'grid' | 'eye' | 'shield';
  size?: number;
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

const iconMap = {
  cpu: '/icons/cpu-icon.svg',
  neural: '/icons/neural-net-icon.svg',
  dataflow: '/icons/data-flow-icon.svg',
  grid: '/icons/cyber-grid-icon.svg',
  eye: '/icons/cyber-eye-icon.svg',
  shield: '/icons/cyber-shield-icon.svg',
};

export const CyberTechIcon: React.FC<CyberTechIconProps> = ({
  name,
  size = 24,
  className = '',
  animated = false,
  onClick,
}) => {
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <div
      className={`inline-flex items-center justify-center ${className} ${animationClass}`}
      onClick={onClick}
      style={{ width: size, height: size }}
    >
      <Image
        src={iconMap[name]}
        alt={name}
        width={size}
        height={size}
        className="drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
      />
    </div>
  );
};

export default CyberTechIcon;
