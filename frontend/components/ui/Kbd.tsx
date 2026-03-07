/**
 * Kbd Component
 * 键盘按键显示组件
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface KbdProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Kbd({ children, size = 'md', className }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center',
        'font-mono font-medium',
        'bg-cyber-muted border border-cyber-border rounded',
        'text-gray-300 shadow-sm',
        'min-w-[1.5em] text-center',
        sizeStyles[size],
        className
      )}
    >
      {children}
    </kbd>
  );
}

/**
 * Keyboard shortcut display
 */
export interface KeyboardShortcutProps {
  keys: string[];
  className?: string;
}

export function KeyboardShortcut({ keys, className }: KeyboardShortcutProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          {index > 0 && <span className="text-gray-500 text-xs">+</span>}
          <Kbd size="sm">{key}</Kbd>
        </React.Fragment>
      ))}
    </div>
  );
}
