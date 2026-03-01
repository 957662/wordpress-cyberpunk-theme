/**
 * CyberPress Illustration Components
 *
 * 赛博朋克风格插画组件
 *
 * @example
 * ```tsx
 * import { CyberCityIllustration, CodeScreenIllustration } from '@/components/graphics/Illustrations';
 *
 * <CyberCityIllustration width={400} />
 * <CodeScreenIllustration width={300} />
 * ```
 */

import React from 'react';

// 插画基础属性
export interface IllustrationProps {
  /** 宽度 */
  width?: number;
  /** 高度 (可选，默认基于宽高比) */
  height?: number;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否使用动画 */
  animated?: boolean;
  /** 自定义颜色 */
  color?: string;
}

// ==================== 城市场景 ====================

/**
 * 赛博城市插画
 */
export const CyberCityIllustration: React.FC<IllustrationProps> = ({
  width = 400,
  height,
  className = '',
  animated = false,
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
        <linearGradient id="citySky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a0a0f" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
        <linearGradient id="buildingGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect width="400" height="300" fill="url(#citySky)" />

      {/* 远景建筑 */}
      <g opacity="0.5">
        <rect x="50" y="150" width="40" height="150" fill="#1a1a2e" />
        <rect x="120" y="120" width="50" height="180" fill="#1a1a2e" />
        <rect x="200" y="140" width="35" height="160" fill="#1a1a2e" />
        <rect x="260" y="100" width="45" height="200" fill="#1a1a2e" />
        <rect x="320" y="130" width="55" height="170" fill="#1a1a2e" />
      </g>

      {/* 中景建筑 */}
      <g opacity="0.7">
        <rect x="80" y="180" width="50" height="120" fill="url(#buildingGradient)" />
        <rect x="160" y="160" width="40" height="140" fill="url(#buildingGradient)" />
        <rect x="230" y="170" width="60" height="130" fill="url(#buildingGradient)" />
        <rect x="310" y="190" width="45" height="110" fill="url(#buildingGradient)" />
      </g>

      {/* 窗户灯光 */}
      <g>
        {/* 随机亮起的窗户 */}
        {animated ? (
          <>
            <rect x="90" y="190" width="4" height="4" fill="#00f0ff">
              <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="100" y="200" width="4" height="4" fill="#ff0080">
              <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="170" y="180" width="4" height="4" fill="#00ff88">
              <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite" />
            </rect>
            <rect x="250" y="190" width="4" height="4" fill="#00f0ff">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
            </rect>
            <rect x="320" y="210" width="4" height="4" fill="#9d00ff">
              <animate attributeName="opacity" values="1;0.3;1" dur="2.2s" repeatCount="indefinite" />
            </rect>
          </>
        ) : (
          <>
            <rect x="90" y="190" width="4" height="4" fill="#00f0ff" opacity="0.8" />
            <rect x="100" y="200" width="4" height="4" fill="#ff0080" opacity="0.6" />
            <rect x="170" y="180" width="4" height="4" fill="#00ff88" opacity="0.7" />
            <rect x="250" y="190" width="4" height="4" fill="#00f0ff" opacity="0.8" />
            <rect x="320" y="210" width="4" height="4" fill="#9d00ff" opacity="0.6" />
          </>
        )}
      </g>

      {/* 霓虹招牌 */}
      <g>
        <text x="90" y="185" fontSize="8" fill="#00f0ff" opacity="0.8">CYBER</text>
        <text x="240" y="185" fontSize="8" fill="#ff0080" opacity="0.8">NEON</text>
        <text x="320" y="205" fontSize="8" fill="#9d00ff" opacity="0.8">TECH</text>
      </g>

      {/* 地面 */}
      <rect x="0" y="290" width="400" height="10" fill="#0a0a0f" />
      <line x1="0" y1="290" x2="400" y2="290" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />
    </svg>
  );
};

// ==================== 开发场景 ====================

/**
 * 代码屏幕插画
 */
export const CodeScreenIllustration: React.FC<IllustrationProps> = ({
  width = 300,
  height,
  className = '',
  color
}) => {
  const aspectRatio = 300 / 250;
  const actualHeight = height || Math.round(width / aspectRatio);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 300 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a0f" />
        </linearGradient>
        <filter id="screenGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 显示器外框 */}
      <rect x="50" y="20" width="200" height="150" rx="5" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="2" />

      {/* 屏幕区域 */}
      <rect x="60" y="30" width="180" height="130" fill="url(#screenGradient)" />

      {/* 代码行 */}
      <g filter="url(#screenGlow)">
        {/* 语法高亮的代码 */}
        <text x="70" y="50" fontSize="6" fill="#ff0080" fontFamily="monospace">import</text>
        <text x="100" y="50" fontSize="6" fill="#00f0ff" fontFamily="monospace">React</text>
        <text x="130" y="50" fontSize="6" fill="#ffffff" fontFamily="monospace">from</text>
        <text x="155" y="50" fontSize="6" fill="#00ff88" fontFamily="monospace">'react'</text>

        <text x="70" y="65" fontSize="6" fill="#9d00ff" fontFamily="monospace">function</text>
        <text x="110" y="65" fontSize="6" fill="#00f0ff" fontFamily="monospace">App()</text>
        <text x="140" y="65" fontSize="6" fill="#ffffff" fontFamily="monospace">{{'{'}}</text>

        <text x="80" y="80" fontSize="6" fill="#ffffff" fontFamily="monospace">return</text>
        <text x="110" y="80" fontSize="6" fill="#ffffff" fontFamily="monospace">(</text>

        <text x="90" y="95" fontSize="6" fill="#00ff88" fontFamily="monospace">&lt;div&gt;</text>

        <text x="100" y="110" fontSize="6" fill="#00ff88" fontFamily="monospace">&lt;h1&gt;</text>
        <text x="120" y="110" fontSize="6" fill="#ffffff" fontFamily="monospace">Hello</text>
        <text x="145" y="110" fontSize="6" fill="#00ff88" fontFamily="monospace">&lt;/h1&gt;</text>

        <text x="100" y="125" fontSize="6" fill="#00ff88" fontFamily="monospace">&lt;p&gt;</text>
        <text x="115" y="125" fontSize="6" fill="#ffffff" fontFamily="monospace">World</text>
        <text x="140" y="125" fontSize="6" fill="#00ff88" fontFamily="monospace">&lt;/p&gt;</text>

        <text x="90" y="140" fontSize="6" fill="#00ff88" fontFamily="monospace">&lt;/div&gt;</text>

        <text x="110" y="155" fontSize="6" fill="#ffffff" fontFamily="monospace">)</text>
        <text x="70" y="170" fontSize="6" fill="#ffffff" fontFamily="monospace">{{'}'}}</text>
      </g>

      {/* 光标 */}
      <rect x="70" y="175" width="6" height="8" fill="#00f0ff">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>

      {/* 显示器支架 */}
      <rect x="140" y="170" width="20" height="30" fill="#1a1a2e" />
      <rect x="120" y="200" width="60" height="5" rx="2" fill="#1a1a2e" />

      {/* 键盘 */}
      <rect x="80" y="210" width="140" height="30" rx="3" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="1" opacity="0.5" />
      <g opacity="0.3">
        <rect x="90" y="218" width="10" height="6" fill="#1a1a2e" />
        <rect x="105" y="218" width="10" height="6" fill="#1a1a2e" />
        <rect x="120" y="218" width="10" height="6" fill="#1a1a2e" />
        <rect x="135" y="218" width="10" height="6" fill="#1a1a2e" />
        <rect x="150" y="218" width="10" height="6" fill="#1a1a2e" />
        <rect x="165" y="218" width="10" height="6" fill="#1a1a2e" />
        <rect x="180" y="218" width="10" height="6" fill="#1a1a2e" />
        <rect x="195" y="218" width="10" height="6" fill="#1a1a2e" />
        <rect x="210" y="218" width="10" height="6" fill="#1a1a2e" />
      </g>
    </svg>
  );
};

