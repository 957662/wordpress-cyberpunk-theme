/**
 * CyberPress Accessible Icons
 *
 * 可访问性增强的图标组件，符合WCAG标准
 *
 * @example
 * ```tsx
 * <AccessibleIcon name="home" ariaLabel="Go to home page" />
 * <IconWithText icon="search" text="Search" position="left" />
 * <IconWithTooltip icon="info" content="More information" />
 * ```
 */

import React, { useState } from 'react';
import { DynamicIcon } from './IconFactory';

// ==================== 类型定义 ====================

export interface AccessibleIconProps {
  /** 图标名称 */
  name: string;
  /** ARIA 标签 */
  ariaLabel?: string;
  /** 图标尺寸 */
  size?: number;
  /** 颜色 */
  color?: string;
  /** 是否隐藏（但仍可被屏幕阅读器访问） */
  visuallyHidden?: boolean;
  /** 焦点样式 */
  focusable?: boolean;
  /** 键盘快捷键 */
  accessKey?: string;
  /** 点击事件 */
  onClick?: () => void;
  /** 额外的类名 */
  className?: string;
}

export interface IconWithTextProps {
  /** 图标名称 */
  icon: string;
  /** 文本内容 */
  text: string;
  /** 图标位置 */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** 图标尺寸 */
  iconSize?: number;
  /** 文本大小 */
  textSize?: 'sm' | 'md' | 'lg';
  /** 颜色 */
  color?: string;
  /** 是否加粗 */
  bold?: boolean;
  /** 点击事件 */
  onClick?: () => void;
  /** 额外的类名 */
  className?: string;
}

export interface IconWithTooltipProps {
  /** 图标名称 */
  icon: string;
  /** 提示内容 */
  content: string;
  /** 提示位置 */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** 图标尺寸 */
  size?: number;
  /** 颜色 */
  color?: string;
  /** 延迟显示（毫秒） */
  delay?: number;
  /** 点击事件 */
  onClick?: () => void;
  /** 额外的类名 */
  className?: string;
}

// ==================== 可访问性图标 ====================

/**
 * 可访问性增强的图标组件
 * 完整的ARIA标签和键盘导航支持
 */
export const AccessibleIcon: React.FC<AccessibleIconProps> = ({
  name,
  ariaLabel,
  size = 24,
  color,
  visuallyHidden = false,
  focusable = false,
  accessKey,
  onClick,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const iconStyle = {
    color,
    outline: isFocused ? `2px solid ${color || '#00f0ff'}` : 'none',
    outlineOffset: '2px',
  };

  return (
    <span
      role={onClick ? 'button' : 'img'}
      aria-label={ariaLabel || name}
      aria-hidden={visuallyHidden}
      tabIndex={focusable || onClick ? 0 : -1}
      accessKey={accessKey}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`
        inline-flex items-center justify-center
        ${onClick || focusable ? 'cursor-pointer' : ''}
        ${visuallyHidden ? 'sr-only' : ''}
        ${className}
      `.trim()}
      style={iconStyle}
    >
      <DynamicIcon name={name} size={size} />
    </span>
  );
};

// ==================== 带文本的图标 ====================

/**
 * 带文本的图标组件
 * 图标和文本的组合，增强可读性
 */
export const IconWithText: React.FC<IconWithTextProps> = ({
  icon,
  text,
  position = 'left',
  iconSize = 20,
  textSize = 'md',
  color,
  bold = false,
  onClick,
  className = ''
}) => {
  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const flexDirectionMap = {
    left: 'flex-row',
    right: 'flex-row-reverse',
    top: 'flex-col',
    bottom: 'flex-col-reverse',
  };

  const gapMap = {
    left: 'gap-2',
    right: 'gap-2',
    top: 'gap-1',
    bottom: 'gap-1',
  };

  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center
        ${flexDirectionMap[position]}
        ${gapMap[position]}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${color || ''}
        ${className}
      `.trim()}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <DynamicIcon name={icon} size={iconSize} aria-hidden="true" />
      <span className={`${textSizeMap[textSize]} ${bold ? 'font-semibold' : ''}`}>
        {text}
      </span>
    </div>
  );
};

// ==================== 带工具提示的图标 ====================

/**
 * 带工具提示的图标组件
 * 鼠标悬停时显示提示信息
 */
export const IconWithTooltip: React.FC<IconWithTooltipProps> = ({
  icon,
  content,
  position = 'top',
  size = 24,
  color,
  delay = 300,
  onClick,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={`relative inline-flex ${className}`.trim()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AccessibleIcon
        name={icon}
        ariaLabel={content}
        size={size}
        color={color}
        onClick={onClick}
      />

      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2
            bg-cyber-dark border border-cyber-cyan/30
            rounded-lg shadow-lg
            whitespace-nowrap
            ${positionClasses[position]}
          `.trim()}
          role="tooltip"
        >
          <span className="text-sm text-gray-300">{content}</span>
          {/* 箭头 */}
          <div
            className={`
              absolute w-2 h-2 bg-cyber-dark border border-cyber-cyan/30
              ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-0 border-l-0' : ''}
              ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-0 border-r-0' : ''}
              ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-0 border-t-0' : ''}
              ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-r-0 border-b-0' : ''}
            `.trim()}
            style={{
              transform: position === 'top' || position === 'bottom'
                ? 'translateX(-50%) rotate(45deg)'
                : 'translateY(-50%) rotate(45deg)',
            }}
          />
        </div>
      )}
    </div>
  );
};

