'use client';

import { ReactNode } from 'react';
import { CyberDecoration } from './CyberIcon';
import { cn } from '@/lib/utils';

/**
 * DecoratedCard - 带赛博朋克装饰的卡片组件
 *
 * @example
 * <DecoratedCard title="Featured Post" glow="cyan">
 *   <p>Card content here...</p>
 * </DecoratedCard>
 */
export interface DecoratedCardProps {
  /** 卡片标题 */
  title?: string;
  /** 卡片内容 */
  children: ReactNode;
  /** 发光效果颜色 */
  glow?: 'cyan' | 'purple' | 'pink';
  /** 是否显示角标装饰 */
  showCorners?: boolean;
  /** 是否显示边框发光 */
  showBorderGlow?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 点击事件 */
  onClick?: () => void;
}

export function DecoratedCard({
  title,
  children,
  glow = 'cyan',
  showCorners = true,
  showBorderGlow = false,
  className,
  onClick,
}: DecoratedCardProps) {
  const glowColors = {
    cyan: 'hover:shadow-neon-cyan hover:border-cyber-cyan',
    purple: 'hover:shadow-neon-purple hover:border-cyber-purple',
    pink: 'hover:shadow-neon-pink hover:border-cyber-pink',
  };

  return (
    <div
      className={cn(
        'relative bg-gradient-to-br from-cyber-card to-cyber-muted',
        'border border-cyber-border rounded-xl p-6',
        'transition-all duration-300',
        glowColors[glow],
        showBorderGlow && 'border-glow-cyan',
        onClick && 'cursor-pointer hover:-translate-y-1',
        className
      )}
      onClick={onClick}
    >
      {/* 角标装饰 */}
      {showCorners && (
        <>
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M 10 40 L 10 10 L 40 10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-cyber-cyan"
              />
              <circle cx="10" cy="10" r="4" fill="currentColor" className="text-cyber-cyan" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none scale-x-[-1]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M 10 40 L 10 10 L 40 10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-cyber-cyan"
              />
              <circle cx="10" cy="10" r="4" fill="currentColor" className="text-cyber-cyan" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none scale-y-[-1]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M 10 40 L 10 10 L 40 10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-cyber-purple"
              />
              <circle cx="10" cy="10" r="4" fill="currentColor" className="text-cyber-purple" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none scale-[-1]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                d="M 10 40 L 10 10 L 40 10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-cyber-purple"
              />
              <circle cx="10" cy="10" r="4" fill="currentColor" className="text-cyber-purple" />
            </svg>
          </div>
        </>
      )}

      {/* 卡片内容 */}
      <div className="relative z-10">
        {title && (
          <h3 className="text-xl font-bold text-glow-cyan mb-4 text-cyber-cyan">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}

/**
 * CyberDivider - 赛博风格分隔线
 */
export interface CyberDividerProps {
  /** 自定义类名 */
  className?: string;
}

export function CyberDivider({ className }: CyberDividerProps) {
  return (
    <div className={cn('relative w-full h-5 my-8', className)}>
      <svg
        viewBox="0 0 400 20"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="dividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00f0ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 中心菱形 */}
        <polygon
          points="200,10 195,5 200,0 205,5"
          fill="#00f0ff"
        />
        <polygon
          points="200,20 195,15 200,10 205,15"
          fill="#9d00ff"
        />
        {/* 延伸线 */}
        <line
          x1="205"
          y1="10"
          x2="300"
          y2="10"
          stroke="url(#dividerGrad)"
          strokeWidth="1"
          opacity="0.5"
        />
        <line
          x1="195"
          y1="10"
          x2="100"
          y2="10"
          stroke="url(#dividerGrad)"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* 装饰点 */}
        <circle cx="150" cy="10" r="2" fill="#00f0ff" opacity="0.3" />
        <circle cx="250" cy="10" r="2" fill="#00f0ff" opacity="0.3" />
      </svg>
    </div>
  );
}

/**
 * TechBadge - 技术标签徽章
 */
export interface TechBadgeProps {
  /** 标签文字 */
  label: string;
  /** 图标 */
  icon?: ReactNode;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  /** 自定义类名 */
  className?: string;
}

export function TechBadge({
  label,
  icon,
  variant = 'cyan',
  className,
}: TechBadgeProps) {
  const variantStyles = {
    cyan: 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan',
    purple: 'border-cyber-purple bg-cyber-purple/10 text-cyber-purple',
    pink: 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink',
    yellow: 'border-cyber-yellow bg-cyber-yellow/10 text-cyber-yellow',
    green: 'border-cyber-green bg-cyber-green/10 text-cyber-green',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded',
        'border text-xs font-bold',
        'hover:shadow-lg transition-shadow',
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{label}</span>
    </div>
  );
}
