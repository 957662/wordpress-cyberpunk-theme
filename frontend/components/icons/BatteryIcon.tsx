'use client';

/**
 * BatteryIcon - 电池图标
 * 表示电池状态、电量
 */

interface BatteryIconProps {
  size?: number;
  className?: string;
  level?: number; // 0-100
  charging?: boolean;
}

export const BatteryIcon = ({
  size = 24,
  className = '',
  level = 75,
  charging = false
}: BatteryIconProps) => {
  // 根据电量确定颜色
  const getColor = () => {
    if (level <= 20) return '#ff0080'; // 红色 - 低电量
    if (level <= 50) return '#f0ff00'; // 黄色 - 中等电量
    return '#00ff88'; // 绿色 - 高电量
  };

  const color = getColor();

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
        {/* 电池主体 */}
        <rect x="-35" y="-20" width="70" height="40" fill="#0a0a0f" stroke="#2a2a4a" strokeWidth="3" rx="5" />

        {/* 电池正极 */}
        <rect x="35" y="-10" width="8" height="20" fill="#2a2a4a" rx="2" />

        {/* 电量显示 */}
        <rect
          x="-30"
          y="-15"
          width={(60 * level) / 100}
          height="30"
          fill={color}
          opacity="0.8"
          rx="3"
        >
          {charging && (
            <animate
              attributeName="opacity"
              values="0.8;0.4;0.8"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </rect>

        {/* 充电图标 */}
        {charging && (
          <g>
            {/* 闪电符号 */}
            <path
              d="M-5 -12 L8 -2 L2 -2 L5 12 L-8 2 L-2 2 Z"
              fill="#ffffff"
              opacity="0.9"
            >
              <animate
                attributeName="opacity"
                values="0.9;0.5;0.9"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>

            {/* 充电动画效果 */}
            {Array.from({ length: 3 }).map((_, i) => (
              <circle
                key={i}
                cy="0"
                r="2"
                fill="#00f0ff"
                opacity="0"
              >
                <animate
                  attributeName="cx"
                  values="-30;35"
                  dur="1.5s"
                  begin={`${i * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="1.5s"
                  begin={`${i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}

        {/* 电量百分比文字 */}
        <text
          x="0"
          y="5"
          fontSize="14"
          fontWeight="bold"
          fill="#ffffff"
          textAnchor="middle"
          fontFamily="monospace"
          opacity="0.9"
        >
          {level}%
        </text>

        {/* 低电量警告动画 */}
        {level <= 20 && (
          <rect
            x="-35"
            y="-20"
            width="70"
            height="40"
            fill="none"
            stroke="#ff0080"
            strokeWidth="2"
            rx="5"
            opacity="0.5"
          >
            <animate
              attributeName="opacity"
              values="0.5;0.1;0.5"
              dur="1s"
              repeatCount="indefinite"
            />
          </rect>
        )}

        {/* 充电发光效果 */}
        {charging && (
          <circle
            cx="0"
            cy="0"
            r="45"
            fill="#00f0ff"
            opacity="0.1"
          >
            <animate
              attributeName="r"
              values="45;50;45"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.1;0.05;0.1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </g>
    </svg>
  );
};

export default BatteryIcon;
