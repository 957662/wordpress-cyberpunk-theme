/**
 * FeedFilters Component
 * 信息流筛选组件
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  X,
  Calendar,
  TrendingUp,
  Clock,
  ArrowUpDown,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SortOption = 'recent' | 'popular' | 'trending' | 'oldest';
export type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

interface FeedFiltersProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  timeFilter: TimeFilter;
  onTimeFilterChange: (filter: TimeFilter) => void;
  className?: string;
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: 'recent', label: '最新', icon: <Clock size={16} /> },
  { value: 'popular', label: '最受欢迎', icon: <TrendingUp size={16} /> },
  { value: 'trending', label: '热门趋势', icon: <TrendingUp size={16} /> },
  { value: 'oldest', label: '最早', icon: <Calendar size={16} /> },
];

const timeFilterOptions: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: '全部时间' },
  { value: 'today', label: '今天' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'year', label: '今年' },
];

export function FeedFilters({
  sortBy,
  onSortChange,
  timeFilter,
  onTimeFilterChange,
  className,
}: FeedFiltersProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const selectedSort = sortOptions.find((opt) => opt.value === sortBy);
  const selectedTime = timeFilterOptions.find((opt) => opt.value === timeFilter);

  const hasActiveFilters = sortBy !== 'recent' || timeFilter !== 'all';

  const handleReset = () => {
    onSortChange('recent');
    onTimeFilterChange('all');
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Sort Dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowSortDropdown(!showSortDropdown);
            setShowTimeDropdown(false);
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200',
            showSortDropdown || sortBy !== 'recent'
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
              : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
          )}
        >
          <ArrowUpDown size={16} />
          <span className="font-medium">{selectedSort?.label}</span>
          <ChevronDown
            size={14}
            className={cn('transition-transform duration-200', showSortDropdown && 'rotate-180')}
          />
        </motion.button>

        <AnimatePresence>
          {showSortDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSortDropdown(false)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full mt-2 z-50 w-56 rounded-lg bg-slate-800 border border-slate-700 shadow-xl overflow-hidden"
              >
                <div className="p-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                        sortBy === option.value
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-slate-300 hover:bg-slate-700/50'
                      )}
                    >
                      {option.icon}
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Time Filter Dropdown */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowTimeDropdown(!showTimeDropdown);
            setShowSortDropdown(false);
          }}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200',
            showTimeDropdown || timeFilter !== 'all'
              ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
              : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
          )}
        >
          <Calendar size={16} />
          <span className="font-medium">{selectedTime?.label}</span>
          <ChevronDown
            size={14}
            className={cn('transition-transform duration-200', showTimeDropdown && 'rotate-180')}
          />
        </motion.button>

        <AnimatePresence>
          {showTimeDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowTimeDropdown(false)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 top-full mt-2 z-50 w-48 rounded-lg bg-slate-800 border border-slate-700 shadow-xl overflow-hidden"
              >
                <div className="p-2">
                  {timeFilterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onTimeFilterChange(option.value);
                        setShowTimeDropdown(false);
                      }}
                      className={cn(
                        'w-full px-3 py-2.5 rounded-lg text-left transition-all duration-200',
                        timeFilter === option.value
                          ? 'bg-purple-500/20 text-purple-400 font-medium'
                          : 'text-slate-300 hover:bg-slate-700/50'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-all"
        >
          <X size={16} />
          <span>重置</span>
        </motion.button>
      )}

      {/* Filter Icon Badge (shows active filters) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
          <Filter size={12} className="text-cyan-400" />
          <span className="text-xs font-medium text-cyan-400">
            {[sortBy !== 'recent', timeFilter !== 'all'].filter(Boolean).length}
          </span>
        </div>
      )}
    </div>
  );
}

export default FeedFilters;
