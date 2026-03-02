/**
 * SplitButton Component - 分割按钮组件
 * 一个按钮分成两部分：主要操作和下拉菜单
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown, MoreVertical } from 'lucide-react';

export interface SplitButtonAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export interface SplitButtonProps {
  mainAction: SplitButtonAction;
  actions: SplitButtonAction[];
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  direction?: 'down' | 'up' | 'left' | 'right';
}

export function SplitButton({
  mainAction,
  actions,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  direction = 'down',
}: SplitButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const variants = {
    primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-cyan/90',
    secondary: 'bg-cyber-purple text-white hover:bg-cyber-purple/90',
    outline: 'border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10',
    ghost: 'text-cyber-cyan hover:bg-cyber-cyan/10',
  };

  const sizes = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  };

  const menuPositions = {
    down: 'top-full left-0 mt-1',
    up: 'bottom-full left-0 mb-1',
    left: 'right-full top-0 mr-1',
    right: 'left-full top-0 ml-1',
  };

  const dropdownVariants = {
    down: { originY: 0, scaleY: 0, opacity: 0 },
    up: { originY: 1, scaleY: 0, opacity: 0 },
    left: { originX: 1, scaleX: 0, opacity: 0 },
    right: { originX: 0, scaleX: 0, opacity: 0 },
  };

  const isVertical = direction === 'down' || direction === 'up';

  return (
    <div className={cn("relative inline-flex", className)} ref={dropdownRef}>
      {/* 主要操作按钮 */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={mainAction.onClick}
        disabled={disabled || mainAction.disabled}
        className={cn(
          "relative inline-flex items-center justify-center px-4 font-medium transition-colors rounded-l-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          "border-r-0"
        )}
      >
        {mainAction.icon && (
          <span className="mr-2">{mainAction.icon}</span>
        )}
        {mainAction.label}
      </motion.button>

      {/* 下拉菜单触发按钮 */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center justify-center px-3 transition-colors rounded-r-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size]
        )}
      >
        {isVertical ? (
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "rotate-180"
          )} />
        ) : (
          <MoreVertical className="w-4 h-4" />
        )}
      </motion.button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={dropdownVariants[direction]}
            animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
            exit={dropdownVariants[direction]}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 min-w-[200px] bg-cyber-card border border-cyber-border rounded-lg shadow-lg overflow-hidden",
              menuPositions[direction],
              isVertical ? "w-full" : "min-w-max"
            )}
          >
            <div className="py-1">
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  disabled={disabled || action.disabled}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm transition-colors",
                    "flex items-center gap-3",
                    "hover:bg-cyber-cyan/10",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    action.danger ? "text-cyber-pink hover:bg-cyber-pink/10" : "text-cyber-text"
                  )}
                >
                  {action.icon && (
                    <span className="flex-shrink-0">{action.icon}</span>
                  )}
                  <span className="flex-1">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
