/**
 * CyberPress 科技图标集
 *
 * 包含完整的赛博朋克风格科技图标
 */

'use client';

import React from 'react';

export type TechIconVariant = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
export type TechIconSize = number;

interface TechIconProps {
  size?: TechIconSize;
  variant?: TechIconVariant;
  className?: string;
  animated?: boolean;
}

const colorMap: Record<TechIconVariant, string> = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
  green: '#00ff88',
};

/**
 * ServerIcon - 服务器图标
 */
export const ServerIcon: React.FC<TechIconProps> = ({
  size = 48,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <filter id={`server-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 机架外框 */}
      <rect x="4" y="2" width="40" height="44" rx="2" stroke={color} strokeWidth="1.5" fill="none" />

      {/* 服务器单元 1 */}
      <rect x="8" y="6" width="32" height="10" rx="1" stroke={color} strokeWidth="1" fill="rgba(0, 240, 255, 0.05)" />
      <circle cx="12" cy="11" r="1.5" fill={color} filter={`url(#server-glow-${variant})`} />
      <circle cx="16" cy="11" r="1.5" fill={color} opacity="0.6" />
      <rect x="22" y="9" width="14" height="4" rx="1" fill={color} opacity="0.3" />

      {/* 服务器单元 2 */}
      <rect x="8" y="19" width="32" height="10" rx="1" stroke={color} strokeWidth="1" fill="rgba(0, 240, 255, 0.05)" />
      <circle cx="12" cy="24" r="1.5" fill={color} filter={`url(#server-glow-${variant})`} />
      <circle cx="16" cy="24" r="1.5" fill={color} opacity="0.6" />
      <rect x="22" y="22" width="14" height="4" rx="1" fill={color} opacity="0.3" />

      {/* 服务器单元 3 */}
      <rect x="8" y="32" width="32" height="10" rx="1" stroke={color} strokeWidth="1" fill="rgba(0, 240, 255, 0.05)" />
      <circle cx="12" cy="37" r="1.5" fill={color} filter={`url(#server-glow-${variant})`} />
      <circle cx="16" cy="37" r="1.5" fill={color} opacity="0.6" />
      <rect x="22" y="35" width="14" height="4" rx="1" fill={color} opacity="0.3" />

      {/* 装饰线 */}
      <line x1="2" y1="16" x2="4" y2="16" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="2" y1="29" x2="4" y2="29" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="44" y1="16" x2="46" y2="16" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="44" y1="29" x2="46" y2="29" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
};

/**
 * CodeIcon - 代码图标
 */
export const CodeBracketIcon: React.FC<TechIconProps> = ({
  size = 48,
  variant = 'purple',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <filter id={`code-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 左括号 */}
      <path
        d="M18 14 L10 24 L18 34"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#code-glow-${variant})`}
      />

      {/* 右括号 */}
      <path
        d="M30 14 L38 24 L30 34"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#code-glow-${variant})`}
      />

      {/* 中间斜线 */}
      <line
        x1="26"
        y1="12"
        x2="22"
        y2="36"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
};

/**
 * TerminalIcon - 终端图标
 */
export const TerminalIcon: React.FC<TechIconProps> = ({
  size = 48,
  variant = 'green',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <filter id={`terminal-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 终端窗口 */}
      <rect x="4" y="4" width="40" height="40" rx="3" stroke={color} strokeWidth="1.5" fill="rgba(0, 255, 136, 0.05)" />

      {/* 标题栏 */}
      <rect x="4" y="4" width="40" height="8" rx="3" fill={color} opacity="0.2" />
      <circle cx="10" cy="8" r="1.5" fill={color} />
      <circle cx="14" cy="8" r="1.5" fill={color} opacity="0.6" />
      <circle cx="18" cy="8" r="1.5" fill={color} opacity="0.3" />

      {/* 提示符 */}
      <path
        d="M12 20 L18 24 L12 28"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#terminal-glow-${variant})`}
      />

      {/* 光标 */}
      <rect x="22" y="22" width="2" height="4" fill={color} filter={`url(#terminal-glow-${variant})`}>
        {animated && <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />}
      </rect>

      {/* 文本行 */}
      <rect x="12" y="34" width="20" height="2" rx="1" fill={color} opacity="0.4" />
      <rect x="12" y="38" width="16" height="2" rx="1" fill={color} opacity="0.3" />
    </svg>
  );
};

/**
 * CloudIcon - 云端图标
 */
export const CloudIcon: React.FC<TechIconProps> = ({
  size = 48,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <filter id={`cloud-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`cloud-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
        </linearGradient>
      </defs>

      {/* 云朵主体 */}
      <ellipse cx="20" cy="28" rx="10" ry="8" stroke={color} strokeWidth="1.5" fill={`url(#cloud-gradient-${variant})`} />
      <ellipse cx="30" cy="26" rx="12" ry="10" stroke={color} strokeWidth="1.5" fill={`url(#cloud-gradient-${variant})`} />
      <ellipse cx="38" cy="30" rx="8" ry="6" stroke={color} strokeWidth="1.5" fill={`url(#cloud-gradient-${variant})`} />

      {/* 连接线 */}
      <line x1="24" y1="36" x2="24" y2="40" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <circle cx="24" cy="42" r="2" fill={color} filter={`url(#cloud-glow-${variant})`} />

      {/* 数据点 */}
      {animated && (
        <>
          <circle cx="18" cy="22" r="1" fill={color} opacity="0">
            <animate attributeName="cy" values="22;18;22" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="30" cy="20" r="1" fill={color} opacity="0">
            <animate attributeName="cy" values="20;16;20" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
            <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
          </circle>
        </>
      )}
    </svg>
  );
};

/**
 * ShieldIcon - 安全盾牌图标
 */
export const ShieldSecureIcon: React.FC<TechIconProps> = ({
  size = 48,
  variant = 'pink',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <filter id={`shield-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id={`shield-gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.05"/>
        </linearGradient>
      </defs>

      {/* 盾牌外形 */}
      <path
        d="M24 4 L40 12 V24 C40 34 32 42 24 44 C16 42 8 34 8 24 V12 L24 4 Z"
        stroke={color}
        strokeWidth="2"
        fill={`url(#shield-gradient-${variant})`}
        filter={`url(#shield-glow-${variant})`}
      />

      {/* 内盾牌 */}
      <path
        d="M24 10 L36 16 V24 C36 31 30 37 24 39 C18 37 12 31 12 24 V16 L24 10 Z"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />

      {/* 锁图标 */}
      <rect x="20" y="22" width="8" height="10" rx="1" stroke={color} strokeWidth="1.5" fill={color} opacity="0.3" />
      <path
        d="M22 22 V18 C22 16.3438 23.3438 15 25 15 C26.6562 15 28 16.3438 28 18 V22"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="24" cy="27" r="1.5" fill={color} filter={`url(#shield-glow-${variant})`} />
    </svg>
  );
};

/**
 * GitBranchIcon - Git分支图标
 */
export const GitBranchIcon: React.FC<TechIconProps> = ({
  size = 48,
  variant = 'yellow',
  className = '',
  animated = false,
}) => {
  const color = colorMap[variant];
  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animationClass} ${className}`}
    >
      <defs>
        <filter id={`git-glow-${variant}`}>
          <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* 主分支线 */}
      <line x1="24" y1="8" x2="24" y2="40" stroke={color} strokeWidth="2" />

      {/* 分支线 */}
      <path d="M24 24 L38 16" stroke={color} strokeWidth="2" fill="none" />

      {/* 节点圆点 */}
      <circle cx="24" cy="12" r="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.3" filter={`url(#git-glow-${variant})`} />
      <circle cx="24" cy="24" r="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.3" filter={`url(#git-glow-${variant})`} />
      <circle cx="24" cy="38" r="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.3" filter={`url(#git-glow-${variant})`} />
      <circle cx="38" cy="16" r="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.3" filter={`url(#git-glow-${variant})`} />
    </svg>
  );
};

export default {
  ServerIcon,
  CodeBracketIcon,
  TerminalIcon,
  CloudIcon,
  ShieldSecureIcon,
  GitBranchIcon,
};
