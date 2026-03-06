'use client';

import React from 'react';

export interface DecorativePatternProps {
  type?: 'grid' | 'circuit' | 'hexagon' | 'dots';
  opacity?: number;
  className?: string;
  animated?: boolean;
}

/**
 * 装饰性背景图案组件
 *
 * @param type - 图案类型
 * @param opacity - 不透明度 (0-1)
 * @param className - 自定义类名
 * @param animated - 是否启用动画效果
 */
export const DecorativePattern: React.FC<DecorativePatternProps> = ({
  type = 'grid',
  opacity = 0.3,
  className = '',
  animated = false
}) => {
  const baseStyle: React.CSSProperties = {
    opacity,
    transition: animated ? 'all 0.3s ease' : undefined
  };

  const patterns = {
    grid: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className={className}
        style={baseStyle}
      >
        <defs>
          <pattern
            id="cyberGrid"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#00f0ff"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cyberGrid)" />
      </svg>
    ),

    circuit: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className={className}
        style={baseStyle}
      >
        <defs>
          <pattern
            id="circuitPattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            {/* 横线 */}
            <line x1="0" y1="10" x2="40" y2="10" stroke="#9d00ff" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="30" x2="40" y2="30" stroke="#9d00ff" strokeWidth="1" opacity="0.5" />
            {/* 竖线 */}
            <line x1="10" y1="0" x2="10" y2="10" stroke="#9d00ff" strokeWidth="1" opacity="0.5" />
            <line x1="10" y1="30" x2="10" y2="40" stroke="#9d00ff" strokeWidth="1" opacity="0.5" />
            <line x1="30" y1="0" x2="30" y2="10" stroke="#9d00ff" strokeWidth="1" opacity="0.5" />
            <line x1="30" y1="30" x2="30" y2="40" stroke="#9d00ff" strokeWidth="1" opacity="0.5" />
            {/* 节点 */}
            <circle cx="10" cy="10" r="1.5" fill="#00f0ff" />
            <circle cx="30" cy="10" r="1.5" fill="#00f0ff" />
            <circle cx="10" cy="30" r="1.5" fill="#00f0ff" />
            <circle cx="30" cy="30" r="1.5" fill="#00f0ff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuitPattern)" />
      </svg>
    ),

    hexagon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className={className}
        style={baseStyle}
      >
        <defs>
          <pattern
            id="hexPattern"
            x="0"
            y="0"
            width="40"
            height="34.64"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="20,0 40,10 40,30 20,40 0,30 0,10"
              fill="none"
              stroke="#ff0080"
              strokeWidth="0.5"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexPattern)" />
      </svg>
    ),

    dots: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className={className}
        style={baseStyle}
      >
        <defs>
          <pattern
            id="dotPattern"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#00f0ff" opacity="0.5" />
            <circle cx="7" cy="7" r="1" fill="#9d00ff" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>
    )
  };

  return patterns[type];
};

/**
 * 扫描线效果组件
 */
export interface ScanlinesProps {
  className?: string;
  opacity?: number;
}

export const Scanlines: React.FC<ScanlinesProps> = ({
  className = '',
  opacity = 0.1
}) => {
  const style: React.CSSProperties = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(' +
      '0deg,' +
      'rgba(0, 0, 0, ' + opacity + '),' +
      'rgba(0, 0, 0, ' + opacity + ') 1px,' +
      'transparent 1px,' +
      'transparent 2px' +
    ')',
    pointerEvents: 'none' as const,
    zIndex: 10
  };

  return <div className={className} style={style} />;
};

/**
 * 故障效果组件
 */
export interface GlitchEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlitchEffect: React.FC<GlitchEffectProps> = ({
  children,
  className = '',
  intensity = 'medium'
}) => {
  const [isGlitching, setIsGlitching] = React.useState(false);

  React.useEffect(() => {
    if (intensity === 'low') {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }, 5000);
      return () => clearInterval(interval);
    } else if (intensity === 'medium') {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }, 3000);
      return () => clearInterval(interval);
    } else if (intensity === 'high') {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [intensity]);

  const glitchStyle: React.CSSProperties = isGlitching ? {
    animation: 'glitch 0.3s ease',
    textShadow: '2px 0 #ff0080, -2px 0 #00f0ff'
  } : {
    transition: 'all 0.1s ease'
  };

  return (
    <div className={className} style={glitchStyle}>
      {children}
      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
};

export default DecorativePattern;
