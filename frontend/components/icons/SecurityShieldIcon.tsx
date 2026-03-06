'use client';

/**
 * SecurityShieldIcon - 安全盾牌图标
 * 表示安全、保护、加密
 */

interface SecurityShieldIconProps {
  size?: number;
  className?: string;
  locked?: boolean;
  variant?: 'cyan' | 'purple' | 'green';
}

export const SecurityShieldIcon = ({
  size = 24,
  className = '',
  locked = true,
  variant = 'cyan'
}: SecurityShieldIconProps) => {
  const colors = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    green: '#00ff88',
  };

  const color = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 盾牌外轮廓 */}
      <path
        d="M50 10 L85 25 V50 C85 70 70 85 50 95 C30 85 15 70 15 50 V25 L50 10Z"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 盾牌内填充 */}
      <path
        d="M50 18 L78 30 V50 C78 67 65 80 50 88 C35 80 22 67 22 50 V30 L50 18Z"
        fill={color}
        fillOpacity="0.1"
      />

      {/* 锁图标 */}
      {locked ? (
        <g>
          {/* 锁体 */}
          <rect
            x="35"
            y="50"
            width="30"
            height="25"
            rx="3"
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          {/* 锁环 */}
          <path
            d="M40 50 V40 C40 35.5 43.5 32 50 32 C56.5 32 60 35.5 60 40 V50"
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          {/* 锁孔 */}
          <circle cx="50" cy="62" r="3" fill={color} />
          <line x1="50" y1="62" x2="50" y2="70" stroke={color} strokeWidth="2" />
        </g>
      ) : (
        <g>
          {/* 开锁状态 */}
          <rect
            x="35"
            y="50"
            width="30"
            height="25"
            rx="3"
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          {/* 打开的锁环 */}
          <path
            d="M40 50 V40 C40 35.5 43.5 32 50 32 C56.5 32 60 35.5 60 40"
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          {/* 锁孔 */}
          <circle cx="50" cy="62" r="3" fill={color} />
        </g>
      )}

      {/* 扫描效果 */}
      <rect
        x="20"
        y="20"
        width="60"
        height="60"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
      >
        <animate
          attributeName="opacity"
          values="0.3;0.1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>

      {/* 角标装饰 */}
      <g stroke={color} strokeWidth="2" opacity="0.5">
        <path d="M20 30 V20 H30" fill="none" />
        <path d="M70 20 H80 V30" fill="none" />
        <path d="M80 70 V80 H70" fill="none" />
        <path d="M30 80 H20 V70" fill="none" />
      </g>
    </svg>
  );
};

export default SecurityShieldIcon;
