/**
 * 日历 Widget
 * 显示当前日期的日历视图，可标记有文章发布的日期
 */

'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { Widget } from './base/Widget';
import { cn } from '@/lib/utils';

export interface CalendarWidgetProps {
  /** 当前日期 */
  currentDate?: Date;
  /** 有文章发布的日期（用于标记） */
  postDates?: Date[];
  /** Widget 标题 */
  title?: string;
  /** 是否显示有文章的日期 */
  showPostDates?: boolean;
  /** 点击日期回调 */
  onDateClick?: (date: Date) => void;
  /** 自定义类名 */
  className?: string;
}

export function CalendarWidget({
  currentDate = new Date(),
  postDates = [],
  title = '日历',
  showPostDates = true,
  onDateClick,
  className,
}: CalendarWidgetProps) {
  const [viewDate, setViewDate] = useState(currentDate);

  // 获取当月的所有日期
  const monthDays = useMemo(() => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    return eachDayOfInterval({ start, end });
  }, [viewDate]);

  // 获取月份的第一天是星期几（用于填充空白）
  const firstDayOfWeek = useMemo(() => {
    return startOfMonth(viewDate).getDay();
  }, [viewDate]);

  // 星期标题
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  // 检查某天是否有文章
  const hasPost = (date: Date) => {
    return postDates.some(postDate => isSameDay(date, postDate));
  };

  // 上一个月
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  };

  // 下一个月
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));
  };

  // 回到今天
  const goToToday = () => {
    setViewDate(new Date());
  };

  // 处理日期点击
  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  return (
    <Widget title={title} className={className}>
      <div className="space-y-4">
        {/* 月份导航 */}
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-cyber-cyan/20 text-cyber-cyan transition-colors"
            aria-label="上个月"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </motion.button>

          <div className="text-center">
            <h3 className="text-lg font-bold text-white">
              {format(viewDate, 'yyyy年 MM月', { locale: zhCN })}
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-cyber-cyan/20 text-cyber-cyan transition-colors"
            aria-label="下个月"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </motion.button>
        </div>

        {/* 星期标题 */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 日期网格 */}
        <div className="grid grid-cols-7 gap-1">
          {/* 填充空白 */}
          {Array.from({ length: firstDayOfWeek }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square"
            />
          ))}

          {/* 日期 */}
          {monthDays.map((date, index) => {
            const isCurrentMonth = isSameMonth(date, viewDate);
            const isDayToday = isToday(date);
            const dayHasPost = hasPost(date);

            return (
              <motion.button
                key={date.toISOString()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(date)}
                className={cn(
                  'aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all relative',
                  !isCurrentMonth && 'text-gray-600',
                  isCurrentMonth && 'text-gray-300',
                  isDayToday && 'bg-cyber-cyan text-white font-bold',
                  isDayToday && 'shadow-neon-cyan',
                  !isDayToday && 'hover:bg-cyber-muted'
                )}
              >
                {format(date, 'd')}

                {/* 有文章的标记 */}
                {showPostDates && dayHasPost && !isDayToday && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyber-pink rounded-full shadow-neon-pink" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 返回今天按钮 */}
        {!isSameMonth(viewDate, new Date()) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goToToday}
            className="w-full py-2 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-sm font-medium hover:bg-cyber-cyan/20 transition-colors"
          >
            回到今天
          </motion.button>
        )}

        {/* 图例 */}
        {showPostDates && postDates.length > 0 && (
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-cyber-border">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-cyber-pink rounded-full" />
              <span>有文章</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 bg-cyber-cyan rounded" />
              <span>今天</span>
            </div>
          </div>
        )}
      </div>
    </Widget>
  );
}
