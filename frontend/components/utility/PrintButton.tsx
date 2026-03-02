/**
 * 打印按钮组件
 */

'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { PrinterIcon } from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface PrintButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onBeforePrint?: () => void | Promise<void> | boolean;
  onAfterPrint?: () => void;
  label?: string;
  showIcon?: boolean;
}

export const PrintButton = forwardRef<HTMLButtonElement, PrintButtonProps>(
  (
    {
      className,
      variant = 'outline',
      size = 'md',
      onBeforePrint,
      onAfterPrint,
      label = '打印',
      showIcon = true,
      ...props
    },
    ref
  ) => {
    const handlePrint = async () => {
      // 执行打印前回调
      if (onBeforePrint) {
        const result = await onBeforePrint();
        if (result === false) return;
      }

      // 执行打印
      window.print();

      // 执行打印后回调
      onAfterPrint?.();
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={handlePrint}
        leftIcon={showIcon ? <PrinterIcon className="w-4 h-4" /> : undefined}
        className={className}
        {...props}
      >
        {label}
      </Button>
    );
  }
);

PrintButton.displayName = 'PrintButton';

/**
 * 打印容器组件 - 包含打印时显示/隐藏的内容
 */
export interface PrintContainerProps {
  children: React.ReactNode;
  className?: string;
  hideOnPrint?: boolean;
  showOnlyOnPrint?: boolean;
}

export function PrintContainer({
  children,
  className,
  hideOnPrint = false,
  showOnlyOnPrint = false,
}: PrintContainerProps) {
  return (
    <div
      className={cn(
        className,
        hideOnPrint && 'print:hidden',
        showOnlyOnPrint && 'hidden print:block'
      )}
    >
      {children}
    </div>
  );
}

/**
 * 打印样式提供者
 */
export interface PrintStylesProps {
  children: React.ReactNode;
  pageBreak?: 'auto' | 'always' | 'avoid' | 'left' | 'right';
  orientation?: 'portrait' | 'landscape';
}

export function PrintStyles({
  children,
  pageBreak,
  orientation,
}: PrintStylesProps) {
  return (
    <div
      style={{
        pageBreakBefore: pageBreak === 'always' ? 'always' : undefined,
        pageBreakAfter: pageBreak === 'always' ? 'always' : undefined,
        pageBreakInside: pageBreak === 'avoid' ? 'avoid' : undefined,
      }}
      className={cn(
        orientation === 'landscape' && 'print:[@page]{orientation:landscape}'
      )}
    >
      {children}
    </div>
  );
}

/**
 * 打印页脚组件
 */
export interface PrintFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function PrintFooter({ children, className }: PrintFooterProps) {
  return (
    <PrintContainer showOnlyOnPrint className={className}>
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-gray-300 bg-gray-50 text-xs text-gray-600">
        {children}
      </div>
    </PrintContainer>
  );
}

/**
 * 打印头部组件
 */
export interface PrintHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function PrintHeader({ children, className }: PrintHeaderProps) {
  return (
    <PrintContainer showOnlyOnPrint className={className}>
      <div className="fixed top-0 left-0 right-0 p-4 border-b border-gray-300 bg-gray-50">
        {children}
      </div>
    </PrintContainer>
  );
}
