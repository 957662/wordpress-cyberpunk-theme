/**
 * 下拉菜单组件
 * 可定制的下拉选择器
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  /** 选项值 */
  value: string;
  /** 显示标签 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 图标 */
  icon?: React.ReactNode;
}

export interface DropdownProps {
  /** 选项列表 */
  options: DropdownOption[];
  /** 当前值 */
  value?: string;
  /** 占位符 */
  placeholder?: string;
  /** 值变化回调 */
  onChange?: (value: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 菜单最大高度 */
  maxHeight?: number;
}

export function Dropdown({
  options,
  value,
  placeholder = '请选择',
  onChange,
  disabled = false,
  className,
  maxHeight = 300,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = useCallback((optionValue: string) => {
    const option = options.find(opt => opt.value === optionValue);
    if (option && !option.disabled) {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  }, [options, onChange]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* 触发按钮 */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-2 rounded-lg border text-left',
          'flex items-center justify-between gap-2',
          'bg-cyber-dark/50 border-cyber-border',
          'hover:border-cyber-cyan transition-colors',
          'focus:outline-none focus:border-cyber-cyan',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={cn(!selectedOption && 'text-gray-500')}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 w-full mt-2 rounded-lg border',
              'bg-cyber-dark border-cyber-border',
              'shadow-neon-cyan overflow-hidden'
            )}
          >
            <div
              className="overflow-y-auto"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              {options.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    'w-full px-4 py-2 text-left',
                    'flex items-center justify-between gap-2',
                    'border-b border-cyber-border last:border-b-0',
                    'hover:bg-cyber-cyan/10 transition-colors',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {option.icon}
                    <span className={cn(
                      value === option.value ? 'text-cyber-cyan' : 'text-gray-300'
                    )}>
                      {option.label}
                    </span>
                  </span>
                  {value === option.value && (
                    <CheckIcon className="w-4 h-4 text-cyber-cyan" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
