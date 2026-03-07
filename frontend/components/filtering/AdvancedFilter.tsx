'use client';

import React, { useState, useMemo } from 'react';
import {
  Filter,
  X,
  ChevronDown,
  Check,
  Search,
  Calendar,
  Tag,
  FolderTree,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * 筛选选项类型
 */
export interface FilterOption<T = string> {
  /** 选项值 */
  value: T;
  /** 选项标签 */
  label: string;
  /** 选项数量（可选） */
  count?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 子选项（用于级联筛选） */
  children?: FilterOption<T>[];
}

/**
 * 筛选器组配置
 */
export interface FilterGroupConfig<T = string> {
  /** 筛选器唯一标识 */
  id: string;
  /** 筛选器标题 */
  title: string;
  /** 筛选器类型 */
  type: 'checkbox' | 'radio' | 'select' | 'date-range' | 'search';
  /** 筛选选项 */
  options?: FilterOption<T>[];
  /** 是否多选 */
  multiple?: boolean;
  /** 是否可搜索 */
  searchable?: boolean;
  /** 占位符 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: T | T[];
  /** 最小选择数量 */
  minSelection?: number;
  /** 最大选择数量 */
  maxSelection?: number;
}

/**
 * 筛选器值类型
 */
export type FilterValue<T = string> = T | T[] | { from?: Date; to?: Date } | string;

/**
 * 筛选器状态
 */
export interface FilterState<T = string> {
  [key: string]: FilterValue<T>;
}

/**
 * 高级筛选组件属性
 */
export interface AdvancedFilterProps<T = string> {
  /** 筛选器配置 */
  filters: FilterGroupConfig<T>[];
  /** 筛选值变化回调 */
  onFilterChange: (filters: FilterState<T>) => void;
  /** 初始筛选值 */
  initialFilters?: FilterState<T>;
  /** 自定义样式类名 */
  className?: string;
  /** 是否展开 */
  defaultExpanded?: boolean;
  /** 是否显示重置按钮 */
  showReset?: boolean;
  /** 是否显示结果数量 */
  showResultCount?: boolean;
  /** 结果数量 */
  resultCount?: number;
  /** 筛选器布局方向 */
  layout?: 'vertical' | 'horizontal';
  /** 筛选器卡片样式 */
  variant?: 'default' | 'outlined' | 'filled';
}

/**
 * 单个筛选器组件
 */
interface FilterGroupProps<T = string> {
  config: FilterGroupConfig<T>;
  value: FilterValue<T>;
  onChange: (value: FilterValue<T>) => void;
  variant?: 'default' | 'outlined' | 'filled';
}

function FilterGroup<T = string>({
  config,
  value,
  onChange,
  variant = 'default',
}: FilterGroupProps<T>) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!config.searchable || !searchQuery) return config.options;
    return config.options?.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [config.options, config.searchable, searchQuery]);

  const hasValue = useMemo(() => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return value.from || value.to;
    }
    return value !== '' && value !== undefined;
  }, [value]);

  const selectedCount = useMemo(() => {
    if (Array.isArray(value)) return value.length;
    return hasValue ? 1 : 0;
  }, [value, hasValue]);

  const variantStyles = {
    default: cn(
      'bg-gray-900/50 border border-cyan-500/20',
      'hover:border-cyan-500/40'
    ),
    outlined: cn(
      'bg-transparent border-2 border-cyan-500/30',
      'hover:border-cyan-500/50'
    ),
    filled: cn(
      'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-transparent',
      'hover:from-cyan-500/20 hover:to-purple-500/20'
    ),
  };

  const handleClear = () => {
    if (config.type === 'checkbox' || config.multiple) {
      onChange([]);
    } else if (config.type === 'date-range') {
      onChange({});
    } else {
      onChange('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg p-4 transition-all duration-200',
        variantStyles[variant]
      )}
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {config.type === 'search' && <Search className="w-4 h-4 text-cyan-400" />}
          {config.type === 'date-range' && <Calendar className="w-4 h-4 text-cyan-400" />}
          {(config.type === 'checkbox' || config.type === 'radio') && (
            <Filter className="w-4 h-4 text-cyan-400" />
          )}
          <h3 className="font-semibold text-white">{config.title}</h3>
          {selectedCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasValue && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
              title="清除筛选"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isExpanded ? 'rotate-180' : ''
              )}
            />
          </motion.button>
        </div>
      </div>

      {/* 筛选器内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* 搜索框 */}
            {config.searchable && (
              <div className="mb-3 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索选项..."
                  className={cn(
                    'w-full pl-9 pr-3 py-2 text-sm rounded-md',
                    'bg-gray-800/50 border border-gray-700',
                    'focus:outline-none focus:border-cyan-500',
                    'text-white placeholder-gray-500'
                  )}
                />
              </div>
            )}

            {/* 选项列表 */}
            {(config.type === 'checkbox' || config.type === 'radio') && (
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {filteredOptions?.map((option) => {
                  const isSelected = Array.isArray(value)
                    ? value.includes(option.value)
                    : value === option.value;

                  const isDisabled = option.disabled ||
                    (config.maxSelection &&
                     Array.isArray(value) &&
                     value.length >= config.maxSelection &&
                     !isSelected);

                  return (
                    <label
                      key={String(option.value)}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded cursor-pointer transition-colors',
                        'hover:bg-cyan-500/10',
                        isDisabled && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <input
                        type={config.type === 'checkbox' ? 'checkbox' : 'radio'}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => {
                          if (isDisabled) return;

                          if (config.type === 'checkbox' || config.multiple) {
                            const currentValue = value as T[];
                            if (isSelected) {
                              onChange(currentValue.filter((v) => v !== option.value));
                            } else {
                              onChange([...currentValue, option.value]);
                            }
                          } else {
                            onChange(option.value);
                          }
                        }}
                        className={cn(
                          'w-4 h-4 rounded border-2 border-cyan-500',
                          'checked:bg-gradient-to-r checked:from-cyan-500 checked:to-purple-500',
                          'focus:ring-2 focus:ring-cyan-500/50',
                          'disabled:opacity-50'
                        )}
                      />
                      <span className="flex-1 text-sm text-gray-300">{option.label}</span>
                      {option.count !== undefined && (
                        <span className="text-xs text-gray-500">({option.count})</span>
                      )}
                      {isSelected && (
                        <Check className="w-4 h-4 text-cyan-400" />
                      )}
                    </label>
                  );
                })}
              </div>
            )}

            {/* 选择器 */}
            {config.type === 'select' && (
              <select
                value={String(value)}
                onChange={(e) => onChange(e.target.value as T)}
                className={cn(
                  'w-full px-3 py-2 text-sm rounded-md',
                  'bg-gray-800/50 border border-gray-700',
                  'focus:outline-none focus:border-cyan-500',
                  'text-white'
                )}
              >
                <option value="">{config.placeholder || '请选择...'}</option>
                {config.options?.map((option) => (
                  <option key={String(option.value)} value={String(option.value)}>
                    {option.label}
                    {option.count !== undefined && ` (${option.count})`}
                  </option>
                ))}
              </select>
            )}

            {/* 搜索输入 */}
            {config.type === 'search' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={String(value)}
                  onChange={(e) => onChange(e.target.value as T)}
                  placeholder={config.placeholder || '搜索...'}
                  className={cn(
                    'w-full pl-9 pr-3 py-2 text-sm rounded-md',
                    'bg-gray-800/50 border border-gray-700',
                    'focus:outline-none focus:border-cyan-500',
                    'text-white placeholder-gray-500'
                  )}
                />
              </div>
            )}

            {/* 日期范围 */}
            {config.type === 'date-range' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">开始日期</label>
                  <input
                    type="date"
                    value={(value as { from?: Date }).from?.toISOString().split('T')[0] || ''}
                    onChange={(e) =>
                      onChange({ ...value, from: e.target.value ? new Date(e.target.value) : undefined })
                    }
                    className={cn(
                      'w-full px-3 py-2 text-sm rounded-md',
                      'bg-gray-800/50 border border-gray-700',
                      'focus:outline-none focus:border-cyan-500',
                      'text-white'
                    )}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">结束日期</label>
                  <input
                    type="date"
                    value={(value as { to?: Date }).to?.toISOString().split('T')[0] || ''}
                    onChange={(e) =>
                      onChange({ ...value, to: e.target.value ? new Date(e.target.value) : undefined })
                    }
                    className={cn(
                      'w-full px-3 py-2 text-sm rounded-md',
                      'bg-gray-800/50 border border-gray-700',
                      'focus:outline-none focus:border-cyan-500',
                      'text-white'
                    )}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * 高级筛选组件
 *
 * 提供灵活的多条件筛选功能，支持多种筛选器类型
 *
 * @example
 * ```tsx
 * const filters: FilterGroupConfig[] = [
 *   {
 *     id: 'category',
 *     title: '分类',
 *     type: 'checkbox',
 *     options: [
 *       { value: 'tech', label: '技术', count: 100 },
 *       { value: 'life', label: '生活', count: 50 },
 *     ],
 *   },
 *   {
 *     id: 'date',
 *     title: '发布日期',
 *     type: 'date-range',
 *   },
 * ];
 *
 * <AdvancedFilter
 *   filters={filters}
 *   onFilterChange={(values) => console.log(values)}
 *   resultCount={42}
 * />
 * ```
 */
export function AdvancedFilter<T = string>({
  filters,
  onFilterChange,
  initialFilters = {},
  className,
  defaultExpanded = true,
  showReset = true,
  showResultCount = true,
  resultCount = 0,
  layout = 'vertical',
  variant = 'default',
}: AdvancedFilterProps<T>) {
  const [filterValues, setFilterValues] = useState<FilterState<T>>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // 计算激活的筛选器数量
  const activeFiltersCount = useMemo(() => {
    return Object.values(filterValues).filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return value.from || value.to;
      }
      return value !== '' && value !== undefined;
    }).length;
  }, [filterValues]);

  const handleFilterChange = (filterId: string, value: FilterValue<T>) => {
    const newFilters = { ...filterValues, [filterId]: value };
    setFilterValues(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState<T> = {};
    filters.forEach((filter) => {
      if (filter.defaultValue !== undefined) {
        resetFilters[filter.id] = filter.defaultValue;
      } else if (filter.type === 'checkbox' || filter.multiple) {
        resetFilters[filter.id] = [];
      } else {
        resetFilters[filter.id] = '';
      }
    });
    setFilterValues(resetFilters);
    onFilterChange(resetFilters);
  };

  const layoutStyles = {
    vertical: 'grid grid-cols-1 gap-4',
    horizontal: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* 筛选器头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">筛选</h2>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showResultCount && (
            <span className="text-sm text-gray-400">
              找到 <span className="text-cyan-400 font-semibold">{resultCount}</span> 个结果
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'p-2 rounded-md transition-colors',
              'hover:bg-cyan-500/10',
              'text-gray-400 hover:text-cyan-400'
            )}
            title={isExpanded ? '收起筛选' : '展开筛选'}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
          {showReset && activeFiltersCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className={cn(
                'flex items-center gap-1 px-3 py-2 rounded-md text-sm',
                'bg-gradient-to-r from-cyan-500/20 to-purple-500/20',
                'border border-cyan-500/30',
                'hover:from-cyan-500/30 hover:to-purple-500/30',
                'text-cyan-400'
              )}
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </motion.button>
          )}
        </div>
      </div>

      {/* 筛选器列表 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={layoutStyles[layout]}
          >
            {filters.map((filter) => (
              <FilterGroup
                key={filter.id}
                config={filter}
                value={filterValues[filter.id] || (filter.multiple ? [] : '')}
                onChange={(value) => handleFilterChange(filter.id, value)}
                variant={variant}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 快速筛选标签组件
 */
export interface QuickFilterTagProps<T = string> {
  /** 标签值 */
  value: T;
  /** 标签文本 */
  label: string;
  /** 是否选中 */
  selected?: boolean;
  /** 点击回调 */
  onClick?: (value: T) => void;
  /** 计数 */
  count?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 快速筛选标签
 *
 * @example
 * ```tsx
 * <QuickFilterTag
 *   value="tech"
 *   label="技术"
 *   selected={selectedCategory === 'tech'}
 *   count={100}
 *   onClick={(value) => setSelectedCategory(value)}
 * />
 * ```
 */
export function QuickFilterTag<T = string>({
  value,
  label,
  selected = false,
  onClick,
  count,
  disabled = false,
  className,
}: QuickFilterTagProps<T>) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={() => !disabled && onClick?.(value)}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
        selected
          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
          : 'bg-gray-800/50 border-2 border-cyan-500/30 text-gray-300 hover:border-cyan-500/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs',
          selected ? 'bg-white/20' : 'bg-cyan-500/20 text-cyan-400'
        )}>
          {count}
        </span>
      )}
      {selected && <Check className="w-4 h-4" />}
    </motion.button>
  );
}

