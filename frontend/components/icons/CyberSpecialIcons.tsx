'use client';

import React from 'react';

/**
 * 赛博朋克特殊效果图标集
 * 包含故障艺术、全息投影、霓虹发光等特效图标
 */

// ============================================
// 故障艺术图标 (Glitch Art Icons)
// ============================================

interface GlitchIconProps {
  size?: number;
  className?: string;
}

/**
 * 故障芯片图标
 * 带有像素化故障效果
 */
export const GlitchChipIcon: React.FC<GlitchIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ filter: 'url(#glitch-filter)' }}
    >
      <defs>
        <filter id="glitch-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </defs>
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 8h8 M8 12h8 M8 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

/**
 * 故障文本图标
 * 带有错位效果
 */
export const GlitchTextIcon: React.FC<GlitchIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <text x="4" y="18" fill="currentColor" fontSize="16" fontWeight="bold" style={{ opacity: 0.3 }}>
        {`</>`}
      </text>
      <text x="4.5" y="18" fill="currentColor" fontSize="16" fontWeight="bold" style={{ opacity: 0.6 }}>
        {`</>`}
      </text>
      <text x="5" y="18" fill="currentColor" fontSize="16" fontWeight="bold">
        {`</>`}
      </text>
    </svg>
  );
};

// ============================================
// 全息投影图标 (Hologram Icons)
// ============================================

interface HologramIconProps {
  size?: number;
  className?: string;
  animating?: boolean;
}

/**
 * 全息数据图标
 * 带有扫描线效果
 */
export const HologramDataIcon: React.FC<HologramIconProps> = ({
  size = 24,
  className = '',
  animating = true,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="hologram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#9d00ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* 数据库主体 */}
      <ellipse cx="12" cy="6" rx="8" ry="2" stroke="url(#hologram-gradient)" strokeWidth="1.5" fill="none" />
      <path d="M4 6v12c0 1.1 3.6 2 8 2s8-0.9 8-2V6" stroke="url(#hologram-gradient)" strokeWidth="1.5" fill="none" />

      {/* 扫描线 */}
      {animating && (
        <line
          x1="4"
          y1="10"
          x2="20"
          y2="10"
          stroke="#00f0ff"
          strokeWidth="1"
          opacity="0.5"
          style={{ animation: 'hologram-scan 2s linear infinite' }}
        />
      )}

      {/* 数据点 */}
      <circle cx="8" cy="14" r="1" fill="#00f0ff" opacity="0.8" />
      <circle cx="12" cy="16" r="1" fill="#9d00ff" opacity="0.8" />
      <circle cx="16" cy="14" r="1" fill="#00f0ff" opacity="0.8" />

      <style>{`
        @keyframes hologram-scan {
          0% { y1: 6; y2: 6; opacity: 0; }
          50% { opacity: 1; }
          100% { y1: 18; y2: 18; opacity: 0; }
        }
      `}</style>
    </svg>
  );
};

/**
 * 全息网络图标
 * 带有脉冲节点效果
 */
export const HologramNetworkIcon: React.FC<HologramIconProps> = ({
  size = 24,
  className = '',
  animating = true,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* 连接线 */}
      <line x1="12" y1="4" x2="6" y2="12" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
      <line x1="12" y1="4" x2="18" y2="12" stroke="#00f0ff" strokeWidth="1" opacity="0.6" />
      <line x1="6" y1="12" x2="12" y2="20" stroke="#9d00ff" strokeWidth="1" opacity="0.6" />
      <line x1="18" y1="12" x2="12" y2="20" stroke="#9d00ff" strokeWidth="1" opacity="0.6" />
      <line x1="6" y1="12" x2="18" y2="12" stroke="#00f0ff" strokeWidth="1" opacity="0.4" />

      {/* 节点 */}
      <circle cx="12" cy="4" r="3" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="2" />
      <circle cx="6" cy="12" r="3" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="2" />
      <circle cx="18" cy="12" r="3" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="2" />
      <circle cx="12" cy="20" r="3" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="2" />

      {/* 脉冲效果 */}
      {animating && (
        <>
          <circle
            cx="12"
            cy="4"
            r="3"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1"
            opacity="0.5"
            style={{ animation: 'pulse 2s ease-out infinite' }}
          />
          <circle
            cx="6"
            cy="12"
            r="3"
            fill="none"
            stroke="#9d00ff"
            strokeWidth="1"
            opacity="0.5"
            style={{ animation: 'pulse 2s ease-out infinite 0.5s' }}
          />
          <circle
            cx="18"
            cy="12"
            r="3"
            fill="none"
            stroke="#9d00ff"
            strokeWidth="1"
            opacity="0.5"
            style={{ animation: 'pulse 2s ease-out infinite 1s' }}
          />
        </>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </svg>
  );
};

// ============================================
// 霓虹发光图标 (Neon Glow Icons)
// ============================================

interface NeonIconProps {
  size?: number;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
}

const neonColors = {
  cyan: '#00f0ff',
  purple: '#9d00ff',
  pink: '#ff0080',
  yellow: '#f0ff00',
};

/**
 * 霓虹六边形图标
 */
export const NeonHexagonIcon: React.FC<NeonIconProps> = ({
  size = 24,
  className = '',
  color = 'cyan',
}) => {
  const neonColor = neonColors[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 2px ${neonColor}) drop-shadow(0 0 4px ${neonColor})` }}
    >
      <path
        d="M12 2l8.5 5v10L12 22l-8.5-5V7z"
        stroke={neonColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill={neonColor} opacity="0.8" />
    </svg>
  );
};

/**
 * 霓虹闪电图标
 */
export const NeonBoltIcon: React.FC<NeonIconProps> = ({ size = 24, className = '', color = 'yellow' }) => {
  const neonColor = neonColors[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 3px ${neonColor}) drop-shadow(0 0 6px ${neonColor})` }}
    >
      <path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke={neonColor}
        strokeWidth="2"
        strokeLinejoin="round"
        fill={neonColor}
        fillOpacity="0.3"
      />
    </svg>
  );
};

