'use client';

/**
 * NeuralIcon - 神经网络图标
 * 表示 AI、机器学习、神经网络
 */

interface NeuralIconProps {
  size?: number;
  className?: string;
  pulsing?: boolean;
}

export const NeuralIcon = ({
  size = 24,
  className = '',
  pulsing = false
}: NeuralIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 神经连接线 */}
      <g stroke="#00f0ff" strokeWidth="1" opacity="0.6">
        <line x1="50" y1="50" x2="25" y2="25" />
        <line x1="50" y1="50" x2="75" y2="25" />
        <line x1="50" y1="50" x2="25" y2="75" />
        <line x1="50" y1="50" x2="75" y2="75" />
        <line x1="50" y1="50" x2="50" y2="15" />
        <line x1="50" y1="50" x2="50" y2="85" />
        <line x1="25" y1="25" x2="50" y2="15" />
        <line x1="75" y1="25" x2="50" y2="15" />
        <line x1="25" y1="75" x2="50" y2="85" />
        <line x1="75" y1="75" x2="50" y2="85" />
      </g>

      {/* 外层节点 */}
      <g>
        <circle cx="25" cy="25" r="5" fill="#9d00ff">
          {pulsing && (
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="75" cy="25" r="5" fill="#9d00ff">
          {pulsing && (
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="25" cy="75" r="5" fill="#ff0080">
          {pulsing && (
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="75" cy="75" r="5" fill="#ff0080">
          {pulsing && (
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2s"
              begin="0.9s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="50" cy="15" r="5" fill="#00f0ff">
          {pulsing && (
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="50" cy="85" r="5" fill="#00f0ff">
          {pulsing && (
            <animate
              attributeName="r"
              values="5;7;5"
              dur="2s"
              begin="0.7s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </g>

      {/* 中心节点 */}
      <circle cx="50" cy="50" r="8" fill="#00f0ff" opacity="0.9">
        {pulsing && (
          <animate
            attributeName="opacity"
            values="0.9;0.5;0.9"
            dur="1.5s"
            repeatCount="indefinite"
          />
        )}
      </circle>
      <circle cx="50" cy="50" r="12" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.3">
        {pulsing && (
          <animate
            attributeName="r"
            values="12;16;12"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* 数据流动效果 */}
      {pulsing && (
        <g>
          <circle cx="0" cy="0" r="2" fill="#ffffff">
            <animateMotion
              dur="1.5s"
              repeatCount="indefinite"
              path="M50,50 L25,25"
            />
            <animate
              attributeName="opacity"
              values="1;0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      )}
    </svg>
  );
};

export default NeuralIcon;
