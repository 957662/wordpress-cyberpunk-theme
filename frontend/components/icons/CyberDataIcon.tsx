import React from 'react';

interface CyberDataIconProps {
  size?: number;
  className?: string;
  color?: string;
  loading?: boolean;
}

/**
 * 赛博数据图标
 * 用于表示数据存储、数据库或信息处理
 */
export const CyberDataIcon: React.FC<CyberDataIconProps> = ({
  size = 24,
  className = '',
  color = '#00f0ff',
  loading = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 数据库堆栈 */}
      <g>
        {/* 顶层 */}
        <ellipse cx="12" cy="5" rx="7" ry="2.5" stroke={color} strokeWidth="1.5" fill="none" />
        <ellipse cx="12" cy="5" rx="5" ry="1.5" fill={color} opacity="0.2" />

        {/* 中层 */}
        <path
          d="M5 5 V10 C5 11.5 8 12.5 12 12.5 C16 12.5 19 11.5 19 10 V5"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse cx="12" cy="10" rx="7" ry="2.5" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />

        {/* 底层 */}
        <path
          d="M5 10 V15 C5 16.5 8 17.5 12 17.5 C16 17.5 19 16.5 19 15 V10"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        <ellipse cx="12" cy="15" rx="7" ry="2.5" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
      </g>

      {/* 数据流线条 */}
      <g opacity="0.6">
        <line x1="8" y1="6" x2="8" y2="8" stroke={color} strokeWidth="1">
          {loading && (
            <animate
              attributeName="y1"
              values="6;4;6"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
          {loading && (
            <animate
              attributeName="y2"
              values="8;6;8"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </line>
        <line x1="12" y1="6" x2="12" y2="9" stroke="#9d00ff" strokeWidth="1">
          {loading && (
            <animate
              attributeName="y1"
              values="6;4;6"
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}
          {loading && (
            <animate
              attributeName="y2"
              values="9;7;9"
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}
        </line>
        <line x1="16" y1="6" x2="16" y2="8" stroke={color} strokeWidth="1">
          {loading && (
            <animate
              attributeName="y1"
              values="6;4;6"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
          {loading && (
            <animate
              attributeName="y2"
              values="8;6;8"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
        </line>
      </g>

      {/* 装饰点 */}
      <circle cx="6" cy="7" r="0.8" fill="#f0ff00" opacity="0.7" />
      <circle cx="18" cy="12" r="0.8" fill="#f0ff00" opacity="0.7" />
      <circle cx="9" cy="16" r="0.8" fill="#ff0080" opacity="0.7" />

      {/* 发光效果 */}
      <circle cx="12" cy="5" r="1" fill={color} opacity="0.8">
        {loading && (
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>
    </svg>
  );
};

export default CyberDataIcon;
