'use client';

/**
 * TokenIcon - 代币/加密货币图标
 * 表示区块链、加密货币、数字资产
 */

interface TokenIconProps {
  size?: number;
  className?: string;
  spinning?: boolean;
}

export const TokenIcon = ({
  size = 24,
  className = '',
  spinning = false
}: TokenIconProps) => {
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
        {/* 外环 */}
        <g>
          <circle
            cx="0"
            cy="0"
            r="35"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="3"
            strokeDasharray="10 5"
            opacity="0.5"
          >
            {spinning && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="10s"
                repeatCount="indefinite"
              />
            )}
          </circle>

          <circle
            cx="0"
            cy="0"
            r="35"
            fill="none"
            stroke="#9d00ff"
            strokeWidth="2"
            strokeDasharray="5 10"
            opacity="0.3"
          >
            {spinning && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360"
                to="0"
                dur="15s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </g>

        {/* 中环 */}
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="url(#tokenGradient)"
          opacity="0.8"
        />

        {/* 内部符号 */}
        <g>
          {/* 六边形 */}
          <path
            d="M0 -15 L13 -7.5 L13 7.5 L0 15 L-13 7.5 L-13 -7.5 Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.8"
          />

          {/* 中心点 */}
          <circle cx="0" cy="0" r="5" fill="#00f0ff">
            {spinning && (
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>

          {/* 连接线 */}
          <g stroke="#ffffff" strokeWidth="1" opacity="0.5">
            <line x1="0" y1="-15" x2="0" y2="15" />
            <line x1="-13" y1="-7.5" x2="13" y2="7.5" />
            <line x1="-13" y1="7.5" x2="13" y2="-7.5" />
          </g>
        </g>

        {/* 发光效果 */}
        <circle
          cx="0"
          cy="0"
          r="40"
          fill="#00f0ff"
          opacity="0.1"
        >
          {spinning && (
            <animate
              attributeName="r"
              values="40;45;40"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
          {spinning && (
            <animate
              attributeName="opacity"
              values="0.1;0.2;0.1"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </g>

      <defs>
        <linearGradient id="tokenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#9d00ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff0080" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TokenIcon;
