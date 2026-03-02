import React from 'react';

/**
 * Edit Icon - 编辑图标
 * 赛博朋克风格
 *
 * Usage:
 * <EditIcon size={24} />
 * <EditIcon size={32} variant="cyan" />
 */

interface EditIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  animated?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const EditIcon: React.FC<EditIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        <filter id={`edit-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Pencil body */}
      <path
        d="M18 2 L22 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Pencil tip */}
      <path
        d="M2 22 L6 18 L22 2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#edit-glow-${variant})`}
      />

      {/* Pencil point */}
      <path
        d="M2 22 L6 22 L2 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#edit-glow-${variant})`}
      />

      {/* Eraser */}
      <path
        d="M16 4 L20 8 L16 12 L12 8 Z"
        fill={color}
        opacity="0.3"
      />
    </svg>
  );
};

export default EditIcon;
