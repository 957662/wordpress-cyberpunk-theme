import React from 'react';

interface CyberGlitchIconProps {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * 赛博故障图标
 * 用于表达错误、警告或赛博朋克风格装饰
 */
export const CyberGlitchIcon: React.FC<CyberGlitchIconProps> = ({
  size = 24,
  className = '',
  color = '#00f0ff'
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
      <defs>
        <filter id="glitch" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </defs>

      {/* 主三角形 */}
      <path
        d="M12 2 L22 20 L2 20 Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        filter="url(#glitch)"
        opacity="0.9"
      />

      {/* 故障偏移效果 */}
      <path
        d="M12 2 L22 20 L2 20 Z"
        stroke="#ff0080"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
        transform="translate(0.5, 0)"
      />

      <path
        d="M12 2 L22 20 L2 20 Z"
        stroke="#9d00ff"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
        transform="translate(-0.5, 0)"
      />

      {/* 中心点 */}
      <circle cx="12" cy="14" r="2" fill={color} />
    </svg>
  );
};

export default CyberGlitchIcon;
