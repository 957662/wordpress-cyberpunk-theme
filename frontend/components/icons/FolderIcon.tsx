import React from 'react';

/**
 * Folder Icon - 文件夹图标
 * 赛博朋克风格
 *
 * Usage:
 * <FolderIcon size={24} />
 * <FolderIcon size={32} variant="cyan" />
 */

interface FolderIconProps {
  size?: number;
  className?: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  open?: boolean;
}

const colorMap = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

export const FolderIcon: React.FC<FolderIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
  open = false,
}) => {
  const color = colorMap[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`folder-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Back tab */}
      <path
        d="M3 6 L10 6 L12 8 L22 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* Folder body */}
      <path
        d={open
          ? "M2 10 L22 10 L22 18 C22 19, 21 20, 20 20 L4 20 C3 20, 2 19, 2 18 Z"
          : "M2 8 L22 8 L22 18 C22 19, 21 20, 20 20 L4 20 C3 20, 2 19, 2 18 Z"
        }
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#folder-glow-${variant})`}
      />

      {/* Inner line detail */}
      {open && (
        <line
          x1="6"
          y1="14"
          x2="18"
          y2="14"
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
        />
      )}

      {/* Corner dots */}
      <circle cx="2" cy="10" r="1" fill={color} opacity="0.6"/>
      <circle cx="22" cy="10" r="1" fill={color} opacity="0.6"/>
      <circle cx="2" cy="20" r="1" fill={color} opacity="0.6"/>
      <circle cx="22" cy="20" r="1" fill={color} opacity="0.6"/>
    </svg>
  );
};

export default FolderIcon;
