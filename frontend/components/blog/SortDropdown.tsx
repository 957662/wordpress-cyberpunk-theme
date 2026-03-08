/**
 * SortDropdown - 排序下拉组件
 * 提供文章排序选项
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { BlogSortField } from '@/types/models/blog';

interface SortDropdownProps {
  value: BlogSortField;
  onChange: (value: BlogSortField) => void;
  className?: string;
}

const SORT_OPTIONS = [
  { value: 'date' as const, label: '最新发布', icon: '📅' },
  { value: 'views' as const, label: '最多浏览', icon: '👁️' },
  { value: 'likes' as const, label: '最多点赞', icon: '❤️' },
  { value: 'comments' as const, label: '最多评论', icon: '💬' },
  { value: 'title' as const, label: '标题排序', icon: '🔤' },
];

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value);

  // 点击外部关闭下拉框
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
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          'bg-slate-800 text-slate-300',
          'hover:bg-slate-700 hover:text-slate-200',
          'transition-colors duration-200'
        )}
      >
        <ArrowUpDown className="w-4 h-4" />
        <span className="hidden sm:inline">{selectedOption?.label}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 mt-2 w-48 rounded-xl',
              'bg-slate-900/95 backdrop-blur-sm border border-slate-700',
              'shadow-xl overflow-hidden'
            )}
          >
            {SORT_OPTIONS.map((option) => {
              const isSelected = option.value === value;

              return (
                <motion.button
                  key={option.value}
                  whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-4 py-3 text-left flex items-center gap-3',
                    'transition-colors duration-150',
                    isSelected
                      ? 'bg-cyan-900/20 text-cyan-400'
                      : 'text-slate-300 hover:text-slate-200'
                  )}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="flex-1">{option.label}</span>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-cyan-400"
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SortDropdown;
