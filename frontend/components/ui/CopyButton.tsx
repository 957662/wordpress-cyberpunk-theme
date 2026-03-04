'use client';

/**
 * CopyButton - 复制到剪贴板按钮组件
 * 赛博朋克风格的复制按钮
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';

export interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text' | 'both';
  showFeedback?: boolean;
  feedbackDuration?: number;
  onCopy?: () => void;
  className?: string;
}

const sizeStyles = {
  sm: 'p-1.5 rounded-md',
  md: 'p-2 rounded-lg',
  lg: 'p-3 rounded-xl',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function CopyButton({
  text,
  size = 'md',
  variant = 'icon',
  showFeedback = true,
  feedbackDuration = 2000,
  onCopy,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();

      if (showFeedback) {
        setTimeout(() => setCopied(false), feedbackDuration);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const baseStyles = 'inline-flex items-center gap-2 border border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan transition-all duration-200 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/30 hover:shadow-neon-cyan';
  const sizeClass = sizeStyles[size];
  const iconSize = iconSizes[size];

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className={cn(
        baseStyles,
        sizeClass,
        variant === 'text' && 'px-3 py-1.5',
        variant === 'both' && 'px-4 py-2',
        className
      )}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <>
          <Check className={iconSize} />
          {(variant === 'text' || variant === 'both') && (
            <span className="text-sm font-medium">Copied!</span>
          )}
        </>
      ) : (
        <>
          <Copy className={iconSize} />
          {(variant === 'text' || variant === 'both') && (
            <span className="text-sm font-medium">Copy</span>
          )}
        </>
      )}
    </motion.button>
  );
}

/**
 * CopyToClipboard - 带文本显示的复制组件
 */
export interface CopyToClipboardProps {
  text: string;
  displayText?: string;
  truncate?: boolean;
  maxLength?: number;
  onCopy?: () => void;
  className?: string;
}

export function CopyToClipboard({
  text,
  displayText,
  truncate = true,
  maxLength = 50,
  onCopy,
  className,
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.();

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const truncatedText = truncate && text.length > maxLength
    ? `${text.substring(0, maxLength)}...`
    : text;

  return (
    <div
      className={cn(
        'group flex items-center gap-2 p-3 rounded-lg border border-cyber-border/50 bg-cyber-card/50 backdrop-blur-sm hover:border-cyber-cyan/30 transition-all duration-200',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono text-gray-300 truncate">
          {displayText || truncatedText}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className={cn(
          'flex-shrink-0 p-2 rounded-md border transition-all duration-200',
          copied
            ? 'border-cyber-green/30 bg-cyber-green/10 text-cyber-green'
            : 'border-cyber-cyan/20 bg-cyber-cyan/5 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan/30'
        )}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}