/**
 * 快速筛选标签组
 */
export interface QuickFilterTagsProps<T = string> {
  /** 标签选项 */
  options: FilterOption<T>[];
  /** 选中的值 */
  value?: T;
  /** 变化回调 */
  onChange?: (value: T) => void;
  /** 是否允许多选 */
  multiple?: boolean;
  /** 多选值 */
  values?: T[];
  /** 多选变化回调 */
  onValuesChange?: (values: T[]) => void;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 快速筛选标签组
 *
 * @example
 * ```tsx
 * <QuickFilterTags
 *   options={[
 *     { value: 'tech', label: '技术', count: 100 },
 *     { value: 'life', label: '生活', count: 50 },
 *   ]}
 *   value={selectedCategory}
 *   onChange={(value) => setSelectedCategory(value)}
 * />
 * ```
 */
export function QuickFilterTags<T = string>({
  options,
  value,
  onChange,
  multiple = false,
  values = [],
  onValuesChange,
  className,
}: QuickFilterTagsProps<T>) {
  const handleClick = (optionValue: T) => {
    if (multiple) {
      const newValues = values.includes(optionValue)
        ? values.filter((v) => v !== optionValue)
        : [...values, optionValue];
      onValuesChange?.(newValues);
    } else {
      onChange?.(optionValue);
    }
  };

  const isSelected = (optionValue: T) => {
    return multiple ? values.includes(optionValue) : value === optionValue;
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <QuickFilterTag
          key={String(option.value)}
          value={option.value}
          label={option.label}
          selected={isSelected(option.value)}
          count={option.count}
          disabled={option.disabled}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}

export default AdvancedFilter;