/**
 * 霓虹星星图标
 */
export const NeonStarIcon: React.FC<NeonIconProps> = ({ size = 24, className = '', color = 'pink' }) => {
  const neonColor = neonColors[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ filter: `drop-shadow(0 0 2px ${neonColor}) drop-shadow(0 0 4px ${neonColor})` }}
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={neonColor}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================
// 矩阵效果图标 (Matrix Effect Icons)
// ============================================

interface MatrixIconProps {
  size?: number;
  className?: string;
  animating?: boolean;
}

/**
 * 矩阵雨图标
 */
export const MatrixRainIcon: React.FC<MatrixIconProps> = ({
  size = 24,
  className = '',
  animating = true,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <linearGradient id="matrix-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
          <stop offset="50%" stopColor="#00ff88" stopOpacity="1" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 代码列 */}
      <g fontFamily="monospace" fontSize="8" fill="url(#matrix-gradient)">
        {animating ? (
          <>
            <text x="2" y="8" style={{ animation: 'matrix-fall 1.5s linear infinite' }}>1</text>
            <text x="6" y="16" style={{ animation: 'matrix-fall 1.8s linear infinite 0.3s' }}>0</text>
            <text x="10" y="10" style={{ animation: 'matrix-fall 1.3s linear infinite 0.6s' }}>1</text>
            <text x="14" y="20" style={{ animation: 'matrix-fall 1.6s linear infinite 0.9s' }}>0</text>
            <text x="18" y="12" style={{ animation: 'matrix-fall 1.4s linear infinite 1.2s' }}>1</text>
          </>
        ) : (
          <>
            <text x="2" y="8">1</text>
            <text x="6" y="16">0</text>
            <text x="10" y="10">1</text>
            <text x="14" y="20">0</text>
            <text x="18" y="12">1</text>
          </>
        )}
      </g>

      <style>{`
        @keyframes matrix-fall {
          0% { opacity: 0; transform: translateY(-5px); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(20px); }
        }
      `}</style>
    </svg>
  );
};

// ============================================
// 电路板图标 (Circuit Board Icons)
// ============================================

interface CircuitIconProps {
  size?: number;
  className?: string;
}

/**
 * 电路节点图标
 */
export const CircuitNodeIcon: React.FC<CircuitIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* 电路线路 */}
      <path d="M4 12h6 M14 12h6 M10 12v-4 M10 12v4" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />

      {/* 节点 */}
      <circle cx="10" cy="12" r="2" fill="#0a0a0f" stroke="#9d00ff" strokeWidth="2" />
      <circle cx="4" cy="12" r="1.5" fill="#00f0ff" />
      <circle cx="20" cy="12" r="1.5" fill="#00f0ff" />
      <circle cx="10" cy="8" r="1.5" fill="#9d00ff" />
      <circle cx="10" cy="16" r="1.5" fill="#9d00ff" />

      {/* 发光效果 */}
      <circle cx="10" cy="12" r="4" fill="none" stroke="#9d00ff" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
};

/**
 * 电路芯片图标
 */
export const CircuitChipIcon: React.FC<CircuitIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* 芯片主体 */}
      <rect x="6" y="6" width="12" height="12" rx="1" fill="#0a0a0f" stroke="#00f0ff" strokeWidth="2" />

      {/* 内部电路 */}
      <path d="M9 9h6 M9 12h6 M9 15h3" stroke="#9d00ff" strokeWidth="1" strokeLinecap="round" />

      {/* 引脚 */}
      <g stroke="#00f0ff" strokeWidth="2" strokeLinecap="round">
        <line x1="6" y1="9" x2="4" y2="9" />
        <line x1="6" y1="12" x2="4" y2="12" />
        <line x1="6" y1="15" x2="4" y2="15" />
        <line x1="18" y1="9" x2="20" y2="9" />
        <line x1="18" y1="12" x2="20" y2="12" />
        <line x1="18" y1="15" x2="20" y2="15" />
        <line x1="9" y1="6" x2="9" y2="4" />
        <line x1="12" y1="6" x2="12" y2="4" />
        <line x1="15" y1="6" x2="15" y2="4" />
        <line x1="9" y1="18" x2="9" y2="20" />
        <line x1="12" y1="18" x2="12" y2="20" />
        <line x1="15" y1="18" x2="15" y2="20" />
      </g>
    </svg>
  );
};

// ============================================
// 导出所有图标
// ============================================

export const CyberSpecialIcons = {
  // 故障艺术
  GlitchChipIcon,
  GlitchTextIcon,

  // 全息投影
  HologramDataIcon,
  HologramNetworkIcon,

  // 霓虹发光
  NeonHexagonIcon,
  NeonBoltIcon,
  NeonStarIcon,

  // 矩阵效果
  MatrixRainIcon,

  // 电路板
  CircuitNodeIcon,
  CircuitChipIcon,
};

export default CyberSpecialIcons;
