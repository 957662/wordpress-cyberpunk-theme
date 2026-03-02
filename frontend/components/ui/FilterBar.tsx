/**
 * FilterBar Component - 过滤栏组件
 * 用于展示和管理过滤条件
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X, Filter, ChevronDown } from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date';
  options?: FilterOption[];
  value?: any;
  min?: number;
  max?: number;
  unit?: string;
}

export interface FilterBarProps {
  filters: FilterGroup[];
  onChange: (filters: FilterGroup[]) => void;
  onReset?: () => void;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function FilterBar({
  filters,
  onChange,
  onReset,
  className,
  collapsible = false,
  defaultCollapsed = false,
}: FilterBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 获取活动过滤器的数量
  const activeFilterCount = filters.filter(
    f => f.value !== undefined && f.value !== null && f.value !== ''
  ).length;

  // 更新过滤器
  const updateFilter = (filterId: string, value: any) => {
    onChange(
      filters.map(f => (f.id === filterId ? { ...f, value } : f))
    );
  };

  // 重置所有过滤器
  const handleReset = () => {
    onChange(
      filters.map(f => ({ ...f, value: undefined }))
    );
    onReset?.();
  };

  // 切换分组展开状态
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // 渲染单个过滤器
  const renderFilter = (filter: FilterGroup) => {
    const isExpanded = expandedGroups.has(filter.id);

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id} className="space-y-2">
            <button
              onClick={() => toggleGroup(filter.id)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-cyber-text">
                {filter.label}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform text-cyber-text-secondary",
                  isExpanded && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pt-2">
                    {filter.options?.map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateFilter(filter.id, option.value)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors",
                          "hover:bg-cyber-cyan/10",
                          filter.value === option.value
                            ? "bg-cyber-cyan/20 text-cyber-cyan"
                            : "text-cyber-text"
                        )}
                      >
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-xs text-cyber-text-secondary">
                            {option.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 'multiselect':
        return (
          <div key={filter.id} className="space-y-2">
            <button
              onClick={() => toggleGroup(filter.id)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-cyber-text">
                {filter.label}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform text-cyber-text-secondary",
                  isExpanded && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 pt-2">
                    {filter.options?.map(option => {
                      const isSelected = Array.isArray(filter.value) &&
                        filter.value.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => {
                            const current = Array.isArray(filter.value) ? filter.value : [];
                            const next = isSelected
                              ? current.filter((v: string) => v !== option.value)
                              : [...current, option.value];
                            updateFilter(filter.id, next);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 text-sm rounded transition-colors",
                            "hover:bg-cyber-cyan/10",
                            isSelected
                              ? "bg-cyber-cyan/20 text-cyber-cyan"
                              : "text-cyber-text"
                          )}
                        >
                          <span>{option.label}</span>
                          {isSelected && (
                            <div className="w-4 h-4 rounded bg-cyber-cyan flex items-center justify-center">
                              <X className="w-3 h-3 text-cyber-dark" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 'range':
        return (
          <div key={filter.id} className="space-y-2">
            <span className="text-sm font-medium text-cyber-text">
              {filter.label}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filter.value?.min ?? filter.min ?? ''}
                onChange={e => updateFilter(filter.id, {
                  ...filter.value,
                  min: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="最小值"
                className={cn(
                  "flex-1 px-3 py-2 text-sm bg-cyber-muted border border-cyber-border rounded",
                  "focus:outline-none focus:border-cyber-cyan",
                  "text-cyber-text placeholder:text-cyber-text-secondary"
                )}
              />
              <span className="text-cyber-text-secondary">-</span>
              <input
                type="number"
                value={filter.value?.max ?? filter.max ?? ''}
                onChange={e => updateFilter(filter.id, {
                  ...filter.value,
                  max: e.target.value ? Number(e.target.value) : undefined
                })}
                placeholder="最大值"
                className={cn(
                  "flex-1 px-3 py-2 text-sm bg-cyber-muted border border-cyber-border rounded",
                  "focus:outline-none focus:border-cyber-cyan",
                  "text-cyber-text placeholder:text-cyber-text-secondary"
                )}
              />
              {filter.unit && (
                <span className="text-xs text-cyber-text-secondary whitespace-nowrap">
                  {filter.unit}
                </span>
              )}
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={filter.id} className="space-y-2">
            <span className="text-sm font-medium text-cyber-text">
              {filter.label}
            </span>
            <input
              type="date"
              value={filter.value || ''}
              onChange={e => updateFilter(filter.id, e.target.value)}
              className={cn(
                "w-full px-3 py-2 text-sm bg-cyber-muted border border-cyber-border rounded",
                "focus:outline-none focus:border-cyber-cyan",
                "text-cyber-text"
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("bg-cyber-card border border-cyber-border rounded-lg", className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyber-cyan" />
          <span className="font-medium text-cyber-text">筛选</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-cyber-cyan text-cyber-dark rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="text-sm text-cyber-cyan hover:text-cyber-cyan/80"
            >
              重置
            </motion.button>
          )}
          {collapsible && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-cyber-text-secondary hover:text-cyber-text"
            >
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isCollapsed && "rotate-180"
                )}
              />
            </motion.button>
          )}
        </div>
      </div>

      {/* 过滤器内容 */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filters.map(filter => renderFilter(filter))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
