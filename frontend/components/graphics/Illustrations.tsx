/**
 * CyberPress Illustrations
 *
 * 赛博朋克风格插画组件库
 *
 * @example
 * ```tsx
 * import { HeroIllustration, ErrorIllustration, LoadingIllustration } from '@/components/graphics/Illustrations';
 *
 * <HeroIllustration />
 * <ErrorIllustration />
 * ```
 */

import React from 'react';

// 插画基础属性
export interface IllustrationProps {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否使用动画 */
  animated?: boolean;
}

/**
 * 主页英雄插画 - 赛博城市景观
 */
export const HeroIllustration: React.FC<IllustrationProps> = ({
  width = 400,
  height = 300,
  className = '',
  animated = true
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* 天空渐变 */}
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0a0f" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>

        {/* 建筑渐变 */}
        <linearGradient id="buildingGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#16162a" />
          <stop offset="100%" stopColor="#2a2a4a" />
        </linearGradient>

        {/* 霓虹渐变 */}
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="50%" stopColor="#9d00ff" />
          <stop offset="100%" stopColor="#ff0080" />
        </linearGradient>

        {/* 发光滤镜 */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect width="400" height="300" fill="url(#skyGradient)" />

      {/* 星星 */}
      {animated && (
        <>
          <circle cx="50" cy="40" r="1" fill="#ffffff">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="150" cy="30" r="1.5" fill="#00f0ff">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="280" cy="50" r="1" fill="#9d00ff">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="350" cy="35" r="1.5" fill="#ff0080">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* 远景建筑 */}
      <g opacity="0.5">
        <rect x="20" y="180" width="40" height="120" fill="#1a1a2e" />
        <rect x="70" y="200" width="35" height="100" fill="#1a1a2e" />
        <rect x="300" y="190" width="45" height="110" fill="#1a1a2e" />
        <rect x="355" y="210" width="30" height="90" fill="#1a1a2e" />
      </g>

      {/* 中景建筑 */}
      <g opacity="0.7">
        <rect x="50" y="150" width="50" height="150" fill="url(#buildingGradient)" />
        <rect x="110" y="170" width="40" height="130" fill="url(#buildingGradient)" />
        <rect x="260" y="160" width="45" height="140" fill="url(#buildingGradient)" />
        <rect x="320" y="180" width="35" height="120" fill="url(#buildingGradient)" />
      </g>

      {/* 近景建筑（带霓虹灯） */}
      <g filter="url(#glow)">
        {/* 左侧建筑 */}
        <rect x="80" y="120" width="60" height="180" fill="url(#buildingGradient)" stroke="#00f0ff" strokeWidth="1" />
        {/* 窗户 */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={`left-${i}`}
            x="90"
            y={130 + i * 20}
            width="8"
            height="12"
            fill="#00f0ff"
            opacity="0.6"
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={`left2-${i}`}
            x="105"
            y={130 + i * 20}
            width="8"
            height="12"
            fill="#00f0ff"
            opacity="0.6"
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={`left3-${i}`}
            x="120"
            y={130 + i * 20}
            width="8"
            height="12"
            fill="#00f0ff"
            opacity="0.6"
          />
        ))}

        {/* 右侧建筑 */}
        <rect x="260" y="130" width="70" height="170" fill="url(#buildingGradient)" stroke="#ff0080" strokeWidth="1" />
        {/* 窗户 */}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect
            key={`right-${i}`}
            x="270"
            y={140 + i * 22}
            width="10"
            height="14"
            fill="#ff0080"
            opacity="0.6"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect
            key={`right2-${i}`}
            x="285"
            y={140 + i * 22}
            width="10"
            height="14"
            fill="#ff0080"
            opacity="0.6"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <rect
            key={`right3-${i}`}
            x="300"
            y={140 + i * 22}
            width="10"
            height="14"
            fill="#ff0080"
            opacity="0.6"
          />
        ))}
      </g>

      {/* 中央塔楼 */}
      <g filter="url(#glow)">
        <polygon
          points="200,80 170,300 230,300"
          fill="url(#buildingGradient)"
          stroke="url(#neonGradient)"
          strokeWidth="2"
        />
        {/* 塔顶天线 */}
        <line x1="200" y1="80" x2="200" y2="40" stroke="#00f0ff" strokeWidth="2">
          {animated && (
            <animate attributeName="y1" values="80;75;80" dur="1s" repeatCount="indefinite" />
          )}
        </line>
        <circle cx="200" cy="35" r="3" fill="#ff0080">
          {animated && (
            <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
          )}
        </circle>
      </g>

      {/* 地面网格 */}
      <g opacity="0.3">
        <line x1="0" y1="300" x2="400" y2="300" stroke="#00f0ff" strokeWidth="1" />
        <line x1="0" y1="280" x2="400" y2="280" stroke="#00f0ff" strokeWidth="0.5" />
        <line x1="0" y1="260" x2="400" y2="260" stroke="#00f0ff" strokeWidth="0.5" />
        {/* 垂直透视线 */}
        <line x1="200" y1="300" x2="100" y2="260" stroke="#00f0ff" strokeWidth="0.5" />
        <line x1="200" y1="300" x2="300" y2="260" stroke="#00f0ff" strokeWidth="0.5" />
      </g>
    </svg>
  );
};

