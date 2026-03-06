'use client';

/**
 * DataStreamIcon - 数据流图标
 * 表示数据传输、API、实时连接
 */

interface DataStreamIconProps {
  size?: number;
  className?: string;
  flowing?: boolean;
}

export const DataStreamIcon = ({
  size = 24,
  className = '',
  flowing = true
}: DataStreamIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 数据包 */}
      <g>
        <circle cx="20" cy="20" r="4" fill="#00f0ff">
          {flowing && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="50" cy="20" r="4" fill="#9d00ff">
          {flowing && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="0.3s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="80" cy="20" r="4" fill="#ff0080">
          {flowing && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        <circle cx="20" cy="50" r="4" fill="#9d00ff">
          {flowing && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="50" cy="50" r="4" fill="#ff0080">
          {flowing && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="80" cy="50" r="4" fill="#00f0ff">
          {flowing && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="0.8s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        <circle cx="20" cy="80" r="4" fill="#ff0080">
          {flowing && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="50" cy="80" r="4" fill="#00f0ff">
          {flowing && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="0.7s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="80" cy="80" r="4" fill="#9d00ff">
          {flowing && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              begin="1s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </g>

      {/* 连接线 */}
      <g stroke="#2a2a4a" strokeWidth="1" opacity="0.5">
        <line x1="20" y1="20" x2="50" y2="20" />
        <line x1="50" y1="20" x2="80" y2="20" />
        <line x1="20" y1="50" x2="50" y2="50" />
        <line x1="50" y1="50" x2="80" y2="50" />
        <line x1="20" y1="80" x2="50" y2="80" />
        <line x1="50" y1="80" x2="80" y2="80" />

        <line x1="20" y1="20" x2="20" y2="50" />
        <line x1="20" y1="50" x2="20" y2="80" />
        <line x1="50" y1="20" x2="50" y2="50" />
        <line x1="50" y1="50" x2="50" y2="80" />
        <line x1="80" y1="20" x2="80" y2="50" />
        <line x1="80" y1="50" x2="80" y2="80" />
      </g>
    </svg>
  );
};

export default DataStreamIcon;
