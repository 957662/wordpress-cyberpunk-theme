'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';

export interface CyberCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  highlightedDates?: Date[];
  className?: string;
}

export default function CyberCalendar({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  highlightedDates = [],
  className = '',
}: CyberCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // 添加上个月的日期
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }

    // 添加当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push({ date: day, isCurrentMonth: true });
    }

    // 添加下个月的日期以填满最后一周
    const remainingDays = 42 - days.length; // 6 行 x 7 天
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(year, month + 1, i);
      days.push({ date: day, isCurrentMonth: false });
    }

    return days;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isDateHighlighted = (date: Date) => {
    return highlightedDates.some(
      (highlighted) =>
        date.getDate() === highlighted.getDate() &&
        date.getMonth() === highlighted.getMonth() &&
        date.getFullYear() === highlighted.getFullYear()
    );
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const days = getDaysInMonth(currentMonth);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect?.(today);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
  };

  return (
    <div className={`cyber-card ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </motion.button>

        <div className="text-center">
          <h3 className="text-lg font-display font-bold text-white mb-1">
            {formatDate(currentMonth)}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToToday}
            className="text-xs text-cyber-cyan hover:text-cyber-purple transition-colors"
          >
            今天
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNextMonth}
          className="p-2 rounded-lg border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </motion.button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-mono text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, isCurrentMonth }, index) => {
          const isSelected = isDateSelected(date);
          const isHighlighted = isDateHighlighted(date);
          const isDisabled = isDateDisabled(date);
          const isToday =
            date.getDate() === new Date().getDate() &&
            date.getMonth() === new Date().getMonth() &&
            date.getFullYear() === new Date().getFullYear();

          return (
            <motion.button
              key={index}
              whileHover={{ scale: isDisabled ? 1 : 1.1 }}
              whileTap={{ scale: isDisabled ? 1 : 0.9 }}
              onClick={() => !isDisabled && onDateSelect?.(date)}
              disabled={isDisabled}
              className={`
                relative p-2 rounded-lg text-sm font-mono transition-all duration-300
                ${!isCurrentMonth ? 'text-gray-600' : 'text-gray-300'}
                ${isDisabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}
                ${isSelected ? 'bg-cyber-cyan text-cyber-dark shadow-neon-cyan' : ''}
                ${isHighlighted && !isSelected ? 'border border-cyber-purple text-cyber-purple' : ''}
                ${!isSelected && !isHighlighted && !isDisabled ? 'hover:border-cyber-cyan hover:text-cyber-cyan' : ''}
                ${isToday && !isSelected ? 'border border-cyber-cyan' : ''}
              `}
            >
              {date.getDate()}

              {/* 今天的指示器 */}
              {isToday && !isSelected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyber-cyan rounded-full" />
              )}

              {/* 高亮指示器 */}
              {isHighlighted && !isSelected && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyber-purple rounded-full animate-pulse" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 底部信息 */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-cyber-border text-center"
        >
          <p className="text-sm text-gray-400">
            已选择:{' '}
            <span className="text-cyber-cyan font-mono">
              {selectedDate.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </motion.div>
      )}

      {/* 图例 */}
      {(highlightedDates.length > 0 || selectedDate) && (
        <div className="mt-4 pt-4 border-t border-cyber-border">
          <div className="flex flex-wrap gap-4 text-xs">
            {highlightedDates.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyber-purple animate-pulse" />
                <span className="text-gray-400">高亮日期</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyber-cyan" />
              <span className="text-gray-400">已选择</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
