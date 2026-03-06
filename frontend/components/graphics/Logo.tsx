'use client';

import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'vertical';
  size?: number;
  className?: string;
  showText?: boolean;
}

/**
 * CyberPress Logo 组件
 *
 * @param variant - Logo 变体: 'horizontal' | 'icon' | 'vertical'
 * @param size - Logo 尺寸（宽度，高度自动调整）
 * @param className - 自定义 CSS 类名
 * @param showText - 是否显示文字（仅对 horizontal 和 vertical 有效）
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 120,
  className = '',
  showText = true
}) => {
  const getLogoContent = () => {
    switch (variant) {
      case 'icon':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            width={size}
            height={size}
            className={className}
          >
            <defs>
              <linearGradient id="iconCyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#00f0ff', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#00a0aa', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="iconPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#9d00ff', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#6a00aa', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="iconPinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#ff0080', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#aa0055', stopOpacity: 1}} />
              </linearGradient>
            </defs>

            {/* 外层六边形 */}
            <polygon
              points="32,4 56,18 56,46 32,60 8,46 8,18"
              fill="none"
              stroke="url(#iconCyanGradient)"
              strokeWidth="2"
              style={{filter: 'drop-shadow(0 0 3px rgba(0,240,255,0.5))'}}
            />

            {/* 内层电路图案 */}
            <g transform="translate(16, 16)" fill="none" stroke="url(#iconPurpleGradient)" strokeWidth="2">
              <line x1="4" y1="8" x2="28" y2="8"/>
              <line x1="4" y1="16" x2="28" y2="16"/>
              <line x1="4" y1="24" x2="28" y2="24"/>
              <line x1="8" y1="4" x2="8" y2="28"/>
              <line x1="16" y1="0" x2="16" y2="32"/>
              <line x1="24" y1="4" x2="24" y2="28"/>
            </g>

            {/* 中心芯片 */}
            <circle
              cx="32"
              cy="32"
              r="8"
              fill="url(#iconPinkGradient)"
              style={{filter: 'drop-shadow(0 0 6px rgba(255,0,128,0.6))'}}
            />
            <circle cx="32" cy="32" r="4" fill="#ffffff"/>

            {/* 装饰点 */}
            <circle cx="32" cy="6" r="2" fill="url(#iconCyanGradient)"/>
            <circle cx="32" cy="58" r="2" fill="url(#iconCyanGradient)"/>
            <circle cx="6" cy="32" r="2" fill="url(#iconCyanGradient)"/>
            <circle cx="58" cy="32" r="2" fill="url(#iconCyanGradient)"/>
          </svg>
        );

      case 'horizontal':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 60"
            width={size}
            height={size * 0.3}
            className={className}
          >
            <defs>
              <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#00f0ff', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#00a0aa', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#9d00ff', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#6a00aa', stopOpacity: 1}} />
              </linearGradient>
              <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#ff0080', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#aa0055', stopOpacity: 1}} />
              </linearGradient>
            </defs>

            {/* 主图标：赛博电路芯片 */}
            <g transform="translate(10, 10)">
              <rect
                x="0"
                y="0"
                width="40"
                height="40"
                rx="6"
                fill="none"
                stroke="url(#cyanGradient)"
                strokeWidth="2"
                style={{filter: 'drop-shadow(0 0 2px rgba(0,240,255,0.5))'}}
              />

              <g fill="none" stroke="url(#purpleGradient)" strokeWidth="1.5">
                <line x1="8" y1="12" x2="32" y2="12"/>
                <line x1="8" y1="20" x2="32" y2="20"/>
                <line x1="8" y1="28" x2="32" y2="28"/>
                <line x1="12" y1="12" x2="12" y2="28"/>
                <line x1="20" y1="8" x2="20" y2="32"/>
                <line x1="28" y1="12" x2="28" y2="28"/>
              </g>

              <circle
                cx="20"
                cy="20"
                r="4"
                fill="url(#pinkGradient)"
                style={{filter: 'drop-shadow(0 0 4px rgba(255,0,128,0.6))'}}
              />
              <circle cx="20" cy="20" r="2" fill="#ffffff"/>
            </g>

            {showText && (
              <>
                <text
                  x="60"
                  y="38"
                  fontFamily="'Courier New', monospace"
                  fontWeight="bold"
                  fontSize="28"
                  fill="url(#cyanGradient)"
                  style={{filter: 'drop-shadow(0 0 2px rgba(0,240,255,0.5))'}}
                >
                  CYBER
                </text>
                <text
                  x="155"
                  y="38"
                  fontFamily="'Courier New', monospace"
                  fontWeight="bold"
                  fontSize="28"
                  fill="url(#purpleGradient)"
                  style={{filter: 'drop-shadow(0 0 2px rgba(157,0,255,0.5))'}}
                >
                  PRESS
                </text>
              </>
            )}
          </svg>
        );

      case 'vertical':
        return (
          <div className={`flex flex-col items-center ${className}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              width={size}
              height={size}
            >
              <defs>
                <linearGradient id="vertCyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#00f0ff', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#00a0aa', stopOpacity: 1}} />
                </linearGradient>
                <linearGradient id="vertPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#9d00ff', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#6a00aa', stopOpacity: 1}} />
                </linearGradient>
                <linearGradient id="vertPinkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#ff0080', stopOpacity: 1}} />
                  <stop offset="100%" style={{stopColor: '#aa0055', stopOpacity: 1}} />
                </linearGradient>
              </defs>

              <polygon
                points="32,4 56,18 56,46 32,60 8,46 8,18"
                fill="none"
                stroke="url(#vertCyanGradient)"
                strokeWidth="2"
              />

              <g transform="translate(16, 16)" fill="none" stroke="url(#vertPurpleGradient)" strokeWidth="2">
                <line x1="4" y1="8" x2="28" y2="8"/>
                <line x1="4" y1="16" x2="28" y2="16"/>
                <line x1="4" y1="24" x2="28" y2="24"/>
                <line x1="8" y1="4" x2="8" y2="28"/>
                <line x1="16" y1="0" x2="16" y2="32"/>
                <line x1="24" y1="4" x2="24" y2="28"/>
              </g>

              <circle cx="32" cy="32" r="8" fill="url(#vertPinkGradient)"/>
              <circle cx="32" cy="32" r="4" fill="#ffffff"/>
            </svg>

            {showText && (
              <div className="mt-2 text-center">
                <div
                  className="font-bold text-lg"
                  style={{
                    fontFamily: "'Courier New', monospace",
                    color: '#00f0ff',
                    textShadow: '0 0 10px rgba(0,240,255,0.5)'
                  }}
                >
                  CYBER
                </div>
                <div
                  className="font-bold text-lg"
                  style={{
                    fontFamily: "'Courier New', monospace",
                    color: '#9d00ff',
                    textShadow: '0 0 10px rgba(157,0,255,0.5)'
                  }}
                >
                  PRESS
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return getLogoContent();
};

export default Logo;
