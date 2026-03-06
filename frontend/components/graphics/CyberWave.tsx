/**
 * CyberPress Cyber Wave Components
 *
 * 赛博朋克风格波浪装饰组件
 *
 * @example
 * ```tsx
 * import { CyberWave, WaveDivider, WaveBackground } from '@/components/graphics/CyberWave';
 *
 * <CyberWave variant="top" />
 * <WaveDivider />
 * <WaveBackground />
 * ```
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CyberWaveProps {
  variant?: 'top' | 'bottom' | 'both';
  color?: 'cyan' | 'purple' | 'pink' | 'mixed';
  amplitude?: number;
  className?: string;
  animated?: boolean;
}

const colors = {
  cyan: {
    primary: '#00f0ff',
    secondary: 'rgba(0, 240, 255, 0.3)',
    gradient: ['rgba(0, 240, 255, 0.8)', 'rgba(0, 240, 255, 0.1)']
  },
  purple: {
    primary: '#9d00ff',
    secondary: 'rgba(157, 0, 255, 0.3)',
    gradient: ['rgba(157, 0, 255, 0.8)', 'rgba(157, 0, 255, 0.1)']
  },
  pink: {
    primary: '#ff0080',
    secondary: 'rgba(255, 0, 128, 0.3)',
    gradient: ['rgba(255, 0, 128, 0.8)', 'rgba(255, 0, 128, 0.1)']
  },
  mixed: {
    primary: '#00f0ff',
    secondary: 'rgba(157, 0, 255, 0.3)',
    gradient: ['rgba(0, 240, 255, 0.8)', 'rgba(157, 0, 255, 0.1)']
  }
};

/**
 * 赛博波浪 - 顶部/底部装饰
 */
export const CyberWave: React.FC<CyberWaveProps> = ({
  variant = 'top',
  color = 'cyan',
  amplitude = 50,
  className = '',
  animated = true
}) => {
  const colorSet = colors[color];
  const rotation = variant === 'bottom' ? 180 : 0;

  return (
    <div
      className={cn(
        'w-full overflow-hidden',
        variant === 'top' ? 'mb-0' : 'mt-0',
        className
      )}
      style={{ height: `${amplitude}px` }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={cn(
          'w-full h-full',
          animated && 'animate-wave-slow'
        )}
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: variant === 'bottom' ? 'top' : 'bottom'
        }}
      >
        <defs>
          <linearGradient id={`waveGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorSet.gradient[0]} />
            <stop offset="100%" stopColor={colorSet.gradient[1]} />
          </linearGradient>
          <filter id={`waveGlow-${color}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 主波浪 */}
        <path
          d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
          fill={`url(#waveGradient-${color})`}
          opacity="0.8"
        />

        {/* 次波浪 */}
        <path
          d="M0,80 C200,140 400,20 600,80 C800,140 1000,20 1200,80 L1200,120 L0,120 Z"
          fill={colorSet.secondary}
          opacity="0.5"
        />

        {/* 高光线 */}
        <path
          d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60"
          fill="none"
          stroke={colorSet.primary}
          strokeWidth="2"
          filter={`url(#waveGlow-${color})`}
        >
          {animated && (
            <animate
              attributeName="d"
              values="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60;
                      M0,60 C150,80 350,40 600,60 C850,80 1050,40 1200,60;
                      M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60"
              dur="5s"
              repeatCount="indefinite"
            />
          )}
        </path>
      </svg>
    </div>
  );
};

/**
 * 波浪分割线
 */
