/**
 * GlitchIcon - 赛博朋克故障效果图标
 * 模拟数字故障效果的动画图标
 */

import React, { useState, useEffect } from 'react';
import { IconProps } from '../types';

export interface GlitchIconProps extends IconProps {
  /**
   * 故障频率
   * @default 'medium'
   */
  frequency?: 'low' | 'medium' | 'high';

  /**
   * 故障强度
   * @default 'medium'
   */
  intensity?: 'low' | 'medium' | 'high';
}

export const GlitchIcon: React.FC<GlitchIconProps> = ({
  size = 24,
  className = '',
  color = '#00f0ff',
  frequency = 'medium',
  intensity = 'medium',
  ariaLabel,
  children,
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const intervals = {
      low: 5000,
      medium: 3000,
      high: 1000,
    };

    const durations = {
      low: 100,
      medium: 200,
      high: 300,
    };

    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), durations[intensity]);
    }, intervals[frequency]);

    return () => clearInterval(interval);
  }, [frequency, intensity]);

  const glitchOffset = isGlitching ? (Math.random() - 0.5) * 4 : 0;
  const colorShift = isGlitching ? '#ff0080' : color;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={ariaLabel}
      role="img"
    >
      {isGlitching && (
        <g
          style={{
            transform: `translate(${glitchOffset}px, ${glitchOffset}px)`,
            opacity: 0.7,
          }}
        >
          {React.cloneElement(children as React.ReactElement, {
            stroke: colorShift,
          })}
        </g>
      )}
      <g
        style={{
          transform: `translate(${-glitchOffset}px, ${-glitchOffset}px)`,
        }}
      >
        {children || (
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        )}
      </g>
    </svg>
  );
};

export default GlitchIcon;
