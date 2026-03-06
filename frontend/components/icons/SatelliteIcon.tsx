'use client';

/**
 * SatelliteIcon - 卫星图标
 * 表示卫星通信、太空技术
 */

interface SatelliteIconProps {
  size?: number;
  className?: string;
  orbiting?: boolean;
}

export const SatelliteIcon = ({
  size = 24,
  className = '',
  orbiting = false
}: SatelliteIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(50, 50)">
        {/* 轨道动画 */}
        {orbiting && (
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="8s"
              repeatCount="indefinite"
            />

            {/* 太阳能板 - 左 */}
            <rect x="-45" y="-8" width="25" height="16" fill="#00f0ff" opacity="0.6" rx="2">
              {orbiting && (
                <animate
                  attributeName="opacity"
                  values="0.6;0.9;0.6"
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </rect>
            {/* 太阳能板网格 - 左 */}
            <g stroke="#0a0a0f" strokeWidth="0.5" opacity="0.3">
              <line x1="-40" y1="-8" x2="-40" y2="8" />
              <line x1="-35" y1="-8" x2="-35" y2="8" />
              <line x1="-30" y1="-8" x2="-30" y2="8" />
            </g>

            {/* 太阳能板 - 右 */}
            <rect x="20" y="-8" width="25" height="16" fill="#00f0ff" opacity="0.6" rx="2">
              {orbiting && (
                <animate
                  attributeName="opacity"
                  values="0.6;0.9;0.6"
                  dur="4s"
                  repeatCount="indefinite"
                />
              )}
            </rect>
            {/* 太阳能板网格 - 右 */}
            <g stroke="#0a0a0f" strokeWidth="0.5" opacity="0.3">
              <line x1="25" y1="-8" x2="25" y2="8" />
              <line x1="30" y1="-8" x2="30" y2="8" />
              <line x1="35" y1="-8" x2="35" y2="8" />
            </g>

            {/* 连接杆 */}
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#9d00ff" strokeWidth="3" />

            {/* 卫星主体 */}
            <rect x="-10" y="-10" width="20" height="20" fill="#16162a" stroke="#9d00ff" strokeWidth="2" rx="3" />

            {/* 天线 */}
            <path d="M0 -10 L0 -18" stroke="#9d00ff" strokeWidth="2" />
            <circle cx="0" cy="-18" r="2" fill="#ff0080">
              {orbiting && (
                <animate
                  attributeName="opacity"
                  values="1;0.3;1"
                  dur="1s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        )}

        {/* 静态版本（当不旋转时显示） */}
        {!orbiting && (
          <>
            {/* 太阳能板 - 左 */}
            <rect x="-45" y="-8" width="25" height="16" fill="#00f0ff" opacity="0.6" rx="2" />
            <g stroke="#0a0a0f" strokeWidth="0.5" opacity="0.3">
              <line x1="-40" y1="-8" x2="-40" y2="8" />
              <line x1="-35" y1="-8" x2="-35" y2="8" />
              <line x1="-30" y1="-8" x2="-30" y2="8" />
            </g>

            {/* 太阳能板 - 右 */}
            <rect x="20" y="-8" width="25" height="16" fill="#00f0ff" opacity="0.6" rx="2" />
            <g stroke="#0a0a0f" strokeWidth="0.5" opacity="0.3">
              <line x1="25" y1="-8" x2="25" y2="8" />
              <line x1="30" y1="-8" x2="30" y2="8" />
              <line x1="35" y1="-8" x2="35" y2="8" />
            </g>

            {/* 连接杆 */}
            <line x1="-20" y1="0" x2="20" y2="0" stroke="#9d00ff" strokeWidth="3" />

            {/* 卫星主体 */}
            <rect x="-10" y="-10" width="20" height="20" fill="#16162a" stroke="#9d00ff" strokeWidth="2" rx="3" />

            {/* 天线 */}
            <path d="M0 -10 L0 -18" stroke="#9d00ff" strokeWidth="2" />
            <circle cx="0" cy="-18" r="2" fill="#ff0080" />
          </>
        )}

        {/* 轨道路径 */}
        <circle cx="0" cy="0" r="35" fill="none" stroke="#00f0ff" strokeWidth="1" opacity="0.2" strokeDasharray="5 5" />
      </g>
    </svg>
  );
};

export default SatelliteIcon;
