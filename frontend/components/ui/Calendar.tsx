'use client';

/**
 * Calendar Component - 日历组件
 * 支持单日期选择、范围选择、多选
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============= Types =============
export type CalendarView = 'month' | 'year' | 'decade';
export type SelectionMode = 'single' | 'range' | 'multiple';

export interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isDisabled: boolean;
}

export interface CalendarProps {
  /** 当前选中的日期 */
  value?: Date | Date[] | [Date?, Date?];
  /** 值变化回调 */
  onChange?: (value: Date | Date[] | [Date?, Date?]) => void;
  /** 选择模式 */
  mode?: SelectionMode;
  /** 最小日期 */
  minDate?: Date;
  /** 最大日期 */
  maxDate?: Date;
  /** 禁用的日期 */
  disabledDates?: Date[];
  /** 禁用的星期 (0-6, 0是周日) */
  disabledDays?: number[];
  /** 自定义日期渲染 */
  renderDay?: (date: CalendarDate) => React.ReactNode;
  /** 显示周数 */
  showWeekNumbers?: boolean;
  /** 语言 */
  locale?: string;
  /** 第一天是星期几 (0-6) */
  firstDayOfWeek?: number;
  /** 主题 */
  theme?: 'cyan' | 'purple' | 'pink' | 'yellow';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 自定义类名 */
  className?: string;
}

// ============= Constants =============
const WEEKDAYS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  zh: ['日', '一', '二', '三', '四', '五', '六'],
};

const MONTHS = {
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  zh: [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ],
};

const THEME_COLORS = {
  cyan: {
    primary: 'bg-cyan-500',
    primaryHover: 'hover:bg-cyan-600',
    primaryLight: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    border: 'border-cyan-500',
  },
  purple: {
    primary: 'bg-purple-500',
    primaryHover: 'hover:bg-purple-600',
    primaryLight: 'bg-purple-500/20',
    text: 'text-purple-400',
    border: 'border-purple-500',
  },
  pink: {
    primary: 'bg-pink-500',
    primaryHover: 'hover:bg-pink-600',
    primaryLight: 'bg-pink-500/20',
    text: 'text-pink-400',
    border: 'border-pink-500',
  },
  yellow: {
    primary: 'bg-yellow-500',
    primaryHover: 'hover:bg-yellow-600',
    primaryLight: 'bg-yellow-500/20',
    text: 'text-yellow-400',
    border: 'border-yellow-500',
  },
};

const SIZES = {
  sm: { cell: 'w-8 h-8', text: 'text-sm' },
  md: { cell: 'w-10 h-10', text: 'text-base' },
  lg: { cell: 'w-12 h-12', text: 'text-lg' },
};

// ============= Utilities =============
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

const isDateDisabled = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
  disabledDays?: number[]
): boolean => {
  const day = date.getDay();

  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDays?.includes(day)) return true;
  if (disabledDates?.some(d => isSameDay(d, date))) return true;

  return false;
};

const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days: Date[] = [];

  // 前一个月的天数
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push(new Date(year, month - 1, prevMonthDays - i));
  }

  // 当前月的天数
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // 下一个月的天数
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
};

// ============= Components =============

