'use client';

/**
 * VRHeadsetIcon - VR 头显图标
 * 表示虚拟现实、VR体验
 */

interface VRHeadsetIconProps {
  size?: number;
  className?: string;
  glowing?: boolean;
}

export const VRHeadsetIcon = ({
  size = 24,
  className = '',
  glowing = false
}: VRHeadsetIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 头显带子 */}
      <path
        d="M20 50 C20 30 30 20 50 20 C70 20 80 30 80 50"
        fill="none"
        stroke="#9d00ff"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* 头显主体 */}
      <rect
        x="15"
        y="45"
        width="70"
        height="35"
        rx="8"
        fill="none"
        stroke="#00f0ff"
        strokeWidth="3"
      />

      {/* 内部填充 */}
      <rect
        x="20"
        y="50"
        width="60"
        height="25"
        rx="5"
        fill="url(#vrGradient)"
        opacity="0.3"
      />

      {/* 镜片 */}
      <g>
        {/* 左镜片 */}
        <ellipse
          cx="35"
          cy="62"
          rx="12"
          ry="10"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="2"
        />
        <ellipse
          cx="35"
          cy="62"
          rx="8"
          ry="6"
          fill="#00f0ff"
          opacity="0.2"
        />

        {/* 右镜片 */}
        <ellipse
          cx="65"
          cy="62"
          rx="12"
          ry="10"
          fill="none"
          stroke="#00f0ff"
          strokeWidth="2"
        />
        <ellipse
          cx="65"
          cy="62"
          rx="8"
          ry="6"
          fill="#00f0ff"
          opacity="0.2"
        />
      </g>

      {/* LED 指示灯 */}
      <circle cx="50" cy="45" r="3" fill="#ff0080">
        {glowing && (
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* 侧边按钮 */}
      <circle cx="80" cy="55" r="4" fill="none" stroke="#9d00ff" strokeWidth="2" />
      <circle cx="20" cy="55" r="4" fill="none" stroke="#9d00ff" strokeWidth="2" />

      {/* 发光效果 */}
      {glowing && (
        <ellipse
          cx="50"
          cy="62"
          rx="35"
          ry="20"
          fill="#00f0ff"
          opacity="0.1"
        >
          <animate
            attributeName="opacity"
            values="0.1;0.2;0.1"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>
      )}

      <defs>
        <linearGradient id="vrGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default VRHeadsetIcon;
