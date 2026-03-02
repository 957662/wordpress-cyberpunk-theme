import React from 'react';

/**
 * 量子计算图标 - 量子纠缠效果
 *
 * 特点：
 * - 粒子纠缠视觉
 * - 轨道运动效果
 * - 霓虹色彩
 * - 动态光效
 *
 * @example
 * ```tsx
 * <QuantumIcon size={64} variant="purple" animated={true} />
 * <QuantumIcon size={48} variant="cyan" />
 * ```
 */

interface QuantumIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'gradient';
  className?: string;
  animated?: boolean;
}

const colorMap = {
  cyan: { primary: '#00f0ff', secondary: '#00a0ff' },
  purple: { primary: '#9d00ff', secondary: '#bd66ff' },
  pink: { primary: '#ff0080', secondary: '#ff66b3' },
  gradient: { primary: '#00f0ff', secondary: '#ff0080' },
};

export const QuantumIcon: React.FC<QuantumIconProps> = ({
  size = 64,
  variant = 'purple',
  className = '',
  animated = false,
}) => {
  const colors = colorMap[variant];
  const animationClass = animated ? 'animate-spin-slow' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animationClass}`}
    >
      <defs>
        {/* 发光滤镜 */}
        <filter id="quantumGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 粒子渐变 */}
        <radialGradient id="particleGradient">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 外圈轨道 */}
      <ellipse
        cx="32"
        cy="32"
        rx="28"
        ry="12"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        transform="rotate(0 32 32)"
      />

      <ellipse
        cx="32"
        cy="32"
        rx="28"
        ry="12"
        stroke={colors.secondary}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        transform="rotate(60 32 32)"
      />

      <ellipse
        cx="32"
        cy="32"
        rx="28"
        ry="12"
        stroke={colors.primary}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
        transform="rotate(120 32 32)"
      />

      {/* 中心核心 */}
      <circle
        cx="32"
        cy="32"
        r="8"
        fill={colors.primary}
        filter="url(#quantumGlow)"
        opacity="0.8"
      />

      <circle
        cx="32"
        cy="32"
        r="4"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* 轨道粒子 */}
      <circle
        cx="60"
        cy="32"
        r="3"
        fill={colors.primary}
        filter="url(#quantumGlow)"
      >
        {animated && (
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path="M32,32 m-28,0 a28,12 0 1,0 56,0 a28,12 0 1,0 -56,0"
          />
        )}
      </circle>

      <circle
        cx="46"
        cy="54"
        r="2.5"
        fill={colors.secondary}
        filter="url(#quantumGlow)"
      >
        {animated && (
          <animateMotion
            dur="2.5s"
            repeatCount="indefinite"
            path="M32,32 m-24,0 a24,10 1 1,0 48,0 a24,10 1 1,0 -48,0"
          />
        )}
      </circle>

      <circle
        cx="18"
        cy="54"
        r="2"
        fill={colors.primary}
        filter="url(#quantumGlow)"
        opacity="0.7"
      >
        {animated && (
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M32,32 m-20,0 a20,8 2 1,0 40,0 a20,8 2 1,0 -40,0"
          />
        )}
      </circle>

      {/* 能量波纹 */}
      {animated && (
        <>
          <circle
            cx="32"
            cy="32"
            r="8"
            fill="none"
            stroke={colors.primary}
            strokeWidth="1"
            opacity="0.5"
          >
            <animate
              attributeName="r"
              values="8;24;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}

      {/* 连接线 */}
      <line
        x1="32"
        y1="32"
        x2="60"
        y2="32"
        stroke={colors.primary}
        strokeWidth="0.5"
        opacity="0.3"
      />

      <line
        x1="32"
        y1="32"
        x2="46"
        y2="54"
        stroke={colors.secondary}
        strokeWidth="0.5"
        opacity="0.3"
      />

      <line
        x1="32"
        y1="32"
        x2="18"
        y2="54"
        stroke={colors.primary}
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  );
};

export default QuantumIcon;
