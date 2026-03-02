'use client';

/**
 * Calendar Component - 日历组件
 * 支持单选、多选、范围选择、事件标记、自定义渲染
 */

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
  Dot,
} from 'lucide-react';

// 日期类型
export type DateValue = Date | string | number;

// 事件数据
export interface CalendarEvent {
  date: Date;
  title: string;
  color?: string;
  onClick?: () => void;
}

// 选择模式
export type SelectionMode = 'single' | 'multiple' | 'range';

// 组件Props
export interface CalendarProps {
  /** 当前值 */
  value?: DateValue | DateValue[] | [DateValue, DateValue];
  /** 默认值 */
  defaultValue?: DateValue | DateValue[] | [DateValue, DateValue];
  /** 选择模式 */
  mode?: SelectionMode;
  /** 变化回调 */
  onChange?: (value: DateValue | DateValue[] | [DateValue, DateValue] | undefined) => void;
  /** 最小日期 */
  minDate?: DateValue;
  /** 最大日期 */
  maxDate?: DateValue;
  /** 禁用日期 */
  disabledDates?: DateValue[];
  /** 标记日期 */
  markedDates?: DateValue[];
  /** 事件列表 */
  events?: CalendarEvent[];
  /** 第一天是星期几（0-6，0是周日） */
  firstDayOfWeek?: number;
  /** 是否显示周数 */
  showWeekNumber?: boolean;
  /** 格式化日期函数 */
  formatDate?: (date: Date) => string;
  /** 自定义样式类名 */
  className?: string;
  /** 自定义日期渲染 */
  renderDay?: (date: Date, isSelected: boolean) => React.ReactNode;
}

// 辅助函数
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};

const parseDate = (value: DateValue): Date => {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  return new Date(value);
};

