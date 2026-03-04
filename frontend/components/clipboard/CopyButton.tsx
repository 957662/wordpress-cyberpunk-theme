'use client';

import React from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { useCopyButton } from '@/hooks/useClipboard';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string | (() => string);
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  successText?: string;
  errorText?: string;
  onCopy?: (success: boolean) => void;
}

/**
 * 复制按钮组件
 */
export function CopyButton({
  text,
  className,
  showIcon = true,
  showText = true,
  successText = '已复制!',
  errorText = '复制失败',
  onCopy,
}: CopyButtonProps) {
  const { isCopied, error, copy } = useCopyButton(text);

  const handleCopy = async () => {
    const success = await copy();
    onCopy?.(success);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-md',
        'text-sm font-medium transition-all duration-200',
        'hover:bg-cyber-cyan/10 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
        className
      )}
      title={isCopied ? successText : '点击复制'}
    >
      {showIcon && (
        <span className="relative">
          {isCopied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : error ? (
            <AlertCircle className="w-4 h-4 text-red-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </span>
      )}
      {showText && (
        <span
          className={cn(
            'transition-colors',
            isCopied && 'text-green-500',
            error && 'text-red-500',
            !isCopied && !error && 'text-gray-600 dark:text-gray-400'
          )}
        >
          {isCopied ? successText : error ? errorText : '复制'}
        </span>
      )}
    </button>
  );
}

/**
 * 赛博朋克风格复制按钮
 */
export function CyberCopyButton({
  text,
  className,
  ...props
}: Omit<CopyButtonProps, 'successText' | 'errorText'>) {
  const { isCopied, error, copy } = useCopyButton(text);

  const handleCopy = async () => {
    await copy();
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'group relative px-4 py-2 rounded',
        'bg-transparent border border-cyber-cyan/50',
        'text-cyber-cyan font-mono text-sm',
        'hover:bg-cyber-cyan/10 hover:border-cyber-cyan',
        'hover:shadow-lg hover:shadow-cyber-cyan/20',
        'transition-all duration-300',
        'before:absolute before:inset-0 before:bg-gradient-to-r',
        'before:from-cyber-cyan/0 before:to-cyber-purple/0',
        'hover:before:from-cyber-cyan/10 hover:before:to-cyber-purple/10',
        'before:transition-all before:duration-300',
        className
      )}
    >
      <div className="relative flex items-center gap-2">
        {isCopied ? (
          <>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400">COPIED</span>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-4 h-4 text-cyber-pink" />
            <span className="text-cyber-pink">ERROR</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-cyber-cyan transition-colors">COPY</span>
          </>
        )}
      </div>

      {/* 扫描线效果 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url(/images/scanlines.png)] opacity-10" />
      </div>
    </button>
  );
}

/**
 * 代码块复制按钮
 */
export function CodeCopyButton({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const { isCopied, copy } = useCopyButton(code);

  return (
    <button
      onClick={() => copy()}
      className={cn(
        'absolute top-2 right-2 p-2 rounded',
        'bg-gray-800/80 hover:bg-gray-700/80',
        'text-gray-400 hover:text-white',
        'opacity-0 group-hover:opacity-100',
        'transition-all duration-200',
        'backdrop-blur-sm',
        className
      )}
      title={isCopied ? '已复制!' : '复制代码'}
    >
      {isCopied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

/**
 * 文本复制组件（带 tooltip）
 */
export function CopyableText({
  text,
  maxLength,
  className,
}: {
  text: string;
  maxLength?: number;
  className?: string;
}) {
  const { isCopied, copy } = useCopyButton(text);

  const displayText =
    maxLength && text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <div
      className={cn(
        'group relative inline-flex items-center gap-2',
        'px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800',
        'hover:bg-gray-200 dark:hover:bg-gray-700',
        'cursor-pointer transition-colors',
        'font-mono text-sm text-gray-700 dark:text-gray-300',
        className
      )}
      onClick={() => copy()}
      title="点击复制"
    >
      <span className="truncate">{displayText}</span>
      <Copy className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors flex-shrink-0" />

      {/* Tooltip */}
      {isCopied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-xs rounded whitespace-nowrap animate-fade-in">
          已复制!
        </span>
      )}
    </div>
  );
}
