/**
 * CyberPress Tech Badges
 *
 * 赛博朋克风格徽章组件
 *
 * @example
 * ```tsx
 * import { TechBadge, StatusBadge, FeatureBadge } from '@/components/graphics/TechBadges';
 *
 * <TechBadge label="NEW" variant="cyan" />
 * <StatusBadge status="online" />
 * <FeatureBadge icon={<ZapIcon />} label="Fast" />
 * ```
 */

import React from 'react';

// ==================== 基础徽章 ====================

export interface TechBadgeProps {
  /** 徽章文本 */
  label: string;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red' | 'orange';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否带发光效果 */
  glow?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否带动画 */
  animated?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
}

/**
 * 科技感基础徽章
 */
export const TechBadge: React.FC<TechBadgeProps> = ({
  label,
  variant = 'cyan',
  size = 'md',
  glow = false,
  className = '',
  animated = false,
  icon
}) => {
  const colors = {
    cyan: {
      bg: 'rgba(0, 240, 255, 0.1)',
      border: '#00f0ff',
      text: '#00f0ff',
      shadow: '0 0 10px rgba(0, 240, 255, 0.5)'
    },
    purple: {
      bg: 'rgba(157, 0, 255, 0.1)',
      border: '#9d00ff',
      text: '#9d00ff',
      shadow: '0 0 10px rgba(157, 0, 255, 0.5)'
    },
    pink: {
      bg: 'rgba(255, 0, 128, 0.1)',
      border: '#ff0080',
      text: '#ff0080',
      shadow: '0 0 10px rgba(255, 0, 128, 0.5)'
    },
    green: {
      bg: 'rgba(0, 255, 136, 0.1)',
      border: '#00ff88',
      text: '#00ff88',
      shadow: '0 0 10px rgba(0, 255, 136, 0.5)'
    },
    yellow: {
      bg: 'rgba(240, 255, 0, 0.1)',
      border: '#f0ff00',
      text: '#f0ff00',
      shadow: '0 0 10px rgba(240, 255, 0, 0.5)'
    },
    red: {
      bg: 'rgba(255, 0, 64, 0.1)',
      border: '#ff0040',
      text: '#ff0040',
      shadow: '0 0 10px rgba(255, 0, 64, 0.5)'
    },
    orange: {
      bg: 'rgba(255, 128, 0, 0.1)',
      border: '#ff8000',
      text: '#ff8000',
      shadow: '0 0 10px rgba(255, 128, 0, 0.5)'
    }
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const color = colors[variant];
  const animationClass = animated ? 'animate-pulse' : '';
  const glowStyle = glow ? { boxShadow: color.shadow } : {};

  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        border rounded
        font-semibold
        transition-all duration-300
        hover:scale-105
        ${sizes[size]}
        ${animationClass}
        ${className}
      `}
      style={{
        backgroundColor: color.bg,
        borderColor: color.border,
        color: color.text,
        ...glowStyle
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

// ==================== 状态徽章 ====================

export interface StatusBadgeProps {
  /** 状态 */
  status: 'online' | 'offline' | 'busy' | 'away' | 'error' | 'warning' | 'success';
  /** 显示文本（可选，默认使用状态名） */
  label?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否显示点 */
  showDot?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 状态指示徽章
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  const statusConfig = {
    online: {
      color: '#00ff88',
      bg: 'rgba(0, 255, 136, 0.1)',
      label: '在线'
    },
    offline: {
      color: '#666666',
      bg: 'rgba(102, 102, 102, 0.1)',
      label: '离线'
    },
    busy: {
      color: '#ff0040',
      bg: 'rgba(255, 0, 64, 0.1)',
      label: '忙碌'
    },
    away: {
      color: '#f0ff00',
      bg: 'rgba(240, 255, 0, 0.1)',
      label: '离开'
    },
    error: {
      color: '#ff0040',
      bg: 'rgba(255, 0, 64, 0.1)',
      label: '错误'
    },
    warning: {
      color: '#f0ff00',
      bg: 'rgba(240, 255, 0, 0.1)',
      label: '警告'
    },
    success: {
      color: '#00ff88',
      bg: 'rgba(0, 255, 136, 0.1)',
      label: '成功'
    }
  };

  const config = statusConfig[status];
  const displayLabel = label || config.label;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2
        border rounded
        transition-all duration-300
        ${sizes[size]}
        ${className}
      `}
      style={{
        backgroundColor: config.bg,
        borderColor: config.color,
        color: config.color
      }}
    >
      {showDot && (
        <span
          className={`
            rounded-full
            ${dotSizes[size]}
            ${status === 'online' || status === 'success' ? 'animate-pulse' : ''}
          `}
          style={{
            backgroundColor: config.color,
            boxShadow: `0 0 8px ${config.color}`
          }}
        />
      )}
      <span className="font-medium">{displayLabel}</span>
    </div>
  );
};

