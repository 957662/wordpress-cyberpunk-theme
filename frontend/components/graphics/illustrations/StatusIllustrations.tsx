/**
 * CyberPress Status Illustrations
 *
 * 状态插画组件库 - 用于展示不同页面状态的插画
 *
 * @example
 * ```tsx
 * import { NotFoundIllustration, ServerErrorIllustration } from '@/components/graphics/illustrations/StatusIllustrations';
 *
 * <NotFoundIllustration width={400} height={300} />
 * <ServerErrorIllustration animated />
 * ```
 */

import React from 'react';

// 基础插画属性
export interface IllustrationProps {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** 是否动画 */
  animated?: boolean;
  /** CSS 类名 */
  className?: string;
}

/**
 * NotFoundIllustration - 404 页面插画
 * 展示一个迷失在数字空间中的六边形
 */
export const NotFoundIllustration: React.FC<IllustrationProps> = ({
  width = 400,
  height = 300,
  animated = false,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="notFoundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.2" />
        </linearGradient>
        <filter id="notFoundGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 背景网格 */}
      <g opacity="0.1">
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 50}
            y1="0"
            x2={i * 50}
            y2="300"
            stroke="#00f0ff"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * 50}
            x2="400"
            y2={i * 50}
            stroke="#00f0ff"
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* 主六边形 - 破碎效果 */}
      <g filter="url(#notFoundGlow)">
        {/* 外层断裂的六边形 */}
        <path
          d="M200 50 L280 100 V200 L200 250 L120 200 V100 L200 50"
          stroke="url(#notFoundGradient)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="20 10"
        >
          {animated && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="30"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* 内层六边形 */}
        <path
          d="M200 80 L255 115 V185 L200 220 L145 185 V115 L200 80"
          fill="url(#notFoundGradient)"
          stroke="#00f0ff"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* 问号 */}
        <text
          x="200"
          y="165"
          fontSize="48"
          fontWeight="bold"
          fill="#00f0ff"
          textAnchor="middle"
          fontFamily="monospace"
          opacity="0.8"
        >
          404
          {animated && (
            <animate
              attributeName="opacity"
              values="0.8;0.4;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </text>

        {/* 漂浮的碎片 */}
        <g opacity="0.3">
          {animated ? (
            <>
              <polygon points="50,50 55,55 50,60 45,55" fill="#00f0ff">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 10,20; 0,0"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </polygon>
              <polygon points="350,80 355,85 350,90 345,85" fill="#9d00ff">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; -15,25; 0,0"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </polygon>
              <polygon points="80,250 85,255 80,260 75,255" fill="#ff0080">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0,0; 12,-18; 0,0"
                  dur="3.5s"
                  repeatCount="indefinite"
                />
              </polygon>
            </>
          ) : (
            <>
              <polygon points="50,50 55,55 50,60 45,55" fill="#00f0ff" />
              <polygon points="350,80 355,85 350,90 345,85" fill="#9d00ff" />
              <polygon points="80,250 85,255 80,260 75,255" fill="#ff0080" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
};

/**
 * ServerErrorIllustration - 500 服务器错误插画
 * 展示服务器故障和电路断裂
 */
export const ServerErrorIllustration: React.FC<IllustrationProps> = ({
  width = 400,
  height = 300,
  animated = false,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="serverErrorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0080" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0.2" />
        </linearGradient>
        <filter id="serverErrorGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 服务器机架 */}
      <g filter="url(#serverErrorGlow)">
        {/* 机架框架 */}
        <rect x="100" y="50" width="200" height="220" rx="5" fill="none" stroke="#ff0080" strokeWidth="2" />

        {/* 服务器单元 */}
        {Array.from({ length: 4 }).map((_, i) => {
          const y = 70 + i * 50;
          const isError = i === 2; // 第三个单元故障

          return (
            <g key={i}>
              <rect
                x="120"
                y={y}
                width="160"
                height="35"
                rx="3"
                fill="url(#serverErrorGradient)"
                stroke={isError ? '#ff0080' : '#ff6600'}
                strokeWidth="1"
                opacity={isError ? 0.8 : 0.4}
              />

              {/* 指示灯 */}
              {Array.from({ length: 5 }).map((_, j) => (
                <circle
                  key={j}
                  cx={135 + j * 25}
                  cy={y + 17}
                  r={4}
                  fill={isError ? '#ff0080' : '#00ff88'}
                  opacity={isError ? 0.8 : 0.5}
                >
                  {animated && isError && (
                    <animate
                      attributeName="opacity"
                      values="0.8;0.3;0.8"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              ))}

              {/* 错误图标 */}
              {isError && (
                <text
                  x="260"
                  y={y + 22}
                  fontSize="16"
                  fill="#ff0080"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  ⚠
                </text>
              )}
            </g>
          );
        })}

        {/* 断裂的电路 */}
        <g opacity="0.6">
          <path
            d="M80 150 L100 150"
            stroke="#ff0080"
            strokeWidth="2"
            strokeDasharray="5 5"
          >
            {animated && (
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-10"
                dur="1s"
                repeatCount="indefinite"
              />
            )}
          </path>
          <path
            d="M300 150 L320 150"
            stroke="#ff0080"
            strokeWidth="2"
            strokeDasharray="5 5"
          >
            {animated && (
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-10"
                dur="1s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </g>

        {/* 错误代码 */}
        <text
          x="200"
          y="145"
          fontSize="24"
          fontWeight="bold"
          fill="#ff0080"
          textAnchor="middle"
          fontFamily="monospace"
          opacity="0.9"
        >
          500
          {animated && (
            <animate
              attributeName="opacity"
              values="0.9;0.5;0.9"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </text>
      </g>
    </svg>
  );
};

/**
 * AccessDeniedIllustration - 403 禁止访问插画
 * 展示锁和禁止标志
 */
export const AccessDeniedIllustration: React.FC<IllustrationProps> = ({
  width = 400,
  height = 300,
  animated = false,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="accessDeniedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0080" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f0ff00" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* 盾牌 */}
      <g filter="url(#accessDeniedGlow)">
        <path
          d="M200 60 L280 90 V160 C280 210 240 250 200 260 C160 250 120 210 120 160 V90 L200 60Z"
          fill="url(#accessDeniedGradient)"
          stroke="#ff0080"
          strokeWidth="3"
        />

        {/* 锁图标 */}
        <g transform="translate(200, 150)">
          {/* 锁体 */}
          <rect x="-25" y="0" width="50" height="40" rx="5" fill="#ff0080" opacity="0.8" />

          {/* 锁环 */}
          <path
            d="M-15 0 V-20 A15 15 0 0 1 15 -20 V0"
            fill="none"
            stroke="#ff0080"
            strokeWidth="4"
          />

          {/* 锁孔 */}
          <circle cx="0" cy="20" r="6" fill="#1a1a2e" />

          {/* 密钥孔 */}
          <path d="M0 20 L0 28" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* 禁止标志 */}
        <circle
          cx="200"
          cy="150"
          r="60"
          fill="none"
          stroke="#f0ff00"
          strokeWidth="4"
          opacity="0.7"
        />
        <line
          x1="160"
          y1="110"
          x2="240"
          y2="190"
          stroke="#f0ff00"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* 警告文字 */}
        <text
          x="200"
          y="240"
          fontSize="16"
          fill="#f0ff00"
          textAnchor="middle"
          fontFamily="monospace"
          fontWeight="bold"
          opacity="0.9"
        >
          ACCESS DENIED
          {animated && (
            <animate
              attributeName="opacity"
              values="0.9;0.5;0.9"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </text>
      </g>

      <filter id="accessDeniedGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </svg>
  );
};

/**
 * MaintenanceIllustration - 维护模式插画
 * 展示齿轮和施工标志
 */
export const MaintenanceIllustration: React.FC<IllustrationProps> = ({
  width = 400,
  height = 300,
  animated = false,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="maintenanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0ff00" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* 大齿轮 */}
      <g transform="translate(200, 130)">
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur={animated ? '10s' : '0s'}
            repeatCount={animated ? 'indefinite' : '0'}
          />
          <circle cx="0" cy="0" r="60" fill="url(#maintenanceGradient)" stroke="#f0ff00" strokeWidth="2" />
          <circle cx="0" cy="0" r="20" fill="#1a1a2e" stroke="#f0ff00" strokeWidth="2" />

          {/* 齿 */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = Math.cos(angle) * 55;
            const y1 = Math.sin(angle) * 55;
            const x2 = Math.cos(angle) * 70;
            const y2 = Math.sin(angle) * 70;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#f0ff00"
                strokeWidth="8"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </g>

      {/* 小齿轮 */}
      <g transform="translate(280, 200)">
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360"
            to="0"
            dur={animated ? '7s' : '0s'}
            repeatCount={animated ? 'indefinite' : '0'}
          />
          <circle cx="0" cy="0" r="35" fill="url(#maintenanceGradient)" stroke="#ff6600" strokeWidth="2" />
          <circle cx="0" cy="0" r="12" fill="#1a1a2e" stroke="#ff6600" strokeWidth="2" />

          {/* 齿 */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180;
            const x1 = Math.cos(angle) * 32;
            const y1 = Math.sin(angle) * 32;
            const x2 = Math.cos(angle) * 42;
            const y2 = Math.sin(angle) * 42;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ff6600"
                strokeWidth="6"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      </g>

      {/* 警告标志 */}
      <g transform="translate(120, 180)">
        <polygon points="0,-30 26,15 -26,15" fill="none" stroke="#f0ff00" strokeWidth="2" />
        <text x="0" y="5" fontSize="20" fill="#f0ff00" textAnchor="middle" fontWeight="bold">
          !
        </text>
      </g>

      {/* 文字 */}
      <text
        x="200"
        y="270"
        fontSize="18"
        fill="#f0ff00"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="bold"
        opacity="0.9"
      >
        MAINTENANCE MODE
      </text>
    </svg>
  );
};

/**
 * EmptyStateIllustration - 空状态插画
 * 展示空文件夹或空数据状态
 */
export const EmptyStateIllustration: React.FC<IllustrationProps> = ({
  width = 400,
  height = 300,
  animated = false,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="emptyStateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#9d00ff" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* 文件夹 */}
      <g transform="translate(200, 130)">
        <path
          d="M-60 -30 L0 -30 L15 -45 L60 -45 L60 50 L-60 50 Z"
          fill="url(#emptyStateGradient)"
          stroke="#00f0ff"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* 放大镜 */}
        <g transform="translate(30, 10)">
          <circle
            cx="0"
            cy="0"
            r="25"
            fill="none"
            stroke="#9d00ff"
            strokeWidth="3"
          />
          <line
            x1="18"
            y1="18"
            x2="35"
            y2="35"
            stroke="#9d00ff"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* 反光效果 */}
          {animated && (
            <circle
              cx="-8"
              cy="-8"
              r="8"
              fill="#9d00ff"
              opacity="0.3"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.1;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </g>
      </g>

      {/* 装饰点 */}
      <g opacity="0.3">
        {Array.from({ length: 5 }).map((_, i) => {
          const x = 80 + i * 60;
          const y = 220 + (i % 2) * 20;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#00f0ff"
            >
              {animated && (
                <animate
                  attributeName="opacity"
                  values="0.3;0.6;0.3"
                  dur="1.5s"
                  begin={`${i * 0.2}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          );
        })}
      </g>

      {/* 文字 */}
      <text
        x="200"
        y="270"
        fontSize="16"
        fill="#00f0ff"
        textAnchor="middle"
        fontFamily="monospace"
        opacity="0.7"
      >
        NO DATA FOUND
      </text>
    </svg>
  );
};

export default {
  NotFoundIllustration,
  ServerErrorIllustration,
  AccessDeniedIllustration,
  MaintenanceIllustration,
  EmptyStateIllustration
};
