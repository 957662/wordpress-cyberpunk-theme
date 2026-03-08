/**
 * VisuallyHiddenText - 屏幕阅读器专用文本
 * 对屏幕阅读器可见但视觉隐藏的文本
 */

import React from 'react';

export interface VisuallyHiddenTextProps {
  /**
   * 隐藏的文本内容
   */
  children: React.ReactNode;

  /**
   * 自定义类名
   */
  className?: string;
}

export const VisuallyHiddenText: React.FC<VisuallyHiddenTextProps> = ({
  children,
  className = '',
}) => {
  return (
    <span
      className={`
        sr-only
        absolute w-px h-px p-0
        -m-px overflow-hidden
        whitespace-nowrap
        border-0
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
};

/**
 * 用法示例:
 *
 * <button>
 *   <SearchIcon size={20} />
 *   <VisuallyHiddenText>搜索</VisuallyHiddenText>
 * </button>
 */

export default VisuallyHiddenText;
