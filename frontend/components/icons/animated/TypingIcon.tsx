/**
 * TypingIcon - 打字机动画图标
 * 模拟终端输入的动画效果
 */

import React, { useState, useEffect } from 'react';
import { IconProps } from '../types';

export interface TypingIconProps extends IconProps {
  /**
   * 打字速度
   * @default 'medium'
   */
  speed?: 'slow' | 'medium' | 'fast';

  /**
   * 光标颜色
   * @default '#00f0ff'
   */
  cursorColor?: string;
}

export const TypingIcon: React.FC<TypingIconProps> = ({
  size = 24,
  className = '',
  color = '#00f0ff',
  speed = 'medium',
  cursorColor = '#00f0ff',
  ariaLabel,
}) => {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const intervals = {
      slow: 1000,
      medium: 500,
      fast: 250,
    };

    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, intervals[speed]);

    return () => clearInterval(interval);
  }, [speed]);

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
      {/* Terminal window */}
      <rect
        x="2"
        y="3"
        width="20"
        height="18"
        rx="2"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />

      {/* Terminal header */}
      <line x1="2" y1="7" x2="22" y2="7" stroke={color} strokeWidth="2" />

      {/* Terminal buttons */}
      <circle cx="5" cy="5" r="0.5" fill={color} />
      <circle cx="7" cy="5" r="0.5" fill={color} />
      <circle cx="9" cy="5" r="0.5" fill={color} />

      {/* Cursor */}
      {showCursor && (
        <rect
          x="5"
          y="12"
          width="2"
          height="10"
          fill={cursorColor}
          className="animate-pulse"
        />
      )}

      {/* Text lines */}
      <line x1="10" y1="12" x2="14" y2="12" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <line x1="10" y1="15" x2="18" y2="15" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <line x1="10" y1="18" x2="16" y2="18" stroke={color} strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
};

export default TypingIcon;
