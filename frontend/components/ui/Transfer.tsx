/**
 * Transfer Component - 穿梭框组件
 * 用于在两个列表之间移动项目
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TransferItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TransferProps {
  dataSource: TransferItem[];
  targetKeys: string[];
  onChange: (targetKeys: string[]) => void;
  titles?: [string, string];
  showSearch?: boolean;
  filterOption?: (input: string, item: TransferItem) => boolean;
  render?: (item: TransferItem) => React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Transfer({
  dataSource,
  targetKeys,
  onChange,
  titles = ['源列表', '目标列表'],
  showSearch = true,
  filterOption,
  render,
  className,
  disabled = false,
}: TransferProps) {
  const [sourceFilter, setSourceFilter] = useState('');
  const [targetFilter, setTargetFilter] = useState('');

  // 过滤函数
  const defaultFilterOption = (input: string, item: TransferItem) =>
    item.label.toLowerCase().includes(input.toLowerCase());

  const filterFn = filterOption || defaultFilterOption;

  // 计算源列表和目标列表
  const { sourceItems, targetItems } = useMemo(() => {
    const source = dataSource.filter(
      item =>
        !targetKeys.includes(item.id) &&
        !item.disabled &&
        filterFn(sourceFilter, item)
    );

    const target = dataSource
      .filter(item => targetKeys.includes(item.id))
      .filter(item => filterFn(targetFilter, item));

    return { sourceItems: source, targetItems: target };
  }, [dataSource, targetKeys, sourceFilter, targetFilter, filterFn]);

  // 选择状态
  const [selectedSourceKeys, setSelectedSourceKeys] = useState<string[]>([]);
  const [selectedTargetKeys, setSelectedTargetKeys] = useState<string[]>([]);

  // 移动到目标
  const moveToTarget = () => {
    if (disabled) return;
    const newTargetKeys = [...new Set([...targetKeys, ...selectedSourceKeys])];
    onChange(newTargetKeys);
    setSelectedSourceKeys([]);
  };

  // 移动到源
  const moveToSource = () => {
    if (disabled) return;
    const newTargetKeys = targetKeys.filter(
      key => !selectedTargetKeys.includes(key)
    );
    onChange(newTargetKeys);
    setSelectedTargetKeys([]);
  };

  // 全部移动到目标
  const moveAllToTarget = () => {
    if (disabled) return;
    const allSourceKeys = sourceItems.map(item => item.id);
    const newTargetKeys = [...new Set([...targetKeys, ...allSourceKeys])];
    onChange(newTargetKeys);
  };

  // 全部移动到源
  const moveAllToSource = () => {
    if (disabled) return;
    onChange([]);
  };

  // 切换选择状态
  const toggleSourceSelection = (id: string) => {
    setSelectedSourceKeys(prev =>
      prev.includes(id)
        ? prev.filter(key => key !== id)
        : [...prev, id]
    );
  };

  const toggleTargetSelection = (id: string) => {
    setSelectedTargetKeys(prev =>
      prev.includes(id)
        ? prev.filter(key => key !== id)
        : [...prev, id]
    );
  };

  const renderList = (
    items: TransferItem[],
    selectedKeys: string[],
    onToggle: (id: string) => void,
    title: string,
    filter: string,
    onFilterChange: (value: string) => void
  ) => (
    <div className="flex-1 flex flex-col border border-cyber-border rounded-lg overflow-hidden bg-cyber-card">
      {/* 标题和搜索 */}
      <div className="p-3 border-b border-cyber-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-cyber-cyan">{title}</span>
          <span className="text-xs text-cyber-text-secondary">
            {items.length} 项
          </span>
        </div>
        {showSearch && (
          <input
            type="text"
            value={filter}
            onChange={e => onFilterChange(e.target.value)}
            placeholder="搜索..."
            disabled={disabled}
            className={cn(
              "w-full px-3 py-1.5 text-sm bg-cyber-muted border border-cyber-border",
              "rounded focus:outline-none focus:border-cyber-cyan",
              "text-cyber-text placeholder:text-cyber-text-secondary",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
        )}
      </div>

      {/* 列表内容 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-cyber-text-secondary text-sm"
            >
              {filter ? '没有匹配的结果' : '列表为空'}
            </motion.div>
          ) : (
            items.map(item => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onClick={() => !disabled && onToggle(item.id)}
                className={cn(
                  "p-2.5 rounded cursor-pointer transition-all",
                  "border border-transparent",
                  "hover:border-cyber-cyan/30 hover:bg-cyber-cyan/5",
                  selectedKeys.includes(item.id) && "bg-cyber-cyan/10 border-cyber-cyan",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {render ? render(item) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cyber-text">{item.label}</span>
                    {selectedKeys.includes(item.id) && (
                      <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-neon-cyan" />
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className={cn("flex items-stretch gap-4", className)}>
      {/* 源列表 */}
      {renderList(
        sourceItems,
        selectedSourceKeys,
        toggleSourceSelection,
        titles[0],
        sourceFilter,
        setSourceFilter
      )}

      {/* 操作按钮 */}
      <div className="flex flex-col gap-2 self-center">
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={moveAllToTarget}
          disabled={disabled || sourceItems.length === 0}
          className={cn(
            "p-2 rounded-lg border border-cyber-border bg-cyber-card",
            "hover:border-cyber-cyan hover:bg-cyber-cyan/10",
            "transition-all",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
          title="全部移动到右侧"
        >
          <ChevronRight className="w-5 h-5 text-cyber-cyan" />
          <ChevronRight className="w-5 h-5 text-cyber-cyan -mt-3 ml-1" />
        </motion.button>

        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={moveToTarget}
          disabled={disabled || selectedSourceKeys.length === 0}
          className={cn(
            "p-2 rounded-lg border border-cyber-border bg-cyber-card",
            "hover:border-cyber-cyan hover:bg-cyber-cyan/10",
            "transition-all",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
          title="移动选中项到右侧"
        >
          <ChevronRight className="w-5 h-5 text-cyber-cyan" />
        </motion.button>

        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={moveToSource}
          disabled={disabled || selectedTargetKeys.length === 0}
          className={cn(
            "p-2 rounded-lg border border-cyber-border bg-cyber-card",
            "hover:border-cyber-cyan hover:bg-cyber-cyan/10",
            "transition-all",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
          title="移动选中项到左侧"
        >
          <ChevronLeft className="w-5 h-5 text-cyber-cyan" />
        </motion.button>

        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={moveAllToSource}
          disabled={disabled || targetItems.length === 0}
          className={cn(
            "p-2 rounded-lg border border-cyber-border bg-cyber-card",
            "hover:border-cyber-cyan hover:bg-cyber-cyan/10",
            "transition-all",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
          title="全部移动到左侧"
        >
          <ChevronLeft className="w-5 h-5 text-cyber-cyan" />
          <ChevronLeft className="w-5 h-5 text-cyber-cyan -mt-3 ml-1" />
        </motion.button>
      </div>

      {/* 目标列表 */}
      {renderList(
        targetItems,
        selectedTargetKeys,
        toggleTargetSelection,
        titles[1],
        targetFilter,
        setTargetFilter
      )}
    </div>
  );
}