// ==================== 网络场景 ====================

/**
 * 网络节点插画
 */
export const NetworkIllustration: React.FC<IllustrationProps> = ({
  width = 300,
  height,
  className = '',
  animated = true,
  color
}) => {
  const aspectRatio = 300 / 300;
  const actualHeight = height || Math.round(width / aspectRatio);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.2" />
        </linearGradient>
        <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景 */}
      <rect width="300" height="300" fill="#0a0a0f" />

      {/* 连接线 */}
      <g stroke="url(#lineGradient)" strokeWidth="1" fill="none">
        <line x1="150" y1="50" x2="80" y2="120" />
        <line x1="150" y1="50" x2="220" y2="120" />
        <line x1="150" y1="50" x2="150" y2="150" />
        <line x1="80" y1="120" x2="50" y2="200" />
        <line x1="80" y1="120" x2="150" y2="150" />
        <line x1="220" y1="120" x2="250" y2="200" />
        <line x1="220" y1="120" x2="150" y2="150" />
        <line x1="150" y1="150" x2="150" y2="250" />
        <line x1="150" y1="150" x2="50" y2="200" />
        <line x1="150" y1="150" x2="250" y2="200" />
      </g>

      {/* 数据传输动画 */}
      {animated && (
        <g>
          <circle r="3" fill="#00f0ff">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M150 50 L80 120"
            />
          </circle>
          <circle r="3" fill="#9d00ff">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path="M220 120 150 150"
            />
          </circle>
          <circle r="3" fill="#ff0080">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M150 150 250 200"
            />
          </circle>
        </g>
      )}

      {/* 节点 */}
      <g filter="url(#nodeGlow)">
        {/* 中心节点 */}
        <circle cx="150" cy="150" r="15" fill="none" stroke="#00f0ff" strokeWidth="2" />
        <circle cx="150" cy="150" r="8" fill="#00f0ff" />

        {/* 外围节点 */}
        <circle cx="150" cy="50" r="10" fill="none" stroke="#9d00ff" strokeWidth="1.5" />
        <circle cx="150" cy="50" r="5" fill="#9d00ff" />

        <circle cx="80" cy="120" r="10" fill="none" stroke="#ff0080" strokeWidth="1.5" />
        <circle cx="80" cy="120" r="5" fill="#ff0080" />

        <circle cx="220" cy="120" r="10" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="220" cy="120" r="5" fill="#00f0ff" />

        <circle cx="50" cy="200" r="8" fill="none" stroke="#9d00ff" strokeWidth="1.5" />
        <circle cx="50" cy="200" r="4" fill="#9d00ff" />

        <circle cx="250" cy="200" r="8" fill="none" stroke="#ff0080" strokeWidth="1.5" />
        <circle cx="250" cy="200" r="4" fill="#ff0080" />

        <circle cx="150" cy="250" r="8" fill="none" stroke="#00f0ff" strokeWidth="1.5" />
        <circle cx="150" cy="250" r="4" fill="#00f0ff" />
      </g>
    </svg>
  );
};