// ==================== 键盘可导航图标 ====================

export interface KeyboardNavigableIconProps {
  /** 图标名称 */
  name: string;
  /** ARIA 标签 */
  ariaLabel: string;
  /** 图标尺寸 */
  size?: number;
  /** 颜色 */
  color?: string;
  /** 是否显示键盘提示 */
  showKeyboardHint?: boolean;
  /** 快捷键文本 */
  keyboardHint?: string;
  /** 点击事件 */
  onClick: () => void;
  /** 额外的类名 */
  className?: string;
}

/**
 * 键盘可导航图标组件
 * 支持键盘操作和快捷键提示
 */
export const KeyboardNavigableIcon: React.FC<KeyboardNavigableIconProps> = ({
  name,
  ariaLabel,
  size = 24,
  color,
  showKeyboardHint = true,
  keyboardHint,
  onClick,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className={`relative inline-flex ${className}`.trim()}>
      <button
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          relative inline-flex items-center justify-center
          p-2 rounded-lg transition-all duration-200
          ${isFocused ? 'bg-cyber-cyan/20 ring-2 ring-cyber-cyan' : 'hover:bg-cyber-purple/10'}
          ${color || ''}
        `.trim()}
        aria-label={ariaLabel}
      >
        <DynamicIcon name={name} size={size} />
      </button>

      {showKeyboardHint && keyboardHint && (
        <span
          className={`
            absolute -bottom-6 left-1/2 -translate-x-1/2
            text-xs text-gray-600
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
          `.trim()}
        >
          {keyboardHint}
        </span>
      )}
    </div>
  );
};

// ==================== 屏幕阅读器专用文本 ====================

export interface VisuallyHiddenTextProps {
  /** 文本内容 */
  children: React.ReactNode;
}

/**
 * 视觉上隐藏但屏幕阅读器可访问的文本
 */
export const VisuallyHiddenText: React.FC<VisuallyHiddenTextProps> = ({ children }) => {
  return (
    <span
      className="sr-only"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0,
      }}
    >
      {children}
    </span>
  );
};

// ==================== 图标按钮组 ====================

export interface IconButtongroupProps {
  /** 按钮列表 */
  buttons: Array<{
    icon: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    keyboardHint?: string;
  }>;
  /** 按钮尺寸 */
  size?: number;
  /** 是否显示分隔符 */
  separated?: boolean;
  /** 额外的类名 */
  className?: string;
}

/**
 * 图标按钮组组件
 * 一组可访问的图标按钮
 */
export const IconButtonGroup: React.FC<IconButtongroupProps> = ({
  buttons,
  size = 24,
  separated = false,
  className = ''
}) => {
  return (
    <div
      className={`
        inline-flex items-center
        ${separated ? 'gap-2' : ''}
        ${className}
      `.trim()}
      role="group"
      aria-label="Icon button group"
    >
      {buttons.map((button, index) => (
        <React.Fragment key={index}>
          {separated && index > 0 && (
            <div className="w-px h-6 bg-gray-700" role="separator" />
          )}
          <KeyboardNavigableIcon
            name={button.icon}
            ariaLabel={button.label}
            size={size}
            onClick={button.onClick}
            keyboardHint={button.keyboardHint}
            disabled={button.disabled}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

// ==================== 导出所有组件 ====================

export default {
  AccessibleIcon,
  IconWithText,
  IconWithTooltip,
  KeyboardNavigableIcon,
  VisuallyHiddenText,
  IconButtonGroup,
};
