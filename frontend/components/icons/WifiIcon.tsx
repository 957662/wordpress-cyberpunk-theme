'use client';

/**
 * WifiIcon - WiFi 图标
 * 表示无线连接、网络信号
 */

interface WifiIconProps {
  size?: number;
  className?: string;
  strength?: 0 | 1 | 2 | 3;
  animated?: boolean;
}

export const WifiIcon = ({
  size = 24,
  className = '',
  strength = 3,
  animated = false
}: WifiIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(50, 75)">
        {/* 中心点 */}
        <circle cx="0" cy="0" r="5" fill="#00f0ff">
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* 信号弧 */}
        {[
          { r: 15, opacity: strength >= 1 ? 0.8 : 0.2, delay: 0 },
          { r: 30, opacity: strength >= 2 ? 0.6 : 0.2, delay: 0.2 },
          { r: 45, opacity: strength >= 3 ? 0.4 : 0.2, delay: 0.4 },
        ].map((signal, index) => (
          <g key={index}>
            <path
              d={`M-${signal.r} -${signal.r * 0.3} A${signal.r} ${signal.r * 0.5} 0 0 1 ${signal.r} -${signal.r * 0.3}`}
              stroke="#00f0ff"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity={signal.opacity}
            >
              {animated && signal.opacity > 0.3 && (
                <animate
                  attributeName="opacity"
                  values={`${signal.opacity};${signal.opacity * 0.5};${signal.opacity}`}
                  dur="2s"
                  begin={`${signal.delay}s`}
                  repeatCount="indefinite"
                />
              )}
            </path>
          </g>
        ))}

        {/* 发光效果 */}
        {animated && strength > 0 && (
          <circle
            cx="0"
            cy="0"
            r="60"
            fill="#00f0ff"
            opacity="0.1"
          >
            <animate
              attributeName="r"
              values="60;70;60"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.1;0.05;0.1"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* 数据流动效果 */}
        {animated && strength === 3 && (
          <g>
            <circle r="2" fill="#ffffff" opacity="0.8">
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                path="M0 0 L-30 -10"
              />
              <animate
                attributeName="opacity"
                values="1;0"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2" fill="#ffffff" opacity="0.8">
              <animateMotion
                dur="1.5s"
                begin="0.5s"
                repeatCount="indefinite"
                path="M0 0 L30 -10"
              />
              <animate
                attributeName="opacity"
                values="1;0"
                dur="1.5s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="2" fill="#ffffff" opacity="0.8">
              <animateMotion
                dur="1.5s"
                begin="1s"
                repeatCount="indefinite"
                path="M0 0 L0 -20"
              />
              <animate
                attributeName="opacity"
                values="1;0"
                dur="1.5s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </g>
    </svg>
  );
};

export default WifiIcon;