const CalendarHeader: React.FC<{
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  locale: string;
  theme: string;
  size: string;
}> = ({ currentMonth, onPrevMonth, onNextMonth, locale, theme, size }) => {
  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS];
  const monthName = MONTHS[locale as keyof typeof MONTHS][currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  return (
    <div className="flex items-center justify-between mb-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPrevMonth}
        className={`p-2 rounded-lg ${colors.primaryHover} bg-gray-800/50 text-gray-400 hover:text-white transition-colors`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      <div className={`font-bold ${colors.text} ${size === 'lg' ? 'text-xl' : 'text-base'}`}>
        {monthName} {year}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNextMonth}
        className={`p-2 rounded-lg ${colors.primaryHover} bg-gray-800/50 text-gray-400 hover:text-white transition-colors`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </div>
  );
};

const WeekdayHeader: React.FC<{
  firstDayOfWeek: number;
  locale: string;
}> = ({ firstDayOfWeek, locale }) => {
  const weekdays = WEEKDAYS[locale as keyof typeof WEEKDAYS];
  const reorderedWeekdays = [
    ...weekdays.slice(firstDayOfWeek),
    ...weekdays.slice(0, firstDayOfWeek),
  ];

  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {reorderedWeekdays.map((day, index) => (
        <div
          key={index}
          className="text-center text-sm font-medium text-gray-500 py-2"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

const DayCell: React.FC<{
  date: CalendarDate;
  onClick: () => void;
  theme: string;
  size: string;
  renderDay?: (date: CalendarDate) => React.ReactNode;
}> = ({ date, onClick, theme, size, renderDay }) => {
  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS];
  const sizeClass = SIZES[size as keyof typeof SIZES];

  if (renderDay) {
    return <>{renderDay(date)}</>;
  }

  const getCellClass = () => {
    let baseClass = `relative ${sizeClass.cell} flex items-center justify-center rounded-lg transition-all duration-200 `;

    if (date.isDisabled) {
      return `${baseClass} text-gray-600 cursor-not-allowed opacity-30`;
    }

    if (date.isRangeStart || date.isRangeEnd) {
      return `${baseClass} ${colors.primary} text-white font-bold cursor-pointer ${colors.primaryHover}`;
    }

    if (date.isInRange) {
      return `${baseClass} ${colors.primaryLight} ${colors.text} cursor-pointer`;
    }

    if (date.isSelected) {
      return `${baseClass} ${colors.primary} text-white font-bold cursor-pointer ${colors.primaryHover}`;
    }

    if (date.isToday) {
      return `${baseClass} ${colors.border} border-2 ${colors.text} cursor-pointer hover:bg-gray-800/50`;
    }

    if (!date.isCurrentMonth) {
      return `${baseClass} text-gray-600 cursor-pointer hover:bg-gray-800/30`;
    }

    return `${baseClass} text-gray-300 cursor-pointer hover:bg-gray-800/50`;
  };

  return (
    <motion.div
      whileHover={date.isDisabled ? {} : { scale: 1.1 }}
      whileTap={date.isDisabled ? {} : { scale: 0.95 }}
      onClick={date.isDisabled ? undefined : onClick}
      className={getCellClass()}
    >
      <span className={sizeClass.text}>{date.date.getDate()}</span>
      {date.isToday && !date.isSelected && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-current" />
      )}
    </motion.div>
  );
};

// ============= Main Component =============

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  mode = 'single',
  minDate,
  maxDate,
  disabledDates,
  disabledDays,
  renderDay,
  showWeekNumbers = false,
  locale = 'zh',
  firstDayOfWeek = 0,
  theme = 'cyan',
  size = 'md',
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // 计算日期选择状态
  const calendarDates = useMemo(() => {
    const days = getDaysInMonth(currentMonth);

    return days.map(date => {
      const isSelected = (() => {
        if (mode === 'single' && value instanceof Date) {
          return isSameDay(date, value);
        }
        if (mode === 'range' && Array.isArray(value) && value.length === 2) {
          const [start, end] = value;
          return (start && isSameDay(date, start)) || (end && isSameDay(date, end));
        }
        if (mode === 'multiple' && Array.isArray(value)) {
          return value.some(v => isSameDay(date, v));
        }
        return false;
      })();

      const isInRange = (() => {
        if (mode === 'range' && Array.isArray(value) && value.length === 2) {
          const [start, end] = value;
          if (!start || !end) return false;
          return date > start && date < end;
        }
        return false;
      })();

      const isRangeStart = (() => {
        if (mode === 'range' && Array.isArray(value) && value.length === 2) {
          const [start] = value;
          return start ? isSameDay(date, start) : false;
        }
        return false;
      })();

      const isRangeEnd = (() => {
        if (mode === 'range' && Array.isArray(value) && value.length === 2) {
          const [, end] = value;
          return end ? isSameDay(date, end) : false;
        }
        return false;
      })();

      return {
        date,
        isCurrentMonth: isSameMonth(date, currentMonth),
        isToday: isToday(date),
        isSelected,
        isInRange: mode === 'range' && hoverDate ? (
          isInRange || (
            Array.isArray(value) && value[0] &&
            date > value[0] && date < hoverDate
          )
        ) : isInRange,
        isRangeStart,
        isRangeEnd,
        isDisabled: isDateDisabled(date, minDate, maxDate, disabledDates, disabledDays),
      };
    });
  }, [currentMonth, value, mode, hoverDate, minDate, maxDate, disabledDates, disabledDays]);

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date, minDate, maxDate, disabledDates, disabledDays)) {
      return;
    }

    if (mode === 'single') {
      onChange?.(date);
    } else if (mode === 'range') {
      const range = value as [Date?, Date?];
      if (!range[0] || (range[0] && range[1])) {
        onChange?.([date, undefined]);
      } else {
        onChange?.([range[0], date < range[0] ? range[0] : date]);
      }
    } else if (mode === 'multiple') {
      const selected = value as Date[] || [];
      const exists = selected.some(d => isSameDay(d, date));
      if (exists) {
        onChange?.(selected.filter(d => !isSameDay(d, date)));
      } else {
        onChange?.([...selected, date]);
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const weeks = [];
  for (let i = 0; i < calendarDates.length; i += 7) {
    weeks.push(calendarDates.slice(i, i + 7));
  }

  const colors = THEME_COLORS[theme as keyof typeof THEME_COLORS];

  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 ${className}`}>
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        locale={locale}
        theme={theme}
        size={size}
      />

      <WeekdayHeader firstDayOfWeek={firstDayOfWeek} locale={locale} />

      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {showWeekNumbers && (
              <div className="flex items-center justify-center text-xs text-gray-600 py-2">
                {getWeekNumber(week[0].date)}
              </div>
            )}
            {week.map((calendarDate, dayIndex) => (
              <DayCell
                key={`${weekIndex}-${dayIndex}`}
                date={calendarDate}
                onClick={() => handleDateClick(calendarDate.date)}
                theme={theme}
                size={size}
                renderDay={renderDay}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