/**
 * 404 错误插画 - 赛博故障效果
 */
export const ErrorIllustration: React.FC<IllustrationProps> = ({
  width = 300,
  height = 250,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0080" />
          <stop offset="100%" stopColor="#ff6600" />
        </linearGradient>
        <filter id="errorGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect width="300" height="250" fill="#0a0a0f" opacity="0.5" />

      {/* 404 文字 */}
      <g filter="url(#errorGlow)">
        <text
          x="150"
          y="120"
          fontFamily="'Orbitron', monospace"
          fontSize="80"
          fontWeight="bold"
          fill="url(#errorGradient)"
          textAnchor="middle"
        >
          404
        </text>
      </g>

      {/* 故障效果线条 */}
      <g>
        <line x1="50" y1="100" x2="250" y2="100" stroke="#00f0ff" strokeWidth="2" opacity="0.5">
          <animate attributeName="opacity" values="0;1;0" dur="0.5s" repeatCount="indefinite" />
        </line>
        <line x1="60" y1="130" x2="240" y2="130" stroke="#ff0080" strokeWidth="2" opacity="0.5">
          <animate attributeName="opacity" values="0;1;0" dur="0.3s" repeatCount="indefinite" />
        </line>
      </g>

      {/* 错误图标 */}
      <g transform="translate(125, 150)" filter="url(#errorGlow)">
        <circle cx="25" cy="25" r="25" fill="none" stroke="url(#errorGradient)" strokeWidth="2" />
        <path d="M25 15V25M25 30V35" stroke="url(#errorGradient)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* 错误文字 */}
      <text
        x="150"
        y="210"
        fontFamily="'Inter', sans-serif"
        fontSize="14"
        fill="#9d00ff"
        textAnchor="middle"
      >
        PAGE NOT FOUND
      </text>

      {/* 装饰点 */}
      <circle cx="50" cy="50" r="2" fill="#00f0ff" opacity="0.5" />
      <circle cx="250" cy="50" r="2" fill="#00f0ff" opacity="0.5" />
      <circle cx="50" cy="200" r="2" fill="#ff0080" opacity="0.5" />
      <circle cx="250" cy="200" r="2" fill="#ff0080" opacity="0.5" />
    </svg>
  );
};

/**
 * 加载插画 - 数据传输动画
 */
