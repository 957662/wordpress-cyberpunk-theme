/**
 * CyberSelect - 赛博朋克风格选择器组件
 * 支持多种颜色主题、搜索、多选等功能
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CyberSelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  variant?: 'default' | 'filled' | 'outlined';
  error?: string;
  helperText?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const colorStyles = {
  cyan: {
    border: 'border-cyber-cyan/50',
    borderHover: 'hover:border-cyber-cyan',
    bg: 'bg-cyber-cyan/10',
    text: 'text-cyber-cyan',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  },
  purple: {
    border: 'border-cyber-purple/50',
    borderHover: 'hover:border-cyber-purple',
    bg: 'bg-cyber-purple/10',
    text: 'text-cyber-purple',
    glow: 'shadow-[0_0_20px_rgba(157,0,255,0.3)]',
  },
  pink: {
    border: 'border-cyber-pink/50',
    borderHover: 'hover:border-cyber-pink',
    bg: 'bg-cyber-pink/10',
    text: 'text-cyber-pink',
    glow: 'shadow-[0_0_20px_rgba(255,0,128,0.3)]',
  },
  green: {
    border: 'border-cyber-green/50',
    borderHover: 'hover:border-cyber-green',
    bg: 'bg-cyber-green/10',
    text: 'text-cyber-green',
    glow: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
  },
};

export function CyberSelect({
  options,
  value,
  onChange,
  placeholder = '请选择',
  disabled = false,
  searchable = false,
  multiple = false,
  color = 'cyan',
  variant = 'default',
  error,
  helperText,
  label,
  required = false,
  className,
}: CyberSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const styles = colorStyles[color];

  // 过滤选项
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 获取选中的选项
  const getSelectedOptions = () => {
    if (multiple) {
      return options.filter((opt) => (value as string[])?.includes(opt.value));
    }
    return options.find((opt) => opt.value === value);
  };

  const selectedOptions = getSelectedOptions();

  // 处理选项点击
  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValue = value as string[] || [];
      const newValue = currentValue.includes(option.value)
        ? currentValue.filter((v) => v !== option.value)
        : [...currentValue, option.value];
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  // 清除选择
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '');
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 聚焦搜索框
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // 渲染选中值
  const renderValue = () => {
    if (multiple) {
      const selected = selectedOptions as SelectOption[];
      if (selected.length === 0) return placeholder;
      return (
        <div className="flex flex-wrap gap-1">
          {selected.map((opt) => (
            <span
              key={opt.value}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs',
                styles.bg,
                styles.text
              )}
            >
              {opt.label}
              <X
                className="w-3 h-3 cursor-pointer hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionClick(opt);
                }}
              />
            </span>
          ))}
        </div>
      );
    }

    const selected = selectedOptions as SelectOption | undefined;
    return selected?.label || placeholder;
  };

  return (
    <div className={cn('relative', className)} ref={ref}>
      {/* Label */}
      {label && (
        <label className={cn('block text-sm font-medium mb-2', styles.text)}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select Trigger */}
      <motion.div
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={cn(
          'relative flex items-center justify-between gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 cursor-pointer',
          'focus-within:ring-2 focus-within:ring-cyan-500/50',
          styles.border,
          styles.borderHover,
          error && 'border-red-500',
          disabled && 'opacity-50 cursor-not-allowed',
          isOpen && styles.glow,
          variant === 'filled' && styles.bg
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={cn('flex-1', !value && 'text-gray-400')}>
          {renderValue()}
        </span>

        <div className="flex items-center gap-2">
          {value && !disabled && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-white transition-colors"
              onClick={handleClear}
            />
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className={cn('w-4 h-4', styles.text)} />
          </motion.div>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-red-400"
        >
          {error}
        </motion.p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 w-full mt-2 bg-cyber-card border-2 rounded-lg shadow-xl overflow-hidden',
              styles.border
            )}
          >
            {/* Search Input */}
            {searchable && (
              <div className="p-3 border-b border-cyber-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索选项..."
                    className={cn(
                      'w-full pl-9 pr-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-sm',
                      'focus:outline-none focus:border-cyber-cyan transition-colors'
                    )}
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div
              className="max-h-60 overflow-y-auto"
              role="listbox"
              aria-multiselectable={multiple}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  {searchQuery ? '未找到匹配的选项' : '暂无选项'}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = multiple
                    ? (value as string[])?.includes(option.value)
                    : value === option.value;

                  return (
                    <motion.div
                      key={option.value}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick(option)}
                      className={cn(
                        'relative flex items-center justify-between px-4 py-3 cursor-pointer transition-colors',
                        'hover:bg-cyber-border',
                        highlightedIndex === index && styles.bg,
                        isSelected && styles.bg,
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className={cn('text-sm', isSelected && styles.text)}>
                        {option.label}
                      </span>

                      {isSelected && (
                        <Check className={cn('w-4 h-4', styles.text)} />
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CyberSelect;
