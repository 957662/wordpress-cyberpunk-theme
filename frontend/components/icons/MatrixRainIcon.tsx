'use client';

/**
 * MatrixRainIcon - 矩阵雨图标
 * 表示代码、数据流、黑客主题
 */

interface MatrixRainIconProps {
  size?: number;
  className?: string;
  raining?: boolean;
}

export const MatrixRainIcon = ({
  size = 24,
  className = '',
  raining = true
}: MatrixRainIconProps) => {
  const columns = 8;
  const chars = ['0', '1', '7', '3', 'A', 'F', 'X', 'Z'];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 背景渐变 */}
      <defs>
        <linearGradient id="rainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
          <stop offset="50%" stopColor="#00ff88" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 矩阵雨列 */}
      {Array.from({ length: columns }).map((_, colIndex) => {
        const x = 12 + colIndex * 11;
        const delay = colIndex * 0.3;
        const char = chars[colIndex % chars.length];

        return (
          <g key={colIndex}>
            {/* 每列的主字符 */}
            <text
              x={x}
              y="20"
              fontSize="10"
              fill="#00ff88"
              fontFamily="monospace"
              opacity="0.3"
            >
              {char}
              {raining && (
                <animate
                  attributeName="y"
                  values="20;100;20"
                  dur={`${3 + colIndex * 0.5}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              )}
            </text>

            {/* 尾迹效果 */}
            {raining && (
              <>
                <text
                  x={x}
                  y="10"
                  fontSize="8"
                  fill="url(#rainGradient)"
                  fontFamily="monospace"
                  opacity="0.2"
                >
                  {char}
                  <animate
                    attributeName="y"
                    values="10;90;10"
                    dur={`${3 + colIndex * 0.5}s`}
                    begin={`${delay}s`}
                    repeatCount="indefinite"
                  />
                </text>
                <text
                  x={x}
                  y="0"
                  fontSize="6"
                  fill="url(#rainGradient)"
                  fontFamily="monospace"
                  opacity="0.1"
                >
                  {char}
                  <animate
                    attributeName="y"
                    values="0;80;0"
                    dur={`${3 + colIndex * 0.5}s`}
                    begin={`${delay}s`}
                    repeatCount="indefinite"
                  />
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* 边框装饰 */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        fill="none"
        stroke="#00ff88"
        strokeWidth="1"
        opacity="0.3"
        rx="5"
      />

      {/* 角标 */}
      <g stroke="#00ff88" strokeWidth="2" opacity="0.5">
        <path d="M5 15 V5 H15" fill="none" />
        <path d="M85 5 H95 V15" fill="none" />
        <path d="M95 85 V95 H85" fill="none" />
        <path d="M15 95 H5 V85" fill="none" />
      </g>

      {/* 扫描线 */}
      <line
        x1="5"
        y1="0"
        x2="95"
        y2="0"
        stroke="#00ff88"
        strokeWidth="1"
        opacity="0.1"
      >
        {raining && (
          <animate
            attributeName="y1"
            values="0;100;0"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
        {raining && (
          <animate
            attributeName="y2"
            values="0;100;0"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </line>
    </svg>
  );
};

export default MatrixRainIcon;
