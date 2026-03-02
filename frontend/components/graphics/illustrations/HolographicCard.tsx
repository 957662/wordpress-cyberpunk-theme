import React from 'react';

/**
 * 全息卡片插画 - 赛博朋克风格装饰元素
 *
 * 用途：
 * - 英雄区背景
 * - 功能卡片装饰
 * - 加载动画
 * - 空状态展示
 *
 * @example
 * ```tsx
 * <HolographicCard width={400} height={300} variant="cyber" />
 * <HolographicCard width={200} height={200} variant="matrix" animated={true} />
 * ```
 */

interface HolographicCardProps {
  width?: number;
  height?: number;
  variant?: 'cyber' | 'matrix' | 'neural' | 'quantum';
  className?: string;
  animated?: boolean;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({
  width = 400,
  height = 300,
  variant = 'cyber',
  className = '',
  animated = false,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'cyber':
        return { primary: '#00f0ff', secondary: '#9d00ff', accent: '#ff0080' };
      case 'matrix':
        return { primary: '#00ff88', secondary: '#00aa55', accent: '#008844' };
      case 'neural':
        return { primary: '#9d00ff', secondary: '#bd66ff', accent: '#7700cc' };
      case 'quantum':
        return { primary: '#ff0080', secondary: '#ff66b3', accent: '#cc0066' };
    }
  };

