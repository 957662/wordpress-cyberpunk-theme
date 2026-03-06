'use client';

import React from 'react';

interface CyberLoaderProps {
  size?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const CyberLoader: React.FC<CyberLoaderProps> = ({
  size = 48,
  color = 'cyan',
  className = '',
}) => {
  return (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
      >
        {/* Outer ring */}
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke={colorMap[color]}
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        {/* Inner ring */}
        <circle
          cx="24"
          cy="24"
          r="14"
          stroke={colorMap[color]}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        {/* Core */}
        <circle cx="24" cy="24" r="8" stroke={colorMap[color]} strokeWidth="2" fill="none" />
        {/* Spokes */}
        <line x1="24" y1="4" x2="24" y2="12" stroke={colorMap[color]} strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="36" x2="24" y2="44" stroke={colorMap[color]} strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="24" x2="12" y2="24" stroke={colorMap[color]} strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="24" x2="44" y2="24" stroke={colorMap[color]} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default CyberLoader;
