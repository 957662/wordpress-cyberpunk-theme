/**
 * 复制按钮组件
 * 一键复制文本内容
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  label?: string;
  showFeedback?: boolean;
}

export function CopyButton({
  text,
  className,
  size = 'md',
  variant = 'icon',
  label,
  showFeedback = true,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (showFeedback) {
        toast.success('已复制到剪贴板');
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('复制失败');
    }
  };

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  if (variant === 'button') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopy}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border border-cyber-border bg-card px-4 py-2 font-medium transition-colors hover:border-cyber-primary hover:text-cyber-primary',
          className
        )}
      >
        {copied ? (
          <Check className={cn('h-4 w-4 text-green-500')} />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span>{copied ? '已复制!' : label || '复制'}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleCopy}
      className={cn(
        'rounded-lg border border-cyber-border bg-card p-2 transition-all hover:border-cyber-primary hover:shadow-lg hover:shadow-cyber-primary/20',
        sizeClasses[size],
        className
      )}
      title={copied ? '已复制!' : '复制'}
    >
      {copied ? (
        <Check className={cn('text-green-500')} size={iconSizes[size]} />
      ) : (
        <Copy size={iconSizes[size]} />
      )}
    </motion.button>
  );
}