// ==================== 服务器场景 ====================

/**
 * 服务器机架插画
 */
export const ServerRackIllustration: React.FC<IllustrationProps> = ({
  width = 200,
  height,
  className = '',
  animated = true,
  color
}) => {
  const aspectRatio = 200 / 300;
  const actualHeight = height || Math.round(width / aspectRatio);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        <linearGradient id="rackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="50%" stopColor="#0a0a0f" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
      </defs>

      {/* 机架框架 */}
      <rect x="20" y="20" width="160" height="260" rx="5" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="2" />
      <line x1="20" y1="40" x2="180" y2="40" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />
      <line x1="20" y1="260" x2="180" y2="260" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />

      {/* 服务器单元 */}
      {[
        { y: 50, color: '#00f0ff' },
        { y: 95, color: '#9d00ff' },
        { y: 140, color: '#ff0080' },
        { y: 185, color: '#00ff88' },
        { y: 230, color: '#00f0ff' }
      ].map((server, index) => (
        <g key={index}>
          {/* 服务器单元框 */}
          <rect x="30" y={server.y} width="140" height="40" rx="3" fill="url(#rackGradient)" stroke={server.color} strokeWidth="1" opacity="0.8" />

          {/* LED 指示灯 */}
          <circle cx="45" cy={server.y + 20} r="3" fill={server.color}>
            {animated && (
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur={`${1 + index * 0.2}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle cx="55" cy={server.y + 20} r="3" fill={server.color} opacity="0.6" />
          <circle cx="65" cy={server.y + 20} r="3" fill={server.color} opacity="0.3" />

          {/* 数据显示 */}
          <rect x="130" y={server.y + 12} width="30" height="16" rx="2" fill="#0a0a0f" opacity="0.5" />
          <text x="132" y={server.y + 23} fontSize="8" fill={server.color} fontFamily="monospace" opacity="0.8">
            {animated ? (
              <tspan>
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="0.5s" repeatCount="indefinite" />
                {'██'}
              </tspan>
            ) : '██'}
          </text>
        </g>
      ))}

      {/* 通风孔 */}
      <g opacity="0.3">
        <line x1="180" y1="60" x2="185" y2="60" stroke="#00f0ff" strokeWidth="1" />
        <line x1="180" y1="70" x2="185" y2="70" stroke="#00f0ff" strokeWidth="1" />
        <line x1="180" y1="80" x2="185" y2="80" stroke="#00f0ff" strokeWidth="1" />

        <line x1="180" y1="105" x2="185" y2="105" stroke="#9d00ff" strokeWidth="1" />
        <line x1="180" y1="115" x2="185" y2="115" stroke="#9d00ff" strokeWidth="1" />
        <line x1="180" y1="125" x2="185" y2="125" stroke="#9d00ff" strokeWidth="1" />
      </g>
    </svg>
  );
};

// ==================== 电路板场景 ====================

/**
 * 电路板插画
 */
export const CircuitBoardIllustration: React.FC<IllustrationProps> = ({
  width = 300,
  height,
  className = '',
  animated = true,
  color
}) => {
  const aspectRatio = 300 / 300;
  const actualHeight = height || Math.round(width / aspectRatio);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
      </defs>

      {/* 背景 */}
      <rect width="300" height="300" fill="#0a0a0f" />

      {/* 电路线条 */}
      <g stroke="url(#circuitGradient)" strokeWidth="2" fill="none" opacity="0.6">
        {/* 主线路 */}
        <path d="M50 150 H100 V100 H150" />
        <path d="M250 150 H200 V200 H150" />
        <path d="M100 150 V200 H100" />
        <path d="M200 150 V100 H200" />
        <path d="M50 150 V50 H250" opacity="0.3" />
        <path d="M50 150 V250 H250" opacity="0.3" />
      </g>

      {/* 数据流动画 */}
      {animated && (
        <g>
          <circle r="4" fill="#00f0ff">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path="M50 150 H100 V100 H150"
            />
          </circle>
          <circle r="4" fill="#9d00ff">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              path="M250 150 H200 V200 H150"
            />
          </circle>
          <circle r="4" fill="#ff0080">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              path="M100 150 V200 H100"
            />
          </circle>
        </g>
      )}

      {/* 芯片/节点 */}
      <g>
        {/* 中心芯片 */}
        <rect x="130" y="130" width="40" height="40" rx="4" fill="#1a1a2e" stroke="#00f0ff" strokeWidth="2" />
        <rect x="140" y="140" width="20" height="20" fill="#00f0ff" opacity="0.3" />
        <circle cx="150" cy="150" r="5" fill="#00f0ff" />

        {/* 外围节点 */}
        <circle cx="50" cy="150" r="8" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="2" />
        <circle cx="250" cy="150" r="8" fill="#0a0a0f" stroke="#ff0080" strokeWidth="2" />
        <circle cx="150" cy="50" r="8" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="2" />
        <circle cx="150" cy="250" r="8" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="2" />

        {/* 小型连接点 */}
        <circle cx="100" cy="100" r="4" fill="#00f0ff" />
        <circle cx="200" cy="100" r="4" fill="#9d00ff" />
        <circle cx="100" cy="200" r="4" fill="#ff0080" />
        <circle cx="200" cy="200" r="4" fill="#00ff88" />
      </g>
    </svg>
  );
};

// ==================== 工作空间场景 ====================

/**
 * 开发工作空间插画
 */
export const WorkspaceIllustration: React.FC<IllustrationProps> = ({
  width = 350,
  height,
  className = '',
  color
}) => {
  const aspectRatio = 350 / 250;
  const actualHeight = height || Math.round(width / aspectRatio);

  return (
    <svg
      width={width}
      height={actualHeight}
      viewBox="0 0 350 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ color }}
    >
      <defs>
        <linearGradient id="deskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a0f" />
        </linearGradient>
      </defs>

      {/* 桌面 */}
      <rect x="50" y="180" width="250" height="10" fill="url(#deskGradient)" />
      <rect x="70" y="190" width="10" height="50" fill="#1a1a2e" />
      <rect x="270" y="190" width="10" height="50" fill="#1a1a2e" />

      {/* 显示器 */}
      <rect x="100" y="80" width="150" height="90" rx="5" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="2" />
      <rect x="110" y="90" width="130" height="70" fill="#0a0a0f" opacity="0.8" />
      {/* 屏幕内容 */}
      <text x="120" y="110" fontSize="8" fill="#00f0ff" fontFamily="monospace">&gt; npm start</text>
      <text x="120" y="125" fontSize="8" fill="#00ff88" fontFamily="monospace">Server running...</text>
      <rect x="175" y="170" width="15" height="10" fill="#1a1a2e" />

      {/* 键盘 */}
      <rect x="120" y="185" width="110" height="25" rx="3" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="1" opacity="0.5" />

      {/* 咖啡杯 */}
      <rect x="280" y="165" width="20" height="25" rx="3" fill="#9d00ff" opacity="0.3" />
      <path d="M300 170 Q305 175 300 180" stroke="#9d00ff" strokeWidth="1.5" fill="none" />
      {/* 热气 */}
      <path d="M285 160 Q283 155 285 150" stroke="#9d00ff" strokeWidth="1" opacity="0.3" strokeDasharray="2,2">
        <animate attributeName="d" values="M285 160 Q283 155 285 150;M285 158 Q287 153 285 148;M285 160 Q283 155 285 150" dur="2s" repeatCount="indefinite" />
      </path>

      {/* 植物 */}
      <rect x="55" y="160" width="15" height="20" rx="2" fill="#00ff88" opacity="0.3" />
      <path d="M62 160 Q55 150 62 145" stroke="#00ff88" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M62 160 Q69 150 62 145" stroke="#00ff88" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
};

export default {
  CyberCityIllustration,
  CodeScreenIllustration,
  NetworkIllustration,
  ServerRackIllustration,
  CircuitBoardIllustration,
  WorkspaceIllustration,
};
