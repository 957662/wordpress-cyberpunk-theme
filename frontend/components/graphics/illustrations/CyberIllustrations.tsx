/**
 * CyberPress 插画组件集
 *
 * 完整的赛博朋克风格 SVG 插画组件
 */

'use client';

import React from 'react';

export type IllustrationVariant = 'cyan' | 'purple' | 'pink' | 'green';
export type IllustrationSize = { width: number; height: number };

interface CyberIllustrationProps {
  width?: number;
  height?: number;
  variant?: IllustrationVariant;
  className?: string;
  animated?: boolean;
}

const colorSchemes: Record<IllustrationVariant, { primary: string; secondary: string; accent: string }> = {
  cyan: { primary: '#00f0ff', secondary: '#00a0ff', accent: '#0080aa' },
  purple: { primary: '#9d00ff', secondary: '#bd66ff', accent: '#6a00aa' },
  pink: { primary: '#ff0080', secondary: '#ff66b3', accent: '#aa0056' },
  green: { primary: '#00ff88', secondary: '#00cc6a', accent: '#009950' },
};

/**
 * ServerRackIllustration - 服务器机架插画
 */
export const ServerRackIllustration: React.FC<CyberIllustrationProps> = ({
  width = 400,
  height = 300,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const colors = colorSchemes[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <linearGradient id="serverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.1"/>
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.05"/>
        </linearGradient>
        <filter id="serverGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 机架框架 */}
      <rect x="100" y="50" width="200" height="200" rx="4" stroke={colors.primary} strokeWidth="2" fill="url(#serverGradient)" />

      {/* 服务器单元 1 */}
      <g transform="translate(120, 70)">
        <rect width="160" height="40" rx="2" stroke={colors.primary} strokeWidth="1.5" fill={colors.primary} fillOpacity="0.05" />
        <circle cx="15" cy="20" r="4" fill={colors.primary} filter="url(#serverGlow)" />
        <circle cx="30" cy="20" r="4" fill={colors.secondary} opacity="0.7" />
        <circle cx="45" cy="20" r="4" fill={colors.secondary} opacity="0.4" />
        <rect x="60" y="14" width="80" height="12" rx="2" fill={colors.primary} opacity="0.3" />

        {/* 数据流动画 */}
        {animated && (
          <>
            <circle r="2" fill={colors.accent}>
              <animateMotion dur="2s" repeatCount="indefinite" path="M60,20 L140,20" />
              <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </g>

      {/* 服务器单元 2 */}
      <g transform="translate(120, 120)">
        <rect width="160" height="40" rx="2" stroke={colors.primary} strokeWidth="1.5" fill={colors.primary} fillOpacity="0.05" />
        <circle cx="15" cy="20" r="4" fill={colors.primary} filter="url(#serverGlow)" />
        <circle cx="30" cy="20" r="4" fill={colors.secondary} opacity="0.7" />
        <circle cx="45" cy="20" r="4" fill={colors.secondary} opacity="0.4" />
        <rect x="60" y="14" width="80" height="12" rx="2" fill={colors.primary} opacity="0.3" />

        {animated && (
          <>
            <circle r="2" fill={colors.accent}>
              <animateMotion dur="2.5s" repeatCount="indefinite" path="M60,20 L140,20" />
              <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </g>

      {/* 服务器单元 3 */}
      <g transform="translate(120, 170)">
        <rect width="160" height="40" rx="2" stroke={colors.primary} strokeWidth="1.5" fill={colors.primary} fillOpacity="0.05" />
        <circle cx="15" cy="20" r="4" fill={colors.primary} filter="url(#serverGlow)" />
        <circle cx="30" cy="20" r="4" fill={colors.secondary} opacity="0.7" />
        <circle cx="45" cy="20" r="4" fill={colors.secondary} opacity="0.4" />
        <rect x="60" y="14" width="80" height="12" rx="2" fill={colors.primary} opacity="0.3" />

        {animated && (
          <>
            <circle r="2" fill={colors.accent}>
              <animateMotion dur="1.8s" repeatCount="indefinite" path="M60,20 L140,20" />
              <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </g>

      {/* 装饰元素 */}
      <line x1="100" y1="110" x2="90" y2="110" stroke={colors.secondary} strokeWidth="1" opacity="0.5" />
      <line x1="100" y1="160" x2="90" y2="160" stroke={colors.secondary} strokeWidth="1" opacity="0.5" />
      <line x1="300" y1="110" x2="310" y2="110" stroke={colors.secondary} strokeWidth="1" opacity="0.5" />
      <line x1="300" y1="160" x2="310" y2="160" stroke={colors.secondary} strokeWidth="1" opacity="0.5" />

      {/* 底部数据线 */}
      <path d="M200 250 L200 270 L150 270 L150 280" stroke={colors.primary} strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M200 250 L200 270 L250 270 L250 280" stroke={colors.primary} strokeWidth="1" fill="none" opacity="0.6" />
      <circle cx="150" cy="285" r="3" fill={colors.accent} />
      <circle cx="250" cy="285" r="3" fill={colors.accent} />
    </svg>
  );
};

/**
 * CircuitBoardIllustration - 电路板插画
 */
export const CircuitBoardIllustration: React.FC<CyberIllustrationProps> = ({
  width = 400,
  height = 300,
  variant = 'purple',
  className = '',
  animated = false,
}) => {
  const colors = colorSchemes[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <filter id="circuitGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 电路路径 */}
      <g stroke={colors.primary} strokeWidth="1.5" fill="none" opacity="0.6">
        <path d="M50 50 L100 50 L100 100 L150 100" />
        <path d="M350 50 L300 50 L300 100 L250 100" />
        <path d="M50 250 L100 250 L100 200 L150 200" />
        <path d="M350 250 L300 250 L300 200 L250 200" />
        <path d="M200 50 L200 100" />
        <path d="M200 250 L200 200" />
      </g>

      {/* 节点 */}
      <g filter="url(#circuitGlow)">
        {/* 中心芯片 */}
        <rect x="175" y="125" width="50" height="50" rx="4" stroke={colors.primary} strokeWidth="2" fill={colors.primary} fillOpacity="0.1" />
        <rect x="185" y="135" width="30" height="30" rx="2" fill={colors.primary} fillOpacity="0.3" />

        {/* 四角节点 */}
        <circle cx="50" cy="50" r="6" stroke={colors.secondary} strokeWidth="2" fill={colors.secondary} fillOpacity="0.2" />
        <circle cx="350" cy="50" r="6" stroke={colors.secondary} strokeWidth="2" fill={colors.secondary} fillOpacity="0.2" />
        <circle cx="50" cy="250" r="6" stroke={colors.secondary} strokeWidth="2" fill={colors.secondary} fillOpacity="0.2" />
        <circle cx="350" cy="250" r="6" stroke={colors.secondary} strokeWidth="2" fill={colors.secondary} fillOpacity="0.2" />

        {/* 中间节点 */}
        <circle cx="150" cy="100" r="4" fill={colors.accent} />
        <circle cx="250" cy="100" r="4" fill={colors.accent} />
        <circle cx="150" cy="200" r="4" fill={colors.accent} />
        <circle cx="250" cy="200" r="4" fill={colors.accent} />

        {animated && (
          <>
            <circle r="3" fill={colors.primary}>
              <animateMotion dur="3s" repeatCount="indefinite" path="M50,50 L100,50 L100,100 L150,100" />
              <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill={colors.primary}>
              <animateMotion dur="3s" repeatCount="indefinite" begin="1.5s" path="M350,50 L300,50 L300,100 L250,100" />
              <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" begin="1.5s"/>
            </circle>
          </>
        )}
      </g>

      {/* 装饰元素 */}
      <g opacity="0.3">
        <rect x="75" y="75" width="10" height="10" stroke={colors.secondary} fill="none" />
        <rect x="315" y="75" width="10" height="10" stroke={colors.secondary} fill="none" />
        <rect x="75" y="215" width="10" height="10" stroke={colors.secondary} fill="none" />
        <rect x="315" y="215" width="10" height="10" stroke={colors.secondary} fill="none" />
      </g>
    </svg>
  );
};

/**
 * NetworkGlobeIllustration - 网络地球插画
 */
export const NetworkGlobeIllustration: React.FC<CyberIllustrationProps> = ({
  width = 400,
  height = 300,
  variant = 'green',
  className = '',
  animated = false,
}) => {
  const colors = colorSchemes[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <filter id="globeGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.05"/>
        </linearGradient>
      </defs>

      {/* 地球外圈 */}
      <circle cx="200" cy="150" r="100" stroke={colors.primary} strokeWidth="2" fill="url(#globeGradient)" />
      <circle cx="200" cy="150" r="90" stroke={colors.secondary} strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="200" cy="150" r="80" stroke={colors.secondary} strokeWidth="0.5" fill="none" opacity="0.3" />

      {/* 经纬线 */}
      <g stroke={colors.secondary} strokeWidth="0.5" fill="none" opacity="0.4">
        <ellipse cx="200" cy="150" rx="100" ry="40" />
        <ellipse cx="200" cy="150" rx="40" ry="100" />
        <line x1="200" y1="50" x2="200" y2="250" />
        <line x1="100" y1="150" x2="300" y2="150" />
      </g>

      {/* 节点 */}
      <g filter="url(#globeGlow)">
        {/* 主要节点 */}
        <circle cx="200" cy="150" r="8" stroke={colors.primary} strokeWidth="2" fill={colors.primary} fillOpacity="0.3" />
        <circle cx="200" cy="150" r="4" fill={colors.accent} />

        {/* 卫星节点 */}
        <circle cx="130" cy="110" r="5" stroke={colors.secondary} strokeWidth="1.5" fill={colors.secondary} fillOpacity="0.3" />
        <circle cx="270" cy="110" r="5" stroke={colors.secondary} strokeWidth="1.5" fill={colors.secondary} fillOpacity="0.3" />
        <circle cx="130" cy="190" r="5" stroke={colors.secondary} strokeWidth="1.5" fill={colors.secondary} fillOpacity="0.3" />
        <circle cx="270" cy="190" r="5" stroke={colors.secondary} strokeWidth="1.5" fill={colors.secondary} fillOpacity="0.3" />

        {/* 连接线 */}
        <line x1="200" y1="150" x2="130" y2="110" stroke={colors.primary} strokeWidth="1" opacity="0.5" />
        <line x1="200" y1="150" x2="270" y2="110" stroke={colors.primary} strokeWidth="1" opacity="0.5" />
        <line x1="200" y1="150" x2="130" y2="190" stroke={colors.primary} strokeWidth="1" opacity="0.5" />
        <line x1="200" y1="150" x2="270" y2="190" stroke={colors.primary} strokeWidth="1" opacity="0.5" />
      </g>

      {/* 轨道卫星 */}
      {animated && (
        <>
          <g>
            <circle r="4" fill={colors.accent} filter="url(#globeGlow)">
              <animateMotion dur="4s" repeatCount="indefinite">
                <mpath href="#satelliteOrbit1" />
              </animateMotion>
            </circle>
          </g>
          <path id="satelliteOrbit1" d="M200,150 A100,100 0 1,1 199,150" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="0.3" strokeDasharray="4,4" />
        </>
      )}

      {/* 信号波 */}
      {animated && (
        <g opacity="0.5">
          <circle cx="200" cy="150" r="50" stroke={colors.primary} strokeWidth="1" fill="none">
            <animate attributeName="r" values="50;120;50" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
};

/**
 * CodeScreenIllustration - 代码屏幕插画
 */
export const CodeScreenIllustration: React.FC<CyberIllustrationProps> = ({
  width = 400,
  height = 300,
  variant = 'pink',
  className = '',
  animated = false,
}) => {
  const colors = colorSchemes[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <filter id="codeGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 窗口框架 */}
      <rect x="50" y="30" width="300" height="240" rx="8" stroke={colors.primary} strokeWidth="2" fill={colors.primary} fillOpacity="0.03" />

      {/* 标题栏 */}
      <rect x="50" y="30" width="300" height="30" rx="8" fill={colors.primary} fillOpacity="0.1" />
      <line x1="50" y1="60" x2="350" y2="60" stroke={colors.primary} strokeWidth="1" />
      <circle cx="70" cy="45" r="4" fill={colors.secondary} />
      <circle cx="85" cy="45" r="4" fill={colors.secondary} opacity="0.6" />
      <circle cx="100" cy="45" r="4" fill={colors.secondary} opacity="0.3" />

      {/* 代码行 */}
      <g fontSize="12" fontFamily="monospace">
        {/* 行 1 */}
        <text x="70" y="90" fill={colors.secondary} opacity="0.7">import</text>
        <text x="120" y="90" fill={colors.primary}>{'{ Cyber, }'}</text>
        <text x="200" y="90" fill={colors.secondary} opacity="0.7">from</text>
        <text x="230" y="90" fill={colors.accent}>'@cyberpress'</text>

        {/* 行 2 */}
        <text x="70" y="115" fill={colors.secondary} opacity="0.7">const</text>
        <text x="110" y="115" fill={colors.primary}>app</text>
        <text x="140" y="115" fill={colors.secondary} opacity="0.7">=</text>
        <text x="155" y="115" fill={colors.accent}>"new Cyber"</text>

        {/* 行 3 */}
        <text x="70" y="140" fill={colors.primary} filter="url(#codeGlow)">app.init()</text>

        {/* 行 4 */}
        <text x="70" y="165" fill={colors.secondary} opacity="0.7">return</text>
        <text x="115" y="165" fill={colors.primary}>(</text>

        {/* 行 5 */}
        <text x="90" y="190" fill={colors.accent}>'&lt;CyberApp /&gt;'</text>

        {/* 行 6 */}
        <text x="70" y="215" fill={colors.primary}>)</text>
      </g>

      {/* 光标 */}
      {animated && (
        <rect x="225" y="90" width="2" height="14" fill={colors.primary} filter="url(#codeGlow)">
          <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
        </rect>
      )}

      {/* 语法高亮装饰 */}
      <rect x="68" y="78" width="260" height="145" stroke={colors.secondary} strokeWidth="0.5" fill="none" opacity="0.2" rx="2" />
    </svg>
  );
};

export default {
  ServerRackIllustration,
  CircuitBoardIllustration,
  NetworkGlobeIllustration,
  CodeScreenIllustration,
};
