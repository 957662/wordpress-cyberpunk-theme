/**
 * CyberPress Additional Illustrations
 *
 * 补充的赛博朋克风格插画组件
 *
 * @example
 * ```tsx
 * import { RobotIllustration, SpaceIllustration } from '@/components/graphics/AdditionalIllustrations';
 *
 * <RobotIllustration width={400} animated />
 * <SpaceIllustration width={500} />
 * ```
 */

import React from 'react';

export interface IllustrationProps {
  width?: number;
  height?: number;
  className?: string;
  animated?: boolean;
  color?: string;
}

// ==================== 机器人场景 ====================

/**
 * 机器人插画
 */
export const RobotIllustration: React.FC<IllustrationProps> = ({
  width = 300,
  height,
  className = '',
  animated = true,
  color
}) => {
  const aspectRatio = 300 / 350;
  const actualHeight = height || Math.round(width / aspectRatio);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 300 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        <linearGradient id="robotBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a0f" />
        </linearGradient>
        <filter id="robotGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 天线 */}
      <line x1="150" y1="50" x2="150" y2="30" stroke="#00f0ff" strokeWidth="2" />
      <circle cx="150" cy="25" r="5" fill="#00f0ff">
        {animated && (
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        )}
      </circle>

      {/* 头部 */}
      <rect x="100" y="50" width="100" height="80" rx="10" fill="url(#robotBody)" stroke="#00f0ff" strokeWidth="2" />

      {/* 眼睛 */}
      <g filter="url(#robotGlow)">
        <circle cx="130" cy="90" r="12" fill="#00f0ff" fillOpacity="0.8">
          {animated && (
            <animate attributeName="r" values="12;14;12" dur="3s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="170" cy="90" r="12" fill="#00f0ff" fillOpacity="0.8">
          {animated && (
            <animate attributeName="r" values="12;14;12" dur="3s" repeatCount="indefinite" begin="0.5s" />
          )}
        </circle>
        <circle cx="130" cy="90" r="5" fill="#0a0a0f" />
        <circle cx="170" cy="90" r="5" fill="#0a0a0f" />
      </g>

      {/* 嘴巴 */}
      <rect x="120" y="110" width="60" height="10" rx="5" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="1" opacity="0.5" />

      {/* 身体 */}
      <rect x="80" y="140" width="140" height="120" rx="15" fill="url(#robotBody)" stroke="#00f0ff" strokeWidth="2" />

      {/* 胸部面板 */}
      <rect x="100" y="160" width="100" height="80" rx="5" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="1" opacity="0.5" />

      {/* 胸部指示灯 */}
      <g>
        <circle cx="120" cy="180" r="4" fill="#00f0ff">
          {animated && (
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="150" cy="180" r="4" fill="#9d00ff">
          {animated && (
            <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" begin="0.2s" />
          )}
        </circle>
        <circle cx="180" cy="180" r="4" fill="#ff0080">
          {animated && (
            <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" begin="0.4s" />
          )}
        </circle>
      </g>

      {/* 数据显示 */}
      <rect x="110" y="195" width="80" height="35" rx="3" fill="#0a0a0f" opacity="0.3" />
      <g opacity="0.6">
        <text x="115" y="210" fontSize="6" fill="#00f0ff" fontFamily="monospace">CPU: 45%</text>
        <text x="115" y="220" fontSize="6" fill="#00ff88" fontFamily="monospace">MEM: 62%</text>
      </g>

      {/* 手臂 */}
      <rect x="50" y="150" width="25" height="80" rx="10" fill="url(#robotBody)" stroke="#00f0ff" strokeWidth="1.5" />
      <rect x="225" y="150" width="25" height="80" rx="10" fill="url(#robotBody)" stroke="#00f0ff" strokeWidth="1.5" />

      {/* 腿 */}
      <rect x="100" y="265" width="35" height="60" rx="8" fill="url(#robotBody)" stroke="#00f0ff" strokeWidth="1.5" />
      <rect x="165" y="265" width="35" height="60" rx="8" fill="url(#robotBody)" stroke="#00f0ff" strokeWidth="1.5" />

      {/* 脚 */}
      <rect x="95" y="320" width="45" height="20" rx="5" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="1" />
      <rect x="160" y="320" width="45" height="20" rx="5" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="1" />

      {/* 悬浮效果 */}
      {animated && (
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-10; 0,0"
            dur="4s"
            repeatCount="indefinite"
          />
        </g>
      )}
    </svg>
  );
};

// ==================== 太空场景 ====================

/**
 * 太空探索插画
 */
export const SpaceIllustration: React.FC<IllustrationProps> = ({
  width = 400,
  height,
  className = '',
  animated = true,
  color
}) => {
  const aspectRatio = 400 / 300;
  const actualHeight = height || Math.round(width / aspectRatio);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        <radialGradient id="spaceBg">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a0f" />
        </radialGradient>
        <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect width="400" height="300" fill="url(#spaceBg)" />

      {/* 星星 */}
      <g filter="url(#starGlow)">
        {[...Array(50)].map((_, i) => {
          const x = Math.random() * 400;
          const y = Math.random() * 300;
          const r = Math.random() * 1.5 + 0.5;
          const opacity = Math.random() * 0.5 + 0.3;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="#ffffff"
              opacity={opacity}
            >
              {animated && (
                <animate
                  attributeName="opacity"
                  values={`${opacity};${opacity * 0.3};${opacity}`}
                  dur={`${Math.random() * 3 + 2}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          );
        })}
      </g>

      {/* 行星 */}
      <circle cx="320" cy="80" r="40" fill="none" stroke="#00f0ff" strokeWidth="2" opacity="0.4" />
      <circle cx="320" cy="80" r="30" fill="#00f0ff" fillOpacity="0.1" />
      <circle cx="320" cy="80" r="20" fill="#00f0ff" fillOpacity="0.2" />

      {/* 卫星 */}
      <g>
        {/* 卫星主体 */}
        <rect x="150" y="140" width="30" height="20" rx="3" fill="#1a1a2e" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="165" cy="150" r="5" fill="#00f0ff" fillOpacity="0.5" />

        {/* 太阳能板 */}
        <rect x="120" y="145" width="25" height="10" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="1" />
        <rect x="185" y="145" width="25" height="10" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="1" />

        {/* 天线 */}
        <line x1="165" y1="140" x2="165" y2="125" stroke="#00f0ff" strokeWidth="1" />
        <circle cx="165" cy="122" r="3" fill="#ff0080">
          {animated && (
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
          )}
        </circle>

        {/* 轨道动画 */}
        {animated && (
          <g>
            <circle cx="200" cy="150" r="60" fill="none" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 150"
                to="360 200 150"
                dur="20s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </g>

      {/* 火箭 */}
      <g>
        {/* 火箭主体 */}
        <path d="M280 200L270 240H290L280 200Z" fill="#ff0080" />
        <ellipse cx="280" cy="230" rx="10" ry="20" fill="#1a1a2e" stroke="#ff0080" strokeWidth="2" />

        {/* 窗户 */}
        <circle cx="280" cy="220" r="5" fill="#00f0ff" fillOpacity="0.8">
          {animated && (
            <animate attributeName="fill-opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
          )}
        </circle>

        {/* 火焰 */}
        <path d="M273 240L280 260L287 240Z" fill="#f0ff00">
          {animated && (
            <animate
              attributeName="d"
              values="M273 240L280 260L287 240Z;M273 240L280 265L287 240Z;M273 240L280 260L287 240Z"
              dur="0.1s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* 尾迹粒子 */}
        {animated && [...Array(5)].map((_, i) => (
          <circle
            key={i}
            r="2"
            fill="#f0ff00"
            opacity={0.6 - i * 0.1}
          >
            <animateMotion
              dur={`${0.5 + i * 0.1}s`}
              repeatCount="indefinite"
              path="M280 240 L280 280"
              begin={`${i * 0.1}s`}
            />
          </circle>
        ))}
      </g>
    </svg>
  );
};

// ==================== AI 场景 ====================

/**
 * AI 神经网络插画
 */
export const NeuralNetworkIllustration: React.FC<IllustrationProps> = ({
  width = 350,
  height,
  className = '',
  animated = true,
  color
}) => {
  const aspectRatio = 350 / 300;
  const actualHeight = height || Math.round(width / aspectRatio);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 350 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.3" />
        </linearGradient>
        <filter id="neuralGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect width="350" height="300" fill="#0a0a0f" />

      {/* 神经网络层级 */}
      <g filter="url(#neuralGlow)">
        {/* 输入层 */}
        {[
          { x: 50, y: 80 },
          { x: 50, y: 130 },
          { x: 50, y: 180 },
          { x: 50, y: 230 },
        ].map((node, i) => (
          <circle key={`input-${i}`} cx={node.x} cy={node.y} r="10" fill="#00f0ff" fillOpacity="0.8" />
        ))}

        {/* 隐藏层 */}
        {[
          { x: 125, y: 60 },
          { x: 125, y: 100 },
          { x: 125, y: 140 },
          { x: 125, y: 180 },
          { x: 125, y: 220 },
          { x: 125, y: 260 },
        ].map((node, i) => (
          <circle key={`hidden1-${i}`} cx={node.x} cy={node.y} r="8" fill="#9d00ff" fillOpacity="0.7" />
        ))}

        {/* 隐藏层2 */}
        {[
          { x: 200, y: 80 },
          { x: 200, y: 120 },
          { x: 200, y: 160 },
          { x: 200, y: 200 },
          { x: 200, y: 240 },
        ].map((node, i) => (
          <circle key={`hidden2-${i}`} cx={node.x} cy={node.y} r="8" fill="#ff0080" fillOpacity="0.7" />
        ))}

        {/* 输出层 */}
        {[
          { x: 275, y: 130 },
          { x: 275, y: 180 },
        ].map((node, i) => (
          <circle key={`output-${i}`} cx={node.x} cy={node.y} r="10" fill="#00ff88" fillOpacity="0.8" />
        ))}

        {/* 连接线 */}
        {animated && (
          <g stroke="url(#neuralGradient)" strokeWidth="1" fill="none" opacity="0.4">
            {/* 输入层到隐藏层1 */}
            {[0, 1, 2, 3].map((input) =>
              [0, 1, 2, 3, 4, 5].map((hidden) => (
                <line
                  key={`in-h1-${input}-${hidden}`}
                  x1="50"
                  y1={[80, 130, 180, 230][input]}
                  x2="125"
                  y2={[60, 100, 140, 180, 220, 260][hidden]}
                />
              ))
            )}
            {/* 隐藏层1到隐藏层2 */}
            {[0, 1, 2, 3, 4, 5].map((h1) =>
              [0, 1, 2, 3, 4].map((h2) => (
                <line
                  key={`h1-h2-${h1}-${h2}`}
                  x1="125"
                  y2={[60, 100, 140, 180, 220, 260][h1]}
                  x2="200"
                  y2={[80, 120, 160, 200, 240][h2]}
                />
              ))
            )}
            {/* 隐藏层2到输出层 */}
            {[0, 1, 2, 3, 4].map((h2) =>
              [0, 1].map((output) => (
                <line
                  key={`h2-out-${h2}-${output}`}
                  x1="200"
                  y2={[80, 120, 160, 200, 240][h2]}
                  x2="275"
                  y2={[130, 180][output]}
                />
              ))
            )}
          </g>
        )}

        {/* 数据流动画 */}
        {animated && [...Array(10)].map((_, i) => (
          <circle
            key={`data-${i}`}
            r="3"
            fill="#00f0ff"
          >
            <animateMotion
              dur={`${2 + Math.random()}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
              path={`M50 ${[80, 130, 180, 230][Math.floor(Math.random() * 4)]} L125 ${[60, 100, 140, 180, 220, 260][Math.floor(Math.random() * 6)]} L200 ${[80, 120, 160, 200, 240][Math.floor(Math.random() * 5)]} L275 ${[130, 180][Math.floor(Math.random() * 2)]}`}
            />
          </circle>
        ))}
      </g>

      {/* 标签 */}
      <text x="50" y="40" fontSize="10" fill="#00f0ff" fontFamily="monospace" textAnchor="middle">INPUT</text>
      <text x="125" y="40" fontSize="10" fill="#9d00ff" fontFamily="monospace" textAnchor="middle">HIDDEN 1</text>
      <text x="200" y="40" fontSize="10" fill="#ff0080" fontFamily="monospace" textAnchor="middle">HIDDEN 2</text>
      <text x="275" y="40" fontSize="10" fill="#00ff88" fontFamily="monospace" textAnchor="middle">OUTPUT</text>
    </svg>
  );
};

// ==================== 数据中心场景 ====================

/**
 * 数据中心插画
 */
export const DataCenterIllustration: React.FC<IllustrationProps> = ({
  width = 400,
  height,
  className = '',
  animated = true,
  color
}) => {
  const aspectRatio = 400 / 300;
  const actualHeight = height || Math.round(width / aspectRatio);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        <linearGradient id="serverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="50%" stopColor="#0a0a0f" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
      </defs>

      {/* 地板 */}
      <rect x="0" y="280" width="400" height="20" fill="#0a0a0f" />
      <line x1="0" y1="280" x2="400" y2="280" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />

      {/* 服务器机架1 */}
      <g>
        <rect x="50" y="80" width="60" height="200" rx="5" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="2" />
        {[
          { y: 100, color: '#00f0ff' },
          { y: 140, color: '#9d00ff' },
          { y: 180, color: '#ff0080' },
          { y: 220, color: '#00ff88' },
        ].map((server, i) => (
          <g key={i}>
            <rect x="60" y={server.y} width="40" height="30" rx="2" fill="url(#serverGradient)" stroke={server.color} strokeWidth="1" />
            <circle cx="70" cy={server.y + 15} r="2" fill={server.color}>
              {animated && (
                <animate
                  attributeName="opacity"
                  values="1;0.3;1"
                  dur={`${1 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        ))}
      </g>

      {/* 服务器机架2 */}
      <g>
        <rect x="170" y="80" width="60" height="200" rx="5" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="2" />
        {[
          { y: 100, color: '#9d00ff' },
          { y: 140, color: '#ff0080' },
          { y: 180, color: '#00f0ff' },
          { y: 220, color: '#00ff88' },
        ].map((server, i) => (
          <g key={i}>
            <rect x="180" y={server.y} width="40" height="30" rx="2" fill="url(#serverGradient)" stroke={server.color} strokeWidth="1" />
            <circle cx="190" cy={server.y + 15} r="2" fill={server.color}>
              {animated && (
                <animate
                  attributeName="opacity"
                  values="1;0.3;1"
                  dur={`${1.2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        ))}
      </g>

      {/* 服务器机架3 */}
      <g>
        <rect x="290" y="80" width="60" height="200" rx="5" fill="#0a0a0f" stroke="#ff0080" strokeWidth="2" />
        {[
          { y: 100, color: '#ff0080' },
          { y: 140, color: '#00f0ff' },
          { y: 180, color: '#9d00ff' },
          { y: 220, color: '#00ff88' },
        ].map((server, i) => (
          <g key={i}>
            <rect x="300" y={server.y} width="40" height="30" rx="2" fill="url(#serverGradient)" stroke={server.color} strokeWidth="1" />
            <circle cx="310" cy={server.y + 15} r="2" fill={server.color}>
              {animated && (
                <animate
                  attributeName="opacity"
                  values="1;0.3;1"
                  dur={`${1.4 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          </g>
        ))}
      </g>

      {/* 连接线 */}
      {animated && (
        <g stroke="#00f0ff" strokeWidth="1" fill="none" opacity="0.3">
          <path d="M80 270 Q200 290 320 270" strokeDasharray="4 4">
            <animate
              attributeName="stroke-dashoffset"
              values="0;8;0"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      )}

      {/* 顶灯 */}
      <g>
        {[100, 200, 300].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="0" x2={x} y2="20" stroke="#00f0ff" strokeWidth="2" />
            <circle cx={x} cy="25" r="5" fill="#00f0ff">
              {animated && (
                <animate
                  attributeName="opacity"
                  values="0.8;1;0.8"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.5}s`}
                />
              )}
            </circle>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default {
  RobotIllustration,
  SpaceIllustration,
  NeuralNetworkIllustration,
  DataCenterIllustration,
};
