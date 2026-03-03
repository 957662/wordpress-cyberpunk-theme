'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  description?: string;
}

export interface CyberDropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  searchable?: boolean;
  multiSelect?: boolean;
  maxVisible?: number;
  className?: string;
}

const colorClasses = {
  cyan: {
    bg: 'bg-cyan-500/10 hover:bg-cyan-500/20',
    border: 'border-cyan-500/50 focus:border-cyan-400',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/20'
  },
  purple: {
    bg: 'bg-purple-500/10 hover:bg-purple-500/20',
    border: 'border-purple-500/50 focus:border-purple-400',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20'
  },
  pink: {
    bg: 'bg-pink-500/10 hover:bg-pink-500/20',
    border: 'border-pink-500/50 focus:border-pink-400',
    text: 'text-pink-400',
    glow: 'shadow-pink-500/20'
  },
  green: {
    bg: 'bg-green-500/10 hover:bg-green-500/20',
    border: 'border-green-500/50 focus:border-green-400',
    text: 'text-green-400',
    glow: 'shadow-green-500/20'
  },
  yellow: {
    bg: 'bg-yellow-500/10 hover:bg-yellow-500/20',
    border: 'border-yellow-500/50 focus:border-yellow-400',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/20'
  }
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

export const CyberDropdown: React.FC<CyberDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择...',
  disabled = false,
  color = 'cyan',
  size = 'md',
  variant = 'outline',
  searchable = false,
  multiSelect = false,
  maxVisible = 8,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>(
    value ? [value] : []
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const colors = colorClasses[color];
  const sizeClass = sizeClasses[size];

  // 过滤选项
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 获取选中的选项
  const getSelectedOption = () => {
    if (multiSelect) {
      return options.filter(opt => selectedValues.includes(opt.value));
    }
    return options.find(opt => opt.value === selectedValues[0]);
  };

  // 处理选项点击
  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled) return;

    if (multiSelect) {
      const newValues = selectedValues.includes(option.value)
        ? selectedValues.filter(v => v !== option.value)
        : [...selectedValues, option.value];
      setSelectedValues(newValues);
      onChange?.(newValues.join(','));
    } else {
      setSelectedValues([option.value]);
      onChange?.(option.value);
      setIsOpen(false);
    }
    setSearchQuery('');
  };

  // 处理键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      const firstEnabled = filteredOptions.find(opt => !opt.disabled);
      if (firstEnabled) {
        handleOptionClick(firstEnabled);
      }
    }
  };

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

  // 聚焦输入框
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const selectedOption = getSelectedOption();
  const displayValue = multiSelect
    ? selectedValues.length > 0
      ? `已选择 ${selectedValues.length} 项`
      : placeholder
    : selectedOption?.label || placeholder;

  return (
    <div
      ref={dropdownRef}
      className={cn('relative w-full', className)}
      onKeyDown={handleKeyDown}
    >
      {/* 触发器 */}
      <motion.button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between gap-3 rounded-lg border-2',
          'font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          colors.border,
          colors.text,
          colors.bg,
          colors.glow,
          sizeClass,
          variant === 'solid' && 'border-transparent',
          isOpen && 'ring-2 ring-offset-2 ring-offset-gray-900'
        )}
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedOption && !multiSelect && selectedOption.icon && (
            <span className="flex-shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">{displayValue}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5" />
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
              'absolute z-50 w-full mt-2 rounded-lg border-2',
              'bg-gray-900/95 backdrop-blur-xl',
              'shadow-xl overflow-hidden',
              colors.border,
              colors.glow
            )}
          >
            {/* 搜索框 */}
            {searchable && (
              <div className="p-2 border-b border-gray-700/50">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索选项..."
                  className={cn(
                    'w-full px-3 py-2 rounded-md',
                    'bg-gray-800/50 border border-gray-700',
                    'text-white placeholder-gray-500',
                    'focus:outline-none focus:border-cyan-500',
                    'text-sm'
                  )}
                />
              </div>
            )}

            {/* 选项列表 */}
            <div
              className="max-h-[300px] overflow-y-auto overflow-x-hidden"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: `${color === 'cyan' ? '#06b6d4' : color === 'purple' ? '#a855f7' : '#ec4899'}40 transparent`
              }}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  暂无匹配选项
                </div>
              ) : (
                filteredOptions.slice(0, maxVisible).map((option, index) => {
                  const isSelected = multiSelect
                    ? selectedValues.includes(option.value)
                    : selectedValues[0] === option.value;

                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      disabled={option.disabled}
                      className={cn(
                        'w-full px-4 py-3 text-left',
                        'flex items-center gap-3',
                        'transition-all duration-150',
                        'hover:bg-gray-800/50',
                        'disabled:opacity-40 disabled:cursor-not-allowed',
                        'border-b border-gray-700/30 last:border-b-0',
                        index === 0 && 'border-t-0',
                        isSelected && colors.bg
                      )}
                      whileHover={{ x: 2 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      {/* 多选复选框 */}
                      {multiSelect && (
                        <div className={cn(
                          'w-5 h-5 rounded border-2 flex items-center justify-center',
                          'flex-shrink-0 transition-colors',
                          isSelected ? colors.border + ' ' + colors.bg : 'border-gray-600'
                        )}>
                          {isSelected && <Check className={cn('w-3.5 h-3.5', colors.text)} />}
                        </div>
                      )}

                      {/* 图标 */}
                      {option.icon && (
                        <span className="flex-shrink-0">{option.icon}</span>
                      )}

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          'font-medium truncate',
                          isSelected ? colors.text : 'text-gray-300'
                        )}>
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-sm text-gray-500 truncate">
                            {option.description}
                          </div>
                        )}
                      </div>

                      {/* 单选选中指示器 */}
                      {!multiSelect && isSelected && (
                        <Check className={cn('w-5 h-5 flex-shrink-0', colors.text)} />
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* 显示更多提示 */}
            {filteredOptions.length > maxVisible && (
              <div className={cn(
                'px-4 py-2 text-sm text-center',
                'bg-gray-800/30 border-t border-gray-700/50',
                colors.text
              )}>
                还有 {filteredOptions.length - maxVisible} 个选项...
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberDropdown;
