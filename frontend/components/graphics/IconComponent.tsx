'use client';

import { forwardRef, SVGProps } from 'react';

interface IconComponentProps extends SVGProps<SVGSVGElement> {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  animated?: boolean;
}

/**
 * 通用图标组件
 * 提供统一的赛博朋克风格图标包装器
 */
export const IconComponent = forwardRef<SVGSVGElement, IconComponentProps>(
  ({ size = 24, variant = 'cyan', animated = false, className = '', children, ...props }, ref) => {
    const variantColors = {
      cyan: '#00f0ff',
      purple: '#9d00ff',
      pink: '#ff0080',
      yellow: '#f0ff00',
      green: '#00ff88'
    };

    const color = variantColors[variant];

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <defs>
          <filter id={`glow-${variant}`}>
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g filter={`url(#glow-${variant})`} className={animated ? 'animate-pulse' : ''}>
          {children}
        </g>
      </svg>
    );
  }
);

IconComponent.displayName = 'IconComponent';

/**
 * 赛博芯片图标
 */
export const ChipIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </IconComponent>
);

/**
 * 数据库图标
 */
export const DatabaseIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </IconComponent>
);

/**
 * 神经网络图标
 */
export const NeuralNetworkIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="4" cy="6" r="2" />
    <circle cx="20" cy="6" r="2" />
    <circle cx="4" cy="18" r="2" />
    <circle cx="20" cy="18" r="2" />
    <path d="M12 9V6M12 15v3M9 12H6M15 12h3" />
    <path d="M5.5 7.5l6 4.5M18.5 7.5l-6 4.5M5.5 16.5l6-4.5M18.5 16.5l-6-4.5" opacity="0.5" />
  </IconComponent>
);

/**
 * 量子核心图标
 */
export const QuantumCoreIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <circle cx="12" cy="12" r="10" opacity="0.3" />
    <circle cx="12" cy="12" r="7" opacity="0.5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    <path d="M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" opacity="0.5" />
  </IconComponent>
);

/**
 * 全息投影图标
 */
export const HologramIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <path d="M2 12h20M12 2v20" />
    <path d="m4.93 4.93 14.14 14.14M4.93 19.07 19.07 4.93" opacity="0.3" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="6" opacity="0.3" />
  </IconComponent>
);

/**
 * 数据流图标
 */
export const DataStreamIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <path d="M2 12h2L6 8l4 8 4-8 4 8 4-8 2 4" />
    <path d="M2 8h2L6 4l4 8 4-8 4 8 4-8 2 4" opacity="0.3" />
    <path d="M2 16h2L6 12l4 8 4-8 4 8 4-8 2 4" opacity="0.3" />
  </IconComponent>
);

/**
 * 赛博眼睛图标
 */
export const CyberEyeIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <path d="M12 5v2M12 17v2M5 12h2M17 12h2" />
  </IconComponent>
);

/**
 * 微芯片图标
 */
export const MicrochipIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    <path d="M7 7h2M7 12h2M7 17h2M15 7h2M15 12h2M15 17h2" />
  </IconComponent>
);

/**
 * 电路板图标
 */
export const CircuitBoardIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <path d="M6 6h4v4H6z" />
    <path d="M14 14h4v4h-4z" />
    <path d="M6 14h2v2H6z" />
    <path d="M16 6h2v2h-2z" />
    <path d="M10 6h2M12 8v2M14 10h2" />
    <path d="M12 16v-2M10 14h-2" />
  </IconComponent>
);

/**
 * 霓虹网格图标
 */
export const NeonGridIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    <circle cx="15" cy="9" r="1.5" fill="currentColor" />
    <circle cx="9" cy="15" r="1.5" fill="currentColor" />
    <circle cx="15" cy="15" r="1.5" fill="currentColor" />
  </IconComponent>
);

/**
 * 机器人图标
 */
export const BotIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
    <path d="M12 20v-6" />
  </IconComponent>
);

/**
 * 火箭发射图标
 */
export const RocketLaunchIcon = (props: Omit<IconComponentProps, 'children'>) => (
  <IconComponent {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </IconComponent>
);

export default IconComponent;