// ==================== 功能徽章 ====================

export interface FeatureBadgeProps {
  /** 图标 */
  icon: React.ReactNode;
  /** 标签文本 */
  label: string;
  /** 描述文本（可选） */
  description?: string;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink';
  /** 布局方向 */
  direction?: 'horizontal' | 'vertical';
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 功能特色徽章
 */
export const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  icon,
  label,
  description,
  variant = 'cyan',
  direction = 'horizontal',
  className = ''
}) => {
  const colors = {
    cyan: {
      bg: 'rgba(0, 240, 255, 0.05)',
      border: 'rgba(0, 240, 255, 0.3)',
      iconBg: 'rgba(0, 240, 255, 0.2)',
      text: '#00f0ff'
    },
    purple: {
      bg: 'rgba(157, 0, 255, 0.05)',
      border: 'rgba(157, 0, 255, 0.3)',
      iconBg: 'rgba(157, 0, 255, 0.2)',
      text: '#9d00ff'
    },
    pink: {
      bg: 'rgba(255, 0, 128, 0.05)',
      border: 'rgba(255, 0, 128, 0.3)',
      iconBg: 'rgba(255, 0, 128, 0.2)',
      text: '#ff0080'
    }
  };

  const color = colors[variant];
  const isVertical = direction === 'vertical';

  return (
    <div
      className={`
        inline-flex
        border rounded-lg
        p-3
        transition-all duration-300
        hover:scale-105
        ${isVertical ? 'flex-col items-center text-center gap-2' : 'flex-row items-center gap-3'}
        ${className}
      `}
      style={{
        backgroundColor: color.bg,
        borderColor: color.border
      }}
    >
      <div
        className="flex items-center justify-center rounded-lg p-2"
        style={{
          backgroundColor: color.iconBg,
          color: color.text
        }}
      >
        {icon}
      </div>
      <div className={isVertical ? 'flex flex-col items-center' : 'flex flex-col'}>
        <span
          className="font-semibold text-sm"
          style={{ color: color.text }}
        >
          {label}
        </span>
        {description && (
          <span className="text-xs text-gray-400 mt-0.5">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};

// ==================== 计数徽章 ====================

export interface CountBadgeProps {
  /** 计数数字 */
  count: number;
  /** 最大显示数字（超过显示 99+） */
  max?: number;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink' | 'red';
  /** 是否显示为零 */
  showZero?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 计数徽章（通常用于图标右上角的通知计数）
 */
export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  variant = 'red',
  showZero = false,
  className = ''
}) => {
  const colors = {
    cyan: {
      bg: '#00f0ff',
      text: '#0a0a0f'
    },
    purple: {
      bg: '#9d00ff',
      text: '#ffffff'
    },
    pink: {
      bg: '#ff0080',
      text: '#ffffff'
    },
    red: {
      bg: '#ff0040',
      text: '#ffffff'
    }
  };

  const color = colors[variant];

  // 如果不显示零且计数为零，返回空
  if (!showZero && count === 0) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full
        font-bold
        min-w-[1.25rem] h-5
        px-1
        text-xs
        ${className}
      `}
      style={{
        backgroundColor: color.bg,
        color: color.text
      }}
    >
      {displayCount}
    </span>
  );
};

// ==================== 版本徽章 ====================

export interface VersionBadgeProps {
  /** 版本号 */
  version: string;
  /** 版本类型 */
  type?: 'alpha' | 'beta' | 'stable' | 'legacy';
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * 版本标识徽章
 */
export const VersionBadge: React.FC<VersionBadgeProps> = ({
  version,
  type = 'stable',
  className = ''
}) => {
  const typeConfig = {
    alpha: {
      label: 'α',
      color: '#ff8000',
      bg: 'rgba(255, 128, 0, 0.1)'
    },
    beta: {
      label: 'β',
      color: '#00f0ff',
      bg: 'rgba(0, 240, 255, 0.1)'
    },
    stable: {
      label: 'v',
      color: '#00ff88',
      bg: 'rgba(0, 255, 136, 0.1)'
    },
    legacy: {
      label: 'old',
      color: '#666666',
      bg: 'rgba(102, 102, 102, 0.1)'
    }
  };

  const config = typeConfig[type];

  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        px-2 py-0.5
        rounded
        border
        text-xs
        font-mono
        font-semibold
        ${className}
      `}
      style={{
        borderColor: config.color,
        backgroundColor: config.bg,
        color: config.color
      }}
    >
      <span>{config.label}</span>
      <span>{version}</span>
    </div>
  );
};

