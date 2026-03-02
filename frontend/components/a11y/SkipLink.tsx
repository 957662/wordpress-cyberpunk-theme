'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * SkipLink Component
 * 提供键盘用户快速跳转到主要内容的链接
 * 符合 WCAG 2.1 A11y 标准
 */
export interface SkipLinkProps {
  /**
   * 跳转目标元素的 ID
   * @default 'main-content'
   */
  targetId?: string;

  /**
   * 链接显示的文本
   * @default '跳转到主要内容'
   */
  label?: string;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 跳过链接的列表（支持多个跳转点）
   */
  links?: Array<{
    id: string;
    label: string;
  }>;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  label = '跳转到主要内容',
  className,
  links,
}) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const skipLinks = links || [{ id: targetId, label }];

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-[9999] flex flex-col',
        focused ? 'visible' : 'sr-only'
      )}
    >
      {skipLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'inline-block px-4 py-3 -mt-12',
            'bg-cyan-500 text-white font-semibold',
            'focus:mt-0 focus:outline-none',
            'transition-all duration-200',
            'hover:bg-cyan-600',
            className
          )}
          onClick={(e) => {
            e.preventDefault();
            const target = document.getElementById(link.id);
            if (target) {
              target.focus();
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

/**
 * LiveRegion Component
 * 用于向屏幕阅读器宣布动态内容变化
 */
export interface LiveRegionProps {
  /**
   * 公告的级别
   * - polite: 等待用户空闲时再宣布
   * - assertive: 立即打断并宣布
   */
  politeness?: 'polite' | 'assertive';

  /**
   * 要宣布的消息
   */
  message?: string | null;

  /**
   * 是否原子化（整个区域作为一个单元）
   */
  atomic?: boolean;

  /**
   * 是否相关（相关区域）
   */
  relevant?: 'additions' | 'removals' | 'text' | 'all';

  /**
   * 自定义标签
   */
  ariaLiveLabel?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  politeness = 'polite',
  message,
  atomic = true,
  relevant = 'additions text',
  ariaLiveLabel,
}) => {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      aria-label={ariaLiveLabel}
      className="sr-only"
    >
      {message}
    </div>
  );
};

/**
 * FocusTrap Component
 * 将焦点限制在特定区域内（用于模态框、对话框等）
 */
export interface FocusTrapProps {
  /**
   * 是否启用焦点陷阱
   */
  enabled?: boolean;

  /**
   * 焦点容器元素
   */
  children: React.ReactNode;

  /**
   * 激活时的回调
   */
  onActivate?: () => void;

  /**
   * 停用时的回调
   */
  onDeactivate?: () => void;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  enabled = true,
  children,
  onActivate,
  onDeactivate,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!enabled) return;

    // 保存当前焦点元素
    previousActiveElement.current = document.activeElement as HTMLElement;

    // 查找可聚焦元素
    const focusableElements =
      containerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || [];

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // 聚焦第一个元素
    firstElement?.focus();
    onActivate?.();

    // 处理 Tab 键循环
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // 处理 Escape 键
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDeactivate?.();
      }
    };

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);

      // 恢复之前的焦点
      previousActiveElement.current?.focus();
    };
  }, [enabled, onActivate, onDeactivate]);

  return <div ref={containerRef}>{children}</div>;
};

/**
 * VisuallyHidden Component
 * 视觉上隐藏但屏幕阅读器可访问的内容
 */
export interface VisuallyHiddenProps {
  children: React.ReactNode;
  /**
   * 聚焦时是否可见
   */
  focusable?: boolean;
  as?: React.ElementType;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  focusable = false,
  as: Component = 'span',
}) => {
  return (
    <Component
      className={cn(
        'sr-only',
        focusable && 'focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black'
      )}
    >
      {children}
    </Component>
  );
};

/**
 * A11yWrapper Component
 * 提供完整无障碍支持的包装组件
 */
export interface A11yWrapperProps {
  children: React.ReactNode;
  /**
   * 区域的角色
   */
  role?: 'main' | 'navigation' | 'complementary' | 'contentinfo' | 'banner';
  /**
   * 区域标签
   */
  ariaLabel?: string;
  /**
   * 区域描述
   */
  ariaDescription?: string;
  /**
   * 跳过链接的目标 ID
   */
  skipLinkId?: string;
  /**
   * 是否添加实时公告区域
   */
  withLiveRegion?: boolean;
}

export const A11yWrapper: React.FC<A11yWrapperProps> = ({
  children,
  role,
  ariaLabel,
  ariaDescription,
  skipLinkId,
  withLiveRegion = false,
}) => {
  return (
    <>
      {skipLinkId && <SkipLink targetId={skipLinkId} />}
      {withLiveRegion && <LiveRegion />}
      <div
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? 'a11y-description' : undefined}
      >
        {ariaDescription && (
          <span id="a11y-description" className="sr-only">
            {ariaDescription}
          </span>
        )}
        {children}
      </div>
    </>
  );
};

// 默认导出
export default SkipLink;
