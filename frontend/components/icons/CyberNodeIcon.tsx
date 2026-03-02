import React from 'react';

interface CyberNodeIconProps {
  size?: number;
  className?: string;
  color?: string;
  connected?: boolean;
}

/**
 * 赛博节点图标
 * 用于表示网络、连接、区块链或分布式系统
 */
export const CyberNodeIcon: React.FC<CyberNodeIconProps> = ({
  size = 24,
  className = '',
  color = '#00f0ff',
  connected = true
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
      {/* 连接线 */}
      {connected && (
        <g opacity="0.4">
          <line x1="12" y1="12" x2="5" y2="5" stroke={color} strokeWidth="1" />
          <line x1="12" y1="12" x2="19" y2="5" stroke={color} strokeWidth="1" />
          <line x1="12" y1="12" x2="5" y2="19" stroke={color} strokeWidth="1" />
          <line x1="12" y1="12" x2="19" y2="19" stroke={color} strokeWidth="1" />
          <line x1="5" y1="5" x2="19" y2="5" stroke="#9d00ff" strokeWidth="0.5" opacity="0.5" />
          <line x1="5" y1="19" x2="19" y2="19" stroke="#9d00ff" strokeWidth="0.5" opacity="0.5" />
        </g>
      )}

      {/* 外围节点 */}
      <g>
        {/* 左上 */}
        <circle cx="5" cy="5" r="2.5" fill="#0a0a0f" stroke={color} strokeWidth="1.5" />
        <circle cx="5" cy="5" r="1" fill={color} opacity="0.8" />

        {/* 右上 */}
        <circle cx="19" cy="5" r="2.5" fill="#0a0a0f" stroke={color} strokeWidth="1.5" />
        <circle cx="19" cy="5" r="1" fill={color} opacity="0.8" />

        {/* 左下 */}
        <circle cx="5" cy="19" r="2.5" fill="#0a0a0f" stroke={color} strokeWidth="1.5" />
        <circle cx="5" cy="19" r="1" fill="#9d00ff" opacity="0.8" />

        {/* 右下 */}
        <circle cx="19" cy="19" r="2.5" fill="#0a0a0f" stroke={color} strokeWidth="1.5" />
        <circle cx="19" cy="19" r="1" fill="#9d00ff" opacity="0.8" />
      </g>

      {/* 中心主节点 */}
      <circle cx="12" cy="12" r="4" fill="#0a0a0f" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.9" />
      <circle cx="12" cy="12" r="0.8" fill="#f0ff00" opacity="0.8" />

      {/* 数据流动指示 */}
      {connected && (
        <g opacity="0.6">
          <circle cx="8.5" cy="8.5" r="0.8" fill="#00f0ff" />
          <circle cx="15.5" cy="8.5" r="0.8" fill="#00f0ff" />
          <circle cx="8.5" cy="15.5" r="0.8" fill="#9d00ff" />
          <circle cx="15.5" cy="15.5" r="0.8" fill="#9d00ff" />
        </g>
      )}
    </svg>
  );
};

export default CyberNodeIcon;
