'use client';

/**
 * FingerprintIcon - 指纹图标
 * 表示生物识别、身份验证、安全
 */

interface FingerprintIconProps {
  size?: number;
  className?: string;
  scanning?: boolean;
}

export const FingerprintIcon = ({
  size = 24,
  className = '',
  scanning = false
}: FingerprintIconProps) => {
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
        {/* 指纹纹路 */}
        <g stroke="#00f0ff" strokeWidth="2" fill="none" opacity="0.7">
          {/* 中心 */}
          <ellipse cx="0" cy="0" rx="8" ry="10" />

          {/* 第一层 */}
          <path d="M-12 -15 Q0 -5 12 -15" />
          <path d="M-15 0 Q-8 8 0 8 Q8 8 15 0" />
          <path d="M-12 15 Q0 5 12 15" />

          {/* 第二层 */}
          <path d="M-18 -20 Q0 -8 18 -20" />
          <path d="M-22 0 Q-12 15 0 15 Q12 15 22 0" />
          <path d="M-18 20 Q0 8 18 20" />

          {/* 第三层 */}
          <path d="M-24 -25 Q0 -10 24 -25" />
          <path d="M-28 0 Q-15 20 0 20 Q15 20 28 0" />
          <path d="M-24 25 Q0 10 24 25" />

          {/* 外层 */}
          <path d="M-30 -30 Q0 -12 30 -30" opacity="0.5" />
          <path d="M-32 0 Q-18 25 0 25 Q18 25 32 0" opacity="0.5" />
          <path d="M-30 30 Q0 12 30 30" opacity="0.5" />
        </g>

        {/* 扫描效果 */}
        {scanning && (
          <>
            {/* 扫描线 */}
            <line
              x1="-35"
              y1="0"
              x2="35"
              y2="0"
              stroke="#ff0080"
              strokeWidth="2"
              opacity="0.8"
            >
              <animate
                attributeName="y1"
                values="-35;35;-35"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="y2"
                values="-35;35;-35"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>

            {/* 扫描发光效果 */}
            <rect
              x="-35"
              y="0"
              width="70"
              height="3"
              fill="url(#scanGlow)"
              opacity="0.3"
            >
              <animate
                attributeName="y"
                values="-35;35;-35"
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
          </>
        )}

        {/* 中心传感器 */}
        <circle cx="0" cy="0" r="5" fill="#9d00ff" opacity="0.8">
          {scanning && (
            <animate
              attributeName="opacity"
              values="0.8;0.3;0.8"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 数据点 */}
        {scanning && (
          <>
            <circle cx="0" cy="-20" r="2" fill="#00f0ff" opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                begin="0.3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="15" cy="0" r="2" fill="#00f0ff" opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                begin="0.8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="0" cy="20" r="2" fill="#00f0ff" opacity="0">
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="2s"
                begin="1.3s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </g>

      <defs>
        <linearGradient id="scanGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff0080" stopOpacity="0" />
          <stop offset="50%" stopColor="#ff0080" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff0080" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default FingerprintIcon;
