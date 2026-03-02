/**
 * CyberPress Custom Icons
 * 赛博朋克风格自定义图标组件
 */

import { SVGProps } from 'react';

// 基础图标 Props 类型
export interface CyberIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

/**
 * NotificationIcon - 通知铃铛
 */
export function NotificationIcon({ size = 24, color = 'currentColor', ...props }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M12 2L12 4M12 20L12 22M4.929 4.929L6.343 6.343M17.657 17.657L19.071 19.071M2 12L4 12M20 12L22 12M4.929 19.071L6.343 17.657M17.657 6.343L19.071 4.929"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#neon-glow)"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#neon-glow)"
      />
    </svg>
  );
}

/**
 * ThemeToggleIcon - 主题切换
 */
export function ThemeToggleIcon({ size = 24, color = 'currentColor', ...props }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <defs>
        <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
      </defs>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="url(#neon-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * DatabaseCyberIcon - 赛博数据库
 */
export function DatabaseCyberIcon({ size = 24, color = 'currentColor', ...props }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <defs>
        <filter id="data-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#9d00ff" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse
        cx="12"
        cy="5"
        rx="9"
        ry="3"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#data-glow)"
      />
      <path
        d="M21 12C21 13.66 16.97 15 12 15C7.03 15 3 13.66 3 12"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#data-glow)"
      />
      <path
        d="M3 5V19C3 20.66 7.03 22 12 22C16.97 22 21 20.66 21 19V5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#data-glow)"
      />
    </svg>
  );
}

/**
 * RocketLaunchIcon - 启动火箭
 */
export function RocketLaunchIcon({ size = 24, color = 'currentColor', ...props }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <defs>
        <linearGradient id="rocket-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f0ff00" />
          <stop offset="100%" stopColor="#ff0080" />
        </linearGradient>
      </defs>
      <path
        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
        stroke="url(#rocket-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
        stroke="url(#rocket-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
        stroke="url(#rocket-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
        stroke="url(#rocket-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * BrainAIIcon - AI 大脑
 */
export function BrainAIIcon({ size = 24, color = 'currentColor', ...props }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <defs>
        <filter id="brain-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feFlood floodColor="#00f0ff" floodOpacity="0.8" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-4.04z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#brain-glow)"
      />
      <path
        d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-4.04z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#brain-glow)"
      />
    </svg>
  );
}

/**
 * TerminalCodeIcon - 代码终端
 */
export function TerminalCodeIcon({ size = 24, color = 'currentColor', ...props }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <defs>
        <filter id="terminal-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feFlood floodColor="#00f0ff" floodOpacity="0.5" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#terminal-glow)"
      />
      <path
        d="M6 8L10 12L6 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 16H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * SmartphoneIcon - 智能手机
 */
export function SmartphoneIcon({ size = 24, color = 'currentColor', ...props }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <defs>
        <filter id="phone-glow" x="-30%" y="-20%" width="160%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feFlood floodColor="#9d00ff" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        x="5"
        y="2"
        width="14"
        height="20"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#phone-glow)"
      />
      <path
        d="M12 18H12.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#phone-glow)"
      />
    </svg>
  );
}

/**
 * LayoutGridIcon - 布局网格
 */
export function LayoutGridIcon({ size = 24, color = 'currentColor', ...props }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <defs>
        <filter id="grid-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feFlood floodColor="#00f0ff" floodOpacity="0.6" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#grid-glow)"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#grid-glow)"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#grid-glow)"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#grid-glow)"
      />
    </svg>
  );
}

/**
 * PuzzleIcon - 拼图集成
 */
export function PuzzleIcon({ size = 24, color = 'currentColor', ...props }: CyberIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <defs>
        <filter id="puzzle-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feFlood floodColor="#f0ff00" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
        filter="url(#puzzle-glow)"
      />
      <path
        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#puzzle-glow)"
      />
    </svg>
  );
}

// 导出所有图标
export default {
  NotificationIcon,
  ThemeToggleIcon,
  DatabaseCyberIcon,
  RocketLaunchIcon,
  BrainAIIcon,
  TerminalCodeIcon,
  SmartphoneIcon,
  LayoutGridIcon,
  PuzzleIcon,
};
