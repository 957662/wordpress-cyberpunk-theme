'use client';

import React from 'react';

export interface QuantumCoreIconProps {
  size?: number;
  className?: string;
  color?: 'cyan' | 'purple' | 'pink';
  animated?: boolean;
}

/**
 * 量子核心图标 - 赛博朋克风格
 * 展示旋转的能量核心和光环效果
 */
export const QuantumCoreIcon: React.FC<QuantumCoreIconProps> = ({
  size = 100,
  className = '',
  color = 'purple',
  animated = true,
}) => {
  const colorMap = {
    cyan: '#00f0ff',
    purple: '#9d00ff',
    pink: '#ff0080',
  };

  const primaryColor = colorMap[color];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <filter id={`quantumGlow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <radialGradient id={`coreGlow-${color}`}>
          <stop offset="0%" stopColor={primaryColor} stopOpacity="1"/>
          <stop offset="50%" stopColor={primaryColor} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0"/>
        </radialGradient>

        <linearGradient id={`ringGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor}/>
          <stop offset="50%" stopColor={colorMap.cyan}/>
          <stop offset="100%" stopColor={primaryColor}/>
        </linearGradient>
      </defs>

      {/* Outer Ring 1 */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke={`url(#ringGradient-${color})`}
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      >
        {animated && <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite"/>}
      </circle>

      {/* Outer Ring 2 */}
      <circle
        cx="50"
        cy="50"
        r="35"
        stroke={primaryColor}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="10 5"
        opacity="0.5"
      >
        {animated && <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="15s" repeatCount="indefinite"/>}
      </circle>

      {/* Outer Ring 3 */}
      <circle
        cx="50"
        cy="50"
        r="30"
        stroke={colorMap.cyan}
        strokeWidth="1"
        fill="none"
        strokeDasharray="5 5"
        opacity="0.4"
      >
        {animated && <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="-360 50 50" dur="10s" repeatCount="indefinite"/>}
      </circle>

      {/* Middle Ring */}
      <circle
        cx="50"
        cy="50"
        r="25"
        stroke={`url(#ringGradient-${color})`}
        strokeWidth="2"
        fill="none"
        filter={`url(#quantumGlow-${color})`}
      >
        {animated && <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite"/>}
      </circle>

      {/* Inner Ring */}
      <circle
        cx="50"
        cy="50"
        r="18"
        stroke={colorMap.pink}
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="3 3"
        opacity="0.6"
      >
        {animated && <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="5s" repeatCount="indefinite"/>}
      </circle>

      {/* Core */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill={`url(#coreGlow-${color})`}
        filter={`url(#quantumGlow-${color})`}
      >
        {animated && (
          <>
            <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite"/>
          </>
        )}
      </circle>

      {/* Energy Particles */}
      {animated && (
        <g fill={primaryColor}>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <circle key={i} r="1.5" opacity="0.8">
              <animateMotion
                dur={`${3 + i * 0.2}s`}
                repeatCount="indefinite"
                path={`M50,50 L${50 + 40 * Math.cos((angle * Math.PI) / 180)},${50 + 40 * Math.sin((angle * Math.PI) / 180)}`}
              />
            </circle>
          ))}
        </g>
      )}

      {/* Orbiting Dots */}
      {animated && (
        <>
          <circle r="2" fill={colorMap.cyan}>
            <animateMotion dur="6s" repeatCount="indefinite">
              <mpath href={`#orbitPath-${color}`}/>
            </animateMotion>
          </circle>
          <circle r="2" fill={colorMap.pink}>
            <animateMotion dur="8s" repeatCount="indefinite" begin="1s">
              <mpath href={`#orbitPath-${color}`}/>
            </animateMotion>
          </circle>
          <path id={`orbitPath-${color}`} d="M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10" fill="none"/>
        </>
      )}
    </svg>
  );
};

export default QuantumCoreIcon;