const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export function Calendar({
  value,
  defaultValue,
  mode = 'single',
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  markedDates = [],
  events = [],
  firstDayOfWeek = 0,
  showWeekNumber = false,
  formatDate,
  className = '',
  renderDay,
}: CalendarProps) {
  // 当前日期状态
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    if (value) {
      if (Array.isArray(value)) {
        return parseDate(value[0] || now);
      }
      return parseDate(value);
    }
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        return parseDate(defaultValue[0] || now);
      }
      return parseDate(defaultValue);
    }
    return now;
  });

  // 选中值状态
  const [selectedValue, setSelectedValue] = useState<DateValue | DateValue[] | [DateValue, DateValue] | undefined>(
    value || defaultValue
  );

  // 解析日期范围
  const min = minDate ? parseDate(minDate) : undefined;
  const max = maxDate ? parseDate(maxDate) : undefined;
  const disabled = disabledDates.map(parseDate);
  const marked = markedDates.map(parseDate);

  // 判断日期是否被禁用
  const isDateDisabled = useCallback((date: Date): boolean => {
    if (min && date < min) return true;
    if (max && date > max) return true;
    return disabled.some((d) => isSameDay(date, d));
  }, [min, max, disabled]);

  // 判断日期是否被选中
  const isDateSelected = useCallback((date: Date): boolean => {
    if (!selectedValue) return false;

    if (mode === 'single') {
      return isSameDay(date, parseDate(selectedValue as DateValue));
    }

    if (mode === 'multiple') {
      return (selectedValue as DateValue[]).some((v) => isSameDay(date, parseDate(v)));
    }

    if (mode === 'range') {
      const [start, end] = selectedValue as [DateValue, DateValue];
      if (!start || !end) return false;
      const startDate = parseDate(start);
      const endDate = parseDate(end);
      return date >= startDate && date <= endDate;
    }

    return false;
  }, [selectedValue, mode]);

  // 判断是否在范围内
  const isInRange = useCallback((date: Date): boolean => {
    if (mode !== 'range' || !selectedValue) return false;

    const [start, end] = selectedValue as [DateValue, DateValue];
    if (!start || !end) return false;

    const startDate = parseDate(start);
    const endDate = parseDate(end);
    return date > startDate && date < endDate;
  }, [mode, selectedValue]);

  // 判断是否是范围起点或终点
  const isRangeEndpoint = useCallback((date: Date): 'start' | 'end' | null => {
    if (mode !== 'range' || !selectedValue) return null;

    const [start, end] = selectedValue as [DateValue, DateValue];
    if (!start || !end) return null;

    if (isSameDay(date, parseDate(start))) return 'start';
    if (isSameDay(date, parseDate(end))) return 'end';

    return null;
  }, [mode, selectedValue]);

  // 判断日期是否有标记
  const isDateMarked = useCallback((date: Date): boolean => {
    return marked.some((d) => isSameDay(date, d));
  }, [marked]);

  // 获取日期的事件
  const getDateEvents = useCallback((date: Date): CalendarEvent[] => {
    return events.filter((event) => isSameDay(date, event.date));
  }, [events]);

  // 处理日期点击
  const handleDateClick = useCallback((date: Date) => {
    if (isDateDisabled(date)) return;

    let newValue: DateValue | DateValue[] | [DateValue, DateValue] | undefined;

    if (mode === 'single') {
      newValue = isSameDay(date, parseDate(selectedValue as DateValue || new Date(0)))
        ? undefined
        : date;
    } else if (mode === 'multiple') {
      const current = selectedValue as DateValue[] || [];
      const exists = current.some((v) => isSameDay(date, parseDate(v)));

      if (exists) {
        newValue = current.filter((v) => !isSameDay(date, parseDate(v)));
      } else {
        newValue = [...current, date];
      }
    } else if (mode === 'range') {
      const [start, end] = (selectedValue || [undefined, undefined]) as [DateValue | undefined, DateValue | undefined];

      if (!start || (start && end)) {
        // 开始新的范围
        newValue = [date, undefined];
      } else {
        // 结束范围
        const startDate = parseDate(start);
        newValue = date < startDate ? [date, start] : [start, date];
      }
    }

    setSelectedValue(newValue);
    onChange?.(newValue);
  }, [isDateDisabled, selectedValue, mode, onChange]);

  // 上一个月
  const previousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // 下一个月
  const nextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // 上一年
  const previousYear = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() - 1);
      return newDate;
    });
  };

  // 下一年
  const nextYear = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(newDate.getFullYear() + 1);
      return newDate;
    });
  };

  // 跳转到今天
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 生成日历网格
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // 上个月的日期
    const prevMonthDays = (firstDay - firstDayOfWeek + 7) % 7;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const day = new Date(prevMonth);
      day.setDate(getDaysInMonth(prevMonth) - i);
      days.push(day);
    }

    // 当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      days.push(day);
    }

    // 下个月的日期
    const remainingDays = 42 - days.length; // 6行 x 7天 = 42
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    for (let i = 1; i <= remainingDays; i++) {
      const day = new Date(nextMonth);
      day.setDate(i);
      days.push(day);
    }

    return days;
  }, [currentDate, firstDayOfWeek]);

  // 星期标题
  const weekDays = useMemo(() => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return [...days.slice(firstDayOfWeek), ...days.slice(0, firstDayOfWeek)];
  }, [firstDayOfWeek]);

  // 格式化日期
  const formatMonthYear = (date: Date): string => {
    if (formatDate) return formatDate(date);
    return `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
  };

  return (
    <div className={`cyber-card p-6 ${className}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          {formatMonthYear(currentDate)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={previousYear}
            className="p-2 hover:bg-cyber-card rounded transition-colors"
            title="上一年"
          >
            <ChevronDoubleLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-cyber-card rounded transition-colors"
            title="上个月"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-cyber-card text-gray-400 hover:text-white rounded transition-colors"
          >
            今天
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-cyber-card rounded transition-colors"
            title="下个月"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={nextYear}
            className="p-2 hover:bg-cyber-card rounded transition-colors"
            title="下一年"
          >
            <ChevronDoubleRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {showWeekNumber && <div />}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isSelected = isDateSelected(date);
          const isDisabled = isDateDisabled(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isToday = isSameDay(date, new Date());
          const isMarked = isDateMarked(date);
          const inRange = isInRange(date);
          const rangeEndpoint = isRangeEndpoint(date);
          const dayEvents = getDateEvents(date);
          const weekNumber = showWeekNumber && index % 7 === 0 ? Math.ceil((index + 1) / 7) : null;

          return (
            <div key={date.getTime()} className="relative">
              {/* 周数 */}
              {weekNumber && (
                <div className="text-xs text-gray-500 text-center py-2">
                  {weekNumber}
                </div>
              )}

              {/* 日期按钮 */}
              <motion.button
                whileHover={isDisabled ? {} : { scale: 1.05 }}
                whileTap={isDisabled ? {} : { scale: 0.95 }}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                className={`
                  relative w-full aspect-square flex flex-col items-center justify-center
                  rounded-lg text-sm transition-all duration-200
                  ${isDisabled
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'hover:bg-cyber-card'
                  }
                  ${!isCurrentMonth ? 'text-gray-500' : 'text-white'}
                  ${isSelected ? 'bg-cyber-cyan text-cyber-dark font-semibold' : ''}
                  ${inRange && !isSelected ? 'bg-cyber-cyan/20' : ''}
                  ${rangeEndpoint === 'start' ? 'rounded-r-none' : ''}
                  ${rangeEndpoint === 'end' ? 'rounded-l-none' : ''}
                  ${isToday && !isSelected ? 'border-2 border-cyber-cyan' : ''}
                `}
              >
                {renderDay ? renderDay(date, isSelected) : date.getDate()}

                {/* 标记点 */}
                {isMarked && !isSelected && (
                  <Dot className="absolute bottom-1 w-3 h-3 text-cyber-cyan" />
                )}

                {/* 事件指示器 */}
                {dayEvents.length > 0 && !isSelected && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: event.color || '#00f0ff' }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* 事件列表 */}
      {events.length > 0 && (
        <div className="mt-6 pt-6 border-t border-cyber-border">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">事件</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {events.slice(0, 5).map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3 p-2 rounded hover:bg-cyber-card transition-colors cursor-pointer"
                onClick={event.onClick}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color || '#00f0ff' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{event.title}</p>
                  <p className="text-xs text-gray-500">
                    {event.date.toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