// ==================== 赛博徽章（高级） ====================

export interface CyberBadgeProps {
  /** 文本 */
  label: string;
  /** 副文本（可选） */
  sublabel?: string;
  /** 颜色变体 */
  variant?: 'cyan' | 'purple' | 'pink';
  /** 额外的 CSS 类名 */
  className?: string;
  /** 是否显示全息效果 */
  holographic?: boolean;
}

/**
 * 高级赛博朋克徽章 - 带全息效果和动画
 */
export const CyberBadge: React.FC<CyberBadgeProps> = ({
  label,
  sublabel,
  variant = 'cyan',
  className = '',
  holographic = false
}) => {
  const colors = {
    cyan: {
      primary: '#00f0ff',
      secondary: '#9d00ff',
      glow: 'rgba(0, 240, 255, 0.5)'
    },
    purple: {
      primary: '#9d00ff',
      secondary: '#ff0080',
      glow: 'rgba(157, 0, 255, 0.5)'
    },
    pink: {
      primary: '#ff0080',
      secondary: '#f0ff00',
      glow: 'rgba(255, 0, 128, 0.5)'
    }
  };

  const color = colors[variant];

  return (
    <div
      className={`
        relative
        inline-flex
        flex-col
        items-center
        justify-center
        px-4 py-2
        rounded
        border-2
        overflow-hidden
        transition-all duration-300
        hover:scale-105
        ${holographic ? 'animate-pulse' : ''}
        ${className}
      `}
      style={{
        borderColor: color.primary,
        boxShadow: holographic
          ? `0 0 20px ${color.glow}, inset 0 0 20px ${color.glow}`
          : `0 0 10px ${color.glow}`
      }}
    >
      {/* 全息背景效果 */}
      {holographic && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(45deg, ${color.primary}, ${color.secondary}, ${color.primary})`,
            backgroundSize: '200% 200%',
            animation: 'hologram 3s ease infinite'
          }}
        />
      )}

      {/* 角标装饰 */}
      <svg
        className="absolute top-0 left-0 w-4 h-4"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M2 2V8M2 2H8"
          stroke={color.primary}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="absolute top-0 right-0 w-4 h-4"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M14 2V8M14 2H8"
          stroke={color.secondary}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="absolute bottom-0 left-0 w-4 h-4"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M2 14V8M2 14H8"
          stroke={color.secondary}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-4 h-4"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M14 14V8M14 14H8"
          stroke={color.primary}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* 内容 */}
      <div className="relative z-10 text-center">
        <div
          className="text-lg font-bold"
          style={{
            color: color.primary,
            textShadow: `0 0 10px ${color.glow}`
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            className="text-xs font-medium opacity-80"
            style={{ color: color.secondary }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  TechBadge,
  StatusBadge,
  FeatureBadge,
  CountBadge,
  VersionBadge,
  CyberBadge
};
