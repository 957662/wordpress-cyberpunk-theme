'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  format?: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  color?: 'cyan' | 'purple' | 'pink' | 'green';
  size?: 'sm' | 'md' | 'lg';
  showTime?: boolean;
  className?: string;
}

const colorClasses = {
  cyan: {
    border: 'border-cyan-500/30 focus:border-cyan-500',
    selected: 'bg-cyan-500 text-white',
    hover: 'hover:bg-cyan-500/20',
    today: 'border-cyan-500 text-cyan-400',
    icon: 'text-cyan-400',
  },
  purple: {
    border: 'border-purple-500/30 focus:border-purple-500',
    selected: 'bg-purple-500 text-white',
    hover: 'hover:bg-purple-500/20',
    today: 'border-purple-500 text-purple-400',
    icon: 'text-purple-400',
  },
  pink: {
    border: 'border-pink-500/30 focus:border-pink-500',
    selected: 'bg-pink-500 text-white',
    hover: 'hover:bg-pink-500/20',
    today: 'border-pink-500 text-pink-400',
    icon: 'text-pink-400',
  },
  green: {
    border: 'border-green-500/30 focus:border-green-500',
    selected: 'bg-green-500 text-white',
    hover: 'hover:bg-green-500/20',
    today: 'border-green-500 text-green-400',
    icon: 'text-green-400',
  },
};

const sizeClasses = {
  sm: { trigger: 'h-8 text-sm', calendar: 'text-sm', cell: 'w-8 h-8' },
  md: { trigger: 'h-10 text-base', calendar: 'text-base', cell: 'w-10 h-10' },
  lg: { trigger: 'h-12 text-lg', calendar: 'text-lg', cell: 'w-12 h-12' },
};

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
const months = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

export function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  format = 'YYYY-MM-DD',
  color = 'cyan',
  size = 'md',
  className,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? internalValue;
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      default:
        return `${year}-${month}-${day}`;
    }
  };

  const handleDateSelect = (date: Date) => {
    if (disabled) return;

    // Check min/max constraints
    if (minDate && date < minDate) return;
    if (maxDate && date > maxDate) return;

    if (controlledValue === undefined) {
      setInternalValue(date);
    }
    onChange?.(date);
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Date[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(new Date(year, month, 1 - (startingDayOfWeek - i)));
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
  };

  const isSelected = (date: Date): boolean => {
    return value ? isSameDay(date, value) : false;
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
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

  return (
    <div ref={pickerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between px-4 rounded-xl border outline-none transition-all',
          'bg-gray-900/50 backdrop-blur-sm text-gray-100',
          sizes.trigger,
          colors.border,
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={cn(!value && 'text-gray-400')}>
          {value ? formatDate(value) : '选择日期'}
        </span>
        <CalendarIcon className={cn('w-4 h-4', colors.icon)} />
      </button>

      {/* Calendar Panel */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-80 mt-2 p-4 rounded-xl border shadow-xl',
            'bg-gray-900/95 backdrop-blur-sm',
            'animate-in fade-in slide-in-from-top-2 duration-200',
            colors.border
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={previousMonth}
              className={cn('p-1 rounded-lg transition-all', colors.hover)}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-lg font-bold">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className={cn('p-1 rounded-lg transition-all', colors.hover)}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div
                key={day}
                className="text-center text-xs text-gray-400 font-medium py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((date, index) => {
              const selected = isSelected(date);
              const today = isToday(date);
              const inMonth = isCurrentMonth(date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  disabled={disabled}
                  className={cn(
                    'aspect-square flex items-center justify-center rounded-lg transition-all',
                    'text-sm font-medium',
                    sizes.cell,
                    !inMonth && 'opacity-30',
                    today && !selected && `border ${colors.today}`,
                    selected && colors.selected,
                    !selected && colors.hover,
                    disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => handleDateSelect(new Date())}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                colors.hover
              )}
            >
              今天
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                colors.hover
              )}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