export interface WaveDividerProps {
  color?: 'cyan' | 'purple' | 'pink' | 'mixed';
  style?: 'single' | 'double' | 'triple';
  className?: string;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  color = 'cyan',
  style = 'single',
  className = ''
}) => {
  const colorSet = colors[color];

  return (
    <div className={cn('w-full my-8', className)} style={{ height: '60px' }}>
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`dividerGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorSet.primary} stopOpacity="0" />
            <stop offset="50%" stopColor={colorSet.primary} stopOpacity="1" />
            <stop offset="100%" stopColor={colorSet.primary} stopOpacity="0} />
          </linearGradient>
        </defs>

        {style === 'single' && (
          <path
            d="M0,30 C300,60 900,0 1200,30"
            fill="none"
            stroke={`url(#dividerGradient-${color})`}
            strokeWidth="2"
          />
        )}

        {style === 'double' && (
          <>
            <path
              d="M0,25 C300,55 900,5 1200,25"
              fill="none"
              stroke={colorSet.primary}
              strokeWidth="2"
              opacity="0.7"
            />
            <path
              d="M0,35 C300,65 900,15 1200,35"
              fill="none"
              stroke={colorSet.secondary}
              strokeWidth="2"
              opacity="0.7"
            />
          </>
        )}

        {style === 'triple' && (
          <>
            <path
              d="M0,20 C300,50 900,0 1200,20"
              fill="none"
              stroke={colorSet.primary}
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path
              d="M0,30 C300,60 900,0 1200,30"
              fill="none"
              stroke={`url(#dividerGradient-${color})`}
              strokeWidth="2"
            />
            <path
              d="M0,40 C300,70 900,10 1200,40"
              fill="none"
              stroke={colorSet.secondary}
              strokeWidth="1.5"
              opacity="0.5"
            />
          </>
        )}
      </svg>
    </div>
  );
};

/**
 * 波浪背景
 */
export interface WaveBackgroundProps {
  color?: 'cyan' | 'purple' | 'pink' | 'mixed';
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

export const WaveBackground: React.FC<WaveBackgroundProps> = ({
  color = 'cyan',
  density = 'medium',
  className = ''
}) => {
  const colorSet = colors[color];
  const waves = density === 'low' ? 3 : density === 'medium' ? 5 : 8;

  return (
    <div className={cn('absolute inset-0 -z-10', className)}>
      <svg
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`bgWaveGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorSet.gradient[0]} />
            <stop offset="100%" stopColor={colorSet.gradient[1]} />
          </linearGradient>
        </defs>

        {Array.from({ length: waves }).map((_, i) => {
          const opacity = 0.1 + (i * 0.05);
          const yOffset = 50 + (i * 40);

          return (
            <path
              key={`wave-${i}`}
              d={`M0,${yOffset} C300,${yOffset + 50} 900,${yOffset - 50} 1200,${yOffset} L1200,400 L0,400 Z`}
              fill={colorSet.secondary}
              opacity={opacity}
              style={{
                animation: `wave-move ${8 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

/**
 * 音频波形可视化
 */
export interface AudioWaveformProps {
  bars?: number;
  color?: 'cyan' | 'purple' | 'pink' | 'mixed';
  animated?: boolean;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  bars = 20,
  color = 'cyan',
  animated = true,
  className = ''
}) => {
  const colorSet = colors[color];

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={`bar-${i}`}
          className="w-1 rounded-full transition-all duration-300"
          style={{
            background: `linear-gradient(to top, ${colorSet.gradient[0]}, ${colorSet.gradient[1]})`,
            height: animated ? '20px' : `${10 + Math.random() * 40}px`,
            animation: animated
              ? `audio-pulse ${0.5 + (i * 0.05)}s ease-in-out infinite`
              : undefined,
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
    </div>
  );
};

/**
 * 脉冲波浪效果
 */
export interface PulseWaveProps {
  color?: 'cyan' | 'purple' | 'pink';
  size?: number;
  className?: string;
}

export const PulseWave: React.FC<PulseWaveProps> = ({
  color = 'cyan',
  size = 200,
  className = ''
}) => {
  const colorSet = colors[color];

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`pulseGradient-${color}`}>
            <stop offset="0%" stopColor={colorSet.primary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colorSet.primary} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 脉冲圆圈 */}
        {Array.from({ length: 3 }).map((_, i) => (
          <circle
            key={`pulse-${i}`}
            cx="100"
            cy="100"
            r="20"
            fill={`url(#pulseGradient-${color})`}
            style={{
              animation: `pulse-expand ${2 + i * 0.5}s ease-out infinite`,
              animationDelay: `${i * 0.7}s`
            }}
          />
        ))}

        {/* 中心点 */}
        <circle
          cx="100"
          cy="100"
          r="10"
          fill={colorSet.primary}
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

export default {
  CyberWave,
  WaveDivider,
  WaveBackground,
  AudioWaveform,
  PulseWave
};