export const LoadingIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 150,
  className = '',
  animated = true
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
        <filter id="loadingGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 中央圆环 */}
      <g filter="url(#loadingGlow)">
        <circle
          cx="100"
          cy="75"
          r="40"
          fill="none"
          stroke="#2a2a4a"
          strokeWidth="4"
        />
        <circle
          cx="100"
          cy="75"
          r="40"
          fill="none"
          stroke="url(#loadingGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset="62.8"
          transform="rotate(-90 100 75)"
        >
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 75"
              to="360 100 75"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </g>

      {/* 内部图标 */}
      <g>
        <path
          d="M90 75L95 80L110 65"
          stroke="#00f0ff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={animated ? 0 : 1}
        >
          {animated && (
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
          )}
        </path>
      </g>

      {/* 数据点 */}
      {animated && (
        <>
          <circle cx="60" cy="75" r="3" fill="#00f0ff">
            <animate attributeName="opacity" values="0;1;0" dur="1s" repeatCount="indefinite" />
            <animate attributeName="cx" values="60;140" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="40" cy="75" r="2" fill="#9d00ff">
            <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="cx" values="40;160" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* 底部文字 */}
      <text
        x="100"
        y="135"
        fontFamily="'Inter', sans-serif"
        fontSize="12"
        fill="#00f0ff"
        textAnchor="middle"
      >
        LOADING...
      </text>
    </svg>
  );
};

/**
 * 空状态插画 - 赛博虚空
 */
export const EmptyIllustration: React.FC<IllustrationProps> = ({
  width = 250,
  height = 200,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 250 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="emptyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 虚空盒子 */}
      <rect
        x="75"
        y="60"
        width="100"
        height="80"
        fill="url(#emptyGradient)"
        stroke="#2a2a4a"
        strokeWidth="2"
      />

      {/* 问号 */}
      <text
        x="125"
        y="115"
        fontFamily="'Orbitron', monospace"
        fontSize="50"
        fill="#9d00ff"
        textAnchor="middle"
        opacity="0.5"
      >
        ?
      </text>

      {/* 装饰线 */}
      <line x1="75" y1="140" x2="175" y2="140" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />
      <line x1="75" y1="60" x2="175" y2="60" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />

      {/* 说明文字 */}
      <text
        x="125"
        y="170"
        fontFamily="'Inter', sans-serif"
        fontSize="12"
        fill="#6a6a8a"
        textAnchor="middle"
      >
        No data found
      </text>
    </svg>
  );
};

/**
 * 成功插画 - 赛博完成
 */
export const SuccessIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height = 160,
  className = '',
  animated = true
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#00f0ff" />
        </linearGradient>
        <filter id="successGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 成功圆环 */}
      <g filter="url(#successGlow)">
        <circle
          cx="100"
          cy="70"
          r="45"
          fill="none"
          stroke="url(#successGradient)"
          strokeWidth="3"
          opacity="0.3"
        >
          {animated && (
            <animate
              attributeName="r"
              values="45;50;45"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle
          cx="100"
          cy="70"
          r="40"
          fill="none"
          stroke="url(#successGradient)"
          strokeWidth="3"
        />
      </g>

      {/* 勾选标记 */}
      <path
        d="M85 70L95 80L115 60"
        stroke="#00ff88"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {animated && (
          <animate
            attributeName="stroke-dasharray"
            from="0,100"
            to="100,0"
            dur="0.8s"
            fill="freeze"
          />
        )}
      </path>

      {/* 装饰点 */}
      <circle cx="100" cy="130" r="3" fill="#00ff88">
        {animated && (
          <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="85" cy="135" r="2" fill="#00f0ff" opacity="0.5" />
      <circle cx="115" cy="135" r="2" fill="#00f0ff" opacity="0.5" />

      {/* 文字 */}
      <text
        x="100"
        y="155"
        fontFamily="'Inter', sans-serif"
        fontSize="12"
        fill="#00ff88"
        textAnchor="middle"
      >
        SUCCESS
      </text>
    </svg>
  );
};

export default {
  HeroIllustration,
  ErrorIllustration,
  LoadingIllustration,
  EmptyIllustration,
  SuccessIllustration,
};
