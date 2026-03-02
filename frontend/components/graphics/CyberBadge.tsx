import React from 'react';

/**
 * CyberBadge - 赛博朋克徽章组件
 * 用于显示标签、状态或装饰性徽章
 */

export interface CyberBadgeProps {
  text: string;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'red';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'hexagon' | 'square';
  animated?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const colorMap = {
  cyan: { bg: 'rgba(0, 240, 255, 0.1)', border: '#00f0ff', text: '#00f0ff' },
  purple: { bg: 'rgba(157, 0, 255, 0.1)', border: '#9d00ff', text: '#9d00ff' },
  pink: { bg: 'rgba(255, 0, 128, 0.1)', border: '#ff0080', text: '#ff0080' },
  yellow: { bg: 'rgba(240, 255, 0, 0.1)', border: '#f0ff00', text: '#f0ff00' },
  green: { bg: 'rgba(0, 255, 136, 0.1)', border: '#00ff88', text: '#00ff88' },
  red: { bg: 'rgba(255, 0, 64, 0.1)', border: '#ff0040', text: '#ff0040' },
};

const sizeMap = {
  sm: { padding: 'px-2 py-1', text: 'text-xs', gap: 'gap-1' },
  md: { padding: 'px-3 py-1.5', text: 'text-sm', gap: 'gap-1.5' },
  lg: { padding: 'px-4 py-2', text: 'text-base', gap: 'gap-2' },
};

const shapeMap = {
  rounded: 'rounded',
  pill: 'rounded-full',
  hexagon: 'clip-hexagon',
  square: 'rounded-none',
};

export const CyberBadge: React.FC<CyberBadgeProps> = ({
  text,
  variant = 'cyan',
  size = 'md',
  shape = 'rounded',
  animated = false,
  glow = false,
  icon,
  className = '',
}) => {
  const colors = colorMap[variant];
  const sizes = sizeMap[size];
  const shapeClass = shapeMap[shape];

  const animationClass = animated ? 'animate-pulse' : '';
  const glowClass = glow ? `shadow-[0_0_10px_${colors.border}]` : '';

  const baseClasses = `
    inline-flex items-center justify-center
    ${sizes.padding}
    ${sizes.text}
    ${sizes.gap}
    font-medium
    border
    ${shapeClass}
    ${animationClass}
    ${glowClass}
    transition-all duration-300
    hover:opacity-80
  `;

  const style = {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    color: colors.text,
  };

  if (shape === 'hexagon') {
    return (
      <div className={`relative inline-block ${className}`}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 50"
          className="absolute inset-0"
          preserveAspectRatio="none"
        >
          <polygon
            points="15,0 85,0 100,25 85,50 15,50 0,25"
            fill={colors.bg}
            stroke={colors.border}
            strokeWidth="2"
          />
        </svg>
        <span className={`relative z-10 ${sizes.padding} ${sizes.text} font-medium flex items-center ${sizes.gap}`} style={{ color: colors.text }}>
          {icon}
          {text}
        </span>
      </div>
    );
  }

  return (
    <span className={`${baseClasses} ${className}`} style={style}>
      {icon}
      {text}
    </span>
  );
};

/**
 * CyberStatusBadge - 状态徽章
 */
export interface CyberStatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CyberStatusBadge: React.FC<CyberStatusBadgeProps> = ({
  status,
  showText = true,
  size = 'md',
  className = '',
}) => {
  const statusConfig = {
    online: { color: '#00ff88', text: '在线', animated: true },
    offline: { color: '#606070', text: '离线', animated: false },
    busy: { color: '#ff0040', text: '忙碌', animated: false },
    away: { color: '#f0ff00', text: '离开', animated: false },
  };

  const config = statusConfig[status];
  const sizeClass = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5';
  const animationClass = config.animated ? 'animate-pulse' : '';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`${sizeClass} ${animationClass} rounded-full`}
        style={{
          backgroundColor: config.color,
          boxShadow: `0 0 8px ${config.color}`,
        }}
      />
      {showText && (
        <span className="text-sm" style={{ color: config.color }}>
          {config.text}
        </span>
      )}
    </span>
  );
};

export default CyberBadge;
