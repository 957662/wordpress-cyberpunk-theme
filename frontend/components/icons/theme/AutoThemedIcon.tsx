/**
 * AutoThemedIcon - 自动主题图标
 * 自动检测并应用主题颜色的图标
 */

import React from 'react';
import { IconProps } from '../types';

export interface AutoThemedIconProps extends IconProps {
  /**
   * 颜色变体
   * @default 'cyan'
   */
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
}

export const AutoThemedIcon: React.FC<AutoThemedIconProps> = ({
  size = 24,
  className = '',
  variant = 'cyan',
  children,
  ...props
}) => {
  const colorMap = {
    cyan: {
      light: 'var(--theme-cyan-light, #0066ff)',
      dark: 'var(--theme-cyan-dark, #00f0ff)',
    },
    purple: {
      light: 'var(--theme-purple-light, #6600cc)',
      dark: 'var(--theme-purple-dark, #9d00ff)',
    },
    pink: {
      light: 'var(--theme-pink-light, #cc0066)',
      dark: 'var(--theme-pink-dark, #ff0080)',
    },
    yellow: {
      light: 'var(--theme-yellow-light, #b3b300)',
      dark: 'var(--theme-yellow-dark, #f0ff00)',
    },
    green: {
      light: 'var(--theme-green-light, #00cc66)',
      dark: 'var(--theme-green-dark, #00ff88)',
    },
  };

  const colors = colorMap[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        color: colors.light,
      }}
      {...props}
    >
      <style>{`
        svg {
          color: ${colors.light};
        }
        @media (prefers-color-scheme: dark) {
          svg {
            color: ${colors.dark};
          }
        }
        :root.dark & svg, .dark & svg {
          color: ${colors.dark};
        }
      `}</style>
      {children}
    </svg>
  );
};

export default AutoThemedIcon;
