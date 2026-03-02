import React from 'react';

interface CyberShieldIconProps {
  size?: number;
  className?: string;
  color?: string;
  secure?: boolean;
}

/**
 * 赛博安全图标
 * 用于表示安全、防护、加密或认证
 */
export const CyberShieldIcon: React.FC<CyberShieldIconProps> = ({
  size = 24,
  className = '',
  color = '#00f0ff',
  secure = true
}) => {
  const statusColor = secure ? '#00ff88' : '#ff0040';

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
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#9d00ff', stopOpacity: 0.1 }} />
        </linearGradient>
      </defs>

      {/* 盾牌外形 */}
      <path
        d="M12 2 L4 6 V12 C4 17 7.5 21 12 22 C16.5 21 20 17 20 12 V6 L12 2 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="url(#shieldGradient)"
      />

      {/* 内部边框 */}
      <path
        d="M12 4 L6 7 V12 C6 16 8.5 19 12 20 C15.5 19 18 16 18 12 V7 L12 4 Z"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.5"
      />

      {/* 扫描线 */}
      <line x1="6" y1="10" x2="18" y2="10" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="6" y1="14" x2="18" y2="14" stroke={color} strokeWidth="0.5" opacity="0.3" />

      {/* 中心锁形 */}
      <g transform="translate(12, 12)">
        {/* 锁体 */}
        <rect x="-3.5" y="-1" width="7" height="6" rx="1" fill={statusColor} opacity="0.9" />
        <rect x="-3.5" y="-1" width="7" height="6" rx="1" stroke={color} strokeWidth="0.5" fill="none" />

        {/* 锁环 */}
        <path
          d="M-2.5 -1 V-3.5 C-2.5 -5.5 -1.5 -6.5 0 -6.5 C1.5 -6.5 2.5 -5.5 2.5 -3.5 V-1"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />

        {/* 锁孔 */}
        <circle cx="0" cy="1.5" r="1" fill="#0a0a0f" />
        <line x1="0" y1="1.5" x2="0" y2="3" stroke="#0a0a0f" strokeWidth="0.5" />
      </g>

      {/* 角落装饰 */}
      <g opacity="0.4">
        <path d="M7 6 L8 6 L7 7" stroke={color} strokeWidth="1" fill="none" />
        <path d="M17 6 L16 6 L17 7" stroke={color} strokeWidth="1" fill="none" />
        <path d="M7 18 L8 18 L7 17" stroke={color} strokeWidth="1" fill="none" />
        <path d="M17 18 L16 18 L17 17" stroke={color} strokeWidth="1" fill="none" />
      </g>

      {/* 状态指示点 */}
      <circle cx="16" cy="5" r="1.5" fill={statusColor} opacity="0.8">
        {secure && (
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
};

export default CyberShieldIcon;