  const colors = getColors();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* 全息渐变 */}
        <linearGradient id="holographicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.1" />
          <stop offset="50%" stopColor={colors.secondary} stopOpacity="0.15" />
          <stop offset="100%" stopColor={colors.accent} stopOpacity="0.1} />
        </linearGradient>

        {/* 扫描线图案 */}
        <pattern id="hologramScanlines" patternUnits="userSpaceOnUse" width="4" height="4">
          <line
            x1="0"
            y1="0"
            x2="4"
            y2="0"
            stroke={colors.primary}
            strokeWidth="0.5"
            opacity="0.1"
          />
        </pattern>

        {/* 网格图案 */}
        <pattern id="hologramGrid" patternUnits="userSpaceOnUse" width="20" height="20">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke={colors.primary}
            strokeWidth="0.5"
            opacity="0.15"
          />
        </pattern>

        {/* 发光滤镜 */}
        <filter id="hologramGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景层 */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#holographicGradient)"
      />

      {/* 网格覆盖 */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#hologramGrid)"
      />

      {/* 扫描线覆盖 */}
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill="url(#hologramScanlines)"
      />

      {/* 全息边框 */}
      <rect
        x="10"
        y="10"
        width={width - 20}
        height={height - 20}
        fill="none"
        stroke={colors.primary}
        strokeWidth="1"
        opacity="0.5"
        filter="url(#hologramGlow)"
      />

      {/* 角落装饰 */}
      <g stroke={colors.secondary} strokeWidth="2" fill="none">
        {/* 左上角 */}
        <path d="M 20 30 L 20 20 L 30 20" opacity="0.6" />
        {/* 右上角 */}
        <path d={`M ${width - 30} 20 L ${width - 20} 20 L ${width - 20} 30`} opacity="0.6" />
        {/* 右下角 */}
        <path d={`M ${width - 20} ${height - 30} L ${width - 20} ${height - 20} L ${width - 30} ${height - 20}`} opacity="0.6" />
        {/* 左下角 */}
        <path d={`M 30 ${height - 20} L 20 ${height - 20} L 20 ${height - 30}`} opacity="0.6" />
      </g>

      {/* 中央全息核心 */}
      <g filter="url(#hologramGlow)">
        {variant === 'cyber' && (
          <>
            {/* 六边形核心 */}
            <path
              d={`M ${width / 2} ${height / 2 - 40}
                  L ${width / 2 + 35} ${height / 2 - 20}
                  L ${width / 2 + 35} ${height / 2 + 20}
                  L ${width / 2} ${height / 2 + 40}
                  L ${width / 2 - 35} ${height / 2 + 20}
                  L ${width / 2 - 35} ${height / 2 - 20} Z`}
              stroke={colors.primary}
              strokeWidth="2"
              fill="none"
              opacity="0.7"
            >
              {animated && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${width / 2} ${height / 2}`}
                  to={`360 ${width / 2} ${height / 2}`}
                  dur="20s"
                  repeatCount="indefinite"
                />
              )}
            </path>

            <circle
              cx={width / 2}
              cy={height / 2}
              r="20"
              fill={colors.secondary}
              opacity="0.5"
            >
              {animated && (
                <animate
                  attributeName="r"
                  values="20;25;20"
                  dur="3s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </>
        )}

        {variant === 'matrix' && (
          <>
            {/* 矩阵雨效果 */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
              <g key={idx}>
                <text
                  x={width / 2 - 40 + idx * 12}
                  y={height / 2}
                  fontSize="12"
                  fill={colors.primary}
                  opacity="0.4"
                  fontFamily="monospace"
                >
                  {['0', '1', '1', '0', '1', '0', '0', '1'][idx]}
                </text>

                {animated && (
                  <circle
                    cx={width / 2 - 40 + idx * 12}
                    cy={height / 2 + 15}
                    r="2"
                    fill={colors.primary}
                  >
                    <animate
                      attributeName="cy"
                      values={`${height / 2 - 30};${height / 2 + 60}`}
                      dur={`${2 + Math.random()}s`}
                      repeatCount="indefinite"
                      begin={idx * 0.2}
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;0"
                      dur={`${2 + Math.random()}s`}
                      repeatCount="indefinite"
                      begin={idx * 0.2}
                    />
                  </circle>
                )}
              </g>
            ))}
          </>
        )}

        {variant === 'neural' && (
          <>
            {/* 神经网络节点 */}
            {[
              { x: width / 2, y: height / 2 - 30 },
              { x: width / 2 - 30, y: height / 2 },
              { x: width / 2 + 30, y: height / 2 },
              { x: width / 2, y: height / 2 + 30 },
              { x: width / 2 - 20, y: height / 2 - 20 },
              { x: width / 2 + 20, y: height / 2 - 20 },
            ].map((node, idx) => (
              <g key={idx}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill={colors.primary}
                  opacity="0.3"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  fill={colors.secondary}
                  filter="url(#hologramGlow)"
                >
                  {animated && (
                    <animate
                      attributeName="r"
                      values="4;6;4"
                      dur={`${2 + Math.random()}s`}
                      repeatCount="indefinite"
                      begin={idx * 0.3}
                    />
                  )}
                </circle>
              </g>
            ))}

            {/* 连接线 */}
            <line
              x1={width / 2}
              y1={height / 2 - 30}
              x2={width / 2 - 30}
              y2={height / 2}
              stroke={colors.primary}
              strokeWidth="1"
              opacity="0.3"
            />
            <line
              x1={width / 2}
              y1={height / 2 - 30}
              x2={width / 2 + 30}
              y2={height / 2}
              stroke={colors.primary}
              strokeWidth="1"
              opacity="0.3"
            />
            <line
              x1={width / 2 - 30}
              y1={height / 2}
              x2={width / 2}
              y2={height / 2 + 30}
              stroke={colors.primary}
              strokeWidth="1"
              opacity="0.3"
            />
            <line
              x1={width / 2 + 30}
              y1={height / 2}
              x2={width / 2}
              y2={height / 2 + 30}
              stroke={colors.primary}
              strokeWidth="1"
              opacity="0.3"
            />
          </>
        )}

        {variant === 'quantum' && (
          <>
            {/* 量子轨道 */}
            {[0, 60, 120].map((angle, idx) => (
              <ellipse
                key={idx}
                cx={width / 2}
                cy={height / 2}
                rx="50"
                ry="20"
                fill="none"
                stroke={colors.primary}
                strokeWidth="1"
                opacity="0.4"
                transform={`rotate(${angle} ${width / 2} ${height / 2})`}
              >
                {animated && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`${angle} ${width / 2} ${height / 2}`}
                    to={`${angle + 360} ${width / 2} ${height / 2}`}
                    dur={`${10 + idx * 2}s`}
                    repeatCount="indefinite"
                  />
                )}
              </ellipse>
            ))}

            {/* 量子核心 */}
            <circle
              cx={width / 2}
              cy={height / 2}
              r="15"
              fill={colors.secondary}
              filter="url(#hologramGlow)"
            >
              {animated && (
                <animate
                  attributeName="r"
                  values="15;18;15"
                  dur="2s"
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </>
        )}
      </g>

      {/* 数据装饰 */}
      <g opacity="0.3">
        <text
          x="25"
          y="35"
          fontSize="10"
          fill={colors.primary}
          fontFamily="monospace"
        >
          SYS_READY
        </text>
        <text
          x={width - 80}
          y={height - 15}
          fontSize="10"
          fill={colors.secondary}
          fontFamily="monospace"
        >
          V2.0.26
        </text>
      </g>

      {/* 扫描动画 */}
      {animated && (
        <rect
          x="10"
          y="10"
          width={width - 20}
          height={height - 20}
          fill="url(#hologramScanlines)"
          opacity="0.1"
        >
          <animate
            attributeName="y"
            values="10;10"
            dur="2s"
            repeatCount="indefinite"
          />
        </rect>
      )}
    </svg>
  );
};

export default HolographicCard;
